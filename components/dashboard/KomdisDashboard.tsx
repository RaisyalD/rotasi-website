'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, GraduationCap, Eye, Building2, UserCheck, FileText, Download } from 'lucide-react'
import { SECTOR_NAME } from '@/lib/utils'
import { User } from '@/lib/supabase'

interface SectorData {
  sector_number: number
  sector_name: string
  participants: User[]
  mentors: User[]
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
  tasks: {
    id: string
    title: string
    description: string
    sector: number
    due_date: string
  }
  participants: User
}

export function KomdisDashboard() {
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSectorsData()
  }, [])

  const fetchSectorsData = async () => {
    try {
      // Fetch all sectors
      const sectorsResponse = await fetch('/api/sectors')
      const sectorsData = await sectorsResponse.json()
      
      if (sectorsData.success) {
        // Fetch participants and mentors for each sector
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

      // Fetch all submissions
      const submissionsResponse = await fetch('/api/submissions')
      const submissionsData = await submissionsResponse.json()
      
      if (submissionsData.success) {
        setSubmissions(submissionsData.submissions)
      }
    } catch (error) {
      console.error('Error fetching sectors data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalParticipants = () => {
    return sectors.reduce((acc, sector) => acc + sector.participants.length, 0)
  }

  const getTotalMentors = () => {
    return sectors.reduce((acc, sector) => acc + sector.mentors.length, 0)
  }

  const getSectorSubmissions = (sectorNumber: number) => {
    return submissions.filter(sub => sub.tasks.sector === sectorNumber)
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Memuat data sektor...</p>
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
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalParticipants()}</div>
            <p className="text-xs text-muted-foreground">
              peserta terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentor</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalMentors()}</div>
            <p className="text-xs text-muted-foreground">
              mentor aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submission</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              tugas dikumpulkan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sectors Overview and Submissions */}
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Submission Tugas</TabsTrigger>
          <TabsTrigger value="sectors">Overview Sektor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectors.map((sector) => (
              <Card key={sector.sector_number}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Sektor {sector.sector_number}: {sector.sector_name}
                  </CardTitle>
                  <CardDescription>
                    {sector.participants.length} peserta • {sector.mentors.length} mentor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Participants */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Peserta ({sector.participants.length})
                    </h4>
                    <div className="space-y-2">
                      {sector.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <p className="font-medium text-sm">{participant.nama_lengkap}</p>
                            <p className="text-xs text-muted-foreground">NIM: {participant.nim}</p>
                          </div>
                          <Badge variant="outline">Peserta</Badge>
                        </div>
                      ))}
                      {sector.participants.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Belum ada peserta</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Mentors */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Mentor ({sector.mentors.length})
                    </h4>
                    <div className="space-y-2">
                      {sector.mentors.map((mentor) => (
                        <div key={mentor.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <p className="font-medium text-sm">{mentor.nama_lengkap}</p>
                            <p className="text-xs text-muted-foreground">{mentor.email}</p>
                          </div>
                          <Badge variant="default">Mentor</Badge>
                        </div>
                      ))}
                      {sector.mentors.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Belum ada mentor</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Recent submissions removed for Komdis as requested */}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submission Tugas Terstruktur per Sektor
              </CardTitle>
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
                      <h3 className="text-lg font-semibold">Sektor {sectorNumber} : {SECTOR_NAME[sectorNumber] ?? `Sektor ${sectorNumber}`}</h3>
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
                                  <Badge variant="outline">Sektor {submission.tasks.sector}</Badge>
                                </div>
                              </div>
                              {submission.file_url && (
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{submission.file_name}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-3 w-3 mr-1" /> Download
                                    </a>
                                  </Button>
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
      </Tabs>
    </div>
  )
}
