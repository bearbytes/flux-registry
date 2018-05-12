import * as React from 'react'
import { ActionCreator, ActionOptions, defineAction, Dispatch } from './actions'
import { ComponentOptions, defineComponent } from './components'
import { createStore, Store, StoreOptions } from './store'

interface FluxRegistryApi<S> {
  registerComponent: <P, SP>(opts: ComponentOptions<S, P, SP>) => React.ComponentType<P>
  registerAction: <T>(opts: ActionOptions<S, T>) => ActionCreator<S, T>
  createStore: (opts: StoreOptions<S>) => Store<S>
}

export function createFluxRegistry<S>(): FluxRegistryApi<S> {
  const stateContext = React.createContext<S>(null as any)
  const dispatchContext = React.createContext<Dispatch<S>>(null as any)

  const actionRegistry = {}

  return {
    registerComponent: opts => defineComponent(opts, stateContext.Consumer, dispatchContext.Consumer),
    registerAction: opts => defineAction(opts, actionRegistry),
    createStore: opts => createStore(opts, actionRegistry, stateContext.Provider, dispatchContext.Provider)
  }
}