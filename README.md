## Requirements
You are to use the following libraries:
- TypeScript 5.5
- React 19 
- TanStack Router (w/ Start and Server Functions)
- TanStack Query
- React Hook Form w/ Zod Resolver
- Zod
- React Aria Components (alongside React Aria and React Stately)
- React Aria Components Tailwind CSS Plugin
- Tailwind CSS
- (optional) Kysely & PostgreSQL
### TypeScript
TypeScript must strictly be used. The usage of `any` is PROHIBITED and use of `unknown` must be sparingly used as much as possible (do not overuse it).
### React
A common beginner mistake is over-reliance on `useEffect`. This task should NOT ever require any use of `useEffect`.
### React Aria Components
The entire UI must be properly tabbable/focusable.

Look into usage of `Group` and `Toolbar` in React Aria Components and look at the ARIA specification linked in each of the components respective documentation to see when `Group` or `Toolbar` may be applicable.

If you intentionally choose to go against the recommendations in the ARIA specification, leave a comment or note as to why you did it (recommendations at the end of the day are just recommendations - breaking them may lead to a better user experience).

Be VERY sure that you encase mutation-related components in a `<form/>`, and to wrap usage of React Aria Components representing form fields with a `Controller`/`useController` from React Hook Form.
### Design
The design must be responsive and look decent.

By decent, the information to be presented in the task should not be botched (words being truncated, single-lined text should not turn into multi-lined text, etc.) from the `sm` screen breakpoint up to the `2xl` screen breakpoint.

Feel free to use additional components in React Aria that are not specified in this task.
### React Query
Use suspense queries/infinite queries and mutations as much as possible.
## Task
You are to write a UI that allows users to:
1. invite others to manage their account,
2. manage what permissions are provided/delegated to users for managing their account, and
3. accept/decline invitations from other users for managing their account.

The UI is only accessible if:
1. The user is logged in and is verified, or
2. The user is logged in but is not verified BUT the user was invited by a verified user to manage their account.

If either of the conditions above are not met, the user is redirected to a login page.

There are two sections in the UI:
1. one is a table for managing invites given, and
2. another one is a table for managing invites received. Both sections are infinitely scrollable (scrolling to the end of the table should load more entries if anymore exists).

Memory related to the application should be persisted in some way. You are free to use anything such as files or some in-memory data structures. Bonus points if you use Kysely & PostgreSQL, but don't force yourself unless you finished implementing all the features with time to spare.
### Permissions
There are a total of 4 permissions that can be granted.
1. Read/write posts
2. Read/write messages
3. Read/write profile info

If permissions for writing posts/message/profile info is given, then the read permission should be automatically enabled as well.

If the write permission is toggled such that it is disabled, the read permission should be kept enabled such that if the user wants to completely take away all permissions then the read permission should be manually toggled by the user to be disabled.
### Managing Invites Given
A `Combobox` for searching for an account to invite, and a `Button` to shoot out an invite should be provided.

Each `Table` entry should be collapsible. When collapsed, the `Table` entry should show the accounts information, the time the invite was given, a summary of the permissions granted, whether the invite is pending/accepted, and a `Button` for deleting/trashing the invite. When expanded, the `Table` entry should show a list of all permissions delegated to the selected invitee with `Switch` components to enable/disable selected permissions.

Prior to shooting out an invite, the permissions to be delegated to the invitee should be specifiable. A confirmation dialog should be shown to confirm whether or not the invitee specified is the one to really be invited, with a list of permissions to be given to the invitee. 

The permissions delegated to the invitee may be changed at any time so long as the invite is in a pending or accepted state.

Pending/accepted invites may additionally be deleted/trashed.
### Managing Invites Received
Each `Table` entry should be collapsible. When collapsed, the `Table` entry should show the inviters information, the time the invite was given/accepted, a summary of the permissions granted, whether the invite is pending/accepted, and two `Button`'s for accepting/rejecting the invite. When expanded, the `Table` entry should show a list of all permissions delegated to the user.
## Bonus
1. Provide a way to allow for permissions delegated to another user to expire after i.e. 7 days - use a `NumberField`.
2. Provide a way to allow for permissions to only be granted during a specified date/time duration (i.e. every Monday, Wednesday, Friday) - use a `DatePicker`.
## Warning
Make sure you use every library PROPERLY AS INTENDED. Points WILL be deducted for any misuse without any proper explanation or approval from Kenta.

A hint for a common error is improperly passing the wrong props provided from a React Hook Form `Controller` to the underlying components rendered by it.

For example, the `ref` from React Hook Form's `Controller` must ONLY be passed to an input HTML element (a `HTMLInputElement`). Some React Aria Components may not explicitly expose an input ref, and so therefore you may need to drop down to using React Aria hooks.