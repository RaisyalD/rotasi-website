'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, GraduationCap, Eye, Building2, UserCheck, Trash2, Edit, Plus, Star, AlertTriangle, FileText, Download } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface SectorData {
  sector_number: number
  sector_name: string
  participants: User[]
  mentors: User[]
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
  participant_name: string
  sector: number
  submission_text?: string
  file_url?: string
  file_name?: string
  submitted_at: string
  evaluation_score?: number
  evaluation_comment?: string
  status: 'submitted' | 'evaluated' | 'rejected'
  tasks: Task
  participants: User
}

export function AcaraDashboard() {
  const { user: currentUser } = useAuth()
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [evaluationDialog, setEvaluationDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)
  const [editTaskDialog, setEditTaskDialog] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [selectedSectorForEvaluation, setSelectedSectorForEvaluation] = useState<number | null>(null)

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: ''
  })

  const [evaluation, setEvaluation] = useState({
    score: '',
    comment: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // Fetch sectors data
      const sectorsResponse = await fetch('/api/sectors')
      const sectorsData = await sectorsResponse.json()
      
      if (sectorsData.success) {
        const sectorsWithData = await Promise.all(
          sectorsData.sectors.map(async (sector: any) => {
            const [participantsRes, mentorsRes] = await Promise.all([
              fetch(`/api/users?role=peserta&sektor=${sector.sector_number}`),
              fetch(`/api/users?role=mentor&sektor=${sector.sector_number}`)
            ])
            
            const participantsData = await participantsRes.json()
            const mentorsData = await mentorsRes.json()
            
            return {
              sector_number: sector.sector_number,
              sector_name: sector.sector_name,
              participants: participantsData.success ? participantsData.users : [],
              mentors: mentorsData.success ? mentorsData.users : []
            }
          })
        )
        
        setSectors(sectorsWithData)
      }

      // Fetch tasks
      const tasksResponse = await fetch('/api/tasks')
      const tasksData = await tasksResponse.json()
      
      if (tasksData.success) {
        setTasks(tasksData.tasks)
      }

      // Fetch submissions
      const submissionsResponse = await fetch('/api/submissions')
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

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.due_date) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Lengkapi data', description: 'Harap isi semua field' })
      return
    }

    if (!currentUser?.id) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'User tidak ditemukan' })
      return
    }

    try {
      // Create tasks for all sectors
      const createPromises = sectors.map(sector => 
        fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            sector: sector.sector_number,
            due_date: newTask.due_date,
            userId: currentUser.id
          })
        })
      )

      const responses = await Promise.all(createPromises)
      const results = await Promise.all(responses.map(res => res.json()))

      const successCount = results.filter(result => result.success).length
      
      if (successCount > 0) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: `Tugas berhasil dibuat untuk ${successCount} sektor` })
        setNewTask({ title: '', description: '', due_date: '' })
        fetchAllData()
      } else {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Gagal', description: 'Gagal membuat tugas' })
      }
    } catch (error) {
      console.error('Error creating task:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal membuat tugas' })
    }
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      due_date: task.due_date
    })
    setEditTaskDialog(true)
  }

  const handleUpdateTask = async () => {
    if (!selectedTask) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.due_date
        })
      })

      const data = await response.json()

      if (data.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: 'Tugas berhasil diupdate' })
        setEditTaskDialog(false)
        setSelectedTask(null)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error updating task:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal mengupdate tugas' })
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    setTaskToDelete(task || null)
    setDeleteConfirmDialog(true)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: 'Tugas berhasil dihapus' })
        setDeleteConfirmDialog(false)
        setTaskToDelete(null)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal menghapus tugas' })
    }
  }

  const handleEvaluateSubmission = async () => {
    if (!selectedSubmission || !evaluation.score || !evaluation.comment) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Lengkapi data', description: 'Harap isi nilai dan komentar' })
      return
    }

    if (!currentUser?.id) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'User tidak ditemukan' })
      return
    }

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          evaluation_score: parseInt(evaluation.score),
          evaluation_comment: evaluation.comment,
          userId: currentUser.id
        })
      })

      const data = await response.json()

      if (data.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: 'Evaluasi berhasil disimpan' })
        setEvaluationDialog(false)
        setSelectedSubmission(null)
        setEvaluation({ score: '', comment: '' })
        fetchAllData()
      }
    } catch (error) {
      console.error('Error evaluating submission:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal menyimpan evaluasi' })
    }
  }

  const getSectorSubmissions = (sectorNumber: number) => {
    return submissions.filter(sub => sub.sector === sectorNumber)
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sektor</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.length}</div>
            <p className="text-xs text-muted-foreground">
              sektor aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              tugas dibuat
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submission</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              tugas dikumpulkan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Dievaluasi</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
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

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Kelola Tugas</TabsTrigger>
          <TabsTrigger value="submissions">Semua Submission</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-6">
          {/* Create Task */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Buat Tugas Baru (Semua Sektor)
              </CardTitle>
              <CardDescription>
                Tugas akan dibuat untuk semua sektor secara otomatis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-title">Judul Tugas</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Masukkan judul tugas"
                  />
                </div>
                <div>
                  <Label htmlFor="task-due-date">Deadline</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="task-description">Deskripsi Tugas</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Masukkan deskripsi tugas"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Buat Tugas
              </Button>
            </CardContent>
          </Card>

          {/* Tasks List grouped by sector */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Tugas per Sektor</CardTitle>
              <CardDescription>Urut sektor 1 sampai 10</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(10)].map((_, idx) => {
                  const sectorNumber = idx + 1
                  const sectorTasks = tasks
                    .filter((t) => t.sector === sectorNumber)
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                  if (sectorTasks.length === 0) return null
                  return (
                    <div key={sectorNumber} className="space-y-3">
                      <h3 className="text-lg font-semibold">Sektor {sectorNumber} : {SECTOR_NAME[sectorNumber] ?? `Sektor ${sectorNumber}`}</h3>
                      <div className="space-y-3">
                        {sectorTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex-1">
                              <h3 className="font-semibold">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">Sektor {task.sector}</Badge>
                                <Badge variant="secondary">Deadline: {new Date(task.due_date).toLocaleDateString('id-ID')}</Badge>
                                <Badge variant={task.status === 'active' ? 'default' : 'secondary'}>
                                  {task.status === 'active' ? 'Aktif' : 'Selesai'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditTask(task)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-3 w-3 mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Tugas Terstruktur per Sektor</CardTitle>
              <CardDescription>Urut sektor 1 sampai 10</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(10)].map((_, idx) => {
                  const sectorNumber = idx + 1
                  const sectorSubs = submissions
                    .filter((s) => s.tasks.sector === sectorNumber)
                    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                  return (
                    <div key={sectorNumber} className="space-y-3">
                      <h3 className="text-lg font-semibold">Sektor {sectorNumber}</h3>
                      {sectorSubs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada submission</p>
                      ) : (
                        <div className="space-y-3">
                          {sectorSubs.map((submission) => (
                            <div key={submission.id} className="border rounded-lg p-4 bg-gray-900/20 dark:bg-gray-800">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold">{submission.participants.nama_lengkap}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {submission.tasks.title} • {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={submission.status === 'submitted' ? 'secondary' : submission.status === 'evaluated' ? 'default' : 'destructive'}>
                                    {submission.status === 'submitted' ? 'Pending' : submission.status === 'evaluated' ? 'Approved' : 'Rejected'}
                                  </Badge>
                                </div>
                              </div>
                              {submission.file_url && (
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{submission.file_name}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer">Download</a>
                                  </Button>
                                  <Button size="sm" onClick={async () => {
                                    const res = await fetch(`/api/submissions/${submission.id}/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: true, userId: currentUser?.id }) })
                                    if (res.ok) {
                                      // @ts-ignore
                                      const { toast } = await import('@/hooks/use-toast')
                                      toast({ title: 'Berhasil', description: 'Submission disetujui' })
                                      fetchAllData()
                                    }
                                  }}>Approve</Button>
                                  <Button size="sm" variant="destructive" onClick={async () => {
                                    const res = await fetch(`/api/submissions/${submission.id}/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: false, userId: currentUser?.id }) })
                                    if (res.ok) {
                                      // @ts-ignore
                                      const { toast } = await import('@/hooks/use-toast')
                                      toast({ title: 'Berhasil', description: 'Submission ditolak' })
                                      fetchAllData()
                                    }
                                  }}>Reject</Button>
                                </div>
                              )}
                              {submission.submission_text && (
                                <div className="bg-gray-800 p-3 rounded mb-3">
                                  <p className="text-sm">{submission.submission_text}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card key={sector.sector_number} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{sector.sector_name}</CardTitle>
                  <CardDescription>
                    Sektor {sector.sector_number}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Peserta:</span>
                    <Badge variant="outline">{sector.participants.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mentor:</span>
                    <Badge variant="outline">{sector.mentors.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <Badge variant="default">
                      {sector.participants.length + sector.mentors.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Evaluation Dialog */}
      <Dialog open={evaluationDialog} onOpenChange={setEvaluationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evaluasi Tugas</DialogTitle>
            <DialogDescription>
              Berikan nilai dan komentar untuk submission ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="evaluation-score">Nilai (0-100)</Label>
              <Input
                id="evaluation-score"
                type="number"
                min="0"
                max="100"
                value={evaluation.score}
                onChange={(e) => setEvaluation({...evaluation, score: e.target.value})}
                placeholder="Masukkan nilai"
              />
            </div>
            <div>
              <Label htmlFor="evaluation-comment">Komentar</Label>
              <Textarea
                id="evaluation-comment"
                value={evaluation.comment}
                onChange={(e) => setEvaluation({...evaluation, comment: e.target.value})}
                placeholder="Masukkan komentar evaluasi"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEvaluationDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleEvaluateSubmission}>
                Simpan Evaluasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskDialog} onOpenChange={setEditTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription>
              Edit informasi tugas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Judul Tugas</Label>
              <Input
                id="edit-task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Masukkan judul tugas"
              />
            </div>
            <div>
              <Label htmlFor="edit-task-description">Deskripsi Tugas</Label>
              <Textarea
                id="edit-task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Masukkan deskripsi tugas"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-task-due-date">Deadline</Label>
              <Input
                id="edit-task-due-date"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditTaskDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdateTask}>
                Update Tugas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus tugas "{taskToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Hapus Tugas
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
