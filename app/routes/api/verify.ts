import { db } from '../../server/db/index'
import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/verify')({
  PUT: async ({ request, params }) => {
    const id = getCookie('authed')

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing Auth Cookies' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const parsedId = JSON.parse(id)

    const updatedUser = await db
      .updateTable('user')
      .set({
        is_verified: true,
      })
      .where('id', '=', parsedId.id)
      .returning(['id', 'username', 'is_verified'])
      .execute()

    if (!updatedUser.length) {
      return new Response(
        JSON.stringify({ error: 'Failed to update verified state' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
