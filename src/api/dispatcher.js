import invariant from 'invariant'
import reduce from 'universal-reduce'

function createDispatcher (branchTable, defaultFn, typeKey) {
  const branchTableRecognizedSymbols = new Set(Object.keys(branchTable))

  return obj => {
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
}

export default ({ sort, expand, isDefined }, typeKey) => {
  return function createCreateDispatcher (collection, defaultFn) {
    invariant(
      collection != null && typeof collection === 'object',
      'createDispatcher requires a collection'
    )

    const hash = makeCategoryHash(collection)

    const orderedHashKeys = sort(Object.keys(hash))

    const expandedSequence = orderedHashKeys.reduce((accum, type) => {
        const fn = typeof hash[type] === 'function'
          ? hash[type]
          : () => hash[type]

        accum.push(
          expand(type).reduce((expanded, category) => {
            expanded[category] = fn
            return expanded
          }, {})
        )

        return accum
      }, [])

    const branchTable = Object.assign({}, ...expandedSequence)

    return createDispatcher(branchTable, defaultFn, typeKey)
  }

  function makeCategoryHash (collection) {
    return reduce(collection, (hash, value, key) => {
      const category = isDefined(key)
        ? key
        : value[typeKey] != null && isDefined(value[typeKey])
          ? value[typeKey]
          : undefined

      invariant(
        category != null,
        'unable to determine a valid category for: ' + key
      )

      hash[category] = value

      return hash
    }, {})
  }
}
