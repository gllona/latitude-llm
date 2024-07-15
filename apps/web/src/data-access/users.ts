import {
  Result,
  UserNotFoundError,
  users,
  verifyPassword,
  type AppContext,
  type PromisedResult,
  type SessionData,
} from '@latitude-data/core'
import { getWorkspace } from '$/data-access/workspaces'
import { eq } from 'drizzle-orm'

export async function getUserFromCredentials(
  { email, password }: { email: string; password: string },
  { db }: AppContext,
): PromisedResult<SessionData> {
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      encryptedPassword: true,
    },
    where: eq(users.email, email),
  })

  if (!user) {
    return Result.error(new UserNotFoundError())
  }

  const validPassword = await verifyPassword(password, user.encryptedPassword)

  if (!validPassword) {
    Result.error(new UserNotFoundError())
  }
  const wpResult = await getWorkspace({ userId: user.id }, { db })

  if (wpResult.error) {
    return Result.error(wpResult.error)
  }

  const workspace = wpResult.value
  return Result.ok({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspace: { id: Number(workspace.id), name: workspace.name },
  })
}

export async function getCurrentUserFromDB(
  { userId }: { userId: string | undefined },
  { db }: AppContext,
): PromisedResult<SessionData> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId ?? ''),
  })

  if (!user) {
    return Result.error(new UserNotFoundError())
  }

  const wpResult = await getWorkspace({ userId: user.id }, { db })
  if (wpResult.error) {
    return Result.error(wpResult.error)
  }

  const workspace = wpResult.value
  return Result.ok({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspace: { id: Number(workspace.id), name: workspace.name },
  })
}