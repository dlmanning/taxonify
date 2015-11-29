import invariant from 'invariant'

export default (isRecognized, typeKey) => (obj, category) => {
  invariant(
    obj != null && typeof obj === 'object',
    'Expected object to be passed into brand'
  )

  invariant(
    isRecognized(category),
    'Unknown category: %s', category
  )

  invariant(
    obj[typeKey] == null,
    'Passed object already has a type key'
  )

  obj[typeKey] = category

  return obj
}
