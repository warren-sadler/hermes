import { IbmmqAdapter } from '../src/adapters'

describe('Hermes Adapters', () => {
    test('adapters should have a `name` property', () => {
        expect(IbmmqAdapter.name).toBeDefined()
    })

    test('adapters should have a `getConnection` method', () => {
        expect(IbmmqAdapter.getConnection).toBeDefined()
    })
    test('adapters should have a `getMessages` method', () => {
        expect(IbmmqAdapter.getMessages).toBeDefined()
    })

    test('adapters should have a `putMessages` method', () => {
        expect(IbmmqAdapter.putMessages).toBeDefined()
    })
})
