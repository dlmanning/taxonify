import invariant from 'invariant'

export default ({ categories, recognizedCategories }) =>
  unsorted => {
    invariant(
      Array.isArray(unsorted) &&
      unsorted.every(item => recognizedCategories.has(item)),
      'sort requires an array of known categories'
    )

    const sorted = [], marked = new Set(), unmarked = new Set(unsorted)

    while (unmarked.size > 0) {
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
