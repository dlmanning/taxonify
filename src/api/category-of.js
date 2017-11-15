module.exports = function createCategoryOf (typeKey) {
  return obj => {
    if (typeof obj !== 'object' || obj[typeKey] == null) {
      throw new TypeError('Must provide a typed object')
    }

    return obj[typeKey]
  }
}
