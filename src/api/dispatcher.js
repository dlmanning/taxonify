const invariant = require('invariant')
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
      invariant(
        isDefined(type),
        'map: unknown type passed to createMap'
      )

      invariant(
        branchTableRecognizedSymbols.has(type) ||
        defaultBranch != null,
          'map: Passed type key not found in branch map and no default value provided'
      )

      return (branchTable[type] || defaultBranch)
    }

    function dispatcher (obj, ...args) {
      invariant(
        typeof obj === 'object',
        'dispatch expected an object'
      )

      const objectTypeSymbol = obj[typeKey]

      invariant(
        objectTypeSymbol != null,
        'dispatcher: passed object is not typed'
      )

      invariant(
        branchTableRecognizedSymbols.has(objectTypeSymbol) ||
        typeof defaultBranch === 'function',
        'dispatcher: Passed object\'s type key not found in branch map and no default function provided'
      )

      return (branchTable[objectTypeSymbol] || defaultBranch)(obj, ...args)
    }
  }

  function createBranchTable (collection) {
    invariant(
      collection != null && typeof collection === 'object',
      'createBranchTable requires a collection'
    )

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

      invariant(
        category != null,
        'unable to determine a valid category for: ' + key
      )

      hash[category] = value

      return hash
    }, {})
  }
}
