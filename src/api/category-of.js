const invariant = require('invariant')

module.exports = function createCategoryOf (typeKey) {
  return obj => {
    invariant(
      typeof obj === 'object' && obj[typeKey] != null,
      'categoryOf requires a typed object'
    )

    return obj[typeKey]
  }
}
