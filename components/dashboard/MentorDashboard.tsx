'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, GraduationCap, Eye, FileText, CheckCircle, Clock, Download, AlertTriangle } from 'lucide-react'
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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)
  const [detailDialog, setDetailDialog] = useState(false)

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
    } catch (error) {
      console.error('Error fetching mentees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'evaluated':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
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

  const getMenteeSubmissions = (menteeId: string) => {
    return submissions.filter(sub => sub.participant_id === menteeId)
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
            <CardTitle className="text-sm font-medium">Tugas Dikumpulkan</CardTitle>
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

      {/* Mentees and Submissions */}
      <Tabs defaultValue="mentees" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mentees">Daftar Mentee</TabsTrigger>
          <TabsTrigger value="submissions">Submission Tugas</TabsTrigger>
        </TabsList>
        
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
                    <div key={mentee.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{mentee.nama_lengkap}</h3>
                          <p className="text-sm text-muted-foreground">
                            NIM: {mentee.nim} • Email: {mentee.email}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {menteeSubmissions.filter(sub => sub.status === 'evaluated').length} / {menteeSubmissions.length} Tugas
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Tugas Terkini:</h4>
                        {menteeSubmissions.slice(0, 3).map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(submission.status)}
                              <div>
                                <p className="font-medium text-sm">{submission.tasks.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(submission.status)}
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
                Submission Tugas Sektor {user.sektor}
              </CardTitle>
              <CardDescription>
                Lihat semua submission tugas dari mentee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{submission.participants.nama_lengkap}</h3>
                        <p className="text-sm text-muted-foreground">
                          {submission.tasks.title} • {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.evaluation_score && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {submission.evaluation_score}/100
                          </Badge>
                        )}
                        {getStatusBadge(submission.status)}
                      </div>
                    </div>
                    
                    {submission.submission_text && (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-3">
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
                <div>
                  <h4 className="font-medium">Status</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedSubmission.status)}
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  {selectedSubmission.evaluation_score && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Nilai: {selectedSubmission.evaluation_score}/100
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Deskripsi Tugas</h4>
                <p className="text-sm text-muted-foreground">{selectedSubmission.tasks.description}</p>
              </div>
              
              {selectedSubmission.submission_text && (
                <div>
                  <h4 className="font-medium">Submission Text</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
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
    </div>
  )
}
