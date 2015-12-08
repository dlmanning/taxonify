import createStore from './store/index'
import createUtilities from './api/index'

export const taxonify = (relationships, typeKey = Symbol('taxonify')) => {
  const store = createStore(relationships)
  return createUtilities(store, typeKey)
}

export { createStore as createTypeStore, createUtilities }
