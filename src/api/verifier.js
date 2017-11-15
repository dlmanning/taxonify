module.exports = ({ is, isDefined }, typeKey) => category => {
  if (!isDefined(category)) {
    throw new Error('Received an unknown category')
  }

  const checker = is(category)

  return function verifier (thing) {
    const type = (typeof thing === 'object' && thing[typeKey] != null)
      ? thing[typeKey]
      : thing

    return checker(type)
  }
}
