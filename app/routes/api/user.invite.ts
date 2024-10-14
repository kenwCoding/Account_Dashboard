import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'
import { InvitationState } from '../../server/db/interfaces'

/**
 * 
 * interface PermissionInviteTable {
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
 */
export const Route = createAPIFileRoute('/api/user/invite')({
  POST: async ({ request, params }) => {
    const id = getCookie('authed')
    const { inviteeId, permissions } = await request.json()

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing Auth Cookies' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    if (!inviteeId || !permissions) {
      return new Response(
        JSON.stringify({ error: 'Missing invitee id or permissions' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const parsedId = JSON.parse(id)
    const parsedInviteeId = parseInt(inviteeId)

    const existedInvite = await db
      .selectFrom('permission_invite')
      .select(['id'])
      .where('permission_invite.inviter_user_id', '=', parsedId.id)
      .where('permission_invite.invitee_user_id', '=', parsedInviteeId)
      .execute()

    if (existedInvite.length) {
      return new Response(JSON.stringify({ error: 'Invite already existed' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const newInvite = await db
      .insertInto('permission_invite')
      .values({
        inviter_user_id: parsedId.id,
        invitee_user_id: parsedInviteeId,
        invitation_state: InvitationState.PENDING,
        permissions: permissions,
      })
      .returningAll()
      .execute()

    return new Response(JSON.stringify(newInvite), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
