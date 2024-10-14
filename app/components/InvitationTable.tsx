import { Cell, Column, Row, Table, TableBody, TableHeader, TableProps } from "react-aria-components";
import { Invite } from "./InvitaionComboBox";
import { InvitationState, Permission } from "../server/db/interfaces";
import { getInviteAsInvitee, getInviteAsInviter, updateInviteState } from "../server/actions/invite";
import { useState } from "react";

export enum InvitationType {
  SENT = 'sent',
  RECEIVED = 'received'
}

interface InvitationTableProps {
  invitationType: InvitationType;
  invites: Invite[];
  onUpdateInvite: (invitationType: InvitationType) => void;
}

export function InvitationTable(props: InvitationTableProps) {
  const { invitationType, invites, onUpdateInvite } = props;

  const handleAccept = async (invite: Invite) => {
    await updateInviteState({inviteId: invite.id, state: InvitationState.ACCEPTED});
    onUpdateInvite(invitationType)
  }

  const handleReject = async (invite: Invite) => {
    await updateInviteState({inviteId: invite.id, state: InvitationState.REJECTED});
    onUpdateInvite(invitationType)
  }

  const handleCancel = async (invite: Invite) => {
    await updateInviteState({inviteId: invite.id, state: InvitationState.CANCELLED});
    onUpdateInvite(invitationType)
  }

  return (
    <div className={`
      bg-white
      px-8
      rounded-md
      shadow-md
      w-full
      h-full
      overflow-y-hidden
      max-h-[50vh]
    `}>
      <div>
        <h1 className="text-lg font-semibold text-center uppercase my-4">Invitation {invitationType}</h1>
      </div>
      <div className="overflow-y-scroll h-[80%]">
        <Table
          className={`
            w-full
            px-10
          `}
          aria-label="Files"
          selectionMode="multiple"
        >
          <TableHeader className=''>
            <Column isRowHeader>
              <small>Username</small>
            </Column>
            <Column>
              <small>Permissions</small>
            </Column>
            <Column>
              <small>State</small>
            </Column>
            <Column>
              <small>Invitation Date</small>
            </Column>
            <Column>
              <small>Updated Date</small>
            </Column>
          </TableHeader>
          <TableBody>
            {invites.length === 0
              ? <Row>
                <Cell>-</Cell>
                <Cell>-</Cell>
                <Cell>-</Cell>
                <Cell>-</Cell>
              </Row>
              : invites.map((invite) => (
                <Row className='text-center border-y' key={invite.id}>
                  {invitationType === InvitationType.SENT ? (
                    <Cell>
                      <small className="font-bold"># {invite.invitee_user_id}</small>
                    </Cell>
                  ) : (
                    <Cell>
                      <small className="font-bold"># {invite.inviter_user_id}</small>
                    </Cell>
                  )}
                  <Cell>
                  {Object.keys(invite.permissions).map((permission, index) => (
                    <>
                    {index === 0? <hr className="border-gray-300 my-1" /> : null}
                    <ul key={permission} className="px-1">
                      <li>
                        <div className="flex justify-between items-center gap-x-4">
                          <small className="font-bold capitalize">{permission.replaceAll('_', ' ')}</small>
                          {invite.permissions[permission as Permission].toString() === 'true'
                            ? <small className="text-green-500 font-bold">{invite.permissions[permission as Permission].toString()}</small>
                            : <small className="text-red-500 font-bold">{invite.permissions[permission as Permission].toString()}</small>
                          }
                        </div>
                      </li>
                    </ul>
                    {index % 2 === 1? <hr className="border-gray-300 my-1" /> : null}
                    </>
                  ))}
                  </Cell>
                  <Cell>
                    {invitationType === InvitationType.SENT
                      ? invite.invitation_state === InvitationState.PENDING || invite.invitation_state === InvitationState.ACCEPTED
                        ? <div className="flex flex-col justify-around items-center h-full">
                            <button  onClick={() => handleCancel(invite)} className={`group ${invite.invitation_state === InvitationState.ACCEPTED ? 'bg-green-500' : 'bg-gray-500'} hover:border-2 hover:border-red-500 hover:bg-transparent hover:text-red-500 text-white px-2 py-1 rounded-md w-[100px]`}>
                              <small className="group-hover:hidden block uppercase font-bold">
                                {invite.invitation_state}
                              </small>
                              <small className="group-hover:block hidden font-bold">
                                Cancel
                              </small>
                            </button>
                          </div>
                        : <div className="flex flex-col justify-around items-center h-full">
                            <button className="bg-red-600 text-white px-2 py-1 rounded-md w-[100px]">
                              <small className="block uppercase font-bold">
                                {invite.invitation_state}
                              </small>
                            </button>
                          </div>
                      : invite.invitation_state === InvitationState.PENDING
                        ? <div className="flex flex-col justify-around items-center h-full">
                              <button onClick={() => handleAccept(invite)} className="text-green-500 hover:text-green-700">
                                <small className="font-bold">Accept</small>
                              </button>
                              <button onClick={() => handleReject(invite)} className="text-red-500 hover:text-red-700">
                                <small className="font-bold">Reject</small>
                              </button>
                          </div>
                        : <div className="flex flex-col justify-around items-center h-full">
                              <div className={`${invite.invitation_state === InvitationState.ACCEPTED ? 'text-green-500' : 'text-red-500'}`}>
                                <small className="font-bold capitalize">
                                  {invite.invitation_state}
                                </small>
                              </div>
                          </div>
                    }
                   
                  </Cell>
                  <Cell>{(new Date(invite.created_at.toString())).toISOString().split('T')[0]}</Cell>
                  <Cell>{(new Date(invite.updated_at.toString())).toISOString().split('T')[0]}</Cell>
                </Row>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}