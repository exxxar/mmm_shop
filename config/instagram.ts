/**
 * Config source: https://git.io/Jfefl
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */
import Env from '@ioc:Adonis/Core/Env'

const instagramConfig = {
  instagramUsername: Env.get('INSTAGRAM_USERNAME'),
  instagramPassword: Env.get('INSTAGRAM_PASSWORD'),
  instagramLogin: Env.get('INSTAGRAM_LOGIN'),
}

export default instagramConfig
