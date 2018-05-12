import {decrement, flux, increment} from './test.fixture'

test('dispatching actions updates the state', () => {
  const initialState = {count: 0}
  const store = flux.createStore({initialState})

  store.dispatch(increment({by: 1}))
  store.dispatch(decrement({by: 2}))

  expect(store.getState().count).toBe(-1)
})

test('separate stores do not share state', () => {
  const initialState = {count: 0}
  const storeA = flux.createStore({initialState})
  const storeB = flux.createStore({initialState})

  storeA.dispatch(increment({by: 1}))
  storeB.dispatch(increment({by: 2}))

  expect(storeA.getState().count).toBe(1)
  expect(storeB.getState().count).toBe(2)
})

test('state can be observed', () => {
  const initialState = {count: 0}
  const store = flux.createStore({initialState})

  const observedCounts: Array<number> = []
  store.subscribe(state => observedCounts.push(state.count))

  store.dispatch(increment({by: 5}))
  store.dispatch(increment({by: 10}))

  expect(observedCounts).toEqual([0, 5, 15])
})

test('created actions can be reused', () => {
  const initialState = {count: 20}
  const store = flux.createStore({initialState})

  const decrementBy5 = decrement({by: 5})

  store.dispatch(decrementBy5)
  store.dispatch(decrementBy5)

  expect(store.getState().count).toBe(10)
})

test('state is not mutated', () => {
  const initialState = {count: 20}
  const store = flux.createStore({initialState})

  const decrementBy5 = decrement({by: 5})

  store.dispatch(decrementBy5)
  const stateAt15 = store.getState()

  store.dispatch(decrementBy5)
  const stateAt10 = store.getState()

  expect(stateAt15).not.toBe(stateAt10)
  expect(stateAt15.count).toBe(15)
  expect(stateAt10.count).toBe(10)
})
