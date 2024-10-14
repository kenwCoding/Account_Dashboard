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
  return <CenterLayout>
    <HomePage>
      <Outlet />
    </HomePage>
  </CenterLayout>
}

function HomePage({ children }: { children?: React.ReactNode }) {
  const { users, givenInvites, receivedInvites } = Route.useLoaderData()
  const navigate = useNavigate()
  console.log(users);
  console.log(givenInvites);
  
  return (
    <div className='flex flex-col gap-12 justify-center items-center'>
      <InvitationTable invitationType={InvitationType.SENT} invites={givenInvites as unknown as Invite[]}/>
      <InvitationTable invitationType={InvitationType.RECEIVED} invites={receivedInvites as unknown as Invite[]}/>
      <InvitationComboBox users={users as unknown as User[]} givenInvites={givenInvites as unknown as Invite[]}/>
      <div className='px-6 w-96'>
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
            console.log(status);
            
            if (status === "200") {
              navigate({ to: '/login' })
            }
          }}
        >
          <small>Logout</small>
        </Button>
      </div>
      {children}
    </div>
  )
}