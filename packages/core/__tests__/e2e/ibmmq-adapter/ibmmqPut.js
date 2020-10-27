const fs = require('fs')
const path = require('path')
const {
    IbmmqAdapter,
    DEFAULT_CONFIG: config,
} = require('../../../lib/adapters/ibmmq-adapter')

let testMessages = ['1', 'dos', 'drei']

exports.testPut = async function testPut(messages = testMessages) {
    let connection
    try {
        connection = await IbmmqAdapter.getConnection(config)
        console.info('Connected Successfully!')
        console.info('Writing Messages...', messages)
        await IbmmqAdapter.putMessages(connection, ...messages)
        console.info('Done!')
    } catch (error) {
        console.info('<------------------->')
        console.error(error)
        console.info('<------------------->')
    } finally {
        console.log('Closing put...')
        await IbmmqAdapter.closeConnection(connection)
    }
}
