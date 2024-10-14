import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/invite/permission')({
  PUT: async ({ request, params }) => {
    const { inviteId, permissions, id } = await request.json()

    const updatedInvite = await db
      .updateTable('permission_invite')
      .set({
        permissions: permissions,
      })
      .where('id', '=', inviteId)
      .where('inviter_user_id', '=', id)
      .returningAll()
      .execute()

    return new Response(JSON.stringify(updatedInvite), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
