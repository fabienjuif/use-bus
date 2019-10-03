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
