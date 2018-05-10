import * as React from 'react'
import {pure} from 'recompose'
import {Dispatch} from './actions'

export interface ComponentOptions<S, P, SP> {
  selectProps: (state: Readonly<S>, props: Readonly<P>) => SP
  render: (props: RenderProps<S, P, SP>) => React.ReactElement<any> | null
}

type RenderProps<S, P, SP> = P & SP & { dispatch: Dispatch<S, any> }

export function defineComponent<S, P, SP>(
  {render, selectProps}: ComponentOptions<S, P, SP>,
  stateConsumer: React.Consumer<S>,
  dispatchConsumer: React.Consumer<Dispatch<S, any>>
): React.ComponentType<P> {
  return pure((props: P) => {
    return React.createElement(dispatchConsumer, null, (dispatch: Dispatch<S, any>) => {
      return React.createElement(stateConsumer, null, (state: S) => {
        const selectedProps = selectProps(state, props)
        const renderProps = Object.assign({}, props, selectedProps, {dispatch})
        return React.createElement(render, renderProps)
      })
    })
  })
}
