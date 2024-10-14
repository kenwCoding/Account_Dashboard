// app/routes/index.tsx
import * as fs from 'fs'
import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getCookie } from 'vinxi/http'
import { Button, Table } from 'react-aria-components'
import { InvitationTable, InvitationType } from '../components/InvitationTable'
import { CenterLayout } from '../components/layouts/CenterLayout'
import { InvitationComboBox, Invite, User } from '../components/InvitaionComboBox'
import { getAllUsers, getLoginCookies, logout } from '../server/actions/user'
import { getInviteAsInvitee, getInviteAsInviter } from '../server/actions/invite'
import { LongScrollLayout } from '../components/layouts/LongScrollLayout'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const users = await getAllUsers() as unknown as User[]
    const { id } = await getLoginCookies() as unknown as { id: number }
    const givenInvites = await getInviteAsInviter({ limit: 100, offset: 0 })
    const receivedInvites = await getInviteAsInvitee({ limit: 100, offset: 0 })
    
    const filteredUsers = users.filter((user: User) => user.id !== id)
    
    return {
      users: filteredUsers,
      id,
      givenInvites,
      receivedInvites,
    }
  },
})

function Home() {
  return <LongScrollLayout>
    <HomePage>
      <Outlet />
    </HomePage>
  </LongScrollLayout>
}

function HomePage({ children }: { children?: React.ReactNode }) {
  const { users, givenInvites: initGivenInvites, receivedInvites: initReceivedInvites } = Route.useLoaderData()
  const [givenInvites, setGivenInvites] = useState(initGivenInvites)
  const [receivedInvites, setReceivedInvites] = useState(initReceivedInvites)
  const navigate = useNavigate()
  
  const handleUpdateInviteState = async (invitationType: InvitationType) => {
    let invites;
    if (invitationType === InvitationType.RECEIVED) {
      invites = await getInviteAsInvitee({ limit: 100, offset: 0 })
      setReceivedInvites(invites)
    } else {
      invites = await getInviteAsInviter({ limit: 100, offset: 0 })
      setGivenInvites(invites)
    }
  }

  return (
    <div className='flex justify-between w-full min-h-screen'>
      <div className='relative flex flex-col justify-center mr-6 px-6 bg-gray-50 drop-shadow-md'>
        <InvitationComboBox users={users as unknown as User[]} givenInvites={givenInvites as unknown as Invite[]}/>
        <div className='w-80 border my-4 absolute bottom-0'>
          <Button
            className={`
              bg-white
              rounded-md
              px-4 py-2 mr-auto
              font-bold
              uppercase
              w-full
              hover:bg-red-500  
              hover:text-white
            `}
            type="button"
            onPress={async () => {
              const { status } = await logout() as unknown as {status: string}
              if (status === "200") {
                navigate({ to: '/login' })
              }
            }}
          >
            <small>Logout</small>
          </Button>
        </div>
      </div>
      <div className='flex-auto gap-y-10 min-h-screen flex flex-col justify-center py-5 mr-6'>
        <InvitationTable invitationType={InvitationType.SENT} invites={givenInvites as unknown as Invite[]} onUpdateInvite={handleUpdateInviteState}/>
        <InvitationTable invitationType={InvitationType.RECEIVED} invites={receivedInvites as unknown as Invite[]}  onUpdateInvite={handleUpdateInviteState}/>
      </div>
      
      {children}
    </div>
  )
}