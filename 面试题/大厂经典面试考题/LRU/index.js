var LRUCache = function (capacity) {
  this.capacity = capacity
  this.cache = new Map()
}

LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    const val = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, val)
    return val
  }
  return -1
}

LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) { // 修改
    this.cache.delete(key)
  } else if (this.cache.size >= this.capacity) { // 新增
    const oldkey = m.keys().next().value
    this.cache.delete(oldkey)
  }
  this.cache.set(key, value)

}