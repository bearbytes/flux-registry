import * as React from 'react'
import { PureComponent } from 'react'
import { Dispatch } from './actions'


export interface ComponentOptionsSimple<S, P> {
  render: (props: RenderProps<S, P>) => React.ReactElement<any> | null
}

export function registerComponentSimple<S, P>(
  {render}: ComponentOptionsSimple<S, P>,
  DispatchConsumer: React.Consumer<Dispatch<S>>
): React.ComponentType<P> {
  return (props: P) => (
    <DispatchConsumer>
      { dispatch => (
        <PureWrapper
          { ...props }
          { ...{dispatch, render} }
        />
      ) }
    </DispatchConsumer>
  )
}

export interface ComponentOptionsEx<S, P, SP> {
  selectProps: (state: Readonly<S>, props: Readonly<P>) => SP
  render: (props: RenderProps<S, P, SP>) => React.ReactElement<any> | null
}

export function registerComponentEx<S, P, SP>(
  {render, selectProps}: ComponentOptionsEx<S, P, SP>,
  StateConsumer: React.Consumer<S>,
  DispatchConsumer: React.Consumer<Dispatch<S>>
): React.ComponentType<P> {
  return (props: P) => (
    <DispatchConsumer>
      { dispatch => (
        <StateConsumer>
          { state => (
            <PureWrapper
              { ...props }
              { ...selectProps(state, props) }
              { ...{dispatch, render} }
            />
          ) }
        </StateConsumer>
      ) }
    </DispatchConsumer>
  )
}

type RenderProps<S, P, SP = {}> = P & {dispatch: Dispatch<S>} & SP

// TODO: this injects render into RenderProps, we'll probably want to keep that separate
class PureWrapper extends PureComponent<any> {
  render() {
    return this.props.render(this.props)
  }
}