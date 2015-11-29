import invariant from 'invariant'

export default (isDefined, typeKey) => (obj, category) => {
  invariant(
    obj != null && typeof obj === 'object',
    'Expected object to be passed into brand'
  )

  invariant(
    isDefined(category),
    'Unknown category: %s', category
  )

  invariant(
    obj[typeKey] == null,
    'Passed object already has a type key'
  )

  obj[typeKey] = category

  return obj
}
