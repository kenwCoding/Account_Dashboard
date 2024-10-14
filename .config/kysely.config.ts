import { defineConfig } from 'kysely-ctl'
import { dialect } from '../app/server/db'

export default defineConfig({
	dialect,
  migrations: {
    migrationFolder: "app/server/migrations",
  },
  plugins: [],
  // seeds: {
  //   seedFolder: "seeds",
  // }
})
