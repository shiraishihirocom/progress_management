import { google } from "googleapis"

// Service Account 認証
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive"],
})

export const drive = google.drive({ version: "v3", auth })

export async function findOrCreateFolder(name: string, parentId: string | null): Promise<string> {
  const query =
    `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false` +
    (parentId ? ` and '${parentId}' in parents` : "")

  const res = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  })

  const folder = res.data.files?.[0]
  if (folder?.id) return folder.id

  const file = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : undefined,
    },
    fields: "id",
  })

  return file.data.id!
}

export async function uploadFileToDrive(file: File, parentId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const created = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [parentId],
    },
    media: {
      mimeType: file.type,
      body: buffer,
    },
    fields: "id",
  })

  return created.data.id!
}
