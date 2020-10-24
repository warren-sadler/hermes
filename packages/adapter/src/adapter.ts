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
    getConnection(connectionParams: ConnectionParams): Promise<Connection>
    getMessages(connection: Connection): Promise<MessageType>
    putMessages(
        connection: Connection,
        ...messages: unknown[]
    ): Promise<unknown>
    closeConnection(connection: Connection): Promise<unknown>
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
    ): Promise<Connection>
    getMessages(
        adapter: AdapterType,
        connection: Connection
    ): Promise<MessageType>
    putMessages(
        adapter: AdapterType,
        connection: Connection,
        ...messages: unknown[]
    ): Promise<unknown>
    closeConnection(
        adapter: AdapterType,
        connection: Connection
    ): Promise<unknown>
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
        async getConnection(adapter, connectionParams) {
            return this.registery
                .get(adapter.name)
                ?.getConnection(connectionParams)
        },
        async getMessages(adapter, connection) {
            return this.registery.get(adapter.name)?.getMessages(connection)
        },
        async putMessages(adapter, connection, ...messages) {
            return this.registery
                .get(adapter.name)
                ?.putMessages(connection, messages)
        },
        async closeConnection(adapter, connection) {
            await this.registery.get(adapter.name)?.closeConnection(connection)
            return
        },
    }
}
