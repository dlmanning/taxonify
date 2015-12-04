import createCreateDispatcher from './dispatcher'
import createCreateVerifier from './verifier'
import createBrand from './brand'

export default (store, typeKey) => {
  const { sort, expand, is, isDefined } = store

  return {
    createDispatcher: createCreateDispatcher(sort, expand, typeKey),
    createVerifier: createCreateVerifier(is, isDefined, typeKey),
    brand: createBrand(isDefined, typeKey)
  }
}
