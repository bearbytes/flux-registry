import {fluximity} from '../api/fluximity'

interface TestState {
  numbers: ReadonlyArray<number>
  total: number
}

const flux = fluximity<TestState>()

const addNumber = flux.defineAction<{
  num: number
}>({
  type: 'addNumber',
  reduce: (state, {num}) => {
    const numbers = [...state.numbers, num]
    const total = state.total + num
    return {numbers, total}
  }
})

test('it works', () => {
  const store = flux.createStore({
    initialState: {
      total: 0,
      numbers: []
    }
  })

  store.dispatch(addNumber({num: 1}))
  store.dispatch(addNumber({num: 2}))
  expect(store.getState().numbers).toEqual([1, 2])
  expect(store.getState().total).toBe(3)
})