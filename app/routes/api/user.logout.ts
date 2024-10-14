import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { deleteCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/user/logout')({
  POST: async ({ request, params }) => {
    deleteCookie('authed')
    deleteCookie('logined')

    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
