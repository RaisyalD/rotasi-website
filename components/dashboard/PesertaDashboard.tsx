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
import { Progress } from '@/components/ui/progress'
import { Calendar, GraduationCap, Upload, FileText, Eye, Download, AlertTriangle, Edit, FileIcon, X } from 'lucide-react'
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
  const [mentor, setMentor] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingSubmission, setEditingSubmission] = useState<TaskSubmission | null>(null)
  const [uploadForm, setUploadForm] = useState({
    submission_text: '',
    file: null as File | null
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetchData()
    
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
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

      // Fetch mentor for user's sector
      const mentorResponse = await fetch(`/api/mentor?sektor=${user.sektor}`)
      const mentorData = await mentorResponse.json()
      
      console.log('Mentor API Response:', mentorData) // Debug log
      
      if (mentorData.success && mentorData.mentors.length > 0) {
        console.log('Setting mentor:', mentorData.mentors[0]) // Debug log
        setMentor(mentorData.mentors[0]) // Take the first mentor if multiple
      } else {
        console.log('No mentor found for sector:', user.sektor) // Debug log
        setMentor(null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setUploadForm({ ...uploadForm, file })
      }
    }
  }

  const validateFile = (file: File): boolean => {
    // Validate file type
    const isZip = file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
    if (!isZip) {
      alert('Hanya file .zip yang diperbolehkan')
      return false
    }

    // Validate file size (10MB)
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      alert('Ukuran file maksimal 10MB')
      return false
    }

    return true
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (validateFile(file)) {
        setUploadForm({ ...uploadForm, file })
      }
    }
  }

  const removeFile = () => {
    setUploadForm({ ...uploadForm, file: null })
  }

  const handleUpload = async () => {
    if (!selectedTask || (!uploadForm.file && !editingSubmission)) {
      alert('Harap upload file tugas dalam format ZIP')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      let fileUrl = ''
      let fileName = ''

      // Upload file if exists
      if (uploadForm.file) {
        const formData = new FormData()
        formData.append('file', uploadForm.file)
        formData.append('folder', 'task-submissions')
        formData.append('task_id', selectedTask.id)

        // Use XMLHttpRequest to track upload progress
        const uploadPromise = new Promise<{fileUrl: string, fileName: string}>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 50) // File upload is 50% of total progress
              setUploadProgress(percentComplete)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText)
                if (response.success) {
                  setUploadProgress(50) // File upload complete
                  resolve({
                    fileUrl: response.fileUrl,
                    fileName: response.fileName
                  })
                } else {
                  reject(new Error(response.error || 'Upload failed'))
                }
              } catch (error) {
                reject(new Error('Invalid response from server'))
              }
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`))
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'))
          })

          xhr.open('POST', '/api/upload')
          xhr.send(formData)
        })

        const uploadData = await uploadPromise
        fileUrl = uploadData.fileUrl
        fileName = uploadData.fileName
      } else if (editingSubmission) {
        // Keep existing file if no new file uploaded
        fileUrl = editingSubmission.file_url || ''
        fileName = editingSubmission.file_name || ''
        setUploadProgress(50) // Skip file upload progress
      }

      // Create or update submission
      const isEditing = editingSubmission !== null
      setUploadProgress(75) // Database operation in progress
      
      const submissionResponse = await fetch('/api/submissions' + (isEditing ? `/${editingSubmission.id}` : ''), {
        method: isEditing ? 'PUT' : 'POST',
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
        setUploadProgress(100) // Complete
        const { toast } = await import('@/hooks/use-toast')
        toast({ 
          title: 'Berhasil', 
          description: isEditing ? 'Tugas berhasil diupdate' : 'Tugas berhasil diupload' 
        })
        
        // Small delay to show 100% progress
        setTimeout(() => {
          setUploadDialog(false)
          setUploadForm({ submission_text: '', file: null })
          setSelectedTask(null)
          setEditingSubmission(null)
          setUploadProgress(0)
          fetchData() // Refresh data
        }, 500)
      }
    } catch (error) {
      console.error('Upload error:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal mengupload tugas' })
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
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
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  const isSubmissionLate = (task: Task, submittedAt: string) => {
    try {
      const submitted = new Date(submittedAt)
      const deadline = new Date(task.due_date)
      // treat deadline as end of day local time
      deadline.setHours(23, 59, 59, 999)
      return submitted.getTime() > deadline.getTime()
    } catch {
      return false
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
            <CardTitle className="text-sm font-medium">Mentor Sektor</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {mentor ? mentor.nama_lengkap : 'Belum ditentukan'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sektor {user.sektor}
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
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Deadline: {new Date(task.due_date).toLocaleDateString('id-ID')}</span>
                          {(() => {
                            const now = new Date()
                            const deadline = new Date(task.due_date)
                            deadline.setHours(23, 59, 59, 999)
                            if (now.getTime() > deadline.getTime()) {
                              return (
                                <Badge variant="destructive">Melewati deadline</Badge>
                              )
                            }
                            return null
                          })()}
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
                                const existingSubmission = submissions.find(sub => sub.task_id === task.id)
                                setSelectedTask(task)
                                setEditingSubmission(existingSubmission || null)
                                setUploadForm({
                                  submission_text: existingSubmission?.submission_text || '',
                                  file: null
                                })
                                setUploadDialog(true)
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Tugas
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
                        {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                          <Badge variant="destructive">Terlambat</Badge>
                        )}
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
      <Dialog open={uploadDialog} onOpenChange={(open) => {
        setUploadDialog(open)
        if (!open) {
          setEditingSubmission(null)
          setUploadForm({ submission_text: '', file: null })
          setUploadProgress(0)
        }
      }}>
        <DialogContent className="max-w-md max-h-[90vh] mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>{editingSubmission ? 'Edit Tugas' : 'Upload Tugas'}</DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
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
              
              {/* Drag and Drop Area - Hidden on Mobile */}
              {!isMobile && (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : uploadForm.file
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                {uploadForm.file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <FileIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          {uploadForm.file.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      File siap diupload. Klik "Upload Tugas" untuk melanjutkan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isDragOver ? 'Lepas file di sini' : 'Drag & drop file ZIP atau klik untuk memilih'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: ZIP • Maksimal: 10MB
                      </p>
                    </div>
                  </div>
                )}
                </div>
              )}

              {/* Mobile File Preview - Only show when file is selected on mobile */}
              {isMobile && uploadForm.file && (
                <div className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FileIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {uploadForm.file.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    File siap diupload. Klik "Upload Tugas" untuk melanjutkan.
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <Input
                id="file-upload"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Choose file button */}
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full min-h-[44px]"
                >
                  <FileIcon className="h-4 w-4 mr-2" />
                  {uploadForm.file ? 'Pilih File Lain' : 'Pilih File'}
                </Button>
                {isMobile && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Format: ZIP • Maksimal: 10MB
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress Upload</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  {uploadProgress < 50 ? 'Mengupload file...' : 
                   uploadProgress < 75 ? 'File berhasil diupload' :
                   uploadProgress < 100 ? 'Menyimpan data...' : 'Selesai!'}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setUploadDialog(false)}
                className="w-full sm:w-auto min-h-[44px]"
              >
                Batal
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full sm:w-auto min-h-[44px]"
              >
                {isUploading ? (editingSubmission ? 'Mengupdate...' : 'Mengupload...') : (editingSubmission ? 'Update Tugas' : 'Upload Tugas')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
