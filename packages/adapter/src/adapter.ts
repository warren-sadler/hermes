/**
 * @module adapter
 * @description this module defines a set of utilities related to hermes adatpers
 */

/**
 *
 */
export interface Adapter<
    ConnectionParams = unknown,
    Connection = unknown,
    MessageType = unknown
> {
    connectionParams?: ConnectionParams
    connection?: Connection
    name: symbol
    getConnection(connectionParams: ConnectionParams): Connection
    getMessages(connection: Connection): MessageType
}

interface AdapterRegistry<
    ConnectionParams = unknown,
    Connection = unknown,
    MessageType = unknown,
    AdapterType = Adapter<ConnectionParams, Connection, MessageType>
> {
    readonly registery: Map<symbol, AdapterType>
    getAdapter(adapter: AdapterType): AdapterType | undefined
    getConnection(
        adapter: AdapterType,
        connectionParams: ConnectionParams
    ): Connection
    getMessages(adapter: AdapterType, connection: Connection): MessageType
}

export const registerAdapters = <A extends Adapter>(
    ...adapters: A[]
): AdapterRegistry => {
    return {
        registery: adapters.reduce(
            (r, adapter) => r.set(adapter.name, adapter),
            new Map()
        ),
        getAdapter(adapter) {
            return this.registery.get(adapter.name)
        },
        getConnection(adapter, connectionParams) {
            return this.registery
                .get(adapter.name)
                ?.getConnection(connectionParams)
        },
        getMessages(adapter, connection) {
            return this.registery.get(adapter.name)?.getMessages(connection)
        },
    }
}
