import { useEffect } from 'react'

let subscribers = []

const subscribe = (filter, callback) => {
  if (filter === undefined || filter === null) return undefined
  if (callback === undefined || callback === null) return undefined

  subscribers = [
    ...subscribers,
    [filter, callback],
  ]

  return () => {
    subscribers = subscribers.filter((subscriber) => subscriber[1] !== callback)
  }
}

export const dispatch = (event) => {
  let { type } = event
  if (typeof event === 'string') type = event

  const args = []
  if (typeof event === 'string') args.push({ type })
  else args.push(event)

  subscribers.forEach(([filter, callback]) => {
    if (typeof filter === 'string' && filter !== type) return
    if (Array.isArray(filter) && !filter.includes(type)) return
    if (filter instanceof RegExp && !filter.test(type)) return
    if (typeof filter === 'function' && !filter(...args)) return

    callback(...args)
  })
}

const useBus = (type, callback, deps = []) => {
  useEffect(() => subscribe(type, callback), deps)

  return dispatch
}

export default useBus
