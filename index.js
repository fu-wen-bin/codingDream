// 创建 readline 接口，用于从标准输入读取数据
const rl = require("readline").createInterface({ input: process.stdin });
// 获取异步迭代器，支持 async/await 语法
var iter = rl[Symbol.asyncIterator]();
// 封装异步读取函数，每次调用读取一行输入
const readline = async () => (await iter.next()).value;

// 使用立即执行的异步函数来处理输入输出
void async function () {
  // 第一行输入：版本号列表，用空格分隔
  const versions = (await readline()).split(' ');
  // 第二行输入：匹配规则（如 ^1.1.2、~1.1.2、1.1 或 1）
  const match = await readline();

  /**
   * 版本号匹配函数
   * @param {string[]} versions - 版本号数组，如 ['1.0.0', '1.1.0', '1.1.2', '2.0.0']
   * @param {string} match - 匹配规则，支持以下格式：
   *   - ^x.y.z: 兼容版本匹配（主版本号相同，允许更高的次版本和补丁版本）
   *   - ~x.y.z: 近似版本匹配（主版本和次版本相同，允许更高的补丁版本）
   *   - x.y: 匹配主版本和次版本都相同的所有版本
   *   - x: 匹配主版本相同的所有版本
   * @returns {string[]} 符合匹配规则的版本号数组
   */
  function matchVersions(versions, match) {
    /**
     * 解析版本号字符串
     * @param {string} v - 版本号字符串，如 '1.2.3'
     * @returns {object} 包含 major、minor、patch 的对象
     */
    const parseVersion = (v) => {
      const parts = v.split('.').map(Number);
      return {
        major: parts[0] || 0,  // 主版本号，默认为 0
        minor: parts[1] || 0,  // 次版本号，默认为 0
        patch: parts[2] || 0   // 补丁版本号，默认为 0
      };
    };

    // 处理兼容版本匹配 ^x.y.z
    // 规则：主版本号必须相同，次版本号和补丁版本号可以更高
    if (match.startsWith('^')) {
      // 去掉 ^ 符号并解析目标版本
      const target = parseVersion(match.slice(1));
      return versions.filter(v => {
        const current = parseVersion(v);
        // 主版本号必须相同
        // 次版本号更高，或者次版本号相同但补丁版本号大于等于目标版本
        return current.major === target.major &&
               (current.minor > target.minor ||
                (current.minor === target.minor && current.patch >= target.patch));
      });
    }

    // 处理近似版本匹配 ~x.y.z
    // 规则：主版本号和次版本号必须相同，补丁版本号可以更高
    if (match.startsWith('~')) {
      // 去掉 ~ 符号并解析目标版本
      const target = parseVersion(match.slice(1));
      return versions.filter(v => {
        const current = parseVersion(v);
        // 主版本号和次版本号必须相同
        // 补丁版本号必须大于等于目标版本
        return current.major === target.major &&
               current.minor === target.minor &&
               current.patch >= target.patch;
      });
    }

    // 处理普通匹配（不带特殊符号）
    const parts = match.split('.');

    // 只有主版本号的情况（如 "1"）
    if (parts.length === 1) {
      const major = Number(parts[0]);
      return versions.filter(v => {
        const current = parseVersion(v);
        // 只要主版本号相同即可
        return current.major === major;
      });
    }
    // 有主版本号和次版本号的情况（如 "1.1"）
    else if (parts.length === 2) {
      const major = Number(parts[0]);
      const minor = Number(parts[1]);
      return versions.filter(v => {
        const current = parseVersion(v);
        // 主版本号和次版本号都必须相同
        return current.major === major && current.minor === minor;
      });
    }

    // 其他不支持的格式，返回空数组
    return [];
  }

  // 执行匹配并输出结果
  const result = matchVersions(versions, match);
  // 将结果数组用空格连接成字符串输出
  console.log(result.join(' '));
}()


/**
 * 使用JavaScript内置Map实现LRU缓存
 * Map对象会记住键的原始插入顺序，这使得它非常适合实现LRU算法
 * @param {number} capacity 缓存容量
 */
var LRUCache = function (capacity) {
  this.capacity = capacity;     // 设置缓存的最大容量
  this.cache = new Map();       // 使用Map作为存储结构，Map默认维护插入顺序
};

/**
 * 获取缓存中键对应的值
 * 若找到对应的键，会将其移到最近使用的位置（Map的末尾）
 * @param {number} key 要查找的键
 * @return {number} 键对应的值，若不存在则返回-1
 */
LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {    // 检查键是否存在
    const val = this.cache.get(key);    // 获取值
    this.cache.delete(key);             // 删除原有的键值对
    this.cache.set(key, val);           // 重新添加到Map末尾，表示最近使用
    return val;                         // 返回值
  }
  return -1;                    // 键不存在，返回-1
};

/**
 * 向缓存中添加或更新键值对
 * @param {number} key 键
 * @param {number} value 值
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) {            // 如果键已存在
    this.cache.delete(key);             // 先删除原有的键值对
  } else if (this.cache.size >= this.capacity) {  // 如果缓存已满且是新键
    const oldKey = this.cache.keys().next().value; // 获取Map中第一个键(最久未使用的)
    this.cache.delete(oldKey);          // 删除最久未使用的键值对
  }
  this.cache.set(key, value);           // 将新键值对添加到Map末尾
};

/**
 * 二叉树节点的定义
 */
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;     // 节点值
    this.left = left;   // 左子节点
    this.right = right; // 右子节点
  }
}

/**
 * 二叉树的右视图 - 返回从右侧能看到的所有节点
 * @param {TreeNode} root 二叉树的根节点
 * @return {number[]} 从右侧看到的节点值数组
 */
function rightSideView(root) {
  // BFS实现 - 层序遍历，取每层最右节点
  if (!root) return [];  // 空树情况

  const result = [];     // 结果数组
  const queue = [root];  // 队列，用于层序遍历

  while (queue.length > 0) {
    const levelSize = queue.length;  // 当前层的节点数

    // 遍历当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();  // 出队一个节点

      // 如果是当前层的最后一个节点(最右边的)，加入结果
      if (i === levelSize - 1) {
        result.push(node.val);
      }

      // 将子节点加入队列，先左后右
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return result;
}

/**
 * 二叉树的右视图 - DFS实现
 * @param {TreeNode} root 二叉树的根节点
 * @return {number[]} 从右侧看到的节点值数组
 */
function rightSideViewDFS(root) {
  const result = [];

  /**
   * 深度优先遍历辅助函数
   * @param {TreeNode} node 当前节点
   * @param {number} depth 当前深度
   */
  function dfs(node, depth) {
    if (!node) return;

    // 如果是当前深度的第一个访问节点(因为先访问右子树)，加入结果
    if (depth === result.length) {
      result.push(node.val);
    }

    // 先访问右子树再访问左子树，确保每层最右边的节点先被访问
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }

  dfs(root, 0);
  return result;
}

// 测试用例
function testRightSideView() {
  // 创建示例树:
  //    1
  //   / \
  //  2   3
  //   \   \
  //    5   4
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(3);
  root.left.right = new TreeNode(5);
  root.right.right = new TreeNode(4);

  console.log("BFS结果:", rightSideView(root));  // 期望输出: [1, 3, 4]
  console.log("DFS结果:", rightSideViewDFS(root)); // 期望输出: [1, 3, 4]
}

// ----------------- 新增：仓库订购最大数量（各货物订购量需两两不相等，可为0） -----------------
/**
 * 计算在每种货物最多可订购 a[i] 件，且实际订购量需两两不相等（允许为 0）的前提下的最大总订购量
 * 贪心策略：按上限降序；对第 i 个上限 ai，分配 current = min(ai, prev - 1)，保证严格递减
 * 证明要点（交换论证）：若存在更优方案中某位置值更大且不满足递减，可向前“推大”违反互异；当前策略已让每一位尽可能大
 * @param {number[]} limits 各货物最大可订购量
 * @returns {number} 最大总订购量
 */
function maxDistinctOrder(limits) {
  // 复制以避免副作用（如果允许原地，可直接在原数组排序）
  const arr = limits.slice().sort((a, b) => b - a); // 降序，使高上限尽量占用较大的可用数量
  let prev = Infinity; // 上一个实际分配的数量（第一项无约束，设无穷大）
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    // 该货物可取的最大值：不得超过自身上限，且严格小于 prev
    let current = Math.min(arr[i], prev - 1);
    if (current < 0) current = 0; // 不得为负
    total += current;
    prev = current;
    if (prev === 0) break; // 后续都只能取 0，再继续无增益，提前结束
  }
  return total;
}

// 使用示例（需要时取消注释）
// console.log(maxDistinctOrder([5,5,5])); // 12 => 5 + 4 + 3
// console.log(maxDistinctOrder([1,1,1])); // 1  => 1 + 0 + 0
// console.log(maxDistinctOrder([3,3,2])); // 6  => 3 + 2 + 1
// console.log(maxDistinctOrder([0,0,0])); // 0

/**
 * 若要接入命令行输入，可参考用户原实现：
 * 1) 读 N（可忽略，仅用于校验长度）
 * 2) 读数组 a
 * 3) 输出 maxDistinctOrder(a)
 *
 * 注意：当前文件顶部已存在 readline 逻辑（用于版本匹配），
 * 为避免冲突，命令行读取示例未直接启用。
 */

// 可选：封装命令行处理（保持注释状态，防止与现有 I/O 冲突）
// function runCLI() {
//   const rl2 = require('readline').createInterface({ input: process.stdin, output: process.stdout });
//   const lines = [];
//   rl2.on('line', line => {
//     lines.push(line.trim());
//     if (lines.length === 2) {
//       const n = parseInt(lines[0], 10);
//       const arr = lines[1].split(/\s+/).map(Number);
//       // 可加校验：if (arr.length !== n) ...
//       console.log(maxDistinctOrder(arr));
//       rl2.close();
//     }
//   });
// }
// runCLI();
// ----------------- 新增结束 -----------------