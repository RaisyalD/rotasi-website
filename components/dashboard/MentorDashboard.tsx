'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, GraduationCap, Eye, FileText, Download, AlertTriangle, Calendar, Clock, DownloadCloud, Archive, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
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
  task_type: 'individu' | 'per_sektor' | 'angkatan'
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

  // Bulk download states
  const [bulkDownloadDialog, setBulkDownloadDialog] = useState(false)
  const [downloadTaskSelectionDialog, setDownloadTaskSelectionDialog] = useState(false)
  const [selectedDownloadTaskIds, setSelectedDownloadTaskIds] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Expandable description states
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

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

  const toggleDescription = (taskId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const dateStr = date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })
      const timeStr = date.toLocaleTimeString('id-ID', { 
        timeZone: 'Asia/Jakarta',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      return `${dateStr} ${timeStr}`
    } catch {
      return dateString
    }
  }

  const isSubmissionLate = (task: Task, submittedAt: string) => {
    try {
      const submitted = new Date(submittedAt)
      const deadline = new Date(task.due_date)
      return submitted.getTime() > deadline.getTime()
    } catch {
      return false
    }
  }

  const getTaskTypeDisplay = (taskType: string) => {
    switch (taskType) {
      case 'individu':
        return 'Individu'
      case 'per_sektor':
        return 'Per Sektor'
      case 'angkatan':
        return 'Angkatan'
      default:
        return 'Individu'
    }
  }

  const getTaskTypeBadgeStyle = (taskType: string) => {
    switch (taskType) {
      case 'individu':
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700' // Hijau
      case 'per_sektor':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' // Kuning
      case 'angkatan':
        return 'bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-600 dark:text-white dark:border-blue-500' // Biru
      default:
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
    }
  }


  const getMenteeSubmissions = (menteeId: string) => {
    return submissions.filter(sub => sub.participant_id === menteeId)
  }

  // Bulk download functions
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
      throw error
    }
  }

  const downloadAllSubmissions = async () => {
    setIsDownloading(true)
    const { toast } = await import('@/hooks/use-toast')
    
    try {
      const submissionsWithFiles = submissions.filter(sub => sub.file_url)
      
      if (submissionsWithFiles.length === 0) {
        toast({ 
          title: 'Info', 
          description: 'Tidak ada file submission yang dapat didownload' 
        })
        return
      }

      let successCount = 0
      let errorCount = 0

      // Download files one by one with delay to avoid overwhelming the browser
      for (let i = 0; i < submissionsWithFiles.length; i++) {
        const submission = submissionsWithFiles[i]
        try {
          const sanitizedFileName = `${submission.tasks.title.replace(/[^a-zA-Z0-9]/g, '_')}_${submission.participants.nama_lengkap.replace(/[^a-zA-Z0-9]/g, '_')}_${submission.file_name}`
          await downloadFile(submission.file_url!, sanitizedFileName)
          successCount++
          
          // Add small delay between downloads
          if (i < submissionsWithFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (error) {
          console.error(`Error downloading ${submission.file_name}:`, error)
          errorCount++
        }
      }

      toast({ 
        title: 'Download Selesai', 
        description: `${successCount} file berhasil didownload${errorCount > 0 ? `, ${errorCount} file gagal` : ''}` 
      })
    } catch (error) {
      console.error('Error in bulk download:', error)
      toast({ title: 'Error', description: 'Terjadi kesalahan saat download' })
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadSelectedTaskSubmissions = async () => {
    if (selectedDownloadTaskIds.length === 0) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Tidak ada tugas yang dipilih' })
      return
    }

    setIsDownloading(true)
    const { toast } = await import('@/hooks/use-toast')
    
    try {
      const submissionsWithFiles = submissions.filter(sub => 
        sub.file_url && selectedDownloadTaskIds.includes(sub.task_id)
      )
      
      if (submissionsWithFiles.length === 0) {
        toast({ 
          title: 'Info', 
          description: 'Tidak ada file submission untuk tugas yang dipilih' 
        })
        return
      }

      let successCount = 0
      let errorCount = 0

      // Download files one by one with delay
      for (let i = 0; i < submissionsWithFiles.length; i++) {
        const submission = submissionsWithFiles[i]
        try {
          const sanitizedFileName = `${submission.tasks.title.replace(/[^a-zA-Z0-9]/g, '_')}_${submission.participants.nama_lengkap.replace(/[^a-zA-Z0-9]/g, '_')}_${submission.file_name}`
          await downloadFile(submission.file_url!, sanitizedFileName)
          successCount++
          
          // Add small delay between downloads
          if (i < submissionsWithFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (error) {
          console.error(`Error downloading ${submission.file_name}:`, error)
          errorCount++
        }
      }

      toast({ 
        title: 'Download Selesai', 
        description: `${successCount} file berhasil didownload${errorCount > 0 ? `, ${errorCount} file gagal` : ''}` 
      })
      
      // Close dialogs
      setDownloadTaskSelectionDialog(false)
      setSelectedDownloadTaskIds([])
    } catch (error) {
      console.error('Error in selected task download:', error)
      toast({ title: 'Error', description: 'Terjadi kesalahan saat download' })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadTaskSelection = (taskId: string) => {
    setSelectedDownloadTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAllDownloadTasks = () => {
    if (selectedDownloadTaskIds.length === tasks.length) {
      setSelectedDownloadTaskIds([])
    } else {
      setSelectedDownloadTaskIds(tasks.map(task => task.id))
    }
  }

  const handleBulkDownload = (type: 'all' | 'select-tasks') => {
    if (type === 'select-tasks') {
      setSelectedDownloadTaskIds([])
      setDownloadTaskSelectionDialog(true)
    } else {
      setBulkDownloadDialog(true)
    }
  }

  const isTaskOverdue = (task: Task) => {
    try {
      const now = new Date()
      const deadline = new Date(task.due_date)
      return now.getTime() > deadline.getTime()
    } catch {
      return false
    }
  }

  const getTaskSubmissionCount = (taskId: string) => {
    return submissions.filter(sub => sub.task_id === taskId).length
  }

  const getTaskSubmissionStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return { total: 0, submitted: 0, pending: 0 }

    const taskSubmissions = submissions.filter(sub => sub.task_id === taskId)
    const submittedSubmissions = taskSubmissions.filter(sub => sub.status === 'submitted' || sub.status === 'evaluated')

    switch (task.task_type) {
      case 'individu':
        // Progress per mentee individual
        return {
          total: mentees.length,
          submitted: submittedSubmissions.length,
          pending: mentees.length - submittedSubmissions.length
        }
      
      case 'per_sektor':
        // Progress per sektor - 1 submission dari sektor tersebut = 100% untuk sektor itu
        const sectorMentees = mentees.filter(mentee => mentee.sektor === task.sector)
        const hasSectorSubmission = submittedSubmissions.some(sub => {
          const mentee = mentees.find(m => m.id === sub.participant_id)
          return mentee && mentee.sektor === task.sector
        })
        return {
          total: 1, // 1 sektor
          submitted: hasSectorSubmission ? 1 : 0,
          pending: hasSectorSubmission ? 0 : 1
        }
      
      case 'angkatan':
        // Progress per angkatan - 1 submission dari semua sektor = 100%
        const hasAngkatanSubmission = submittedSubmissions.length > 0
        return {
          total: 1, // 1 angkatan
          submitted: hasAngkatanSubmission ? 1 : 0,
          pending: hasAngkatanSubmission ? 0 : 1
        }
      
      default:
        return {
          total: mentees.length,
          submitted: submittedSubmissions.length,
          pending: mentees.length - submittedSubmissions.length
        }
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
                              <Badge className={getTaskTypeBadgeStyle(task.task_type)}>{getTaskTypeDisplay(task.task_type)}</Badge>
                            </div>
                            <div className="mb-3">
                              {task.description.length > 100 ? (
                                <div>
                                  <p className={`text-sm text-muted-foreground whitespace-pre-wrap ${!expandedDescriptions.has(task.id) ? 'line-clamp-3' : ''}`}>
                                    {task.description}
                                  </p>
                                  <button
                                    onClick={() => toggleDescription(task.id)}
                                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1 transition-colors"
                                  >
                                    {expandedDescriptions.has(task.id) ? (
                                      <>
                                        <ChevronUp className="h-3 w-3" />
                                        Tampilkan Lebih Sedikit
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-3 w-3" />
                                        Tampilkan Lebih Banyak
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Deadline: {formatDateTime(task.due_date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Progress: {submissionStatus.submitted}/{submissionStatus.total} {task.task_type === 'individu' ? 'mentee' : task.task_type === 'per_sektor' ? 'sektor' : 'angkatan'}
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
                            <span>
                              {task.task_type === 'individu' 
                                ? `${submissionStatus.submitted}/${submissionStatus.total} mentee`
                                : task.task_type === 'per_sektor'
                                ? `${submissionStatus.submitted}/${submissionStatus.total} sektor`
                                : `${submissionStatus.submitted}/${submissionStatus.total} angkatan`
                              }
                            </span>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{mentee.nama_lengkap}</h3>
                          <p className="text-sm text-muted-foreground">
                            NIM: {mentee.nim} • Email: {mentee.email}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {menteeSubmissions.length} submission
                        </Badge>
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
              <div className="space-y-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Submission Tugas Sektor {user.sektor} : {SECTOR_NAME[user.sektor as number] ?? `Sektor ${user.sektor}`}
                  </CardTitle>
                  <CardDescription>
                    Lihat semua submission tugas dari mentee • Total: {submissions.length} submission
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkDownload('all')}
                    disabled={submissions.length === 0 || isDownloading}
                    className="flex-shrink-0"
                  >
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download Semua</span>
                    <span className="sm:hidden">Download Semua</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkDownload('select-tasks')}
                    disabled={submissions.length === 0 || isDownloading}
                    className="flex-shrink-0"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download per Tugas</span>
                    <span className="sm:hidden">Download per Tugas</span>
                  </Button>
                </div>
              </div>
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
                  <div className="text-sm text-muted-foreground">
                    <span>{new Date(selectedTask.due_date).toLocaleDateString('id-ID')}</span>
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
                        <span>
                          {selectedTask.task_type === 'individu' 
                            ? 'Mentee yang sudah mengumpulkan'
                            : selectedTask.task_type === 'per_sektor'
                            ? 'Sektor yang sudah mengumpulkan'
                            : 'Angkatan yang sudah mengumpulkan'
                          }
                        </span>
                        <span>{submissionStatus.submitted}/{submissionStatus.total}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(submissionStatus.submitted / submissionStatus.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Belum dikumpulkan: {submissionStatus.pending} {selectedTask.task_type === 'individu' ? 'mentee' : selectedTask.task_type === 'per_sektor' ? 'sektor' : 'angkatan'}
                        </span>
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
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-medium">{submission.participants.nama_lengkap}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                            <Badge variant="destructive">
                              <Clock className="h-3 w-3 mr-1" />
                              Terlambat
                            </Badge>
                          )}
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

      {/* Bulk Download Confirmation Dialog */}
      <Dialog open={bulkDownloadDialog} onOpenChange={setBulkDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Download Semua Submission</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mendownload semua file submission dari sektor {user.sektor}? ({submissions.filter(sub => sub.file_url).length} file)
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setBulkDownloadDialog(false)}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              onClick={downloadAllSubmissions}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Download Semua
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Task Selection Dialog */}
      <Dialog open={downloadTaskSelectionDialog} onOpenChange={setDownloadTaskSelectionDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Pilih Tugas untuk Download</DialogTitle>
            <DialogDescription>
              Pilih tugas yang ingin didownload submission-nya dari sektor {user.sektor} ({tasks.length} tugas tersedia)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all-download"
                  checked={selectedDownloadTaskIds.length === tasks.length && tasks.length > 0}
                  onChange={handleSelectAllDownloadTasks}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="select-all-download" className="font-medium">
                  Pilih Semua ({selectedDownloadTaskIds.length}/{tasks.length})
                </label>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks
                .sort((a, b) => a.sector - b.sector)
                .map((task) => {
                const taskSubmissions = submissions.filter(sub => sub.task_id === task.id && sub.file_url)
                return (
                  <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="checkbox"
                      id={`download-task-${task.id}`}
                      checked={selectedDownloadTaskIds.includes(task.id)}
                      onChange={() => handleDownloadTaskSelection(task.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor={`download-task-${task.id}`} className="block cursor-pointer">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Sektor {task.sector} • {taskSubmissions.length} file submission
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {task.description.length > 100 ? (
                            <div>
                              <p className={`${!expandedDescriptions.has(task.id) ? 'line-clamp-2' : ''}`}>
                                {task.description}
                              </p>
                              <button
                                onClick={() => toggleDescription(task.id)}
                                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1 transition-colors"
                              >
                                {expandedDescriptions.has(task.id) ? (
                                  <>
                                    <ChevronUp className="h-3 w-3" />
                                    Tampilkan Lebih Sedikit
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3" />
                                    Tampilkan Lebih Banyak
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <p className="line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              {selectedDownloadTaskIds.length} tugas dipilih • {submissions.filter(sub => selectedDownloadTaskIds.includes(sub.task_id) && sub.file_url).length} file akan didownload
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setDownloadTaskSelectionDialog(false)}
                disabled={isDownloading}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                onClick={downloadSelectedTaskSubmissions}
                disabled={selectedDownloadTaskIds.length === 0 || isDownloading}
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download {selectedDownloadTaskIds.length} Tugas</span>
                    <span className="sm:hidden">Download {selectedDownloadTaskIds.length}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
