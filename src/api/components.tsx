import * as React from 'react'
import { pure } from 'recompose'
import { Dispatch } from './actions'


export function registerComponent<S, P, SP>(
  opts: ComponentOptionsSimple<S, P> | ComponentOptionsEx<S, P, SP>,
  stateConsumer: React.Consumer<S>,
  dispatchConsumer: React.Consumer<Dispatch<S>>
): React.ComponentType<P> {
  const optsEx = opts as ComponentOptionsEx<S, P, SP>
  if (optsEx.selectProps === undefined) {
    return registerComponentSimple(opts, stateConsumer, dispatchConsumer)
  } else {
    return registerComponentEx(optsEx, stateConsumer, dispatchConsumer)
  }
}

export type RegisterComponent<S, P, SP> =
  RegisterComponentSimple<S, P> &
  RegisterComponentEx<S, P, SP>


export type RegisterComponentSimple<S, P> = (opts: ComponentOptionsSimple<S, P>) => React.ComponentType<P>

export interface ComponentOptionsSimple<S, P> {
  render: (props: RenderProps<S, P>) => React.ReactElement<any> | null
}

export function registerComponentSimple<S, P>(
  {render}: ComponentOptionsSimple<S, P>,
  stateConsumer: React.Consumer<S>,
  dispatchConsumer: React.Consumer<Dispatch<S>>
): React.ComponentType<P> {
  return pure((props: P) => {
    return React.createElement(dispatchConsumer, null, (dispatch: Dispatch<S>) => {
      const renderProps = Object.assign({}, props, {dispatch})
      return React.createElement(render, renderProps)
    })
  })
}

export type RegisterComponentEx<S, P, SP> = (opts: ComponentOptionsEx<S, P, SP>) => React.ComponentType<P>

export interface ComponentOptionsEx<S, P, SP> {
  selectProps: (state: Readonly<S>, props: Readonly<P>) => SP
  render: (props: RenderProps<S, P, SP>) => React.ReactElement<any> | null
}

export function registerComponentEx<S, P, SP>(
  {render, selectProps}: ComponentOptionsEx<S, P, SP>,
  stateConsumer: React.Consumer<S>,
  dispatchConsumer: React.Consumer<Dispatch<S>>
): React.ComponentType<P> {
  return pure((props: P) => {
    return React.createElement(dispatchConsumer, null, (dispatch: Dispatch<S>) => {
      return React.createElement(stateConsumer, null, (state: S) => {
        const selectedProps = selectProps(state, props)
        const renderProps = Object.assign({}, props, selectedProps, {dispatch})
        return React.createElement(render, renderProps)
      })
    })
  })
}

type RenderProps<S, P, SP = {}> = P & {dispatch: Dispatch<S>} & SP
