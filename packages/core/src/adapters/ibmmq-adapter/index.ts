import { IAdapter } from '../adapter'

export const IbmmqAdapter: IAdapter<'IBMMQ'> = {
    name: 'IBMMQ',
    connection: false,
    async getConnection(shouldConnect: boolean): Promise<boolean | void> {
        this.connection = shouldConnect
        return
    },
    async *getMessages(): AsyncIterable<number> {
        let n = 0
        while (this.connection) {
            yield n++
        }
    },
    async putMessages(
        connection: boolean,
        ...messages: number[]
    ): Promise<boolean> {
        if (connection) {
            console.log(messages)
            return true
        }
        return false
    },
    closeConnection(connection: boolean) {
        this.connection = connection
    },
}

export default IbmmqAdapter
