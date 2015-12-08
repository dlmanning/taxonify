import createStore from './store'
import createUtilities from './api'

export const taxonify = (relationships, typeKey = Symbol('taxonify')) => {
  const store = createStore(relationships)
  return createUtilities(store, typeKey)
}

export { createStore as createTypeStore, createUtilities }
