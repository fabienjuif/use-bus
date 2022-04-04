/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks'
import useBus, { dispatch } from './index'

const prepare = (done) => (renderHookResult) => () => {
  renderHookResult.unmount()
  done()
}

it('should register event and call callback on dispatch (imported one)', (done) => {
  const clean = prepare(done)(renderHook(() => useBus('EVENT_TYPE', (event) => {
    expect(event.type).toEqual('EVENT_TYPE')

    clean()
  })))

  dispatch('EVENT_TYPE')
})

it('should register event and call callback on dispatch (returned by useBus one)', (done) => {
  let returnedDispatch

  const clean = prepare(done)(renderHook(() => {
    returnedDispatch = useBus('EVENT_TYPE', (event) => {
      expect(event.type).toEqual('EVENT_TYPE')

      clean()
    })
  }))

  returnedDispatch('EVENT_TYPE')
})

it('should pass the full event to the callback', (done) => {
  const clean = prepare(done)(renderHook(() => useBus('EVENT_TYPE', (event) => {
    expect(event).toEqual({
      type: 'EVENT_TYPE',
      payload: 'an other parameter',
      yet: 'an other',
    })

    clean()
  })))

  dispatch({
    type: 'EVENT_TYPE',
    payload: 'an other parameter',
    yet: 'an other',
  })
})

it('should not trigger the callback after unmount', (done) => {
  const { unmount } = renderHook(() => useBus('EVENT_TYPE', () => {
    done.fail('this callback should not have been called')
  }))

  unmount()

  dispatch('EVENT_TYPE')
  setTimeout(done, 500)
})

it('should register a function and call the callback', (done) => {
  let catchTimes = 0

  const { unmount } = renderHook(() => useBus((event) => event.channel === 'ui' && event.type === 'EVENT_TYPE', (event) => {
    catchTimes += 1
    expect(event).toEqual({
      channel: 'ui',
      type: 'EVENT_TYPE',
      payload: 'some payload',
    })
  }))

  const { unmount: otherUnmount } = renderHook(() => useBus((event) => event.channel === 'sw' && event.type === 'EVENT_TYPE', () => {
    catchTimes += 1
  }))

  dispatch({
    channel: 'ui',
    type: 'EVENT_TYPE',
    payload: 'some payload',
  })

  unmount()
  otherUnmount()

  expect(catchTimes).toEqual(1)

  done()
})

it('should register an array and call the callback', (done) => {
  let hitCount = 0
  let missCount = 0

  const { unmount: unmountHit } = renderHook(() => useBus(['foo', 'bar'], (event) => {
    hitCount += 1
    expect(event).toEqual({
      channel: 'ui',
      type: expect.stringMatching(/^(foo|bar)$/),
      payload: 'some payload',
    })
  }))

  const { unmount: unmountMiss } = renderHook(() => useBus(['baz'], () => {
    missCount += 1
  }))

  dispatch({
    channel: 'ui',
    type: 'foo',
    payload: 'some payload',
  })

  dispatch({
    channel: 'ui',
    type: 'bar',
    payload: 'some payload',
  })

  dispatch({
    channel: 'ui',
    type: 'baz',
    payload: 'some payload',
  })

  unmountHit()
  unmountMiss()

  expect(hitCount).toEqual(2)
  expect(missCount).toEqual(1)

  done()
})

it('should register a RegExp and call the callback', (done) => {
  let hitCount = 0
  let missCount = 0

  const { unmount: unmountHit } = renderHook(() => useBus(/^b/, (event) => {
    hitCount += 1
    expect(event).toEqual({
      channel: 'ui',
      type: expect.stringMatching(/^(bar|baz)$/),
      payload: 'some payload',
    })
  }))

  const { unmount: unmountMiss } = renderHook(() => useBus(/^f/, () => {
    missCount += 1
  }))

  dispatch({
    channel: 'ui',
    type: 'foo',
    payload: 'some payload',
  })

  dispatch({
    channel: 'ui',
    type: 'bar',
    payload: 'some payload',
  })

  dispatch({
    channel: 'ui',
    type: 'baz',
    payload: 'some payload',
  })

  unmountHit()
  unmountMiss()

  expect(hitCount).toEqual(2)
  expect(missCount).toEqual(1)

  done()
})
