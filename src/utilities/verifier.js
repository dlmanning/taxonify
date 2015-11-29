import invariant from 'invariant'

export default (is, isDefined, typeKey) => category => {
  const checker = is(category)

  return obj => {
    invariant(
      obj != null && typeof obj === 'object',
      'Expected an object to be passed to the verifier'
    )

    invariant(
      obj[typeKey] != null,
      'Passed object has no type key. You should use brand()'
    )

    invariant(
      isDefined(obj[typeKey]),
      'Passed object has an unrecognized type key: ' +
      'Did you make this yourself? Consider using brand() instead'
    )

    return checker(obj[typeKey])
  }
}
