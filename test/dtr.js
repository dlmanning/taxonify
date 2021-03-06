const t = require('./types')

module.exports = define => {
  define(t.AUTOMOBILE, [t.CAR, t.TRUCK])
  define(t.CAR, [t.CAMRY, t.ACCORD])
  define(t.TRUCK, [t.TACOMA, t.RIDGELINE])
  define(t.HONDA, [t.ACCORD, t.RIDGELINE])
  define(t.TOYOTA, [t.CAMRY, t.TACOMA])
  define(t.ACCORD, [t.ACCORD_SEDAN, t.ACCORD_COUPE])
  define(t.PLANE)
  define(t.TRAIN)
}
