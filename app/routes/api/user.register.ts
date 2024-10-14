import { db } from '../../server/db/index'
import { generatePasswordHash } from '../../server/utils'
import { createAPIFileRoute } from '@tanstack/start/api'
import { setCookie } from 'vinxi/http'

export const Route = createAPIFileRoute('/api/user/register')({
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
      .where('username', '=', username)
      .execute()

    if (existedUser.length) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const passwordHash = await generatePasswordHash(password)
    const createdUser = await db
      .insertInto('user')
      .values({
        username,
        password: passwordHash,
        is_verified: false,
      })
      .returning(['id', 'username'])
      .execute()

    setCookie('authed', JSON.stringify({ id: createdUser[0].id }), {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    setCookie(
      'logined',
      JSON.stringify({ username: createdUser[0].username }),
      {
        maxAge: 60 * 60 * 24,
      },
    )

    return new Response(JSON.stringify(createdUser), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
