import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'

export const Route = createAPIFileRoute(
  '/api/invite/received/$invitee_id/$limit/$offset',
)({
  GET: async ({ request, params }) => {
    const inviteeId = params.invitee_id
    const limit = params.limit
    const offset = params.offset
  
    const invites = await db
      .selectFrom('permission_invite')
      .selectAll()
      .where('permission_invite.invitee_user_id', '=', parseInt(inviteeId))
      .orderBy('permission_invite.id', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .execute()

    return json(invites)
  },
})
