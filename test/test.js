const test = require('tape')
const tapSpec = require('tap-spec')
const { createTypeStore, createUtilities } = require('../')
const relationships = require('./dtr')
const {
  PLANE,
  TRAIN,
  AUTOMOBILE,
  HONDA,
  TOYOTA,
  CAR,
  TRUCK,
  RIDGELINE,
  ACCORD,
  ACCORD_SEDAN,
  ACCORD_COUPE,
  TACOMA,
  CAMRY
} = require('./types')

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout)

const typeKey = Symbol('Test')
const store = createTypeStore(relationships)
const { createVerifier, createDispatcher, createMap, brand, categoryOf } =
  createUtilities(store, typeKey)

const plane = brand({}, PLANE)
const train = brand({}, TRAIN)
const automobile = brand({}, AUTOMOBILE)
const truck = brand({}, TRUCK)
const car = brand({}, CAR)
const honda = brand({}, HONDA)
const toyota = brand({}, TOYOTA)
const accord = brand({}, ACCORD)
const accord_sedan = brand({}, ACCORD_SEDAN)

const camry = brand({}, CAMRY)

const isAutomobile = createVerifier(AUTOMOBILE)
const isPlane = createVerifier(PLANE)
const isTrain = createVerifier(TRAIN)
const isHonda = createVerifier(HONDA)
const isTruck = createVerifier(TRUCK)
const isCar = createVerifier(CAR)
const isToyota = createVerifier(TOYOTA)
const isCamry = createVerifier(CAMRY)
const isAccord = createVerifier(ACCORD)

test('store accessors', t => {
  const { expand, sort, is } = store

  const automobileSubcategories = [
    AUTOMOBILE,
    CAR,
    ACCORD_SEDAN,
    RIDGELINE,
    TACOMA,
    TRUCK,
    ACCORD,
    ACCORD_COUPE,
    CAMRY
  ]

  const sortedAutomobileSubcategories = sort(automobileSubcategories)

  t.ok(
    sortedAutomobileSubcategories.length === automobileSubcategories.length &&
    arraysHaveSameElements(automobileSubcategories, sortedAutomobileSubcategories) &&
    isTopologicallySorted(sortedAutomobileSubcategories, is),
    'correctly sorted automobile categories'
  )

  const expanded = expand('automobile')

  t.ok(
    arraysHaveSameElements(expanded, automobileSubcategories),
    'correctly expanded automobiles'
  )

  t.end()
})

test('categoryOf', t => {
  const typedObject = brand({}, TRAIN)
  t.ok(categoryOf(typedObject) === TRAIN, 'got type of typed object')

  t.end()
})

test('branding', t => {
  const typedObject = brand({}, TRAIN)
  t.ok(typedObject[typeKey] === TRAIN, 'apply type key to object')

  t.throws(
    brand.bind(null, {}, Symbol('spaceship')),
    'throws if passed an unrecognized category'
  )

  t.end()
})

test('basic type verification', t => {
  t.ok(isPlane(plane), 'a plane is a plane')
  t.ok(isTrain(train), 'a train is a train')
  t.notOk(isPlane(train), ' a train is not a plane')
  t.notOk(isPlane(automobile), 'a plane is not an automobile')
  t.ok(isAutomobile(automobile), 'an automobile is an automobile')
  t.ok(isAutomobile(truck), 'a truck is an automobile')
  t.ok(isAutomobile(car), 'a car is an automobile')

  t.ok(isTruck(truck), 'a truck is a truck')
  t.ok(isCar(car), 'a car is a car')
  t.notOk(isTruck(car), 'a car is not a truck')
  t.notOk(isCar('truck'), 'a truck is not a car')

  t.ok(isAutomobile(camry), 'a camry is an automobile')
  t.ok(isCar(camry), 'a camry is a car')
  t.ok(isToyota(camry), 'a camry is a toyota')
  t.ok(isCamry(camry), 'a camry is a camry')
  t.notOk(isTruck(camry), 'a camry is not a truck')
  t.notOk(isHonda(camry), 'a camry is not a honda')
  t.notOk(isAccord(camry), 'a camry is not an accord')
  t.notOk(
    isAutomobile('submarine'),
    'verifier function returns false if passed an unrecognized category'
  )

  t.throws(
    createVerifier.bind(null, 'submarine'),
   'createVerifier throws if passed an unrecognized category'
  )

  t.end()
})

test('map a type to a value', t => {
  const thingsThatMoveYou = [ PLANE, TRAIN, AUTOMOBILE, TRUCK, CAR, ACCORD,
    CAMRY, HONDA, TOYOTA, ACCORD_SEDAN ]

  const map = createMap({
    [ACCORD_SEDAN]: 1,
    [AUTOMOBILE]: 2,
    [CAR]: 3,
    [PLANE]: 4,
    [ACCORD]: 5
  }, 6)

  t.deepEqual(
    thingsThatMoveYou.map(map),
    [4, 6, 2, 2, 3, 5, 3, 6, 6, 1],
    'mapped correctly'
  )

  t.end()
})

test('dispatch on type', t => {
  const thingsThatMoveYou = [ plane, train, automobile, truck, car, accord,
    camry, honda, toyota, accord_sedan ]

  const bins = {
    automobiles: [],
    cars: [],
    planes: [],
    accords: [],
    accord_sedans: [],
    misc: []
  }

  const dispatch = createDispatcher({
    [ACCORD_SEDAN]: obj => bins.accord_sedans.push(obj),
    [AUTOMOBILE]: obj => bins.automobiles.push(obj),
    [CAR]: obj => bins.cars.push(obj),
    [PLANE]: obj => bins.planes.push(obj),
    [ACCORD]: obj => bins.accords.push(obj)
  }, obj => bins.misc.push(obj))

  thingsThatMoveYou.forEach(thing => dispatch(thing))

  t.ok(
    bins.accord_sedans.length === 1 &&
    bins.accord_sedans.indexOf(accord_sedan) > -1,
    'properly dispatched accord sedan'
  )

  t.ok(
    bins.accords.length === 1 && bins.accords.indexOf(accord) > -1,
    'properly dispatched accords'
  )

  t.ok(
    bins.cars.length === 2 &&
    bins.cars.indexOf(car) > -1 &&
    bins.cars.indexOf(camry) > -1,
    'properly dispatched cars'
  )

  t.ok(
    bins.automobiles.length === 2 &&
    bins.automobiles.indexOf(automobile) > -1 &&
    bins.automobiles.indexOf(truck) > -1,
    'properly dispatched automobiles'
  )

  t.ok(
    bins.planes.length === 1 && bins.planes.indexOf(plane) > -1,
    'properly dispatched planes'
  )

  t.ok(
    bins.misc.length === 3 &&
    bins.misc.indexOf(train) > -1 &&
    bins.misc.indexOf(honda) > -1 &&
    bins.misc.indexOf(toyota) > -1,
    'properly dispatched misc'
  )

  t.throws(createDispatcher.bind(null, {
    'submarine': () => {}
  }), 'throws when passed a map with an unknown property')

  // t.throws(createDispatcher.bind(null, {
  //   [AUTOMOBILE]: 'blerp'
  // }), 'throws when passed a map with non-function values')

  const dispatchNoDefaults = createDispatcher({
    [AUTOMOBILE]: obj => bins.automobiles.push(obj),
    [CAR]: obj => bins.cars.push(obj),
    [PLANE]: obj => bins.planes.push(obj),
    [ACCORD]: obj => bins.accords.push(obj)
  })

  t.throws(
    () => thingsThatMoveYou.forEach(thing => dispatchNoDefaults(thing)),
    'throws when non-mapped types are passed if no default function is given'
  )

  t.end()
})

test('dispatches on typed function', t => {
  const thingsThatMoveYou = [ plane, train, automobile, truck, car, accord,
    camry, honda, toyota, accord_sedan ]

  const bins = {
    automobiles: [],
    cars: [],
    planes: [],
    accords: [],
    accord_sedans: [],
    misc: []
  }

  const dispatch = createDispatcher([
    brand(obj => bins.accord_sedans.push(obj), ACCORD_SEDAN),
    brand(obj => bins.automobiles.push(obj), AUTOMOBILE),
    brand(obj => bins.cars.push(obj), CAR),
    brand(obj => bins.planes.push(obj), PLANE),
    brand(obj => bins.accords.push(obj), ACCORD)
  ], obj => bins.misc.push(obj))

  thingsThatMoveYou.forEach(thing => dispatch(thing))

  t.ok(
    bins.accord_sedans.length === 1 &&
    bins.accord_sedans.indexOf(accord_sedan) > -1,
    'properly dispatched accord sedan'
  )

  t.ok(
    bins.accords.length === 1 && bins.accords.indexOf(accord) > -1,
    'properly dispatched accords'
  )

  t.ok(
    bins.cars.length === 2 &&
    bins.cars.indexOf(car) > -1 &&
    bins.cars.indexOf(camry) > -1,
    'properly dispatched cars'
  )

  t.ok(
    bins.automobiles.length === 2 &&
    bins.automobiles.indexOf(automobile) > -1 &&
    bins.automobiles.indexOf(truck) > -1,
    'properly dispatched automobiles'
  )

  t.ok(
    bins.planes.length === 1 && bins.planes.indexOf(plane) > -1,
    'properly dispatched planes'
  )

  t.ok(
    bins.misc.length === 3 &&
    bins.misc.indexOf(train) > -1 &&
    bins.misc.indexOf(honda) > -1 &&
    bins.misc.indexOf(toyota) > -1,
    'properly dispatched misc'
  )

  t.end()
})

function isTopologicallySorted (array, isPredecessor) {
  return array.reduce(({ previous, value = true }, current) =>
    value === false
      ? { value: false }
      : {
        previous: current,
        value: previous != null
          ? !(isPredecessor(current)(previous))
          : true
      }
  ).value
}

function arraysHaveSameElements (a, b) {
  return (
    a.every(item => b.indexOf(item) !== -1) &&
    b.every(item => a.indexOf(item) !== -1)
  )
}
