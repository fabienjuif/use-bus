const rewire = require("rewire")
const index = rewire("./index")
const subscribe = index.__get__("subscribe")
// @ponicode
describe("subscribe", () => {
    test("0", () => {
        let callFunction = () => {
            subscribe("\"[3,\"false\",false]\"", "callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            subscribe("\"{\"x\":[10,null,null,null]}\"", "callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            subscribe("\"{\"x\":5,\"y\":6}\"", "callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            subscribe("\"\"2006-01-02T14:04:05.000Z\"\"", "callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            subscribe(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
