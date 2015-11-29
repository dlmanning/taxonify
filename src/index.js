import createTypeStore from './create-typestore'
import createUtilities from './utilities/index'

export const taxonify = (relationships, typeKey = Symbol('taxonify')) => {
  const store = createTypeStore(relationships)
  return createUtilities(store, typeKey)
}

export { createTypeStore, createUtilities }
