import { IAdapter } from '../src/adapters'

describe('Hermes Adapters', () => {
    const MockAdapter: IAdapter<'Mock'> = {
        name: 'Mock',
        getConnection(options: boolean): boolean {
            return options
        },
        getMessages(): [] {
            return []
        },
        putMessages(connection: boolean, messages): boolean {
            if (messages) return connection
            return false
        },
        closeConnection(): boolean {
            return false
        },
    }
    test('adapters should have a `name` property', () => {
        expect(MockAdapter.name).toBeDefined()
    })

    test('adapters should have a `getConnection` method', () => {
        expect(MockAdapter.getConnection).toBeDefined()
    })
    test('adapters should have a `getMessages` method', () => {
        expect(MockAdapter.getMessages).toBeDefined()
    })

    test('adapters should have a `putMessages` method', () => {
        expect(MockAdapter.putMessages).toBeDefined()
    })
})
