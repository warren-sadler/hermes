const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const {
    IbmmqAdapter,
    DEFAULT_CONFIG: config,
} = require('../../../lib/adapters/ibmmq-adapter')
const TEST_OUT_FILE = path.resolve(__dirname, './test-validation.txt')
const fsWriteFile = promisify(fs.writeFile)
exports.testGet = async function testGet(nMessages, outFile = TEST_OUT_FILE) {
    let connection
    let messages = []
    try {
        connection = await IbmmqAdapter.getConnection(config)
        console.info('Getter connected successfully!')
        for await (const message of IbmmqAdapter.getMessages(connection)) {
            if (messages.length !== nMessages - 1) {
                console.info('Msg', message)
                messages.push(message)
            }
        }
    } catch (error) {
        console.info('<------------------->')
        console.error(error)
        console.info('<------------------->')
    } finally {
        console.log('Closing get...')
        await IbmmqAdapter.closeConnection(connection)
        console.log('Writing file')
        await fsWriteFile(outFile, JSON.stringify(messages.join('\n')))
    }
}
