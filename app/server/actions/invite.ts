import { createServerFn, json } from "@tanstack/start";
import { getCookie, parseCookies, setCookie } from "vinxi/http";
import { db } from "../db";
import { Permissions } from "../db/interfaces";

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

export const getInviteAsInviter = createServerFn("GET", async ({ limit = 100, offset = 0}: { limit: number, offset: number}) => {
  const id = getCookie("authed");
 
  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);
  console.log(parsedId.id);
  
  const res = await fetch(`http://localhost:3000/api/invite/given/${parsedId.id}/${limit}/${offset}`)
  const data = await res.json();
  console.log(data);
  
  return json(data);
});

export const getInviteAsInvitee = createServerFn("GET", async ({ limit = 100, offset = 0}: { limit: number, offset: number}) => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const parsedId = JSON.parse(id);

  const res = await fetch(`http://localhost:3000/api/invite/received/${parsedId.id}/${limit}/${offset}`)
  const data = await res.json();
  console.log(data);
  
  return json(data);
});