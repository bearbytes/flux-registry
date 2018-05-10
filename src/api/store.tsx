import * as React from 'react'
import {ReactNode} from 'react'
import {Action, ActionRegistry, Dispatch} from './actions'

export interface Store<S> {
  getState: () => S
  subscribe: (observer: StateObserver<S>) => void // todo: return unsubscribe
  dispatch: (action: Action<S, any>) => void
  provider: React.ComponentType
}

export interface StoreOptions<S> {
  initialState: S
}

type StateObserver<S> = (state: S) => void

export function createStore<S>(
  opts: StoreOptions<S>,
  actionRegistry: ActionRegistry<S>,
  StateProvider: React.Provider<S>,
  DispatchProvider: React.Provider<Dispatch<S>>
): Store<S> {
  let currentState = opts.initialState
  const getState = () => currentState

  let observers: Array<StateObserver<S>> = []
  const subscribe = (observer: StateObserver<S>) => {
    observers.push(observer)
    observer(getState())
  }

  const setState = (state: S) => {
    currentState = state
    observers.forEach(observer => observer(state))
  }

  const dispatch = (action: Action<S, any>) => {
    const options = actionRegistry[action.type]
    if (options === undefined) {
      throw Error(`The dispatched action of type ${action.type} is not registered.`)
    }

    let state = getState()
    state = options.reduce(state, action.payload)
    setState(state)
  }

  const provider: React.ComponentType = (props: { children?: ReactNode }) => (
    <DispatchProvider value={dispatch}>
      <StateHolder getState={getState} subscribe={subscribe} StateProvider={StateProvider}>
        {props.children}
      </StateHolder>
    </DispatchProvider>
  )

  return {
    getState,
    dispatch,
    subscribe,
    provider
  }
}

interface StateHolderProps<S> {
  getState: () => S,
  subscribe: (observer: StateObserver<S>) => void,
  StateProvider: React.Provider<S>
}

class StateHolder<S> extends React.Component<StateHolderProps<S>, S> {
  constructor(props: StateHolderProps<S>) {
    super(props)
    this.state = this.props.getState()
  }

  componentDidMount() {
    this.props.subscribe(state => this.setState(state))
  }

  render() {
    return (
      <this.props.StateProvider value={this.state}>
        {this.props.children}
      </this.props.StateProvider>
    )
  }
}