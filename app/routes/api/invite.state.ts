import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/invite/state')({
  PUT: async ({ request, params }) => {
    const id = getCookie('authed')
    const { inviteId, state } = await request.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing Auth Cookies' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const parsedId = JSON.parse(id)

    const updatedInvite = await db
      .updateTable('permission_invite')
      .set({
        invitation_state: state,
      })
      .where('id', '=', inviteId)
      .where('invitee_user_id', '=', parsedId.id)
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
