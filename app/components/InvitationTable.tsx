import { Cell, Column, Row, Table, TableBody, TableHeader, TableProps } from "react-aria-components";
import { Invite } from "./InvitaionComboBox";
import { Permission } from "../server/db/interfaces";

export enum InvitationType {
  SENT = 'sent',
  RECEIVED = 'received'
}

interface InvitationTableProps {
  invitationType: InvitationType;
  invites: Invite[]
}

export function InvitationTable(props: InvitationTableProps) {
  const { invitationType, invites } = props;

  return (
    <div className={`
      bg-white
      px-8 py-6
      rounded-md
      shadow-md
      w-full
    `}>
      <h1 className="text-xl font-semibold text-center pb-3 uppercase">Invitation {invitationType}</h1>
      <Table
        className={`
          border
          border-gray-300
          rounded-md
          shadow-md
          w-full
          px-10
        `}
        aria-label="Files"
        selectionMode="multiple"
      >
        <TableHeader>
          <Column isRowHeader>Username</Column>
          <Column>State</Column>
          <Column>Permission</Column>
          <Column>Invitation Date</Column>
          <Column>Updated Date</Column>
        </TableHeader>
        <TableBody>
          {/* 
          id: number;
          invitee_user_id: number;
          inviter_user_id: number;
          permissions: Permissions;
          invitation_state: InvitationState;
          created_at: Date;
          updated_at: Date;
          */}
          {invites.length === 0
            ? <Row>
              <Cell>-</Cell>
              <Cell>-</Cell>
              <Cell>-</Cell>
              <Cell>-</Cell>
            </Row>
            : invites.map((invite) => (
              <Row className='text-center' key={invite.id}>
                {invitationType === InvitationType.SENT ? (
                  <Cell>{invite.invitee_user_id}</Cell>
                ) : (
                  <Cell>{invite.inviter_user_id}</Cell>
                )}
                <Cell>
                {Object.keys(invite.permissions).map((permission) => (
                  <ul key={permission}>
                    <li>
                      <div className="flex justify-between items-center gap-x-4">
                        <small className="font-bold">{permission}</small>
                        {invite.permissions[permission as Permission].toString() === 'true'
                          ? <small className="text-green-500 font-bold">{invite.permissions[permission as Permission].toString()}</small>
                          : <small className="text-red-500 font-bold">{invite.permissions[permission as Permission].toString()}</small>
                        }
                      </div>
                    </li>
                  </ul>
                ))}
                </Cell>
                <Cell>{invite.invitation_state}</Cell>
                <Cell>{invite.created_at.toString()}</Cell>
                <Cell>{invite.updated_at.toString()}</Cell>
              </Row>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}