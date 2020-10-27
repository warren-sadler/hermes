"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmmqAdapter = exports.IbmmqAdapterName = exports.DEFAULT_CONFIG = void 0;
const ibmmq_1 = __importStar(require("ibmmq"));
const string_decoder_1 = require("string_decoder");
const DECODER = new string_decoder_1.StringDecoder('utf-8');
exports.DEFAULT_CONFIG = {
    host: process.env.IBMMQ_HOST || 'localhost',
    port: parseFloat(process.env.IBMMQ_PORT || '1414'),
    queueManager: process.env.IBMMQ_QUEUE_MANAGER || 'QM1',
    queueName: process.env.IBMMQ_QUEUE_NAME || 'DEV.QUEUE.1',
    channelName: process.env.IBMMQ_CHANNEL_NAME || 'DEV.APP.SVRCONN',
    openOptions: ibmmq_1.MQC.MQOO_OUTPUT | ibmmq_1.MQC.MQOO_INPUT_AS_Q_DEF,
    useSyncPoint: false,
};
exports.IbmmqAdapterName = 'IBMMQ';
exports.IbmmqAdapter = {
    name: exports.IbmmqAdapterName,
    connection: null,
    getConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection)
                return this.connection;
            const mqClientChannelDefiniton = new ibmmq_1.default.MQCD();
            mqClientChannelDefiniton.ConnectionName = `${options.host}(${options.port})`;
            mqClientChannelDefiniton.ChannelName = options.channelName;
            const mqConnectionOptions = new ibmmq_1.default.MQCNO();
            mqConnectionOptions.Options = ibmmq_1.MQC.MQCNO_CLIENT_BINDING;
            mqConnectionOptions.ClientConn = mqClientChannelDefiniton;
            const mqConnectionHandler = yield ibmmq_1.default.ConnxPromise(options.queueManager, mqConnectionOptions);
            const mqObjectDescription = new ibmmq_1.default.MQOD();
            mqObjectDescription.ObjectName = options.queueName;
            const mqMessageHandlerObject = yield ibmmq_1.default.OpenPromise(mqConnectionHandler, mqObjectDescription, options.openOptions);
            this.connection = [mqConnectionHandler, mqMessageHandlerObject];
            return this.connection;
        });
    },
    getMessages([_, mqMessageHandlerObject]) {
        let messages, resolve, reject;
        const init = (res, rej) => ([messages, resolve, reject] = [[], res, rej]);
        let messagesAvailable = new Promise(init);
        const mqMessageDefinition = new ibmmq_1.default.MQMD();
        const mqGetMessageObject = new ibmmq_1.default.MQGMO();
        mqGetMessageObject.Options =
            ibmmq_1.MQC.MQGMO_NO_SYNCPOINT |
                ibmmq_1.MQC.MQGMO_CONVERT |
                ibmmq_1.MQC.MQGMO_FAIL_IF_QUIESCING;
        mqGetMessageObject.MatchOptions = ibmmq_1.MQC.MQMO_NONE;
        mqGetMessageObject.WaitInterval = 10 * 1000;
        ibmmq_1.default.setTuningParameters({ getLoopPollTimeMs: 100 });
        ibmmq_1.default.Get(mqMessageHandlerObject, mqMessageDefinition, mqGetMessageObject, (error, _x, _y, md, buffer) => {
            if (!error) {
                if (md.Format === 'MQSTR') {
                    messages.push(DECODER.write(buffer));
                    resolve(messages);
                    return;
                }
            }
            if (error.mqrc === ibmmq_1.MQC.MQRC_NO_MSG_AVAILABLE)
                return reject(error);
            return reject({ description: 'Unknown IBMMQ Error', error });
        });
        return {
            [Symbol.asyncIterator]: function () {
                return __asyncGenerator(this, arguments, function* () {
                    try {
                        for (;;) {
                            const messages = yield __await(messagesAvailable);
                            messagesAvailable = new Promise(init);
                            yield __await(yield* __asyncDelegator(__asyncValues(messages)));
                        }
                    }
                    catch (error) {
                        throw error;
                    }
                });
            },
        };
    },
    putMessages([_, mqMessageHandlerObject], ...messages) {
        var messages_1, messages_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (messages_1 = __asyncValues(messages); messages_1_1 = yield messages_1.next(), !messages_1_1.done;) {
                    const msg = messages_1_1.value;
                    const mqMessageDefinition = new ibmmq_1.default.MQMD();
                    const mqPutOptions = new ibmmq_1.default.MQPMO();
                    mqPutOptions.Options =
                        ibmmq_1.MQC.MQPMO_NO_SYNCPOINT |
                            ibmmq_1.MQC.MQPMO_NEW_MSG_ID |
                            ibmmq_1.MQC.MQPMO_NEW_CORREL_ID;
                    try {
                        yield ibmmq_1.default.PutPromise(mqMessageHandlerObject, mqMessageDefinition, mqPutOptions, msg);
                    }
                    catch (error) {
                        throw error;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) yield _a.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        });
    },
    closeConnection([mqConnectionHandler, mqClientChannelDefinition,]) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ibmmq_1.default.ClosePromise(mqClientChannelDefinition, 0);
            yield ibmmq_1.default.DiscPromise(mqConnectionHandler);
            return true;
        });
    },
};
exports.default = exports.IbmmqAdapter;
