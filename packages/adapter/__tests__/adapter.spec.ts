import { Adapter, registerAdapters } from '../src/adapter'

describe('Adapters', () => {
    type MockAdapter = Adapter<
        Record<string, unknown>,
        Record<string, unknown>,
        string[]
    >
    const MockAdapter: MockAdapter = {
        name: Symbol('MockAdapter'),
        async getConnection(connection) {
            return connection
        },
        async getMessages() {
            return []
        },
        async putMessages() {
            return
        },
        async closeConnection() {
            return
        },
    }
    const Adapters = registerAdapters(MockAdapter)
    test('Adapters require a getConnection method', () => {
        expect(MockAdapter).toHaveProperty('getConnection')
    })
    test('Adapters require a closeConnection method', () => {
        expect(MockAdapter).toHaveProperty('closeConnection')
    })
    test('Adapters require a getMessages method', () => {
        expect(MockAdapter).toHaveProperty('getMessages')
    })
    test('Adapters require a putMessages method', () => {
        expect(MockAdapter).toHaveProperty('putMessages')
    })

    describe('Adapter Registery', () => {
        test('accessing adapters object via getAdapter', () => {
            const mockAdapter = Adapters.getAdapter(MockAdapter)
            if (mockAdapter) {
                expect(mockAdapter.name).toBeDefined()
            }
        })
    })
})
