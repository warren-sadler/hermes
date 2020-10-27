/**
 * @module Acceptors
 */
import * as xpath from 'xpath-ts'
import { DOMParserImpl as dom } from 'xmldom-ts'

/* ----------------------------- Supported Types ---------------------------- */
export type SupportedQueryTypes = 'XPATH'
export type SupportedFormats = 'XML'
export type SupportedExpressions = '=' | 'IN' | 'CONTAINS'

/* ----------------------------- Predicate Types ---------------------------- */

interface IInPredicate {
    expression: 'IN'
    value: string[]
}
interface IEqualsPredicate {
    expression: '='
    value: string
}

interface IContainsPredicate {
    expression: 'CONTAINS'
    value: string
}

type Predicate = IInPredicate | IEqualsPredicate | IContainsPredicate

/* --------------------------- Acceptor Definition -------------------------- */

export interface IAcceptorDefinition {
    format: SupportedFormats
    queryType: SupportedQueryTypes
    query: string
    predicate: Predicate
}
const evaluateExpression = (predicate: Predicate, message: string) => {
    switch (predicate.expression) {
        case '=':
            return predicate.value === message
        case 'IN':
            return predicate.value.some((value) => value === message)
        case 'CONTAINS':
            return new RegExp(predicate.value).test(message)
        default:
            return false
    }
}
export type AcceptorBuilder = (
    acceptor: IAcceptorDefinition
) => (message: unknown) => boolean

/* ------------------------ Concrete Implementations ------------------------ */

export const buildXpathAcceptor: AcceptorBuilder = (acceptor) => {
    return (message): boolean => {
        const xmlDocument = new dom().parseFromString(message as string)
        const [queryResult] = xpath.select(
            acceptor.query,
            xmlDocument
        ) as Node[]
        return evaluateExpression(
            acceptor.predicate,
            (queryResult as Node).nodeValue as string
        )
    }
}
