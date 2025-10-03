'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, GraduationCap, Calendar, FileText, Download, AlertTriangle, RefreshCw, Building2, UserCheck, Eye, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { safeFetch } from '@/lib/webview-utils'

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

interface SectorData {
  sector_number: number
  sector_name: string
  participants: User[]
  mentors: User[]
}

export function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Expandable description states
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())
  
  // Sector filter state
  const [selectedSector, setSelectedSector] = useState<string>('none')
  const [selectedSectorParticipants, setSelectedSectorParticipants] = useState<string>('all')

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

      // Fetch all users
      try {
        const usersResponse = await safeFetch('/api/users')
        const usersData = await usersResponse.json()
        
        if (usersData.success) {
          setAllUsers(usersData.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setAllUsers([])
      }

      // Fetch tasks
      try {
        const tasksResponse = await safeFetch('/api/tasks')
        const tasksData = await tasksResponse.json()
        
        if (tasksData.success) {
          setTasks(tasksData.tasks)
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
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
        setSubmissions([])
      }

    } catch (error) {
      console.error('Error fetching data:', error)
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
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
      case 'per_sektor':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
      case 'angkatan':
        return 'bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-600 dark:text-white dark:border-blue-500'
      default:
        return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'peserta':
        return 'bg-blue-100 text-blue-800'
      case 'mentor':
        return 'bg-green-100 text-green-800'
      case 'acara':
        return 'bg-orange-100 text-orange-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'peserta':
        return 'Peserta'
      case 'mentor':
        return 'Mentor'
      case 'acara':
        return 'Divisi Acara'
      case 'admin':
        return 'Admin'
      default:
        return role
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

  // Error state
  if (!isLoading && sectors.length === 0 && allUsers.length === 0) {
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {allUsers.filter(user => user.role === 'peserta').length}
            </div>
            <p className="text-xs text-muted-foreground">
              peserta terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Mentor</CardTitle>
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {allUsers.filter(user => user.role === 'mentor').length}
            </div>
            <p className="text-xs text-muted-foreground">
              mentor aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Tugas</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{new Set(tasks.map(task => task.title)).size}</div>
            <p className="text-xs text-muted-foreground">
              tugas dibuat
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Submission</CardTitle>
            <Download className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              tugas dikumpulkan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="users" className="text-xs sm:text-sm py-2">Data Peserta</TabsTrigger>
          <TabsTrigger value="panitia" className="text-xs sm:text-sm py-2">Panitia</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm py-2">Penugasan</TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs sm:text-sm py-2">Submission</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Data Peserta Terdaftar
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Daftar semua peserta yang terdaftar di sistem
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSectorParticipants} onValueChange={setSelectedSectorParticipants}>
                    <SelectTrigger className="w-full sm:w-[200px] [&>span]:justify-start [&>span]:gap-0 [&>span]:text-left">
                      <SelectValue placeholder="Pilih Sektor" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="end" className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="all">Semua Sektor</SelectItem>
                      {[...Array(10)].map((_, idx) => {
                        const sectorNumber = idx + 1
                        return (
                          <SelectItem key={sectorNumber} value={sectorNumber.toString()}>
                            Sektor {sectorNumber} - {SECTOR_NAME[sectorNumber as number] ?? `Sektor ${sectorNumber}`}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(() => {
                  // Filter sectors based on selected sector
                  const filteredSectors = selectedSectorParticipants === 'all' 
                    ? sectors 
                    : sectors.filter((sector) => sector.sector_number === parseInt(selectedSectorParticipants))

                  if (selectedSectorParticipants === 'all') {
                    // Show all sectors
                    return sectors.map((sector) => (
                      <div key={sector.sector_number} className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          {sector.sector_name} - {SECTOR_NAME[sector.sector_number as number] ?? `Sektor ${sector.sector_number}`}
                        </h3>
                        {sector.participants.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Belum ada peserta</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {sector.participants.map((participant) => (
                              <Card key={participant.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-3 md:p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-medium text-sm sm:text-base truncate">{participant.nama_lengkap}</h4>
                                      <Badge variant="outline" className="text-xs shrink-0">Sektor {participant.sektor}</Badge>
                                    </div>
                                    {participant.nim && (
                                      <p className="text-xs sm:text-sm text-muted-foreground">NIM: {participant.nim}</p>
                                    )}
                                    {participant.email && (
                                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{participant.email}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getRoleBadgeStyle(participant.role)} text-xs`}>
                                        {getRoleDisplay(participant.role)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  } else {
                    // Show only selected sector
                    const sectorNumber = parseInt(selectedSectorParticipants)
                    const sector = sectors.find((s) => s.sector_number === sectorNumber)
                    
                    if (!sector) {
                      return (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Sektor Tidak Ditemukan</h3>
                          <p className="text-muted-foreground">
                            Sektor {sectorNumber} tidak ditemukan dalam sistem
                          </p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          {sector.sector_name} - {SECTOR_NAME[sector.sector_number as number] ?? `Sektor ${sector.sector_number}`}
                        </h3>
                        {sector.participants.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Belum ada peserta</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {sector.participants.map((participant) => (
                              <Card key={participant.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-3 md:p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-medium text-sm sm:text-base truncate">{participant.nama_lengkap}</h4>
                                      <Badge variant="outline" className="text-xs shrink-0">Sektor {participant.sektor}</Badge>
                                    </div>
                                    {participant.nim && (
                                      <p className="text-xs sm:text-sm text-muted-foreground">NIM: {participant.nim}</p>
                                    )}
                                    {participant.email && (
                                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{participant.email}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getRoleBadgeStyle(participant.role)} text-xs`}>
                                        {getRoleDisplay(participant.role)}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="panitia" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Divisi Acara */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Divisi Acara
                </CardTitle>
                <CardDescription>
                  Panitia divisi acara
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers.filter(user => user.role === 'acara').length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada panitia divisi acara</p>
                  ) : (
                    allUsers.filter(user => user.role === 'acara').map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3 md:p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm sm:text-base truncate">{user.nama_lengkap}</h4>
                              <Badge className={`${getRoleBadgeStyle(user.role)} text-xs shrink-0`}>
                                {getRoleDisplay(user.role)}
                              </Badge>
                            </div>
                            {user.email && (
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Mentor
                </CardTitle>
                <CardDescription>
                  Mentor per sektor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectors.map((sector) => (
                    <div key={sector.sector_number} className="space-y-2">
                      <h4 className="font-medium text-sm">
                        {sector.sector_name} - {SECTOR_NAME[sector.sector_number as number] ?? `Sektor ${sector.sector_number}`}
                      </h4>
                      {sector.mentors.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Belum ada mentor</p>
                      ) : (
                        <div className="space-y-2">
                          {sector.mentors.map((mentor) => (
                            <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-2 md:p-3">
                                <div className="space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="font-medium text-xs sm:text-sm truncate">{mentor.nama_lengkap}</h5>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                      Sektor {mentor.sektor}
                                    </Badge>
                                  </div>
                                  {mentor.email && (
                                    <p className="text-xs text-muted-foreground truncate">{mentor.email}</p>
                                  )}
                                  <Badge className={`${getRoleBadgeStyle(mentor.role)} text-xs`}>
                                    {getRoleDisplay(mentor.role)}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Daftar Penugasan
              </CardTitle>
              <CardDescription>
                Semua penugasan yang telah dibuat oleh divisi acara
              </CardDescription>
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
                              <p className={`text-sm text-muted-foreground whitespace-pre-wrap break-words break-all ${!expandedDescriptions.has(task.title) ? 'line-clamp-2' : ''}`}>
                                {task.description}
                              </p>
                              <button
                                onClick={() => toggleDescription(task.title)}
                                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-1 transition-colors"
                              >
                                {expandedDescriptions.has(task.title) ? (
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
                            <Badge className={getTaskTypeBadgeStyle(task.task_type || 'individu')}>
                              {getTaskTypeDisplay(task.task_type || 'individu')}
                            </Badge>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                Semua Submission
              </CardTitle>
                  <CardDescription className="text-sm">
                Submission tugas dari semua peserta termasuk status keterlambatan
              </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-full sm:w-[200px] [&>span]:justify-start [&>span]:gap-0 [&>span]:text-left">
                      <SelectValue placeholder="Pilih Sektor" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" align="end" className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="none">Tidak memilih sektor</SelectItem>
                      <SelectItem value="all">Semua Sektor</SelectItem>
                      {[...Array(10)].map((_, idx) => {
                        const sectorNumber = idx + 1
                        return (
                          <SelectItem key={sectorNumber} value={sectorNumber.toString()}>
                            Sektor {sectorNumber} - {SECTOR_NAME[sectorNumber as number] ?? `Sektor ${sectorNumber}`}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(() => {
                  // Show message if no sector is selected
                  if (selectedSector === 'none') {
                    return (
                      <div className="text-center py-12">
                        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Pilih Sektor untuk Menampilkan Hasil</h3>
                        <p className="text-muted-foreground">
                          Gunakan filter di atas untuk memilih sektor yang ingin Anda lihat submissionnya
                        </p>
                      </div>
                    )
                  }

                  // Filter submissions based on selected sector
                  const filteredSubmissions = selectedSector === 'all' 
                    ? submissions 
                    : submissions.filter((s) => s.tasks.sector === parseInt(selectedSector))
                  
                  // Group by sector
                  const groupedSubmissions = filteredSubmissions.reduce((acc, submission) => {
                    const sectorNumber = submission.tasks.sector
                    if (!acc[sectorNumber]) {
                      acc[sectorNumber] = []
                    }
                    acc[sectorNumber].push(submission)
                    return acc
                  }, {} as Record<number, TaskSubmission[]>)
                  
                  // Sort sectors and submissions
                  const sortedSectors = Object.keys(groupedSubmissions)
                    .map(Number)
                    .sort((a, b) => a - b)
                  
                  if (selectedSector === 'all') {
                    // Show all sectors
                    return [...Array(10)].map((_, idx) => {
                  const sectorNumber = idx + 1
                      const sectorSubs = groupedSubmissions[sectorNumber] || []
                      const sortedSubs = sectorSubs.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                      
                  return (
                    <div key={sectorNumber} className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Sektor {sectorNumber} - {SECTOR_NAME[sectorNumber as number] ?? `Sektor ${sectorNumber}`}
                      </h3>
                          {sortedSubs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada submission</p>
                      ) : (
                        <div className="space-y-3">
                              {sortedSubs.map((submission) => (
                                <div key={submission.id} className="border rounded-lg p-3 md:p-4 bg-gray-50 dark:bg-gray-800">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm sm:text-base truncate">{submission.participants.nama_lengkap}</h4>
                                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {submission.tasks.title} • {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                  </p>
                                      <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <Badge className={`${getTaskTypeBadgeStyle(submission.tasks.task_type || 'individu')} text-xs`}>
                                      {getTaskTypeDisplay(submission.tasks.task_type || 'individu')}
                                    </Badge>
                                    {submission.participants.nim && (
                                          <Badge variant="outline" className="text-xs">NIM: {submission.participants.nim}</Badge>
                                    )}
                                  </div>
                                </div>
                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                                        <Badge variant="destructive" className="text-xs">Terlambat</Badge>
                                  )}
                                      <Badge variant="outline" className="text-xs">
                                    {submission.status === 'submitted' ? 'Dikumpulkan' : 
                                     submission.status === 'evaluated' ? 'Dievaluasi' : 'Ditolak'}
                                  </Badge>
                                </div>
                              </div>
                              
                              {submission.tasks.description.length > 100 ? (
                                <div className="mb-3">
                                      <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${!expandedDescriptions.has(submission.tasks.id) ? 'line-clamp-2' : ''}`}>
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
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {submission.tasks.description}
                                </p>
                              )}
                              
                              {submission.file_url && (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-xs sm:text-sm truncate">{submission.file_name}</span>
                                      </div>
                                      <Button size="sm" variant="outline" asChild className="shrink-0">
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              )}
                              
                              {submission.submission_text && (
                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3">
                                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{submission.submission_text}</p>
                                </div>
                              )}
                              
                                  {submission.evaluation_comment && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      Komentar: {submission.evaluation_comment}
                                    </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  } else {
                    // Show only selected sector
                    const sectorNumber = parseInt(selectedSector)
                    const sectorSubs = groupedSubmissions[sectorNumber] || []
                    const sortedSubs = sectorSubs.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                    
                    return (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          Sektor {sectorNumber} - {SECTOR_NAME[sectorNumber as number] ?? `Sektor ${sectorNumber}`}
                        </h3>
                        {sortedSubs.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Belum ada submission</p>
                        ) : (
                          <div className="space-y-3">
                            {sortedSubs.map((submission) => (
                              <div key={submission.id} className="border rounded-lg p-3 md:p-4 bg-gray-50 dark:bg-gray-800">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm sm:text-base truncate">{submission.participants.nama_lengkap}</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                      {submission.tasks.title} • {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                      <Badge className={`${getTaskTypeBadgeStyle(submission.tasks.task_type || 'individu')} text-xs`}>
                                        {getTaskTypeDisplay(submission.tasks.task_type || 'individu')}
                                      </Badge>
                                      {submission.participants.nim && (
                                        <Badge variant="outline" className="text-xs">NIM: {submission.participants.nim}</Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    {isSubmissionLate(submission.tasks, submission.submitted_at) && (
                                      <Badge variant="destructive" className="text-xs">Terlambat</Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      {submission.status === 'submitted' ? 'Dikumpulkan' : 
                                       submission.status === 'evaluated' ? 'Dievaluasi' : 'Ditolak'}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {submission.tasks.description.length > 100 ? (
                                  <div className="mb-3">
                                    <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${!expandedDescriptions.has(submission.tasks.id) ? 'line-clamp-2' : ''}`}>
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
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {submission.tasks.description}
                                  </p>
                                )}
                                
                                {submission.file_url && (
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span className="text-xs sm:text-sm truncate">{submission.file_name}</span>
                                    </div>
                                    <Button size="sm" variant="outline" asChild className="shrink-0">
                                      <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </a>
                                    </Button>
                                  </div>
                                )}
                                
                                {submission.submission_text && (
                                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3">
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{submission.submission_text}</p>
                                  </div>
                                )}
                                
                                {submission.evaluation_comment && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      Komentar: {submission.evaluation_comment}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
