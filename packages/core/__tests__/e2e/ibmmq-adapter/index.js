const fs = require('fs')
const path = require('path')
const { testPut } = require('./ibmmqPut')
const { testGet } = require('./ibmmqGet')

async function test() {
    const OUTFILE = path.resolve(__dirname, './results.txt')
    try {
        const TEST_MSGS = ['investing', 'for', 'growth']
        testPut(TEST_MSGS)
        await testGet(TEST_MSGS.length, OUTFILE)
    } catch (error) {
        console.error(error)
    } finally {
        const result = fs.readFileSync(OUTFILE, 'utf-8')
        console.log(result)
    }
}

test()
