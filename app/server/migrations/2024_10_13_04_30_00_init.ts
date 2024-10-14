import { Kysely, sql } from 'kysely'
import { InvitationState, Permission } from '../db/interfaces'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'varchar', (col) => col.notNull().unique())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('is_verified', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('permission_invite')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('inviter_user_id', 'integer', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('invitee_user_id', 'integer', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('invitation_state', 'varchar(50)', (col) => col.defaultTo(InvitationState.PENDING).notNull())
    .addColumn('permissions', 'jsonb', (col) => col.defaultTo(JSON.stringify(
      {
        [Permission.READ_POSTS]: false,
        [Permission.WRITE_POSTS]: false,
        [Permission.READ_MESSAGES]: false,
        [Permission.WRITE_MESSAGES]: false,
        [Permission.READ_PROFILE_INFO]: false,
        [Permission.WRITE_PROFILE_INFO]: false,
      }
    )).notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

    await db.schema
      .createIndex('permission_invite_user_id_index')
      .on('permission_invite')
      .column('id')
      .column('inviter_user_id')
      .column('invitee_user_id')
      .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('permission_invite').execute()
  await db.schema.dropTable('user').execute()
}