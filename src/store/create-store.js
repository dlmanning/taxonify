import reduce from 'universal-reduce'
import invariant from 'invariant'
import createSort from './toposort'
import createExpand from './expand'
import createIs from './is'

const createAccessors = store => ({
  sort: createSort(store),
  expand: createExpand(store),
  is: createIs(store)
})

export default function createTypeStore (buildRelationships) {
  invariant(
    typeof buildRelationships === 'function',
    'createTypeStore requires a function as its argument'
  )

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
    invariant(
      category != null,
      'define requires at least one argument'
    )

    const setOfSubcategories = categories.has(category)
      ? categories.get(category)
      : new Set([ category ])

    invariant(
      subcategories == null || Array.isArray(subcategories),
      'second argument to define, if provided, must be an array'
    )

    if (subcategories != null) {
      subcategories.forEach(subcategory =>
        setOfSubcategories.add(subcategory))
    }

    categories.set(category, setOfSubcategories)
  }

}
