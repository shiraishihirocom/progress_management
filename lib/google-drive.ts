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

/**
 * 学生の課題提出用フォルダ階層を作成・取得する
 * @param rootFolderId ルートフォルダID（教員が指定）
 * @param year 年度（例: 2023）
 * @param grade 学年（例: 1, 2, 3）
 * @param studentInfo 学生情報（例: "01_山田太郎"）
 * @param assignmentName 課題名（例: "キャラクターモデリング"）
 * @param submissionCount 提出回数（例: 1, 2, 3）
 * @returns 作成されたフォルダのID
 */
export async function getSubmissionFolderPath(
  rootFolderId: string,
  year: number,
  grade: number,
  studentInfo: string,
  assignmentName: string,
  submissionCount: number
): Promise<string> {
  // 年度フォルダを作成または取得
  const yearFolderName = `${year}年度`;
  const yearFolderId = await findOrCreateFolder(yearFolderName, rootFolderId);

  // 学年フォルダを作成または取得
  const gradeFolderName = `${grade}年生`;
  const gradeFolderId = await findOrCreateFolder(gradeFolderName, yearFolderId);

  // 学生フォルダを作成または取得
  const studentFolderId = await findOrCreateFolder(studentInfo, gradeFolderId);

  // 課題フォルダを作成または取得
  const assignmentFolderId = await findOrCreateFolder(assignmentName, studentFolderId);

  // 提出回数フォルダを作成または取得
  const submissionFolderName = `${submissionCount}回目`;
  const submissionFolderId = await findOrCreateFolder(submissionFolderName, assignmentFolderId);

  return submissionFolderId;
}

/**
 * 学生の課題提出をGoogle Driveに保存する
 * @param rootFolderId ルートフォルダID
 * @param year 年度 
 * @param grade 学年
 * @param studentNumber 出席番号
 * @param studentName 氏名
 * @param assignmentName 課題名
 * @param submissionCount 提出回数
 * @param zipFile 提出ZIPファイル
 * @param previewImage プレビュー画像
 * @returns フォルダID、ファイルID、画像IDを含むオブジェクト
 */
export async function uploadSubmissionToDrive(
  rootFolderId: string,
  year: number,
  grade: number,
  studentNumber: string,
  studentName: string,
  assignmentName: string,
  submissionCount: number,
  zipFile: File,
  previewImage: File | null
): Promise<{
  folderId: string;
  zipFileId: string;
  previewImageId: string | null;
}> {
  try {
    // 学生情報を整形
    const paddedNumber = studentNumber.padStart(2, '0');
    const studentInfo = `${paddedNumber}_${studentName}`;

    // フォルダパスを取得または作成
    const folderId = await getSubmissionFolderPath(
      rootFolderId, 
      year, 
      grade, 
      studentInfo, 
      assignmentName, 
      submissionCount
    );

    // ZIPファイルをアップロード
    const zipFileId = await uploadFileToDrive(zipFile, folderId);
    
    // プレビュー画像があればアップロード
    let previewImageId = null;
    if (previewImage) {
      previewImageId = await uploadFileToDrive(previewImage, folderId);
    }

    return {
      folderId,
      zipFileId,
      previewImageId
    };
  } catch (error) {
    console.error("Google Driveへのアップロードエラー:", error);
    throw new Error("ファイルのアップロードに失敗しました");
  }
}
