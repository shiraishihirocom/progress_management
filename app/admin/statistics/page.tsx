"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, RefreshCw } from "lucide-react"

// モックデータ
const submissionsByMonth = [
  { name: "1月", 学生数: 30 },
  { name: "2月", 学生数: 35 },
  { name: "3月", 学生数: 40 },
  { name: "4月", 学生数: 45 },
  { name: "5月", 学生数: 42 },
  { name: "6月", 学生数: 48 },
  { name: "7月", 学生数: 52 },
  { name: "8月", 学生数: 20 },
  { name: "9月", 学生数: 38 },
  { name: "10月", 学生数: 42 },
  { name: "11月", 学生数: 45 },
  { name: "12月", 学生数: 50 },
]

const scoreDistribution = [
  { name: "90-100", value: 15 },
  { name: "80-89", value: 25 },
  { name: "70-79", value: 30 },
  { name: "60-69", value: 20 },
  { name: "0-59", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const submissionsByAssignment = [
  { name: "課題1", 提出数: 42, 平均スコア: 78 },
  { name: "課題2", 提出数: 38, 平均スコア: 82 },
  { name: "課題3", 提出数: 40, 平均スコア: 75 },
  { name: "課題4", 提出数: 35, 平均スコア: 80 },
  { name: "課題5", 提出数: 30, 平均スコア: 85 },
]

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState("2025")

  useEffect(() => {
    // 実際のAPIが実装されたら、ここでデータを取得する
    // 現在はモックデータを使用
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">📊 統計ダッシュボード</h1>
            <div className="flex items-center gap-2">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="年度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023年度</SelectItem>
                  <SelectItem value="2024">2024年度</SelectItem>
                  <SelectItem value="2025">2025年度</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                更新
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                エクスポート
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="submissions">提出状況</TabsTrigger>
              <TabsTrigger value="scores">スコア分析</TabsTrigger>
              <TabsTrigger value="students">学生分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>月別提出数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={submissionsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="学生数" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>スコア分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={scoreDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {scoreDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>課題別提出数と平均スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={submissionsByAssignment}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="提出数" fill="#8884d8" />
                            <Line yAxisId="right" type="monotone" dataKey="平均スコア" stroke="#ff7300" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>提出タイミング分析</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">データ準備中...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>課題別詳細提出状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {loading ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={submissionsByAssignment}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="提出数" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scores" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>スコア詳細分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {loading ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scoreDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>学生別パフォーマンス</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">データ準備中...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
