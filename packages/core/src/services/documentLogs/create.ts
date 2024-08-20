import {
  database,
  documentLogs,
  Result,
  Transaction,
} from '@latitude-data/core'
import { Commit, DocumentLog } from '$core/browser'

export type CreateDocumentLogProps = {
  commit: Commit
  data: {
    uuid: string
    documentUuid: string
    parameters: Record<string, unknown>
    resolvedContent: string
    customIdentifier?: string
    duration: number
  }
}

export async function createDocumentLog(
  {
    data: {
      uuid,
      documentUuid,
      resolvedContent,
      parameters,
      customIdentifier,
      duration,
    },
    commit,
  }: CreateDocumentLogProps,
  db = database,
) {
  return Transaction.call<DocumentLog>(async (trx) => {
    const inserts = await trx
      .insert(documentLogs)
      .values({
        uuid,
        documentUuid,
        commitId: commit.id,
        resolvedContent,
        parameters,
        customIdentifier,
        duration,
      })
      .returning()

    const documentLog = inserts[0]!

    return Result.ok(documentLog)
  }, db)
}