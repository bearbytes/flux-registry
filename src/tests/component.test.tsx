import {shallow} from 'enzyme'
import * as React from 'react'
import {CounterComponent, flux, increment} from './test.fixture'

test('basic test', () => {
  const initialState = {count: 42}
  const store = flux.createStore({initialState})

  const StateProvider = store.provider
  const MyComponent = () => {
    return (
      <StateProvider>
        <CounterComponent offsetBy={100}/>
      </StateProvider>
    )
  }

  const wrapper = shallow(<MyComponent/>)
  expect(wrapper.html()).toBe('<p>142</p>')
})

test('component updates on state change', () => {
  const initialState = {count: 42}
  const store = flux.createStore({initialState})

  const StateProvider = store.provider
  const MyComponent = () => {
    return (
      <StateProvider>
        <CounterComponent offsetBy={100}/>
      </StateProvider>
    )
  }

  const wrapper = shallow(<MyComponent/>)
  expect(wrapper.html()).toBe('<p>142</p>')

  store.dispatch(increment({by: 1}))
  expect(wrapper.html()).toBe('<p>143</p>')
})