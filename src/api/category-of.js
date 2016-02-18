import invariant from 'invariant'

export default function createCategoryOf (typeKey) {
  return obj => {
    invariant(
      typeof obj === 'object' && obj[typeKey] != null,
      'categoryOf requires a typed object'
    )

    return obj[typeKey]
  }
}
