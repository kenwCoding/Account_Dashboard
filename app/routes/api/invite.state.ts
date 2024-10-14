import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '../../server/db/index'
import { getCookie } from 'vinxi/http'
import { InvitationState } from '../../server/db/interfaces'

export const Route = createAPIFileRoute('/api/invite/state')({
  PUT: async ({ request, params }) => {
    const id = getCookie('authed')
    const { inviteId, inviteeId, inviterId, state } = await request.json()
    
    if (!((state == InvitationState.CANCELLED && inviterId)
      || (state == InvitationState.ACCEPTED && inviteeId)
      || (state == InvitationState.REJECTED && inviteeId)
      || (!(inviterId && inviteeId))
    )) {
      return new Response(
        JSON.stringify({ error: 'Invalid Invite Update Request' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    if (state == InvitationState.CANCELLED) {
      const updatedInvite = await db
        .updateTable('permission_invite')
        .set({
          invitation_state: state,
        })
        .where('id', '=', inviteId)
        .where('inviter_user_id', '=', inviterId)
        .returningAll()
        .execute()
  
      return new Response(JSON.stringify(updatedInvite), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } else {
      const updatedInvite = await db
        .updateTable('permission_invite')
        .set({
          invitation_state: state,
        })
        .where('id', '=', inviteId)
        .where('invitee_user_id', '=', inviteeId)
        .returningAll()
        .execute()
  
      return new Response(JSON.stringify(updatedInvite), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  },
})
