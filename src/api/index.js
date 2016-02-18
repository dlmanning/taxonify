import createCreateDispatcher from './dispatcher'
import createCreateVerifier from './verifier'
import createBrand from './brand'
import createCategoryOf from './category-of'

export default (store, typeKey) => {

  return {
    createDispatcher: createCreateDispatcher(store, typeKey),
    createVerifier: createCreateVerifier(store, typeKey),
    brand: createBrand(store, typeKey),
    categoryOf: createCategoryOf(typeKey)
  }
}
