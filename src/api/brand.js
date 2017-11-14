const invariant = require('invariant')

module.exports = ({ isDefined }, typeKey) => (item, category) => {
  invariant(
    item != null && (typeof item === 'object' || typeof item === 'function'),
    'Expected object or function to be passed into brand'
  )

  invariant(
    isDefined(category),
    'Unknown category: %s', category
  )

  invariant(
    item[typeKey] == null,
    'Passed object already has a type key'
  )

  item[typeKey] = category

  return item
}
