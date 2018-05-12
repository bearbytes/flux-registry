export type Dispatch<S, T = any> = (action: Action<S, T>) => void

export interface Action<S, T> {
  type: string
  payload: T
}

export interface ActionOptions<S, T> {
  type: string,
  reduce: (state: S, payload: T) => S
}

export type ActionCreator<S, T> = (payload: T) => Action<S, T>

export interface ActionRegistry<S> {
  [ type: string ]: ActionOptions<S, any>
}

export function defineAction<S, T>(opts: ActionOptions<S, T>, registry: ActionRegistry<S>) {
  const type = opts.type
  if (registry[ type ] !== undefined) {
    throw Error(`Tried to register a action type ${type} which is already registered`)
  }

  const actionCreator = (payload: T) => ({ type, payload })
  registry[ type ] = opts
  return actionCreator
}

