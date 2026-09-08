import { list, put } from "@vercel/blob";

const RECIPIENT_PREFIX = "telegram-recipients/";

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));
}

function recipientPath(chatId: string) {
  return `${RECIPIENT_PREFIX}${chatId}.json`;
}

export async function getApprovedRecipientIds() {
  if (!hasBlobStorage()) return [];

  const recipientIds: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: RECIPIENT_PREFIX, limit: 1000, cursor });
    for (const blob of result.blobs) {
      const match = blob.pathname.match(/^telegram-recipients\/(-?\d+)\.json$/);
      if (match) recipientIds.push(match[1]);
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return [...new Set(recipientIds)];
}

export async function isApprovedRecipient(chatId: string) {
  return (await getApprovedRecipientIds()).includes(chatId);
}

export async function approveRecipient(chatId: string) {
  if (!hasBlobStorage()) throw new Error("RECIPIENT_STORAGE_NOT_CONFIGURED");
  await put(recipientPath(chatId), JSON.stringify({ chatId, approvedAt: new Date().toISOString() }), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
