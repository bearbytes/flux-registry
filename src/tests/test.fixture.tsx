import * as React from 'react'
import {fluximity} from '../api/fluximity'

interface CounterState {
  count: number
}

export const flux = fluximity<CounterState>()

export const increment = flux.defineAction<{ by: number }>({
  type: 'increment',
  reduce: (state, {by}) => ({count: state.count + by})
})

export const decrement = flux.defineAction<{ by: number }>({
  type: 'decrement',
  reduce: (state, {by}) => ({count: state.count - by})
})

export const CounterComponent = flux.defineComponent<{
  offsetBy: number
}, {
  combinedCount: number
}>({
  selectProps: (state, props) => ({combinedCount: state.count + props.offsetBy}),
  render: ({combinedCount}) => (<p>{combinedCount}</p>)
})