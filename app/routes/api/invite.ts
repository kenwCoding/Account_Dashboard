import { InvitationState } from '../../server/db/interfaces'
import { db } from '../../server/db/index'
import { generatePasswordHash, checkPasswordHash } from '../../server/utils'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getCookie, parseCookies, setCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/invite')({
  POST: async ({ request, params }) => {
    const { inviteeId, permissions, id } = await request.json()

    const existedInvite = await db
      .selectFrom('permission_invite')
      .select('permission_invite.id')
      .where('invitee_user_id', '=', inviteeId)
      .where('inviter_user_id', '=', id)
      .execute()

    if (existedInvite.length) {
      return new Response(
        JSON.stringify({ error: 'Invite already exists' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const createdInvite = await db
      .insertInto('permission_invite')
      .values({
        permissions: permissions,
        invitee_user_id: inviteeId,
        inviter_user_id: id,
        invitation_state: InvitationState.PENDING, // or the appropriate state value
      })
      .returningAll()
      .execute()

    return new Response(JSON.stringify(createdInvite), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
})
