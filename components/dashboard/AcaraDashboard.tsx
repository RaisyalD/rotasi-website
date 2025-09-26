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
import { Users, GraduationCap, Eye, Building2, UserCheck, Trash2, Edit, Plus, AlertTriangle, FileText, Download, RefreshCw, DownloadCloud, Archive, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { safeFetch } from '@/lib/webview-utils'

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
  task_type: 'individu' | 'per_sektor' | 'angkatan'
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
  const [editTaskDialog, setEditTaskDialog] = useState(false)
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false)
  const [bulkDeleteType, setBulkDeleteType] = useState<'all' | 'select-tasks' | null>(null)
  const [taskSelectionDialog, setTaskSelectionDialog] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  
  // Bulk edit states
  const [bulkEditDialog, setBulkEditDialog] = useState(false)
  const [bulkEditTaskIds, setBulkEditTaskIds] = useState<string[]>([])
  const [bulkEditData, setBulkEditData] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '23:59',
    task_type: 'individu' as 'individu' | 'per_sektor' | 'angkatan'
  })

  // Bulk download states
  const [bulkDownloadDialog, setBulkDownloadDialog] = useState(false)
  const [downloadTaskSelectionDialog, setDownloadTaskSelectionDialog] = useState(false)
  const [selectedDownloadTaskIds, setSelectedDownloadTaskIds] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '23:59',
    task_type: 'individu' as 'individu' | 'per_sektor' | 'angkatan'
  })
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isDeletingTasks, setIsDeletingTasks] = useState(false)
  
  // Time picker states
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [timePickerType, setTimePickerType] = useState<'create' | 'edit' | 'bulk-edit'>('create')
  
  // Expandable description states
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())
  const [expandedTaskDescriptions, setExpandedTaskDescriptions] = useState<Set<number>>(new Set())

  // Helper function to get unique tasks (one per title)
  const getUniqueTasks = () => {
    if (!tasks || tasks.length === 0) {
      return []
    }
    
    const uniqueTasks: Task[] = []
    const seenTitles = new Set<string>()
    
    tasks.forEach(task => {
      if (!seenTitles.has(task.title)) {
        seenTitles.add(task.title)
        uniqueTasks.push(task)
      }
    })
    
    return uniqueTasks
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      // Fetch sectors data
      try {
        const sectorsResponse = await safeFetch('/api/sectors')
        const sectorsData = await sectorsResponse.json()
        
        if (sectorsData.success) {
          const sectorsWithData = await Promise.all(
            sectorsData.sectors.map(async (sector: any) => {
              try {
                const [participantsRes, mentorsRes] = await Promise.all([
                  safeFetch(`/api/users?role=peserta&sektor=${sector.sector_number}`),
                  safeFetch(`/api/users?role=mentor&sektor=${sector.sector_number}`)
                ])
                
                const participantsData = await participantsRes.json()
                const mentorsData = await mentorsRes.json()
                
                return {
                  sector_number: sector.sector_number,
                  sector_name: sector.sector_name,
                  participants: participantsData.success ? participantsData.users : [],
                  mentors: mentorsData.success ? mentorsData.users : []
                }
              } catch (error) {
                console.error(`Error fetching data for sector ${sector.sector_number}:`, error)
                return {
                  sector_number: sector.sector_number,
                  sector_name: sector.sector_name,
                  participants: [],
                  mentors: []
                }
              }
            })
          )
          
          setSectors(sectorsWithData)
        }
      } catch (error) {
        console.error('Error fetching sectors data:', error)
        setSectors([])
      }

      // Fetch tasks
      try {
        const tasksResponse = await safeFetch('/api/tasks')
        const tasksData = await tasksResponse.json()
        
        if (tasksData.success) {
          setTasks(tasksData.tasks)
        } else {
          console.error('Failed to fetch tasks:', tasksData)
          setTasks([])
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setTasks([])
      }

      // Fetch submissions
      try {
        const submissionsResponse = await safeFetch('/api/submissions')
        const submissionsData = await submissionsResponse.json()
        
        if (submissionsData.success) {
          setSubmissions(submissionsData.submissions)
        } else {
          console.error('Failed to fetch submissions:', submissionsData)
          setSubmissions([])
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
        setSubmissions([])
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      // Show user-friendly error message
      const { toast } = await import('@/hooks/use-toast')
      toast({ 
        title: 'Error', 
        description: 'Gagal memuat data. Periksa koneksi internet Anda.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.due_date || !newTask.due_time) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Lengkapi data', description: 'Harap isi semua field' })
      return
    }

    if (!currentUser?.id) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'User tidak ditemukan' })
      return
    }

    setIsCreatingTask(true)

    try {
      console.log('Creating task with data:', {
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date,
        due_time: newTask.due_time,
        userId: currentUser.id
      })
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
            due_date: `${newTask.due_date}T${newTask.due_time}:00+07:00`,
            task_type: newTask.task_type,
            userId: currentUser.id
          })
        })
      )

      const responses = await Promise.all(createPromises)
      const results = await Promise.all(responses.map(res => res.json()))

      const successCount = results.filter(result => result.success).length
      const failedResults = results.filter(result => !result.success)
      
      console.log('Task creation results:', results)
      
      if (successCount > 0) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Berhasil', description: `Tugas berhasil dibuat untuk ${successCount} sektor` })
        setNewTask({ title: '', description: '', due_date: '', due_time: '23:59', task_type: 'individu' })
        fetchAllData()
      } else {
        const { toast } = await import('@/hooks/use-toast')
        const errorMessage = failedResults.length > 0 ? failedResults[0].error || failedResults[0].details || 'Gagal membuat tugas' : 'Gagal membuat tugas'
        toast({ 
          title: 'Gagal', 
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error creating task:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal membuat tugas' })
    } finally {
      setIsCreatingTask(false)
    }
  }


  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    const taskDate = new Date(task.due_date)
    const dateStr = taskDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) // YYYY-MM-DD format
    const timeStr = taskDate.toLocaleTimeString('en-US', { 
      timeZone: 'Asia/Jakarta',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    setNewTask({
      title: task.title,
      description: task.description,
      due_date: dateStr,
      due_time: timeStr,
      task_type: task.task_type
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
          due_date: `${newTask.due_date}T${newTask.due_time}:00+07:00`,
          task_type: newTask.task_type
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


  const handleBulkDelete = (type: 'all' | 'select-tasks') => {
    console.log('handleBulkDelete called with type:', type)
    console.log('Current tasks count:', tasks.length)
    
    if (type === 'select-tasks') {
      setSelectedTaskIds([])
      setTaskSelectionDialog(true)
    } else {
      setBulkDeleteType(type)
      setBulkDeleteDialog(true)
    }
  }

  const confirmBulkDelete = async () => {
    console.log('confirmBulkDelete called with bulkDeleteType:', bulkDeleteType)
    if (!bulkDeleteType) return

    setIsDeletingTasks(true)

    try {
      let response
      if (bulkDeleteType === 'all') {
        // Delete all tasks
        console.log('Deleting all tasks...')
        response = await fetch('/api/tasks/bulk-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ deleteAll: true })
        })
      } else {
        // Delete selected tasks
        console.log('Deleting selected tasks:', selectedTaskIds)
        if (selectedTaskIds.length === 0) {
          const { toast } = await import('@/hooks/use-toast')
          toast({ 
            title: 'Gagal', 
            description: 'Tidak ada tugas yang dipilih' 
          })
          return
        }

        // Get all task IDs that have the same title as the selected unique tasks
        const selectedUniqueTasks = getUniqueTasks().filter(task => selectedTaskIds.includes(task.id))
        const allTaskIdsToDelete: string[] = []
        
        selectedUniqueTasks.forEach(uniqueTask => {
          const tasksWithSameTitle = tasks.filter(task => task.title === uniqueTask.title)
          allTaskIdsToDelete.push(...tasksWithSameTitle.map(task => task.id))
        })

        response = await fetch('/api/tasks/bulk-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskIds: allTaskIdsToDelete })
        })
      }

      const data = await response.json()
      console.log('Bulk delete response:', data)

      if (data.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ 
          title: 'Berhasil', 
          description: bulkDeleteType === 'all' 
            ? 'Semua tugas berhasil dihapus' 
            : `${selectedTaskIds.length} tugas berhasil dihapus` 
        })
        setBulkDeleteDialog(false)
        setTaskSelectionDialog(false)
        setBulkDeleteType(null)
        setSelectedTaskIds([])
        // Refresh data to update task count
        await fetchAllData()
      } else {
        const { toast } = await import('@/hooks/use-toast')
        toast({ 
          title: 'Gagal', 
          description: data.error || 'Gagal menghapus tugas' 
        })
      }
    } catch (error) {
      console.error('Error bulk deleting tasks:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal menghapus tugas' })
    } finally {
      setIsDeletingTasks(false)
    }
  }

  const handleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAllTasks = () => {
    const uniqueTasks = getUniqueTasks()
    if (selectedTaskIds.length === uniqueTasks.length) {
      setSelectedTaskIds([])
    } else {
      setSelectedTaskIds(uniqueTasks.map(task => task.id))
    }
  }

  const confirmSelectedTasksDelete = () => {
    if (selectedTaskIds.length === 0) return
    setBulkDeleteType('select-tasks')
    setTaskSelectionDialog(false)
    setBulkDeleteDialog(true)
  }

  // Bulk edit functions
  const handleBulkEdit = () => {
    setBulkEditTaskIds([])
    setBulkEditData({
      title: '',
      description: '',
      due_date: '',
      due_time: '23:59',
      task_type: 'individu'
    })
    setBulkEditDialog(true)
  }

  const handleBulkEditTaskSelection = (taskId: string) => {
    setBulkEditTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAllBulkEditTasks = () => {
    const uniqueTasks = getUniqueTasks()
    if (bulkEditTaskIds.length === uniqueTasks.length) {
      setBulkEditTaskIds([])
    } else {
      setBulkEditTaskIds(uniqueTasks.map(task => task.id))
    }
  }

  const handleBulkUpdate = async () => {
    if (bulkEditTaskIds.length === 0) {
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Tidak ada tugas yang dipilih' })
      return
    }

    try {
      // Get all task IDs that have the same title as the selected unique tasks
      const selectedUniqueTasks = getUniqueTasks().filter(task => bulkEditTaskIds.includes(task.id))
      const allTaskIdsToUpdate: string[] = []
      
      selectedUniqueTasks.forEach(uniqueTask => {
        const tasksWithSameTitle = tasks.filter(task => task.title === uniqueTask.title)
        allTaskIdsToUpdate.push(...tasksWithSameTitle.map(task => task.id))
      })

      const response = await fetch('/api/tasks/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskIds: allTaskIdsToUpdate,
          updateData: {
            ...bulkEditData,
            due_date: bulkEditData.due_date ? `${bulkEditData.due_date}T${bulkEditData.due_time}:00+07:00` : bulkEditData.due_date
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        const { toast } = await import('@/hooks/use-toast')
        toast({ 
          title: 'Berhasil', 
          description: `${bulkEditTaskIds.length} tugas berhasil diupdate` 
        })
        setBulkEditDialog(false)
        setBulkEditTaskIds([])
        setBulkEditData({
          title: '',
          description: '',
          due_date: '',
          due_time: '23:59',
      task_type: 'individu'
        })
        fetchAllData()
      } else {
        const { toast } = await import('@/hooks/use-toast')
        toast({ title: 'Gagal', description: data.error || 'Gagal mengupdate tugas' })
      }
    } catch (error) {
      console.error('Error bulk updating tasks:', error)
      const { toast } = await import('@/hooks/use-toast')
      toast({ title: 'Gagal', description: 'Gagal mengupdate tugas' })
    }
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

  const openTimePicker = (type: 'create' | 'edit' | 'bulk-edit') => {
    setTimePickerType(type)
    setTimePickerOpen(true)
  }

  const handleTimeSelect = (time: string) => {
    if (timePickerType === 'create') {
      setNewTask({...newTask, due_time: time})
    } else if (timePickerType === 'edit') {
      setNewTask({...newTask, due_time: time})
    } else if (timePickerType === 'bulk-edit') {
      setBulkEditData({...bulkEditData, due_time: time})
    }
    // Don't close dialog automatically
  }

  const handleTimePickerConfirm = () => {
    setTimePickerOpen(false)
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

  const toggleTaskDescription = (taskIndex: number) => {
    setExpandedTaskDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskIndex)) {
        newSet.delete(taskIndex)
      } else {
        newSet.add(taskIndex)
      }
      return newSet
    })
  }


  const getSectorSubmissions = (sectorNumber: number) => {
    return submissions.filter(sub => sub.sector === sectorNumber)
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Memuat data...</p>
      </div>
    )
  }

  // Error state - show if no data and not loading
  if (!isLoading && sectors.length === 0 && tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Tidak dapat memuat data</h3>
        <p className="text-muted-foreground mb-4">
          Terjadi masalah saat memuat data. Silakan coba lagi.
        </p>
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="text-2xl font-bold">{new Set(tasks.map(task => task.title)).size}</div>
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="task-due-date">Deadline Tanggal</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-due-time">Deadline Jam</Label>
                    <div className="relative">
                      <Input
                        id="task-due-time"
                        type="time"
                        value={newTask.due_time || '23:59'}
                        onChange={(e) => setNewTask({...newTask, due_time: e.target.value})}
                        step="60"
                        className="pr-10"
                      />
                      <Clock 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                        onClick={() => openTimePicker('create')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="task-type">Jenis Tugas</Label>
                <Select
                  value={newTask.task_type}
                  onValueChange={(value: 'individu' | 'per_sektor' | 'angkatan') => 
                    setNewTask({...newTask, task_type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tugas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individu">Individu</SelectItem>
                    <SelectItem value="per_sektor">Per Sektor</SelectItem>
                    <SelectItem value="angkatan">Angkatan</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button 
                onClick={handleCreateTask} 
                className="w-full"
                disabled={isCreatingTask}
              >
                {isCreatingTask ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Membuat Tugas...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Tugas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tasks List grouped by sector */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle>Daftar Tugas per Sektor</CardTitle>
                  <CardDescription>Urut sektor 1 sampai 10 • Total: {tasks.length} tugas</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={handleBulkEdit}
                    disabled={tasks.length === 0}
                    className="flex-shrink-0"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Edit Tugas</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      console.log('Hapus Semua button clicked')
                      handleBulkDelete('all')
                    }}
                    disabled={tasks.length === 0}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Hapus Semua Tugas</span>
                    <span className="sm:hidden">Hapus Semua</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      console.log('Hapus Tugas button clicked')
                      handleBulkDelete('select-tasks')
                    }}
                    disabled={tasks.length === 0}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Hapus Tugas</span>
                    <span className="sm:hidden">Hapus</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  // Group tasks by title and due_date to avoid duplicates
                  const groupedTasks = tasks.reduce((acc, task) => {
                    const key = `${task.title}-${task.due_date}`
                    if (!acc[key]) {
                      acc[key] = {
                        title: task.title,
                        description: task.description,
                        due_date: task.due_date,
                        task_type: task.task_type,
                        sectors: new Set<number>()
                      }
                    }
                    acc[key].sectors.add(task.sector)
                    return acc
                  }, {} as Record<string, { title: string; description: string; due_date: string; task_type: string; sectors: Set<number> }>)

                  // Convert to array and sort by due_date
                  const uniqueTasks = Object.values(groupedTasks)
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

                  return uniqueTasks.map((task, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <div>
                                {task.description.length > 100 ? (
                                  <div>
                              <p className={`text-sm text-muted-foreground whitespace-pre-wrap break-words break-all ${!expandedTaskDescriptions.has(index) ? 'line-clamp-2' : ''}`}>
                                      {task.description}
                                    </p>
                                    <button
                                onClick={() => toggleTaskDescription(index)}
                                      className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1 transition-colors"
                                    >
                                {expandedTaskDescriptions.has(index) ? (
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
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words break-all">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                                <Badge variant="secondary">Deadline: {formatDateTime(task.due_date)}</Badge>
                            <Badge className={getTaskTypeBadgeStyle(task.task_type || 'individu')}>{getTaskTypeDisplay(task.task_type || 'individu')}</Badge>
                              </div>
                          <p className="text-xs text-muted-foreground">
                            Tugas dibuat untuk sektor 1-10
                          </p>
                            </div>
                          </div>
                      </div>
                  ))
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle>Submission Tugas Terstruktur per Sektor</CardTitle>
                  <CardDescription>Urut sektor 1 sampai 10 • Total: {submissions.length} submission</CardDescription>
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
                            <div key={submission.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold">{submission.participants.nama_lengkap}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {submission.tasks.title} • {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                  </p>
                                  <div className="mt-1">
                                    <Badge className={getTaskTypeBadgeStyle(submission.tasks.task_type || 'individu')}>
                                      {getTaskTypeDisplay(submission.tasks.task_type || 'individu')}
                                    </Badge>
                                  </div>
                                  <div className="mt-1">
                                    {submission.tasks.description.length > 100 ? (
                                      <div>
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${!expandedDescriptions.has(submission.tasks.id) ? 'line-clamp-2' : ''}`}>
                                          {submission.tasks.description}
                                        </p>
                                        <button
                                          onClick={() => toggleDescription(submission.tasks.id)}
                                          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1 transition-colors"
                                        >
                                          {expandedDescriptions.has(submission.tasks.id) ? (
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
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {submission.tasks.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                                    <Badge variant="destructive">Terlambat</Badge>
                                  )}
                                </div>
                              </div>
                              {submission.file_url && (
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{submission.file_name}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer">Download</a>
                                  </Button>
                                </div>
                              )}
                              {submission.submission_text && (
                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{submission.submission_text}</p>
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-task-due-date">Deadline Tanggal</Label>
                <Input
                  id="edit-task-due-date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-task-due-time">Deadline Jam</Label>
                <div className="relative">
                  <Input
                    id="edit-task-due-time"
                    type="time"
                    value={newTask.due_time || '23:59'}
                    onChange={(e) => setNewTask({...newTask, due_time: e.target.value})}
                    step="60"
                    className="pr-10"
                  />
                  <Clock 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                    onClick={() => openTimePicker('edit')}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-task-type">Jenis Tugas</Label>
                <Select
                  value={newTask.task_type}
                  onValueChange={(value: 'individu' | 'per_sektor' | 'angkatan') => 
                    setNewTask({...newTask, task_type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tugas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individu">Individu</SelectItem>
                    <SelectItem value="per_sektor">Per Sektor</SelectItem>
                    <SelectItem value="angkatan">Angkatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setEditTaskDialog(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                onClick={handleUpdateTask}
                className="w-full sm:w-auto"
              >
                Update Tugas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Task Selection Dialog */}
      <Dialog open={taskSelectionDialog} onOpenChange={setTaskSelectionDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Pilih Tugas yang Akan Dihapus</DialogTitle>
            <DialogDescription>
              Pilih tugas yang ingin dihapus dari {getUniqueTasks().length} tugas yang tersedia
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedTaskIds.length === getUniqueTasks().length && getUniqueTasks().length > 0}
                  onChange={handleSelectAllTasks}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="font-medium">
                  Pilih Semua ({selectedTaskIds.length}/{getUniqueTasks().length})
                </label>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getUniqueTasks().map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => handleTaskSelection(task.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`task-${task.id}`} className="block cursor-pointer">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semua Sektor • Deadline: {formatDateTime(task.due_date)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {task.description}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              {selectedTaskIds.length} tugas dipilih
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setTaskSelectionDialog(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmSelectedTasksDelete}
                disabled={selectedTaskIds.length === 0}
                className="w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Hapus {selectedTaskIds.length} Tugas</span>
                <span className="sm:hidden">Hapus {selectedTaskIds.length}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialog} onOpenChange={(open) => {
        console.log('Bulk delete dialog open state changed:', open)
        setBulkDeleteDialog(open)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Massal</DialogTitle>
            <DialogDescription>
              {bulkDeleteType === 'all' 
                ? `Apakah Anda yakin ingin menghapus SEMUA tugas di semua sektor? (${tasks.length} tugas)`
                : `Apakah Anda yakin ingin menghapus ${selectedTaskIds.length} tugas yang dipilih?`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Cancel button clicked')
                setBulkDeleteDialog(false)
              }}
              disabled={isDeletingTasks}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                console.log('Confirm delete button clicked')
                confirmBulkDelete()
              }}
              disabled={isDeletingTasks}
              className="w-full sm:w-auto"
            >
              {isDeletingTasks ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Menghapus...</span>
                  <span className="sm:hidden">Menghapus...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {bulkDeleteType === 'all' ? 'Hapus Semua' : `Hapus ${selectedTaskIds.length} Tugas`}
                  </span>
                  <span className="sm:hidden">
                    {bulkDeleteType === 'all' ? 'Hapus Semua' : 'Hapus'}
                  </span>
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Download Confirmation Dialog */}
      <Dialog open={bulkDownloadDialog} onOpenChange={setBulkDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Download Semua Submission</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mendownload semua file submission? ({submissions.filter(sub => sub.file_url).length} file)
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
              Pilih tugas yang ingin didownload submission-nya dari {tasks.length} tugas yang tersedia
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
                          Sektor {task.sector} • Deadline: {formatDateTime(task.due_date)} • {taskSubmissions.length} file submission
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {task.description}
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

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditDialog} onOpenChange={setBulkEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Edit Tugas Massal</DialogTitle>
            <DialogDescription>
              Pilih tugas yang ingin diedit dan isi data yang akan diupdate
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Task Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="select-all-bulk-edit"
                    checked={bulkEditTaskIds.length === getUniqueTasks().length && getUniqueTasks().length > 0}
                    onChange={handleSelectAllBulkEditTasks}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="select-all-bulk-edit" className="font-medium">
                    Pilih Semua ({bulkEditTaskIds.length}/{getUniqueTasks().length})
                  </label>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getUniqueTasks().map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="checkbox"
                    id={`bulk-edit-task-${task.id}`}
                    checked={bulkEditTaskIds.includes(task.id)}
                    onChange={() => handleBulkEditTaskSelection(task.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                    <div className="flex-1 min-w-0">
                      <label htmlFor={`bulk-edit-task-${task.id}`} className="block cursor-pointer">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Semua Sektor • Deadline: {formatDateTime(task.due_date)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {task.description}
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data yang akan diupdate:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulk-edit-title">Judul Tugas</Label>
                  <Input
                    id="bulk-edit-title"
                    value={bulkEditData.title}
                    onChange={(e) => setBulkEditData({...bulkEditData, title: e.target.value})}
                    placeholder="Masukkan judul tugas baru"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="bulk-edit-due-date">Deadline Tanggal</Label>
                    <Input
                      id="bulk-edit-due-date"
                      type="date"
                      value={bulkEditData.due_date}
                      onChange={(e) => setBulkEditData({...bulkEditData, due_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bulk-edit-due-time">Deadline Jam</Label>
                    <div className="relative">
                      <Input
                        id="bulk-edit-due-time"
                        type="time"
                        value={bulkEditData.due_time || '23:59'}
                        onChange={(e) => setBulkEditData({...bulkEditData, due_time: e.target.value})}
                        step="60"
                        className="pr-10"
                      />
                      <Clock 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                        onClick={() => openTimePicker('bulk-edit')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bulk-edit-description">Deskripsi Tugas</Label>
                <Textarea
                  id="bulk-edit-description"
                  value={bulkEditData.description}
                  onChange={(e) => setBulkEditData({...bulkEditData, description: e.target.value})}
                  placeholder="Masukkan deskripsi tugas baru"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="bulk-edit-task-type">Jenis Tugas</Label>
                <Select
                  value={bulkEditData.task_type}
                  onValueChange={(value: 'individu' | 'per_sektor' | 'angkatan') => 
                    setBulkEditData({...bulkEditData, task_type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tugas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individu">Individu</SelectItem>
                    <SelectItem value="per_sektor">Per Sektor</SelectItem>
                    <SelectItem value="angkatan">Angkatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              {bulkEditTaskIds.length} tugas dipilih
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setBulkEditDialog(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                onClick={handleBulkUpdate}
                disabled={bulkEditTaskIds.length === 0}
                className="w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Update {bulkEditTaskIds.length} Tugas</span>
                <span className="sm:hidden">Update {bulkEditTaskIds.length}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Picker Dialog */}
      <Dialog open={timePickerOpen} onOpenChange={setTimePickerOpen}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Pilih Waktu Deadline</DialogTitle>
            <DialogDescription>
              Pilih jam dan menit untuk deadline tugas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time-picker-hour">Jam</Label>
                <Select
                  value={(() => {
                    const currentTime = timePickerType === 'create' ? newTask.due_time : 
                                      timePickerType === 'edit' ? newTask.due_time : 
                                      bulkEditData.due_time
                    return currentTime ? currentTime.split(':')[0] : '23'
                  })()}
                  onValueChange={(hour) => {
                    const currentTime = timePickerType === 'create' ? newTask.due_time : 
                                      timePickerType === 'edit' ? newTask.due_time : 
                                      bulkEditData.due_time
                    const minute = currentTime ? currentTime.split(':')[1] : '59'
                    const newTime = `${hour.padStart(2, '0')}:${minute}`
                    handleTimeSelect(newTime)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time-picker-minute">Menit</Label>
                <Select
                  value={(() => {
                    const currentTime = timePickerType === 'create' ? newTask.due_time : 
                                      timePickerType === 'edit' ? newTask.due_time : 
                                      bulkEditData.due_time
                    return currentTime ? currentTime.split(':')[1] : '59'
                  })()}
                  onValueChange={(minute) => {
                    const currentTime = timePickerType === 'create' ? newTask.due_time : 
                                      timePickerType === 'edit' ? newTask.due_time : 
                                      bulkEditData.due_time
                    const hour = currentTime ? currentTime.split(':')[0] : '23'
                    const newTime = `${hour}:${minute.padStart(2, '0')}`
                    handleTimeSelect(newTime)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-lg font-mono bg-muted px-4 py-2 rounded">
                {(() => {
                  const currentTime = timePickerType === 'create' ? newTask.due_time : 
                                    timePickerType === 'edit' ? newTask.due_time : 
                                    bulkEditData.due_time
                  return currentTime || '23:59'
                })()}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 pb-2">
            <Button variant="outline" onClick={() => setTimePickerOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleTimePickerConfirm}>
              Pilih
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
