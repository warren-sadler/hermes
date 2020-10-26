export interface IAdapter<A> {
    name: A;
    connection?: unknown;
    getConnection(connectionOptions: unknown): unknown;
    getMessages(connection?: unknown): unknown;
    putMessages(connection?: unknown, ...messages: unknown[]): unknown;
    closeConnection(connection: unknown): unknown;
}
