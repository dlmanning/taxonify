import createDispatchersFactory from './dispatcher'
import createCreateVerifier from './verifier'
import createBrand from './brand'
import createCategoryOf from './category-of'


export default (store, typeKey) => {
  const { createDispatcher, createMap } = createDispatchersFactory(store, typeKey)

  return {
    createDispatcher,
    createMap,
    createVerifier: createCreateVerifier(store, typeKey),
    brand: createBrand(store, typeKey),
    categoryOf: createCategoryOf(typeKey)
  }
}
