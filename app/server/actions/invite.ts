import { createServerFn, json } from "@tanstack/start";
import { getCookie, parseCookies, setCookie } from "vinxi/http";
import { db } from "../db";
import { InvitationState, Permissions } from "../db/interfaces";

export const createInvite = createServerFn("POST", async ({inviteeId, permissions}: {inviteeId: number, permissions: Permissions}) => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);
  const res = await fetch('http://localhost:3000/api/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: parsedId.id,
      inviteeId: inviteeId,
      permissions: permissions
    }),
  })
  const data = await res.json();
  return json(data);
});

export const getInviteAsInviter = createServerFn("GET", async ({ limit = 100, offset = 0 }: { limit: number, offset: number}) => {
  const id = getCookie("authed");
 
  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);
  
  const res = await fetch(`http://localhost:3000/api/invite/given/${parsedId.id}/${limit}/${offset}`)
  const data = await res.json();
  
  return json(data);
});

export const getInviteAsInvitee = createServerFn("GET", async ({ limit = 100, offset = 0 }: { limit: number, offset: number}) => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);

  const res = await fetch(`http://localhost:3000/api/invite/received/${parsedId.id}/${limit}/${offset}`)
  const data = await res.json();
  
  return json(data);
});

export const updateInvitePermissions = createServerFn("POST", async ({inviteId, permissions}: {inviteId: number, permissions: Permissions}) => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);
  
  const res = await fetch(`http://localhost:3000/api/invite/permission`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: parsedId.id,
      inviteId: inviteId,
      permissions: permissions
    }),
  })
  const data = await res.json();
  
  return json(data);
});

export const updateInviteState = createServerFn("POST", async ({ inviteId, state }: { inviteId: number, state: InvitationState}) => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);
  
  const res = await fetch(`http://localhost:3000/api/invite/state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: state === InvitationState.CANCELLED
      ? JSON.stringify({
        inviteId: inviteId,
        inviterId: parsedId.id,
        state: state
      })
      : JSON.stringify({
        inviteId: inviteId,
        inviteeId: parsedId.id,
        state: state
      })
  })
  const data = await res.json();
  
  return json(data);
});