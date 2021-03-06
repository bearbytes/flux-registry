## flux-registry

Yet another Flux implementation for React, focusing on minimal boilerplate and strong Typescript support.

### High level overview:

* create Registry  
  * declare `State` interface
* register Actions  
  * declare `Payload` interface
  * declare function `reduce: (State, Payload) => State`
* register Components  
  * declare `OwnProps`
  * optionally declare `SelectedProps` and function `selectProps: (State, OwnProps) => SelectedProps`
  * declare function `render: (OwnProps & SelectedProps & Dispatch) => React.Element | null`
* create Store  
  * provide initial state
* put Store Provider into the Component Tree as parent of registered Components
* `dispatch` registered Actions from Component's `render` function to update state


### Example usage:

```typescript
import { createFluxRegistry } from 'flux-registry'
import React = require('react')
import ReactDOM = require('react-dom')

// first create a registry
const flux = createFluxRegistry<{
  // definition of global state
  myNumber: number
}>()

// register any number of actions
const incrementNumber = flux.registerAction<{
  // definition of action payload
  amount: number
}>({
  // unique type name for the action
  type: 'increment',

  // function to update the state when action is dispatched
  reduce: ({myNumber}, {amount}) => ({myNumber: myNumber + amount})
})

// register any number of react components
const IncrementButton = flux.registerComponent<{
  // definition of component props (OwnProps)
  incrementBy: number
}>({
  // render function. dispatch is provided with the props
  // use it to dispatch previously registered actions from event handlers
  render: ({incrementBy, dispatch}) => {
    const onClick = () => dispatch(incrementNumber({amount: incrementBy}))
    return <button onClick={ onClick }>Increment by { incrementBy }</button>
  }
})

// registered components can select additional props (SelectedProps) from the global state
const NumberDisplay = flux.registerComponent<{
  // OwnProps
  multiplicationFactor: number
}, {
  // SelectedProps
  totalValue: number
}>({
  // must provide a selectProps function in this case: (State, OwnProps) => SelectedProps
  selectProps: ({myNumber}, {multiplicationFactor}) => ({totalValue: myNumber * multiplicationFactor}),

  // OwnProps and SelectedProps are merged into a single object for the render function
  render: ({totalValue, multiplicationFactor}) => {
    const text = `${totalValue} (multiplied by ${multiplicationFactor})`
    return <p>{ text }</p>
  }
})

// create a store that holds a single instance of the global state
const store = flux.createStore({
  initialState: {myNumber: 0}
})

// Wrap all registered components into a single store.Provider at the root of your component tree.
const App = () => (
  <store.Provider>
    <NumberDisplay multiplicationFactor={ 5 }/>
    <IncrementButton incrementBy={ 2 }/>
  </store.Provider>
)

// That's it, we can render our app
ReactDOM.render(<App/>, document.getElementById('root'))

```
