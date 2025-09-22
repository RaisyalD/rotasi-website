'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, GraduationCap, Eye, FileText, Download, AlertTriangle, Calendar, Clock } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'

interface Mentee extends User {
  submissions?: TaskSubmission[]
}

interface Task {
  id: string
  title: string
  description: string
  sector: number
  due_date: string
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
}

interface TaskSubmission {
  id: string
  task_id: string
  participant_id: string
  submission_text?: string
  file_url?: string
  file_name?: string
  submitted_at: string
  status: 'submitted' | 'evaluated' | 'rejected'
  evaluation_score?: number
  evaluation_comment?: string
  tasks: Task
  participants: User
}


export function MentorDashboard({ user }: { user: User }) {
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailDialog, setDetailDialog] = useState(false)
  const [taskDetailDialog, setTaskDetailDialog] = useState(false)

  useEffect(() => {
    fetchMentees()
  }, [])

  const fetchMentees = async () => {
    try {
      // Fetch mentees from the same sector
      const response = await fetch(`/api/users?role=peserta&sektor=${user.sektor}`)
      const data = await response.json()
      
      if (data.success) {
        setMentees(data.users)
      }

      // Fetch submissions for the sector
      const submissionsResponse = await fetch(`/api/submissions?sector=${user.sektor}`)
      const submissionsData = await submissionsResponse.json()
      
      if (submissionsData.success) {
        setSubmissions(submissionsData.submissions)
      }

      // Fetch tasks for the sector
      const tasksResponse = await fetch(`/api/tasks?sector=${user.sektor}`)
      const tasksData = await tasksResponse.json()
      
      if (tasksData.success) {
        setTasks(tasksData.tasks)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const isSubmissionLate = (task: Task, submittedAt: string) => {
    try {
      const submitted = new Date(submittedAt)
      const deadline = new Date(task.due_date)
      deadline.setHours(23, 59, 59, 999)
      return submitted.getTime() > deadline.getTime()
    } catch {
      return false
    }
  }

  const getMenteeSubmissions = (menteeId: string) => {
    return submissions.filter(sub => sub.participant_id === menteeId)
  }

  const isTaskOverdue = (task: Task) => {
    try {
      const now = new Date()
      const deadline = new Date(task.due_date)
      deadline.setHours(23, 59, 59, 999)
      return now.getTime() > deadline.getTime()
    } catch {
      return false
    }
  }

  const getTaskSubmissionCount = (taskId: string) => {
    return submissions.filter(sub => sub.task_id === taskId).length
  }

  const getTaskSubmissionStatus = (taskId: string) => {
    const taskSubmissions = submissions.filter(sub => sub.task_id === taskId)
    const submittedCount = taskSubmissions.filter(sub => sub.status === 'submitted' || sub.status === 'evaluated').length
    return {
      total: mentees.length,
      submitted: submittedCount,
      pending: mentees.length - submittedCount
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Memuat data mentee...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentee</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentees.length}</div>
            <p className="text-xs text-muted-foreground">
              Sektor {user.sektor}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              tugas aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission Dikumpulkan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(sub => sub.status === 'submitted' || sub.status === 'evaluated').length}
            </div>
            <p className="text-xs text-muted-foreground">
              dari total tugas
            </p>
          </CardContent>
        </Card>
        
      </div>

      {/* Mentees, Tasks, and Submissions */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tugas Sektor</TabsTrigger>
          <TabsTrigger value="mentees">Daftar Mentee</TabsTrigger>
          <TabsTrigger value="submissions">Submission Tugas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tugas Sektor {user.sektor} : {SECTOR_NAME[user.sektor as number] ?? `Sektor ${user.sektor}`}
              </CardTitle>
              <CardDescription>
                Daftar tugas yang diberikan oleh Divisi Acara untuk sektor Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Tugas</h3>
                    <p className="text-muted-foreground">
                      Belum ada tugas yang diberikan untuk sektor {user.sektor} saat ini.
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const submissionStatus = getTaskSubmissionStatus(task.id)
                    const isOverdue = isTaskOverdue(task)
                    
                    return (
                      <div key={task.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{task.title}</h3>
                              <Badge variant="outline">Sektor {task.sector}</Badge>
                              {isOverdue && (
                                <Badge variant="destructive">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Terlambat
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Deadline: {new Date(task.due_date).toLocaleDateString('id-ID')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Progress: {submissionStatus.submitted}/{submissionStatus.total}
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTask(task)
                              setTaskDetailDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress Submission</span>
                            <span>{submissionStatus.submitted}/{submissionStatus.total} mentee</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(submissionStatus.submitted / submissionStatus.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mentees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Daftar Mentee Sektor {user.sektor}
              </CardTitle>
              <CardDescription>
                Lihat progress dan tugas mentee Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mentees.map((mentee) => {
                  const menteeSubmissions = getMenteeSubmissions(mentee.id)
                  
                  return (
                    <div key={mentee.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{mentee.nama_lengkap}</h3>
                          <p className="text-sm text-muted-foreground">
                            NIM: {mentee.nim} • Email: {mentee.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Tugas Terkini:</h4>
                        {menteeSubmissions.slice(0, 3).map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium text-sm">{submission.tasks?.title ?? 'Tugas'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                                <Badge variant="destructive">Terlambat</Badge>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubmission(submission)
                                  setDetailDialog(true)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                        {menteeSubmissions.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">Belum ada tugas dikumpulkan</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submission Tugas Sektor {user.sektor} : {SECTOR_NAME[user.sektor as number] ?? `Sektor ${user.sektor}`}
              </CardTitle>
              <CardDescription>
                Lihat semua submission tugas dari mentee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{submission.participants.nama_lengkap}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(submission.tasks?.title ?? 'Tugas')} • {new Date(submission.submitted_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                          <Badge variant="destructive">Terlambat</Badge>
                        )}
                      </div>
                    </div>
                    
                    {submission.submission_text && (
                      <div className="bg-muted p-3 rounded mb-3">
                        <p className="text-sm">{submission.submission_text}</p>
                      </div>
                    )}
                    
                    {submission.file_url && (
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{submission.file_name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    )}
                    
                    {submission.evaluation_comment && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded mb-3">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Komentar Evaluasi:</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{submission.evaluation_comment}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setDetailDialog(true)
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Submission Tugas</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.tasks.title}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Peserta</h4>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.participants.nama_lengkap}</p>
                  <p className="text-sm text-muted-foreground">NIM: {selectedSubmission.participants.nim}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Deskripsi Tugas</h4>
                <p className="text-sm text-muted-foreground">{selectedSubmission.tasks.description}</p>
              </div>
              
              {selectedSubmission.submission_text && (
                <div>
                  <h4 className="font-medium">Submission Text</h4>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm">{selectedSubmission.submission_text}</p>
                  </div>
                </div>
              )}
              
              {selectedSubmission.file_url && (
                <div>
                  <h4 className="font-medium">File Submission</h4>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedSubmission.file_name}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={selectedSubmission.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedSubmission.evaluation_comment && (
                <div>
                  <h4 className="font-medium">Komentar Evaluasi</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <p className="text-sm">{selectedSubmission.evaluation_comment}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={taskDetailDialog} onOpenChange={setTaskDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Tugas</DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Sektor</h4>
                  <p className="text-sm text-muted-foreground">
                    Sektor {selectedTask.sector} : {SECTOR_NAME[selectedTask.sector as number] ?? `Sektor ${selectedTask.sector}`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Deadline</h4>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span>{new Date(selectedTask.due_date).toLocaleDateString('id-ID')}</span>
                    {isTaskOverdue(selectedTask) && (
                      <Badge variant="destructive" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Terlambat
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Deskripsi Tugas</h4>
                <div className="bg-muted p-3 rounded mt-2">
                  <p className="text-sm whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Status Tugas</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedTask.status === 'active' ? 'default' : 'secondary'}>
                    {selectedTask.status === 'active' ? 'Aktif' : selectedTask.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Dibuat: {new Date(selectedTask.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Progress Submission</h4>
                {(() => {
                  const submissionStatus = getTaskSubmissionStatus(selectedTask.id)
                  return (
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Mentee yang sudah mengumpulkan</span>
                        <span>{submissionStatus.submitted}/{submissionStatus.total}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(submissionStatus.submitted / submissionStatus.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Belum dikumpulkan: {submissionStatus.pending}</span>
                        <span>{Math.round((submissionStatus.submitted / submissionStatus.total) * 100)}% selesai</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div>
                <h4 className="font-medium">Mentee yang Sudah Mengumpulkan</h4>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {submissions
                    .filter(sub => sub.task_id === selectedTask.id && (sub.status === 'submitted' || sub.status === 'evaluated'))
                    .map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <p className="text-sm font-medium">{submission.participants.nama_lengkap}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {submission.status === 'submitted' ? 'Dikumpulkan' : 'Dievaluasi'}
                        </Badge>
                      </div>
                    ))}
                  {submissions.filter(sub => sub.task_id === selectedTask.id && (sub.status === 'submitted' || sub.status === 'evaluated')).length === 0 && (
                    <p className="text-sm text-muted-foreground italic">Belum ada mentee yang mengumpulkan tugas ini</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
