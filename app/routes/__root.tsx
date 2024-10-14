import * as React from 'react'
import { createRootRoute, redirect } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import appCss from '../styles/app.css?url'
import { getLoginCookies } from '../server/actions/user'

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  links: () => [
    {
      rel: 'stylesheet',
      href: appCss,
    },
  ],
  beforeLoad: async (location) => {
    const res = await getLoginCookies() as unknown as { isLogined: boolean };
    const isLoginPage = location.location.href.includes("/login") || location.location.href.includes("/register");    
    
    if (!res.isLogined && !isLoginPage) {
      throw redirect({
        to: "/login",
        search: {
          // redirect: location.href,
        },
      });
    } else if ((res.isLogined && isLoginPage)) {
      throw redirect({
        to: "/",
        search: {
          // redirect: location.href,
        },
      });
    } else {
      return;
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}