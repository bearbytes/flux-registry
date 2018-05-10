import {Action, ActionRegistry} from './actions'

export interface Store<S> {
  getState: () => S
  subscribe: (observer: StateObserver<S>) => void // todo: return unsubscribe
  dispatch: (action: Action<S, any>) => void
}

export interface StoreOptions<S> {
  initialState: S
}

type StateObserver<S> = (state: S) => void

export function createStore<S>(
  opts: StoreOptions<S>,
  actionRegistry: ActionRegistry<S>
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

  return {
    getState,
    dispatch,
    subscribe
  }
}

