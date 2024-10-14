import { db } from '../../server/db/index'
import { generatePasswordHash, checkPasswordHash } from '../../server/utils'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getCookie, setCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/user/login')({
  POST: async ({ request, params }) => {
    const { username, password } = await request.json()

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing username or passowrd' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const existedUser = await db
      .selectFrom('user')
      .select(['user.password', 'user.id', 'user.username'])
      .where('username', '=', username)
      .execute()

    if (!existedUser.length) {
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const isPasswordMatch = await checkPasswordHash(
      existedUser[0].password,
      password,
    )

    if (!isPasswordMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    setCookie('authed', JSON.stringify({ id: existedUser[0].id }), {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    setCookie(
      'logined',
      JSON.stringify({ username: existedUser[0].username }),
      {
        maxAge: 60 * 60 * 24,
      },
    )

    return new Response(JSON.stringify(existedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
