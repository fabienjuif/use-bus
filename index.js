import { useEffect } from 'react'

const subscribers = new Map()

const subscribe = (type, callback) => {
  if (type === undefined || type === null) return
  if (callback === undefined || callback === null) return

  if (!subscribers.has(type)) subscribers.set(type, new Set())
  subscribers.get(type).add(callback)
}

const unsubscribe = (type, callback) => {
  if (!subscribers.has(type)) return
  if (callback === undefined || callback === null) return

  subscribers.get(type).delete(callback)

  if (subscribers.get(type).size === 0) subscribers.delete(type)
}

export const dispatch = (action) => {
  let { type } = action
  if (typeof action === 'string') type = action

  if (!subscribers.has(type)) return

  subscribers.get(type).forEach((callback) => {
    if (typeof action === 'string') {
      callback({ type })
    } else {
      callback(action)
    }
  })
}

const useBus = (type, callback, deps = []) => {
  useEffect(() => {
    subscribe(type, callback)

    return () => {
      unsubscribe(type, callback)
    }
  }, deps)

  return dispatch
}

export default useBus
