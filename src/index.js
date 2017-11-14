const createStore = require('./store')
const createUtilities = require('./api')

module.exports = {
  taxonify: (relationships, typeKey = Symbol('taxonify')) => {
    const store = createStore(relationships)
    return createUtilities(store, typeKey)
  },
  createTypeStore: createStore,
  createUtilities
}
