import {shallow} from 'enzyme'
import * as React from 'react'
import {CounterComponent, flux} from './test.fixture'

test('root component can be created', () => {
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