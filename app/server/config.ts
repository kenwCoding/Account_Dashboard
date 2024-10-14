import * as dotenv from 'dotenv'

dotenv.config()

export interface Config {
  readonly connectionString: string
}

export const config: Config = Object.freeze({
  connectionString: getEnvVariable('POSTGRESQL_URI'),
})

function getEnvVariable(name: string): string {
  if (!process.env[name]) {
    throw new Error(`environment variable ${name} not found`)
  }

  return process.env[name]!
}