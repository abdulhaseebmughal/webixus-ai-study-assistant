"use client"

import { useState, useEffect } from "react"
import { FeatureLayout } from "@/components/feature-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Target, Zap, Brain, AlertCircle, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [studyStats, setStudyStats] = useState({
    totalHours: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    streak: 0,
  })

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch("/api/progress", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      })

      const data = await response.json()

      if (data.success && data.data.progress) {
        const progress = data.data.progress
        setStudyStats({
          totalHours: progress.totalStudyHours || 0,
          sessionsCompleted: progress.sessionsCompleted || 0,
          averageScore: progress.averageScore || 0,
          streak: progress.streak || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const learningBreakdown = [
    { name: "Quizzes", value: 35, color: "#8b5cf6" },
    { name: "Flashcards", value: 30, color: "#06b6d4" },
    { name: "Summaries", value: 20, color: "#f59e0b" },
    { name: "Study Buddy", value: 15, color: "#10b981" },
  ]

  const recommendations = [
    {
      title: "Keep Learning",
      description: "Continue your study streak by completing quizzes and flashcards daily.",
      priority: "high",
      icon: AlertCircle,
    },
    {
      title: "Practice Regularly",
      description: "Consistent practice leads to better retention and understanding.",
      priority: "medium",
      icon: Zap,
    },
    {
      title: "Review Progress",
      description: "Check your weak areas and focus on improving them.",
      priority: "medium",
      icon: Brain,
    },
  ]

  return (
    <FeatureLayout
      title="Learning Dashboard"
      description="Track your progress, identify weak areas, and get personalized study recommendations"
    >
      <div className="space-y-8">
        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Study Hours</p>
                <p className="text-3xl font-bold">{studyStats.totalHours}</p>
                <p className="text-xs text-green-600">+2.5 this week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-3xl font-bold">{studyStats.sessionsCompleted}</p>
                <p className="text-xs text-green-600">+3 this week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{studyStats.averageScore}%</p>
                <p className="text-xs text-green-600">+5% improvement</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">{studyStats.streak} days</p>
                <p className="text-xs text-amber-600">Keep it going!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Method Distribution</CardTitle>
            <CardDescription>Your activity across different study tools</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={learningBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {learningBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>AI-powered suggestions to optimize your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon
                const priorityColor =
                  rec.priority === "high"
                    ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                    : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"

                return (
                  <div key={idx} className={`p-4 border rounded-lg ${priorityColor}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Study Goals</CardTitle>
            <CardDescription>Set and track your learning objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Complete 50 Quizzes</h4>
                  <span className="text-sm text-muted-foreground">18/50</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "36%" }} />
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Study 30 Hours</h4>
                  <span className="text-sm text-muted-foreground">24.5/30</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "82%" }} />
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Maintain 10-Day Streak</h4>
                  <span className="text-sm text-muted-foreground">7/10</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureLayout>
  )
}
