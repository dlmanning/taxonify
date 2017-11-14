const createDispatchersFactory = require('./dispatcher')
const createCreateVerifier = require('./verifier')
const createBrand = require('./brand')
const createCategoryOf = require('./category-of')

module.exports = (store, typeKey) => {
  const { createDispatcher, createMap } = createDispatchersFactory(store, typeKey)

  return {
    createDispatcher,
    createMap,
    createVerifier: createCreateVerifier(store, typeKey),
    brand: createBrand(store, typeKey),
    categoryOf: createCategoryOf(typeKey)
  }
}
