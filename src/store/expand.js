const reduce = require('universal-reduce')

module.exports = ({ categories, recognizedCategories }) =>
  category => {
    if (!recognizedCategories.has(category)) {
      throw new Error(`Unknown category: ${category}`)
    }
  
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

    return Array.from(expandedCategories)
}
