import invariant from 'invariant'

export default (sort, expand, typeKey) => (hash, defaultFn) => {
  invariant(
    hash != null && typeof hash === 'object' && !Array.isArray(hash),
    'createDispatcher requires an object hash'
  )

  const orderedHashKeys = sort(Object.keys(hash))

  const expandedSequence = orderedHashKeys.reduce((accum, type) => {
      const fn = hash[type]
      invariant(
        typeof fn === 'function',
        'createDispatcher requires hash values to be functions'
      )

      accum.push(
        expand(type).reduce((expanded, category) => {
          expanded[category] = fn
          return expanded
        }, {})
      )

      return accum
    }, [])

  const branchTable = Object.assign({}, ...expandedSequence)
  const branchTableRecognizedSymbols = new Set(Object.keys(branchTable))

  const dispatch = obj => {
    invariant(
      typeof obj === 'object',
      'dispatch expected an object'
    )

    const objectTypeSymbol = obj[typeKey]

    invariant(
      objectTypeSymbol != null,
      'dispatch expects passed objects to have been typed. ' +
      'Consider using brand()'
    )

    invariant(
      branchTableRecognizedSymbols.has(objectTypeSymbol) ||
      typeof defaultFn === 'function',
      'Passed object\'s type key not found in branch map and no ' +
      'function provided'
    )

    return (branchTable[objectTypeSymbol] || defaultFn)(obj)
  }

  return dispatch
}
