module.exports = ({ isDefined }, typeKey) => (item, category) => {
  if (item == null || (typeof item !== 'object' && typeof item !== 'function')) {
    throw new TypeError('Expected object or function to be passed into brand')
  }

  if (!isDefined(category)) {
    throw new Error(`Unknown category ${category}`)
  }

  if (item[typeKey] != null) {
    throw new Error('Passed object already has a type key')
  }

  item[typeKey] = category

  return item
}
