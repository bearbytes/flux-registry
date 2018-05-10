import * as React from 'react'
import {ActionCreator, ActionOptions, defineAction, Dispatch} from './actions'
import {ComponentOptions, defineComponent} from './components'
import {createStore, Store, StoreOptions} from './store'

interface FluximityApi<S> {
  defineComponent: <P, SP>(opts: ComponentOptions<S, P, SP>) => React.ComponentType<P>
  defineAction: <T>(opts: ActionOptions<S, T>) => ActionCreator<S, T>
  createStore: (opts: StoreOptions<S>) => Store<S>
}

export function fluximity<S>(): FluximityApi<S> {
  const stateContext = React.createContext<S>(null as any)
  const dispatchContext = React.createContext<Dispatch<S>>(null as any)

  const actionRegistry = {}

  return {
    defineComponent: opts => defineComponent(opts, stateContext.Consumer, dispatchContext.Consumer),
    defineAction: opts => defineAction(opts, actionRegistry),
    createStore: opts => createStore(opts, actionRegistry)
  }
}