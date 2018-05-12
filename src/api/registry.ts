import * as React from 'react'
import { ActionCreator, ActionOptions, defineAction, Dispatch } from './actions'
import { ComponentOptionsEx, ComponentOptionsSimple, registerComponentEx, registerComponentSimple } from './components'
import { createStore, Store, StoreOptions } from './store'

interface FluxRegistryApi<S> {
  registerComponent:
    (<P>(opts: ComponentOptionsSimple<S, P>) => React.ComponentType<P>) &
    (<P, SP>(opts: ComponentOptionsEx<S, P, SP>) => React.ComponentType<P>)

  registerAction:
    <T>(opts: ActionOptions<S, T>) => ActionCreator<S, T>

  createStore:
    (opts: StoreOptions<S>) => Store<S>
}

export function createFluxRegistry<S>(): FluxRegistryApi<S> {
  const stateContext = React.createContext<S>(null as any)
  const dispatchContext = React.createContext<Dispatch<S>>(null as any)

  const actionRegistry = {}

  const registerComponent = <P, SP>(opts: ComponentOptionsSimple<S, P> | ComponentOptionsEx<S, P, SP>) => {
    const optsEx = opts as ComponentOptionsEx<S, P, SP>
    if (optsEx.selectProps === undefined) {
      return registerComponentSimple(opts, dispatchContext.Consumer)
    } else {
      return registerComponentEx(optsEx, stateContext.Consumer, dispatchContext.Consumer)
    }
  }

  return {
    registerComponent,
    registerAction: opts => defineAction(opts, actionRegistry),
    createStore: opts => createStore(opts, actionRegistry, stateContext.Provider, dispatchContext.Provider)
  }
}

