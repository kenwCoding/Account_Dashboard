import {
  ColumnType,
  Generated,
  JSONColumnType,
} from 'kysely'

export enum Permission {
  READ_POSTS = 'read_posts',
  WRITE_POSTS = 'write_posts',
  READ_MESSAGES = 'read_messages',
  WRITE_MESSAGES = 'write_messages',
  READ_PROFILE_INFO = 'read_profile_info',
  WRITE_PROFILE_INFO = 'write_profile_info',
}

export enum InvitationState {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface Permissions {
  [Permission.READ_POSTS]: boolean;
  [Permission.WRITE_POSTS]: boolean;
  [Permission.READ_MESSAGES]: boolean;
  [Permission.WRITE_MESSAGES]: boolean;
  [Permission.READ_PROFILE_INFO]: boolean;
  [Permission.WRITE_PROFILE_INFO]: boolean;
}

export interface Database {
  user: UserTable
  permission_invite: PermissionInviteTable
}

export interface UserTable {
  id: Generated<number>
  username: string
  password: string
  is_verified: boolean
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
}

export interface PermissionInviteTable {
  id: Generated<number>
  inviter_user_id: number
  invitee_user_id: number
  invitation_state: InvitationState
  permissions: JSONColumnType<{
    [Permission.READ_POSTS]: boolean
    [Permission.WRITE_POSTS]: boolean
    [Permission.READ_MESSAGES]: boolean
    [Permission.WRITE_MESSAGES]: boolean
    [Permission.READ_PROFILE_INFO]: boolean
    [Permission.WRITE_PROFILE_INFO]: boolean
  }>
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
}