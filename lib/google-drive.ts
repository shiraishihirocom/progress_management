import { google } from "googleapis"
import { Readable } from 'stream';

// サービスアカウントJSONデータの取得
let serviceAccount;
try {
  serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT) 
    : null;
} catch (error) {
  console.error('サービスアカウントJSONの解析エラー:', error);
  serviceAccount = null;
}

// Service Account 認証
const auth = new google.auth.JWT({
  email: serviceAccount?.client_email || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: serviceAccount?.private_key || process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive"],
})

// Google DriveのルートフォルダID（環境変数から取得）
export const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || "";

export const drive = google.drive({ version: "v3", auth })

// フォルダを検索し、存在しなければ作成する
export async function findOrCreateFolder(parentFolderId: string, folderName: string): Promise<string> {
  try {
    // まず既存のフォルダを検索
    const response = await drive.files.list({
      q: `name='${folderName}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    const folders = response.data.files;
    if (folders && folders.length > 0) {
      console.log(`フォルダ "${folderName}" が見つかりました: ${folders[0].id}`);
      return folders[0].id!;
    }

    // フォルダが見つからない場合は新規作成
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    console.log(`フォルダ "${folderName}" を作成しました: ${folder.data.id}`);
    return folder.data.id!;
  } catch (error) {
    console.error(`フォルダ作成エラー "${folderName}":`, error);
    throw error;
  }
}

// 階層的なフォルダパスを作成し、最終フォルダIDを返す
export async function getSubmissionFolderPath(
  rootFolderId: string,
  year: number,
  grade: number,
  studentInfo: string,
  assignmentName: string,
  submissionCount: number
): Promise<string> {
  try {
    // 年度フォルダ
    const yearFolderName = `${year}年度`;
    const yearFolderId = await findOrCreateFolder(rootFolderId, yearFolderName);

    // 学年フォルダ
    const gradeFolderName = `${grade}年生`;
    const gradeFolderId = await findOrCreateFolder(yearFolderId, gradeFolderName);

    // 学生フォルダ
    const studentFolderId = await findOrCreateFolder(gradeFolderId, studentInfo);

    // 課題フォルダ
    const assignmentFolderId = await findOrCreateFolder(studentFolderId, assignmentName);

    // 提出回数フォルダ
    const submissionFolderName = `${submissionCount}回目`;
    const submissionFolderId = await findOrCreateFolder(assignmentFolderId, submissionFolderName);

    return submissionFolderId;
  } catch (error) {
    console.error("フォルダパス作成エラー:", error);
    throw error;
  }
}

// ファイルをアップロードする
export async function uploadFileToDrive(
  folderId: string,
  fileName: string,
  fileContent: Buffer,
  mimeType: string
): Promise<string> {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(fileContent)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log(`ファイル "${fileName}" をアップロードしました: ${response.data.id}`);
    return response.data.id!;
  } catch (error) {
    console.error(`ファイルアップロードエラー "${fileName}":`, error);
    throw error;
  }
}

// URLからファイルをダウンロードしてGoogle Driveにアップロード
export async function uploadFileFromUrl(folderId: string, fileName: string, fileUrl: string, mimeType: string): Promise<string> {
  try {
    // ファイルをダウンロード
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`ファイルのダウンロードに失敗しました: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    // ファイルをGoogle Driveにアップロード
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(Buffer.from(buffer))
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log(`ファイル "${fileName}" をアップロードしました: ${driveResponse.data.id}`);
    return driveResponse.data.id!;
  } catch (error) {
    console.error(`ファイルアップロードエラー "${fileName}":`, error);
    throw error;
  }
}

// 提出物をGoogle Driveにアップロード
export async function uploadSubmissionToDrive(
  rootFolderId: string,
  year: number,
  grade: number,
  studentNumber: string,
  studentName: string,
  assignmentTitle: string,
  submissionVersion: number,
  zipFileUrl: string,
  previewImageUrl: string | null
): Promise<{
  folderId: string;
  zipFileId: string;
  previewImageId: string | null;
}> {
  try {
    // 学生情報を整形（例: "01_山田太郎"）
    const studentInfo = `${studentNumber}_${studentName}`;
    
    // フォルダ階層を作成
    const folderId = await getSubmissionFolderPath(
      rootFolderId,
      year,
      grade,
      studentInfo,
      assignmentTitle,
      submissionVersion
    );
    
    // ZIPファイルをアップロード
    const zipFileName = `submission_v${submissionVersion}.zip`;
    const zipFileId = await uploadFileFromUrl(
      folderId,
      zipFileName,
      zipFileUrl,
      'application/zip'
    );
    
    // プレビュー画像をアップロード（存在する場合のみ）
    let previewImageId = null;
    if (previewImageUrl) {
      const previewFileName = `preview_v${submissionVersion}.png`;
      previewImageId = await uploadFileFromUrl(
        folderId,
        previewFileName,
        previewImageUrl,
        'image/png'
      );
    }
    
    return {
      folderId,
      zipFileId,
      previewImageId
    };
  } catch (error) {
    console.error("提出物アップロードエラー:", error);
    throw error;
  }
}
