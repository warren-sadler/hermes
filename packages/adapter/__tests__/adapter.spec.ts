import { Adapter, registerAdapters } from '../src/adapter'

describe('Adapters', () => {
    type MockAdapter = Adapter<
        Record<string, unknown>,
        Record<string, unknown>,
        string[]
    >
    const MockAdapter: MockAdapter = {
        name: Symbol('MockAdapter'),
        getConnection(connection) {
            return connection
        },
        getMessages() {
            return []
        },
    }
    const Adapters = registerAdapters(MockAdapter)
    test('Adapters require a getConnection method', () => {
        expect(MockAdapter).toHaveProperty('getConnection')
    })

    test('getting messages from an adapter', () => {
        expect(MockAdapter.getMessages({})).toStrictEqual([])
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
