import { Database } from './interfaces' // this is the Database interface we defined earlier
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { config } from '../config'

const pool = new pg.Pool({ connectionString: config.connectionString });

export const dialect = new PostgresDialect({
  pool,
})

export const db = new Kysely<Database>({
  dialect,
})