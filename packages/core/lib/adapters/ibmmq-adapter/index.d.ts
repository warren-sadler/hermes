import { IAdapter } from '../adapter';
export declare const DEFAULT_CONFIG: IbmmqConnectionOptions;
declare type MqConnectionHandler = unknown;
declare type MqMessageHandlerObject = unknown;
export declare type IbmmqConnection = [MqConnectionHandler, MqMessageHandlerObject];
export interface IbmmqConnectionOptions {
    host: string;
    port: number;
    queueManager: string;
    queueName: string;
    channelName: string;
    useSyncPoint: boolean;
    security?: {
        username: string;
        password: string;
    };
    openOptions?: unknown;
}
export declare const IbmmqAdapterName = "IBMMQ";
export declare const IbmmqAdapter: IAdapter<typeof IbmmqAdapterName>;
export default IbmmqAdapter;
