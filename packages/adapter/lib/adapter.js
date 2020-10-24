"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdapters = void 0;
exports.registerAdapters = (...adapters) => {
    return {
        registery: adapters.reduce((r, adapter) => r.set(adapter.name, adapter), new Map()),
        getAdapter(adapter) {
            return this.registery.get(adapter.name);
        },
    };
};
