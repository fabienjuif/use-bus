# use-bus
> React hook to subscribe and dispatch events accros React components

![npm](https://img.shields.io/npm/v/use-bus.svg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-bus.svg) ![CircleCI](https://img.shields.io/circleci/build/github/fabienjuif/use-bus.svg) ![Coveralls github](https://img.shields.io/coveralls/github/fabienjuif/use-bus.svg)


# API
## dispatch
`import { dispatch } from 'use-bus'`:
- `dispatch('string')`: will dispatch the action `{ type: 'string' }` without payload
- `dispatch({ type: 'string', payload: 3 })`: will dispatch the given action

## useBus
`import useBus from 'use-bus'`:
- `useBus('string', callback, deps)`: register the given `callback` to the `string` action (action.type equals `string`)
  * `callback`: take the action as the first argument so you can retrieve its type and its payload for example
  * `deps`: is an array where you declare variables you use in `callback`, like you are doing for a useEffect from React

# Example
## register to an event (and react to it)
```jsx
import React, { useState } from 'react'
import useBus from 'use-bus'

const PrintIterations = () => {
  const [iterations, setIterations] = useState(0)

  useBus(
    '@@ui/ADD_ITERATION',
    () => setIterations(iterations + 1),
    [iterations],
  )

  return (
    <div>
      {'There is '}
      {iterations}
      {' iterations'}
    </div>
  )
}

export default PrintIterations
```

1. import the hook `useBus`
2. register to an event name, here `@@ui/ADD_ITERATION`
3. react to this, here an anonymous function that increment a number

## dispatch an event
```jsx
import React from 'react'
import { dispatch } from 'use-bus'

const IterateBtn = () => {
  return (
    <button onClick={() => dispatch('@@ui/ADD_ITERATION')}>
      Iterate
    </button>
  )
}

export default IterateBtn
```

1. import `dispatch` and call it with the event you want to send

## Connect the dispatcher and the reaction
```jsx
import React from 'react'
import PrintIterations from './printIterations'
import IterateBtn from './iterateBtn'

const App = () => {
  return (
    <div>
      <PrintIterations />
      <IterateBtn />
    </div>
  )
}

export default App
```

There is no connection to do, this is already done by `use-bus`.

This example just demonstrate that siblings can interact, but you can imagine a dispatcher wherever you want in the React tree and something that react to the dispatch wherever you want to.
