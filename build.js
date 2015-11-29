var rollup = require("rollup")
var babel = require("rollup-plugin-babel")
var npm = require( 'rollup-plugin-npm' )
var commonjs = require( 'rollup-plugin-commonjs' )

rollup.rollup({
  entry: "src/index.js",
  plugins: [
    babel()
  ]
}).then(function (bundle) {
  bundle.write({
    dest: "dist/bundle.js",
    format: "cjs"
  })
}).catch(err => {
  console.log(err)
})
