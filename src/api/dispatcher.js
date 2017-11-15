const reduce = require('universal-reduce')

module.exports = ({ sort, expand, isDefined }, typeKey) => {
  return {
    createMap: (collection, defaultBranch) =>
      factory(collection, defaultBranch).map,
    createDispatcher: (collection, defaultBranch) =>
      factory(collection, defaultBranch).dispatcher
  }

  function factory (collection, defaultBranch) {
    const branchTable = createBranchTable(collection)
    const branchTableRecognizedSymbols = new Set(Object.keys(branchTable))

    return { map, dispatcher }

    function map (type) {
      if (!isDefined(type)) {
        throw new Error('Received an unknown category')
      }

      if (!branchTableRecognizedSymbols.has(type) && defaultBranch == null) {
        throw new Error('Passed type key not found in branch map and no default value provided')
      }

      return (branchTable[type] || defaultBranch)
    }

    function dispatcher (obj, ...args) {
      if (typeof obj !== 'object') {
        throw new TypeError('Expected an object')
      }

      const objectTypeSymbol = obj[typeKey]

      if (objectTypeSymbol == null) {
        throw new Error('Passed object is not typed')
      }

      if (!branchTableRecognizedSymbols.has(objectTypeSymbol) && typeof defaultBranch !== 'function') {
        throw new Error('Passed object\'s type key not found in branch map and no default function provided')
      }

      return (branchTable[objectTypeSymbol] || defaultBranch)(obj, ...args)
    }
  }

  function createBranchTable (collection) {
    if (collection == null || typeof collection !== 'object') {
      throw new TypeError('Requires a collection')
    }

    const hash = makeCategoryHash(collection)
    const orderedHashKeys = sort(Object.keys(hash))

    const expandedSequence = orderedHashKeys.reduce((accum, type) => {
      accum.push(
        expand(type).reduce((expanded, category) => {
          expanded[category] = hash[type]
          return expanded
        }, {})
      )

      return accum
    }, [])

    const branchTable = Object.assign({}, ...expandedSequence)

    return branchTable
  }

  function makeCategoryHash (collection) {
    return reduce(collection, (hash, value, key) => {
      const category = isDefined(key)
        ? key
        : value[typeKey] != null && isDefined(value[typeKey])
          ? value[typeKey]
          : undefined

      if (category == null) {
        throw new Error(`Unable to determine a valid category for: ${key}`)
      }

      hash[category] = value

      return hash
    }, {})
  }
}
