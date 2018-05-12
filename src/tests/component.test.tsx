import {shallow} from 'enzyme'
import * as React from 'react'
import {CounterComponent, flux, increment} from './test.fixture'

test('basic test', () => {
  const initialState = {count: 42}
  const {Provider} = flux.createStore({initialState})

  const MyComponent = () => {
    return (
      <Provider>
        <CounterComponent offsetBy={100}/>
      </Provider>
    )
  }

  const wrapper = shallow(<MyComponent/>)
  expect(wrapper.html()).toBe('<p>142</p>')
})

test('component updates on state change', () => {
  const initialState = {count: 42}
  const store = flux.createStore({initialState})
  const {Provider} = store

  const MyComponent = () => {
    return (
      <Provider>
        <CounterComponent offsetBy={100}/>
      </Provider>
    )
  }

  const wrapper = shallow(<MyComponent/>)
  expect(wrapper.html()).toBe('<p>142</p>')

  store.dispatch(increment({by: 1}))
  expect(wrapper.html()).toBe('<p>143</p>')
})