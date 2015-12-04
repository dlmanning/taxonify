import reduce from 'universal-reduce'
import invariant from 'invariant'

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

  function isDefined (category) {
    return recognizedCategories.has(category)
  }

  function sort (unsorted) {
    invariant(
      Array.isArray(unsorted) &&
      unsorted.every(item => recognizedCategories.has(item)),
      'sort requires an array of known categories'
    )

    const sorted = [], marked = new Set(), unmarked = new Set(unsorted)

    while (marked.size < unsorted.length) {
      const n = [...unmarked][0]
      visit(n)
    }

    return sorted

    function visit (n, visited = new Set()) {
      invariant(
        !visited.has(n),
        'A cyclic dependency exists in category defintions. ' +
        'Unable to apply topographical sort'
      )

      if (!marked.has(n)) {
        visited.add(n)
        const edges = categories.get(n) || []
        for (const m of edges) {
          if (m !== n) {
            visit(m, visited)
          }
        }
        visited.delete(n)

        if (unmarked.has(n)) {
          marked.add(n)
          unmarked.delete(n)
          sorted.unshift(n)
        }
      }
    }

  }

  function expand (category) {
    invariant(
      isDefined(category),
      'Typestore: Unknown category: %s', category
    )

    const expandedCategories = new Set()

    let categoriesToExpand = [ category ]
    while (categoriesToExpand.length > 0) {
      const nextCategory = categoriesToExpand.pop()
      expandedCategories.add(nextCategory)

      if (categories.has(nextCategory)) {
        reduce(categories.get(nextCategory), (accum, category) => {
          if (!expandedCategories.has(category)) {
            categoriesToExpand.push(category)
          }

          return accum
        }, categoriesToExpand)
      }

    }

    return [...expandedCategories]
  }

  function is (category) {
    invariant(
      isDefined(category),
      'Typestore: Unknown category: %s', category
    )

    const setOfSubcategories = categories.has(category)
      ? categories.get(category)
      : new Set([category])

    return type => search(setOfSubcategories, type)
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

  function search (setOfSubcategories, type, searched = new Set()) {
    if (setOfSubcategories.has(type)) {
      return true
    }

    for (let subcategory of setOfSubcategories) {
      if (categories.has(subcategory) && !searched.has(subcategory)) {
        searched.add(subcategory)
        if (search(categories.get(subcategory), type, searched)) {
          return true
        }
      }
    }

    return false
  }
}
