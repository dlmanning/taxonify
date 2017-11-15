module.exports = ({ categories, recognizedCategories }) =>
  unsorted => {
    if (!Array.isArray(unsorted)) {
      throw new TypeError('Sorting requires an array of categories')
    }
    
    if (unsorted.some(item => !recognizedCategories.has(item))) {
      throw new Error('Cannot sort unknown category')
    }

    const sorted = [], marked = new Set(), unmarked = new Set(unsorted)

    while (unmarked.size > 0) {
      const n = Array.from(unmarked)[0]
      visit(n)
    }

    return sorted

    function visit (n, visited = new Set()) {
      if (visited.has(n)) {
        throw new Error(`A cyclic dependency exists in category defintions. ${n} visited twice`)
      }

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
