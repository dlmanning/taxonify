const invariant = require('invariant')

module.exports = ({ is, isDefined }, typeKey) => category => {
  invariant(
    isDefined(category),
    `createVerifier: received an unkown category`
  )

  const checker = is(category)

  return function verifier (thing) {
    const type = (typeof thing === 'object' && thing[typeKey] != null)
      ? thing[typeKey]
      : thing

    return checker(type)
  }
}
