# taxonify

## Categorize your stuff

## Quick start

You need some categories, define them like this:

```javascript
function relationships (define) {
  define('automobile', ['car', 'truck'])
  define('car', ['camry', 'accord'])
  define('truck', ['ridgeline', 'tacoma'])
  define('honda', ['accord', 'ridgeline'])
  define('toyota', ['camry', 'tacoma'])
}
```

Now hand the `relationships` function to `taxonify`

```javascript
import { taxonify } from 'taxonify'

const { createVerifier, brand } = taxonify(relationships)
```

Make a verifier function (or two)
```javascript
const isTruck = createVerifier('truck')
const isHonda = createVerifier('honda')
```

Brand an object with one of your categories

```javascript
const myAccord = brand({ color: red, sunroof: true }, 'accord')
```

And you're ready to verify your object

```javascript
isTruck(myAccord) // false
isHonda(myAccord) // true
```
