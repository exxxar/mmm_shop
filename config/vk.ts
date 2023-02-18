/**
 * Config source: https://git.io/Jfefl
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */
import Env from '@ioc:Adonis/Core/Env'

const vkConfig = {
  vkToken: Env.get('VK_TOKEN'),
}

export default vkConfig
