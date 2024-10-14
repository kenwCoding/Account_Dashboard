import { db } from '../../server/db/index'
import { generatePasswordHash, checkPasswordHash } from '../../server/utils'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getCookie, parseCookies, setCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/user')({
  GET: async ({ request, params }) => {      
    const existedUser = await db
      .selectFrom('user')
      .selectAll()
      .execute()

    if (!existedUser.length) {
      return new Response(
        JSON.stringify({ error: 'Failed to get all users' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }
    return new Response(JSON.stringify(existedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
