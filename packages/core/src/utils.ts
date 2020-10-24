/**
 * @module utils
 * @description commonly used project utilities
 */

/**
 * when awaited, pauses execution for a given duration
 * @param duration
 */
export const sleep = async (duration = 1_000): Promise<void> =>
    new Promise((res) => setTimeout(res, duration))
