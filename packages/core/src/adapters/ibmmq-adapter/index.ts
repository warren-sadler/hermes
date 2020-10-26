import mq, { MQC } from 'ibmmq'
import { StringDecoder } from 'string_decoder'
import { IAdapter } from '../adapter'

/* ---------------------------- Module Constants ---------------------------- */

const DECODER = new StringDecoder('utf-8')
export const DEFAULT_CONFIG: IbmmqConnectionOptions = {
    host: process.env.IBMMQ_HOST || 'localhost',
    port: parseFloat(<string>process.env.IBMMQ_PORT || '1414'),
    queueManager: process.env.IBMMQ_QUEUE_MANAGER || 'QM1',
    queueName: process.env.IBMMQ_QUEUE_NAME || 'DEV.QUEUE.1',
    channelName: process.env.IBMMQ_CHANNEL_NAME || 'DEV.APP.SVRCONN',
    openOptions: MQC.MQOO_OUTPUT | MQC.MQOO_INPUT_AS_Q_DEF,
    useSyncPoint: false,
}

/* ------------------------------ Adapter Types ----------------------------- */
type MqConnectionHandler = unknown
type MqMessageHandlerObject = unknown
export type IbmmqConnection = [MqConnectionHandler, MqMessageHandlerObject]

export interface IbmmqConnectionOptions {
    host: string
    port: number
    queueManager: string
    queueName: string
    channelName: string
    useSyncPoint: boolean
    security?: {
        username: string
        password: string
    }
    openOptions?: unknown
}

/* ----------------------------- Implementation ----------------------------- */

export const IbmmqAdapterName = 'IBMMQ'
export const IbmmqAdapter: IAdapter<typeof IbmmqAdapterName> = {
    name: IbmmqAdapterName,
    connection: null,
    async getConnection(
        options: IbmmqConnectionOptions
    ): Promise<IbmmqConnection> {
        if (this.connection) return this.connection as IbmmqConnection
        const mqClientChannelDefiniton = new mq.MQCD()
        mqClientChannelDefiniton.ConnectionName = `${options.host}(${options.port})`
        mqClientChannelDefiniton.ChannelName = options.channelName
        const mqConnectionOptions = new mq.MQCNO()
        mqConnectionOptions.Options = MQC.MQCNO_CLIENT_BINDING
        mqConnectionOptions.ClientConn = mqClientChannelDefiniton
        const mqConnectionHandler = await mq.ConnxPromise(
            options.queueManager,
            mqConnectionOptions
        )
        const mqObjectDescription = new mq.MQOD()
        mqObjectDescription.ObjectName = options.queueName
        const mqMessageHandlerObject = await mq.OpenPromise(
            mqConnectionHandler,
            mqObjectDescription,
            options.openOptions
        )
        this.connection = [mqConnectionHandler, mqMessageHandlerObject]
        return this.connection as IbmmqConnection
    },
    //eslint-disable-next-line
    getMessages([_, mqMessageHandlerObject]: IbmmqConnection) {
        let messages: unknown[],
            resolve: (val: unknown[]) => unknown,
            reject: (val: unknown) => unknown
        const init = (
            res: (val: unknown[]) => unknown,
            rej: (val: unknown) => unknown
        ) => ([messages, resolve, reject] = [[], res, rej])
        let messagesAvailable: Promise<unknown[]> = new Promise(init)
        const mqMessageDefinition = new mq.MQMD()
        const mqGetMessageObject = new mq.MQGMO()
        mqGetMessageObject.Options =
            MQC.MQGMO_NO_SYNCPOINT |
            MQC.MQGMO_CONVERT |
            MQC.MQGMO_FAIL_IF_QUIESCING
        mqGetMessageObject.MatchOptions = MQC.MQMO_NONE
        mqGetMessageObject.WaitInterval = 10 * 1_000
        mq.setTuningParameters({ getLoopPollTimeMs: 100 })
        mq.Get(
            mqMessageHandlerObject,
            mqMessageDefinition,
            mqGetMessageObject,
            (
                error: Record<string, unknown>,
                _x: unknown,
                _y: unknown,
                md: Record<string, unknown>,
                buffer: Buffer
            ) => {
                if (!error) {
                    if (md.Format === 'MQSTR') {
                        messages.push(DECODER.write(buffer))
                        resolve(messages)
                        return
                    }
                }
                if (error.mqrc === MQC.MQRC_NO_MSG_AVAILABLE)
                    return reject(error)
                return reject({ description: 'Unknown IBMMQ Error', error })
            }
        )
        return {
            [Symbol.asyncIterator]: async function* () {
                try {
                    for (;;) {
                        const messages = await messagesAvailable
                        messagesAvailable = new Promise(init)
                        yield* messages
                    }
                } catch (error) {
                    throw error
                }
            },
        }
    },
    async putMessages(
        // eslint-disable-next-line
        [_, mqMessageHandlerObject]: IbmmqConnection,
        ...messages: number[]
    ): Promise<boolean> {
        for await (const msg of messages) {
            const mqMessageDefinition = new mq.MQMD()
            const mqPutOptions = new mq.MQPMO()
            mqPutOptions.Options =
                MQC.MQPMO_NO_SYNCPOINT |
                MQC.MQPMO_NEW_MSG_ID |
                MQC.MQPMO_NEW_CORREL_ID
            try {
                await mq.PutPromise(
                    mqMessageHandlerObject,
                    mqMessageDefinition,
                    mqPutOptions,
                    msg
                )
            } catch (error) {
                throw error
            }
        }
        return true
    },
    async closeConnection([
        mqConnectionHandler,
        mqClientChannelDefinition,
    ]: IbmmqConnection): Promise<boolean> {
        await mq.ClosePromise(mqClientChannelDefinition, 0)
        await mq.DiscPromise(mqConnectionHandler)
        return true
    },
}

export default IbmmqAdapter
