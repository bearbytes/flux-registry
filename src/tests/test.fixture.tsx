import * as React from 'react'
import { createFluxRegistry } from '../api/registry'

interface CounterState {
  count: number
}

export const flux = createFluxRegistry<CounterState>()

export const increment = flux.registerAction<{ by: number }>({
  type: 'increment',
  reduce: (state, { by }) => ({ count: state.count + by })
})

export const decrement = flux.registerAction<{ by: number }>({
  type: 'decrement',
  reduce: (state, { by }) => ({ count: state.count - by })
})

export const CounterComponent = flux.registerComponent<{
  offsetBy: number
}, {
  combinedCount: number
}>({
  selectProps: (state, props) => ({ combinedCount: state.count + props.offsetBy }),
  render: ({ combinedCount }) => (<p>{combinedCount}</p>)
})