/**
 * 不使用正则的空白字符判断（基于 trim）
 * @param {string} ch 单个字符
 * @returns {boolean}
 */
function isWhitespace(ch) {
  return ch.trim() === '';
}

/**
 * 统计字符串中每个字符的出现频率（忽略所有空白字符），返回普通对象
 * @param {string} str 非空字符串
 * @returns {Record<string, number>}
 */
function charFrequency(str) {
  const freq = {}; // 直接使用普通对象
  for (const ch of str) {
    if (isWhitespace(ch)) continue;
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq; // 直接返回对象
}

// 可按需导出
module.exports = { charFrequency };

/**
 * 安全 polyfill：仅在环境不支持 Array.prototype.fill 时定义
 */
(function () {
  if (Array.prototype.fill) return;

  Object.defineProperty(Array.prototype, 'fill', {
    value: function (value, start, end) {
      if (this == null) throw new TypeError('this is null or undefined');
      var O = Object(this);
      // 将 length 转为无符号 32 位整数（数组 length 本身受限于 32 位）
      var len = O.length >>> 0;

      // ToInteger 实现
      function toInteger(n) {
        var num = Number(n);
        if (isNaN(num)) return 0;
        if (num === 0 || !isFinite(num)) return num;
        return (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
      }

      // 归一化起止位置并裁剪到 [0, len]
      var k = start === undefined ? 0 : toInteger(start);
      if (k < 0) k = Math.max(len + k, 0);
      else k = Math.min(k, len);

      var final = end === undefined ? len : toInteger(end);
      if (final < 0) final = Math.max(len + final, 0);
      else final = Math.min(final, len);

      // 填充 [k, final)
      while (k < final) {
        O[k] = value;
        k++;
      }
      return O;
    },
    writable: true,
    configurable: true
  });
})();
