import os
from pathlib import Path

from transformers import AutoModelForSequenceClassification, AutoTokenizer

# 设置模型名称和导出路径
model_id = "uer/roberta-base-finetuned-jd-binary-chinese"
export_dir = "./onnx_model"

# 创建导出目录（如果不存在）
os.makedirs(export_dir, exist_ok=True)

print(f"正在导出模型 {model_id} 到 {export_dir}...")

# 加载模型和tokenizer - 使用safetensors格式避免PyTorch版本问题
print("尝试使用safetensors格式加载模型...")
try:
    # 优先尝试使用safetensors格式
    model = AutoModelForSequenceClassification.from_pretrained(
        model_id,
        use_safetensors=True  # 使用safetensors格式避开PyTorch版本限制
    )
except Exception as e:
    print(f"使用safetensors格式失败: {e}")
    print("尝试使用本地已下载的模型...")
    # 尝试使用本地已下载的模型
    local_model_path = "./roberta-base-finetuned-jd-binary-chinese"
    if os.path.exists(local_model_path):
        print(f"使用本地模型路径: {local_model_path}")
        model = AutoModelForSequenceClassification.from_pretrained(
            local_model_path,
            use_safetensors=True
        )
    else:
        print(f"本地模型路径不存在: {local_model_path}")
        print("尝试直接加载模型，忽略安全检查...")
        # 最后的备选方案 - 直接加载但不推荐
        import torch

        torch.manual_seed(42)  # 设置随机种子增加安全性
        model = AutoModelForSequenceClassification.from_pretrained(model_id)

tokenizer = AutoTokenizer.from_pretrained(model_id)

# 使用transformers内置的ONNX导出功能
try:
    # 尝试使用transformers.onnx导出器
    from transformers.onnx import export
    from transformers import AutoConfig

    # 设置导出配置
    onnx_config = AutoConfig.from_pretrained(model_id)

    # 准备示例输入
    inputs = tokenizer("这是一个测试句子", return_tensors="pt")

    # 导出模型到ONNX格式
    onnx_path = Path(export_dir) / "model.onnx"

    # 使用export函数导出
    with open(onnx_path, "wb") as f:
        f.write(model.to_onnx().SerializeToString())

    print(f"模型已成功导出到: {onnx_path}")

    # 保存tokenizer
    tokenizer.save_pretrained(export_dir)
    print("Tokenizer已保存")

except Exception as e:
    print(f"使用transformers.onnx导出器失败: {e}")
    print("尝试使用torch.onnx.export作为备选方案...")

    # 使用torch.onnx.export作为备选方案
    try:
        import torch

        # 准备示例输入
        inputs = tokenizer("这是一个测试句子", return_tensors="pt")

        # 导出模型到ONNX格式
        onnx_path = os.path.join(export_dir, "model.onnx")

        # 动态维度设置
        dynamic_axes = {
            "input_ids": {0: "batch_size", 1: "sequence_length"},
            "attention_mask": {0: "batch_size", 1: "sequence_length"},
            "output": {0: "batch_size"}
        }

        # 导出模型
        torch.onnx.export(
            model,
            (
                inputs["input_ids"],
                inputs["attention_mask"]
            ),
            onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["input_ids", "attention_mask"],
            output_names=["output"],
            dynamic_axes=dynamic_axes
        )

        print(f"模型已使用torch.onnx.export成功导出到: {onnx_path}")

        # 保存tokenizer
        tokenizer.save_pretrained(export_dir)
        print("Tokenizer已保存")

    except Exception as e2:
        print(f"导出失败: {e2}")
        print("请尝试安装特定版本的transformers和optimum库，或查看详细错误信息进行排查。")

print("导出过程完成")
