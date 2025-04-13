import { getStudents, type StudentSummary } from "@/app/actions/student"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function StudentsPage() {
  const { success, data: students, error } = await getStudents()

  if (!success || !students) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>エラー</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || "学生一覧の取得に失敗しました。"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>登録学生一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>学年</TableHead>
              <TableHead>出席番号</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>提出数</TableHead>
              <TableHead>課題数</TableHead>
              <TableHead>平均点</TableHead>
              <TableHead>最終提出日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student: StudentSummary) => (
              <TableRow key={student.id}>
                <TableCell>{student.grade || "-"}</TableCell>
                <TableCell>{student.studentNumber || "-"}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.totalSubmissions}</TableCell>
                <TableCell>{student.totalAssignments}</TableCell>
                <TableCell>
                  {student.averageScore !== null ? student.averageScore.toFixed(1) : "-"}
                </TableCell>
                <TableCell>{student.lastSubmittedAt || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
