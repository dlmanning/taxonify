const reduce = require('universal-reduce')
const createSort = require('./toposort')
const createExpand = require('./expand')
const createIs = require('./is')

const createAccessors = store => ({
  sort: createSort(store),
  expand: createExpand(store),
  is: createIs(store)
})

module.exports = function createTypeStore (buildRelationships) {
  if (typeof buildRelationships !== 'function') {
    throw new TypeError('First parameter must be a function.')
  }

  const categories = new Map()
  const recognizedCategories = new Set()

  buildRelationships(def)

  for (let setOfSubcategories of categories.values()) {
    for (let subcategory of setOfSubcategories) {
      recognizedCategories.add(subcategory)
    }
  }

  const { sort, expand, is } =
    createAccessors({ categories, recognizedCategories })

  function isDefined (category) {
    return recognizedCategories.has(category)
  }

  return { is, expand, isDefined, sort }

  function def (category, subcategories) {
    if (category == null) {
      throw new TypeError('The first parameter must be a category.')
    }

    const setOfSubcategories = categories.has(category)
      ? categories.get(category)
      : new Set([ category ])

    if (subcategories != null && !Array.isArray(subcategories)) {
      throw new TypeError('The second parameter, if provided, must be an array of categories.')
    }

    if (subcategories != null) {
      subcategories.forEach(subcategory =>
        setOfSubcategories.add(subcategory))
    }

    categories.set(category, setOfSubcategories)
  }

}
