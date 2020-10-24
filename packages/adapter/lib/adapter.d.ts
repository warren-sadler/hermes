export interface Adapter<ConnectionParams = unknown, Connection = unknown> {
    connectionParams?: ConnectionParams;
    connection?: Connection;
    name: symbol;
    getConnection(connectionParams: ConnectionParams): Connection;
}
interface AdapterRegistry<Adapter> {
    registery: Map<symbol, Adapter>;
    getAdapter(adapter: Adapter): Adapter | undefined;
}
export declare const registerAdapters: <A extends Adapter<unknown, unknown>>(...adapters: A[]) => AdapterRegistry<A>;
export {};
