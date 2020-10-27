import { buildXpathAcceptor } from '../src/acceptors'

describe('Acceptors', () => {
    describe('Acceptors serve as a predicate to message processing', () => {
        test('building xpath acceptors', () => {
            const TEST_XML_DOC = `<title>Hello World</title>`
            const titleIsHelloWorld = buildXpathAcceptor({
                format: 'XML',
                queryType: 'XPATH',
                query: '//title/text()',
                predicate: {
                    expression: '=',
                    value: 'Hello World',
                },
            })
            expect(titleIsHelloWorld(TEST_XML_DOC)).toBe(true)
        })
    })
    test('building a regex based acceptor', () => {
        const TEST_CACO_MESSAGE =
            '<header><groupName>#123|DTCC|CACO</groupName></header>'
        const isCacoGroup = buildXpathAcceptor({
            format: 'XML',
            queryType: 'XPATH',
            query: '//header/groupName/text()',
            predicate: {
                expression: 'CONTAINS',
                value: 'CACO',
            },
        })
        expect(isCacoGroup(TEST_CACO_MESSAGE)).toBe(true)
    })
})
