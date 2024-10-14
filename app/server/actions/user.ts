import { createServerFn, json } from "@tanstack/start";
import { deleteCookie, getCookie, parseCookies, setCookie } from "vinxi/http";
import { generatePasswordHash } from "../utils";
import { db } from "../db";

export const getLoginCookies = createServerFn("GET", async () => {
  const id = getCookie("authed") as string;

  if (!id) {
    return json({ isLogined: false, id: null });
  }

  const parsedId = JSON.parse(id);
  
  return id ? json({ isLogined: true, id: parsedId.id }) : json({ isLogined: false, id: parsedId.id });
});

export const logout = createServerFn("GET", async () => {
  deleteCookie("authed");
  deleteCookie("logined");
  
  return json({ status: '200' });
});


export const getAllUsers = createServerFn("GET", async () => {
  const id = getCookie("authed");

  if (!id) {
    return json({ error: "Missing Auth Cookies" });
  }

  const res = await fetch('http://localhost:3000/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()
  
  return json(data)
});
