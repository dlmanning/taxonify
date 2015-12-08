import invariant from 'invariant'
import reduce from 'universal-reduce'

const createDispatcher = (branchTable, defaultFn, typeKey) => {
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

export default ({ sort, expand }, typeKey) => (collection, defaultFn) => {
  invariant(
    collection != null && typeof collection === 'object',
    'createDispatcher requires a collection'
  )

  const hash = makeCategoryHash(collection)

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

  return createDispatcher(branchTable, defaultFn, typeKey)

  function makeCategoryHash (collection) {
    return reduce(collection, (hash, value, key) => {
      if(value[typeKey] != null) {
        hash[value[typeKey]] = value
      } else {
        hash[key] = value
      }

      return hash
    }, {})
  }
}
