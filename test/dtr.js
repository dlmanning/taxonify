import * as t from './types'

export default define => {
  define(t.AUTOMOBILE, [t.CAR, t.TRUCK])
  define(t.CAR, [t.CAMRY, t.ACCORD])
  define(t.TRUCK, [t.TACOMA, t.RIDGELINE])
  define(t.HONDA, [t.ACCORD, t.RIDGELINE])
  define(t.TOYOTA, [t.CAMRY, t.ACCORD])
  define(t.PLANE)
  define(t.TRAIN)
}
