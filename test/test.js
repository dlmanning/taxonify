import test from 'tape'
import tapSpec from 'tap-spec'
import { createTypeStore, createUtilities } from '../src'
import relationships from './dtr'
import {
  PLANE,
  TRAIN,
  AUTOMOBILE,
  HONDA,
  TOYOTA,
  CAR,
  TRUCK,
  RIDGELINE,
  ACCORD,
  TACOMA,
  CAMRY
} from './types'

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout)

const typeKey = Symbol('Test')
const store = createTypeStore(relationships)
const { createVerifier, createDispatcher, brand }
  = createUtilities(store, typeKey)

const plane = brand({}, PLANE)
const train = brand({}, TRAIN)
const automobile = brand({}, AUTOMOBILE)
const truck = brand({}, TRUCK)
const car = brand({}, CAR)
const honda = brand({}, HONDA)
const toyota = brand({}, TOYOTA)
const accord = brand({}, ACCORD)
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

test('category expansion', t => {
  const { expand } = store

  const automobileSubcategories
    = [ AUTOMOBILE, CAR, TRUCK, RIDGELINE, ACCORD, TACOMA, CAMRY]

  const expanded = expand('automobile')

  t.ok(
    expanded.every(item => automobileSubcategories.indexOf(item) > -1) &&
    automobileSubcategories.every(item => expanded.indexOf(item) > -1),
    'correctly expanded automobiles'
  )
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
  t.notOk(isCar(truck), 'a truck is not a car')

  t.ok(isAutomobile(camry), 'a camry is an automobile')
  t.ok(isCar(camry), 'a camry is a car')
  t.ok(isToyota(camry), 'a camry is a toyota')
  t.ok(isCamry(camry), 'a camry is a camry')
  t.notOk(isTruck(camry), 'a camry is not a truck')
  t.notOk(isHonda(camry), 'a camry is not a honda')
  t.notOk(isAccord(camry), 'a camry is not an accord')

  t.throws(
    createVerifier.bind(null, 'submarine'),
    /Unknown category: submarine/,
   'createVerifier throws if passed an unrecognized category'
  )

  t.throws(
    isAutomobile.bind(null, { [typeKey]: 'submarine' }),
    'verifier function throws if passed an unrecognized category'
  )

  t.end()
})


test('dispatch on type', t => {
  const thingsThatMoveYou = [ plane, train, automobile, truck, car, accord,
    camry, honda, toyota ]

  const bins = {
    automobiles: [],
    cars: [],
    planes: [],
    accords: [],
    misc:  []
  }

  const dispatch = createDispatcher({
    [AUTOMOBILE]: obj => bins.automobiles.push(obj),
    [CAR]: obj => bins.cars.push(obj),
    [PLANE]: obj => bins.planes.push(obj),
    [ACCORD]: obj => bins.accords.push(obj)
  }, obj => bins.misc.push(obj))

  thingsThatMoveYou.forEach(thing => dispatch(thing))

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

  t.throws(createDispatcher.bind(null, {
    [AUTOMOBILE]: 'blerp'
  }), 'throws when passed a map with non-function values')

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
