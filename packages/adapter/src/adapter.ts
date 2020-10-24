/**
 * @module adapter
 * @description this module defines a set of utilities related to hermes adatpers
 */

/**
 *
 */
export interface Adapter<ConnectionParams = unknown, Connection = unknown> {
    connectionParams?: ConnectionParams
    connection?: Connection
    name: symbol
    getConnection(connectionParams: ConnectionParams): Connection
}

interface AdapterRegistry<Adapter> {
    registery: Map<symbol, Adapter>
    getAdapter(adapter: Adapter): Adapter | undefined
}

export const registerAdapters = <A extends Adapter>(
    ...adapters: A[]
): AdapterRegistry<A> => {
    return {
        registery: adapters.reduce(
            (r, adapter) => r.set(adapter.name, adapter),
            new Map()
        ),
        getAdapter(adapter) {
            return this.registery.get(adapter.name)
        },
    }
}
