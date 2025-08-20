'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, GraduationCap, Upload, FileText, Eye, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'


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
}

export function PesertaDashboard({ user }: { user: User }) {
  const { user: currentUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [uploadForm, setUploadForm] = useState({
    submission_text: '',
    file: null as File | null
  })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch tasks for user's sector
      const tasksResponse = await fetch(`/api/tasks?sector=${user.sektor}`)
      const tasksData = await tasksResponse.json()
      
      if (tasksData.success) {
        setTasks(tasksData.tasks)
      }

      // Fetch user's submissions
      const submissionsResponse = await fetch(`/api/submissions?participantId=${user.id}`)
      const submissionsData = await submissionsResponse.json()
      
      if (submissionsData.success) {
        setSubmissions(submissionsData.submissions)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] })
    }
  }

  const handleUpload = async () => {
    if (!selectedTask || !uploadForm.file) {
      alert('Harap upload file tugas dalam format ZIP')
      return
    }

    setIsUploading(true)

    try {
      let fileUrl = ''
      let fileName = ''

      // Upload file if exists
      if (uploadForm.file) {
        const formData = new FormData()
        formData.append('file', uploadForm.file)
        formData.append('folder', 'task-submissions')
        formData.append('task_id', selectedTask.id)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const uploadData = await uploadResponse.json()
        
        if (uploadData.success) {
          fileUrl = uploadData.fileUrl
          fileName = uploadData.fileName
        }
      }

      // Create submission
      const submissionResponse = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: selectedTask.id,
          participant_id: user.id,
          submission_text: uploadForm.submission_text || undefined,
          file_url: fileUrl || undefined,
          file_name: fileName || undefined
        })
      })

      const submissionData = await submissionResponse.json()

      if (submissionData.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: 'Tugas berhasil diupload' })
        setUploadDialog(false)
        setUploadForm({ submission_text: '', file: null })
        setSelectedTask(null)
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Upload error:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal mengupload tugas' })
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'evaluated':
        return <Badge variant="default" className="bg-green-100 text-green-800">Dievaluasi</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getTaskStatus = (task: Task) => {
    const submission = submissions.find(sub => sub.task_id === task.id)
    if (submission) {
      return submission.status
    }
    return 'not_submitted'
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'evaluated':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Memuat data tugas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Sektor {user.sektor}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Dikumpulkan</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Dievaluasi</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(sub => sub.status === 'evaluated').length}
            </div>
            <p className="text-xs text-muted-foreground">
              sudah dievaluasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Submissions */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Daftar Tugas</TabsTrigger>
          <TabsTrigger value="submissions">Submission Saya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tugas Sektor {user.sektor} : {SECTOR_NAME[user.sektor as number] ?? `Sektor ${user.sektor}`}
              </CardTitle>
              <CardDescription>
                Daftar tugas yang harus dikumpulkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => {
                  const taskStatus = getTaskStatus(task)
                  const submission = submissions.find(sub => sub.task_id === task.id)
                  
                  return (
                    <div key={task.id} className="border rounded-lg p-4 bg-gray-900/20 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTaskStatusIcon(taskStatus)}
                          <h3 className="font-semibold">{task.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Sektor {task.sector}
                          </Badge>
                          {getStatusBadge(taskStatus)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Deadline: {new Date(task.due_date).toLocaleDateString('id-ID')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {taskStatus === 'not_submitted' ? (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedTask(task)
                                setUploadDialog(true)
                              }}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload Tugas
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedTask(task)
                                setUploadDialog(true)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Lihat Detail
                            </Button>
                          )}
                        </div>
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
                <Upload className="h-5 w-5" />
                Submission Tugas Saya
              </CardTitle>
              <CardDescription>
                Riwayat pengumpulan tugas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 bg-gray-900/20 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{submission.tasks.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Sektor {submission.tasks.sector} • {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                    
                    {submission.submission_text && (
                      <div className="bg-gray-800 p-3 rounded mb-3">
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
                    
                    {/* nilai dan komentar disembunyikan untuk peserta */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Tugas</DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="submission-text">Deskripsi Tugas (Opsional)</Label>
              <Textarea
                id="submission-text"
                value={uploadForm.submission_text}
                onChange={(e) => setUploadForm({...uploadForm, submission_text: e.target.value})}
                placeholder="Tambahkan deskripsi atau catatan tentang tugas Anda"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="file-upload">Upload File Tugas (ZIP)</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload tugas dalam format ZIP. Maksimal 10MB.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Mengupload...' : 'Upload Tugas'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
