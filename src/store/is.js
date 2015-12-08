import invariant from 'invariant'

export default ({ categories, recognizedCategories }) =>
  category => {
    invariant(
      recognizedCategories.has(category),
      'Typestore: Unknown category: %s', category
    )

    const setOfSubcategories = categories.has(category)
      ? categories.get(category)
      : new Set([category])

    return type => isDescendant(setOfSubcategories, type)

    function isDescendant (setOfSubcategories, type, visited = new Set()) {
      if (setOfSubcategories.has(type)) {
        return true
      }

      for (let subcategory of setOfSubcategories) {
        if (categories.has(subcategory) && !visited.has(subcategory)) {
          visited.add(subcategory)
          if (isDescendant(categories.get(subcategory), type, visited)) {
            return true
          }
        }
      }

      return false
    }
  }
