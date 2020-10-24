import { Adapter } from '../src/adapter'

describe('Adapters', () => {
    type MockAdapter = Adapter<Record<string, unknown>, Record<string, unknown>>
    const MockAdapter: MockAdapter = {
        name: Symbol('MockAdapter'),
        getConnection(connection) {
            return connection
        },
    }
    test('Adapters require a getConnection method', () => {
        expect(MockAdapter).toHaveProperty('getConnection')
    })
})
