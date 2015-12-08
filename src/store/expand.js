import invariant from 'invariant'
import reduce from 'universal-reduce'

export default ({ categories, recognizedCategories }) =>
  category => {
    invariant(
      recognizedCategories.has(category),
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
