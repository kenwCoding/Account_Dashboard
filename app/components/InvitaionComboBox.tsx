import { useRef, useState } from "react";
import { Button, ComboBox, Input, Label, ListBox, ListBoxItem, Popover, Switch } from "react-aria-components";
import { createInvite } from "../server/actions/invite";
import { InvitationState, Permission, Permissions } from "../server/db/interfaces";

interface InvitationComboBoxProps {
  users: User[];
  givenInvites: Invite[];
}

export type Invite = {
  id: number;
  invitee_user_id: number;
  inviter_user_id: number;
  permissions: Permissions;
  invitation_state: InvitationState;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: number;
  username: string;
  is_verified: boolean;
}

const initialPermissions = {
  [Permission.READ_POSTS]: false,
  [Permission.WRITE_POSTS]: false,
  [Permission.READ_MESSAGES]: false,
  [Permission.WRITE_MESSAGES]: false,
  [Permission.READ_PROFILE_INFO]: false,
  [Permission.WRITE_PROFILE_INFO]: false,
};

export function InvitationComboBox(props: InvitationComboBoxProps) {
  const { users, givenInvites } = props;
  const ref = useRef<HTMLInputElement>(null);
  const [targetUser, setTargetUser] = useState({ id: null, username: null } as { id: number | null, username: string | null });
  const [permissions, setPermissions] = useState<Permissions>(initialPermissions);

  return (
    <>
      <div className="bg-white border rounded-lg px-2 py-2 w-80">
        <ComboBox
          className='p-2 mb-2'
          onSelectionChange={(e) => {
            const key = e as string;

            if (!key) {
              setPermissions(initialPermissions)
              setTargetUser({ id: null, username: null });
              return;
            }

            const selectedIndex = parseInt(key.replace('react-aria-', ''));            
            setPermissions(givenInvites.find(invite => invite.invitee_user_id === users[selectedIndex - 1].id)?.permissions || initialPermissions)
            setTargetUser({
              id: users[selectedIndex - 1].id,
              username: users[selectedIndex - 1].username,
            });
          }}
        >
          <Label className='font-semibold'>
            <h1 className="text-md font-bold text-start my-2">Invite User</h1>
          </Label>
          <div>
            <Input
              className={`
                bg-white
                border
                border-gray-300
                rounded-sm
                px-2
                w-full
              `}
            />
          </div>
          <Popover>
            <ListBox className='max-h-24 min-w-40 overflow-scroll bg-white border rounded-lg'>
              {users.map((user) => {
                return <ListBoxItem className='cursor-pointer hover:bg-gray-100 px-2' key={user.id} >{user.username}</ListBoxItem>
              })}
            </ListBox>
          </Popover>
        </ComboBox>
        <hr className="my-4"/>
        <div className="flex m-2">
          <h1 className="flex-1 text-md font-bold text-start">Permissions</h1>
          <h1 className="flex-1 text-md font-bold text-end">Write</h1>
          <h1 className="flex-1 text-md font-bold text-end">Read</h1>
        </div>
        {Object
          .values(Permission)
          .reduce((acc, cur, index) => {
            if (index % 2 === 1) return acc;
            const permissionAction = cur.split('_')[0];
            const permissionType = cur.replaceAll(`${permissionAction}_`, '');            

            const arr = []
            arr.push(`write`);
            arr.push(`read`);
            arr.push(permissionType);
            acc.push(arr);
            return acc;
          }, [] as string[][])
          .map((permission, index) => {
            const [write, read, permissionType] = permission;

            return (
              <div key={permissionType} className='flex justify-between items-center px-2 py-1'>
                <small className="flex-1 uppercase">{permissionType}</small>
                <Switch
                  className="flex-1 group flex gap-2 items-center text-black font-semibold text-lg justify-end"
                  isDisabled={targetUser && targetUser.id ? false : true}
                  isSelected={permissions[`${write}_${permissionType}` as Permission]}
                  onChange={(e) => setPermissions(pre => {
                    if (!pre[`${write}_${permissionType}` as Permission]) {                      
                      return {
                        ...pre,
                        [`${write}_${permissionType}`]: true,
                        [`${read}_${permissionType}`]: true,
                      }
                    } else {
                      return {
                        ...pre,
                        [`${write}_${permissionType}`]: false,
                      }
                    }
                    
                  })}
                >
                  <div className="flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full shadow-inner bg-clip-padding border border-solid border-white/30 p-[3px] box-border transition duration-200 ease-in-out bg-red-400 group-pressed:bg-red-500 group-selected:bg-green-400 group-selected:group-pressed:bg-green-500 group-disabled:bg-gray-400 outline-none group-focus-visible:ring-2 ring-black">
                    <span className="cursor-pointer h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-0 group-selected:translate-x-[100%]" />
                  </div>
                </Switch>
                <Switch
                  className="flex-1 group flex gap-2 items-center text-black font-semibold text-lg justify-end"
                  isDisabled={targetUser && targetUser.id ? false : true}
                  isSelected={permissions[`${read}_${permissionType}` as Permission]}
                  onChange={(e) => setPermissions(pre => (
                    {
                      ...pre,
                      [`${read}_${permissionType}`]: !pre[`${read}_${permissionType}` as Permission]
                    }
                  ))}
                >
                  <div className="flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full shadow-inner bg-clip-padding border border-solid border-white/30 p-[3px] box-border transition duration-200 ease-in-out bg-red-400 group-pressed:bg-red-500 group-selected:bg-green-400 group-selected:group-pressed:bg-green-500 group-disabled:bg-gray-400 outline-none group-focus-visible:ring-2 ring-black">
                    <span className="cursor-pointer h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-0 group-selected:translate-x-[100%]" />
                  </div>
                </Switch>
              </div>
            )
        })}
        <div className="mx-1 mt-4 mb-2">
          <Button
            className={`
              rounded-md
              px-4 py-2 
              font-bold
              uppercase
              w-full
              text-white
              bg-blue-500
              hover:bg-blue-600
              disabled:text-gray-400
              disabled:bg-gray-100
            `}
            type="button"
            isDisabled={!targetUser.id}
            onPress={async () => {
              if (targetUser && targetUser.id && permissions) {                
                const result = await createInvite({inviteeId: targetUser.id, permissions});
                console.log(result);
                
              }
            }}
          >
            <small>Invite</small>
          </Button>
        </div>
      </div>
    </>
  )
};