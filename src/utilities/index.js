import createCreateDispatcher from './dispatcher'
import createCreateVerifier from './verifier'
import createBrand from './brand'

export default (store, typeKey) => {
  const { compare, expand, is, isRecognized } = store

  return {
    createDispatcher: createCreateDispatcher(compare, expand, typeKey),
    createVerifier: createCreateVerifier(is, isRecognized, typeKey),
    brand: createBrand(isRecognized, typeKey)
  }
}
