/**
 * @module hermes
 * @description An event-processing system.
 */
import Hermes from '@hermes/core'

/**
 * application entrypoint
 * @public
 */
async function main(): Promise<void> {
    await Hermes.utils.sleep()
    console.log('Hello World 🌎')
}

export default main
