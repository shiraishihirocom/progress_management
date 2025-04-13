"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    systemName: "課題管理システム",
    systemDescription: "3DCG課題の提出・評価を管理するシステム",
    defaultCourseName: "未設定",
    availableGrades: [1, 2, 3, 4],
    enableEmailNotifications: true,
    enableAutoGrading: false,
    maxFileSize: 50, // MB
    allowedFileTypes: [".blend", ".fbx", ".obj", ".stl"],
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (!response.ok) {
          throw new Error("設定の取得に失敗しました")
        }
        const data = await response.json()
        if (data.success && data.data) {
          setSettings(data.data)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast.error("設定の取得に失敗しました")
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("設定の保存に失敗しました")
      }

      toast.success("設定を保存しました")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("設定の保存に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">⚙️ システム設定</h1>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "保存中..." : "設定を保存"}
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">基本設定</TabsTrigger>
              <TabsTrigger value="courses">コース設定</TabsTrigger>
              <TabsTrigger value="grades">学年設定</TabsTrigger>
              <TabsTrigger value="advanced">詳細設定</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>基本情報</CardTitle>
                  <CardDescription>システムの基本情報を設定します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">システム名</Label>
                    <Input
                      id="systemName"
                      value={settings.systemName}
                      onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemDescription">システム説明</Label>
                    <Input
                      id="systemDescription"
                      value={settings.systemDescription}
                      onChange={(e) => setSettings({ ...settings, systemDescription: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>コース設定</CardTitle>
                  <CardDescription>コースの基本設定を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCourseName">デフォルトコース名</Label>
                    <Input
                      id="defaultCourseName"
                      value={settings.defaultCourseName}
                      onChange={(e) => setSettings({ ...settings, defaultCourseName: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grades">
              <Card>
                <CardHeader>
                  <CardTitle>学年設定</CardTitle>
                  <CardDescription>利用可能な学年を設定します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>利用可能な学年</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((grade) => (
                        <Button
                          key={grade}
                          variant={settings.availableGrades.includes(grade) ? "default" : "outline"}
                          onClick={() => {
                            const newGrades = settings.availableGrades.includes(grade)
                              ? settings.availableGrades.filter((g) => g !== grade)
                              : [...settings.availableGrades, grade].sort()
                            setSettings({ ...settings, availableGrades: newGrades })
                          }}
                        >
                          {grade}年生
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>詳細設定</CardTitle>
                  <CardDescription>システムの詳細設定を管理します</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>メール通知</Label>
                        <p className="text-sm text-muted-foreground">
                          課題の提出や評価に関するメール通知を有効にします
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={settings.enableEmailNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, enableEmailNotifications: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>自動採点</Label>
                        <p className="text-sm text-muted-foreground">
                          提出された課題の自動採点を有効にします
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="autoGrading"
                          checked={settings.enableAutoGrading}
                          onChange={(e) =>
                            setSettings({ ...settings, enableAutoGrading: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">最大ファイルサイズ (MB)</Label>
                      <Select
                        value={settings.maxFileSize.toString()}
                        onValueChange={(value) =>
                          setSettings({ ...settings, maxFileSize: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 MB</SelectItem>
                          <SelectItem value="50">50 MB</SelectItem>
                          <SelectItem value="100">100 MB</SelectItem>
                          <SelectItem value="200">200 MB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>許可されたファイル形式</Label>
                      <div className="flex flex-wrap gap-2">
                        {[".blend", ".fbx", ".obj", ".stl"].map((type) => (
                          <Button
                            key={type}
                            variant={settings.allowedFileTypes.includes(type) ? "default" : "outline"}
                            onClick={() => {
                              const newTypes = settings.allowedFileTypes.includes(type)
                                ? settings.allowedFileTypes.filter((t) => t !== type)
                                : [...settings.allowedFileTypes, type]
                              setSettings({ ...settings, allowedFileTypes: newTypes })
                            }}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
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