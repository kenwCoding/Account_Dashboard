import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'

export const Route = createAPIFileRoute(
  '/api/invite/given/$inviter_id/$limit/$offset',
)({
  GET: async ({ request, params }) => {
    const inviterId = params.inviter_id
    const limit = params.limit
    const offset = params.offset

    const invites = await db
      .selectFrom('permission_invite')
      .selectAll()
      .where('permission_invite.inviter_user_id', '=', parseInt(inviterId))
      .orderBy('permission_invite.id', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .execute()

    console.log('invites', invites)

    return json(invites)
  },
})
