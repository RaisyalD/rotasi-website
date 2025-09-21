'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Database, Plus, Trash2, Settings } from 'lucide-react'

interface BucketConfig {
  id: string
  name: string
  public: boolean
  fileSizeLimit: number
  allowedMimeTypes: string[]
  description?: string
}

export function SupabaseTableEditor() {
  const [buckets, setBuckets] = useState<BucketConfig[]>([
    {
      id: 'rotasi-files',
      name: 'rotasi-files',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: [
        'application/zip',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      description: 'Bucket untuk menyimpan file tugas peserta'
    }
  ])
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newBucket, setNewBucket] = useState<Partial<BucketConfig>>({
    name: '',
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: [],
    description: ''
  })

  const handleCreateBucket = () => {
    if (!newBucket.name) {
      alert('Nama bucket harus diisi')
      return
    }

    const bucket: BucketConfig = {
      id: newBucket.name,
      name: newBucket.name,
      public: newBucket.public || true,
      fileSizeLimit: newBucket.fileSizeLimit || 10485760,
      allowedMimeTypes: newBucket.allowedMimeTypes || [],
      description: newBucket.description
    }

    setBuckets([...buckets, bucket])
    setNewBucket({
      name: '',
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: [],
      description: ''
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteBucket = (bucketId: string) => {
    setBuckets(buckets.filter(b => b.id !== bucketId))
  }

  const generateSQL = (bucket: BucketConfig) => {
    const mimeTypes = bucket.allowedMimeTypes.map(type => `'${type}'`).join(', ')
    
    return `-- Create bucket: ${bucket.name}
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('${bucket.id}', '${bucket.name}', ${bucket.public}, ${bucket.fileSizeLimit}, ARRAY[${mimeTypes}]);

-- RLS Policies for ${bucket.name}
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = '${bucket.id}' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT 
USING (bucket_id = '${bucket.id}');

CREATE POLICY "Allow users to update own files" ON storage.objects FOR UPDATE 
USING (bucket_id = '${bucket.id}' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete own files" ON storage.objects FOR DELETE 
USING (bucket_id = '${bucket.id}' AND auth.uid()::text = (storage.foldername(name))[1]);`
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Storage Bucket Editor
          </CardTitle>
          <CardDescription>
            Kelola bucket storage untuk file upload. Bucket ini akan digunakan untuk menyimpan file tugas peserta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Daftar Bucket</h3>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Bucket Baru
            </Button>
          </div>

          <div className="space-y-4">
            {buckets.map((bucket) => (
              <Card key={bucket.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{bucket.name}</CardTitle>
                      <CardDescription>{bucket.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bucket.public ? "default" : "secondary"}>
                        {bucket.public ? "Public" : "Private"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBucket(bucket.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">File Size Limit:</span>
                      <p className="text-muted-foreground">{formatFileSize(bucket.fileSizeLimit)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Allowed MIME Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bucket.allowedMimeTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type.split('/')[1]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">SQL Script:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1"
                        onClick={() => {
                          navigator.clipboard.writeText(generateSQL(bucket))
                          alert('SQL script copied to clipboard!')
                        }}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Copy SQL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Bucket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Bucket Baru</DialogTitle>
            <DialogDescription>
              Konfigurasi bucket storage untuk menyimpan file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bucket-name">Nama Bucket</Label>
              <Input
                id="bucket-name"
                value={newBucket.name}
                onChange={(e) => setNewBucket({...newBucket, name: e.target.value})}
                placeholder="contoh: user-uploads"
              />
            </div>
            
            <div>
              <Label htmlFor="bucket-description">Deskripsi (Opsional)</Label>
              <Textarea
                id="bucket-description"
                value={newBucket.description}
                onChange={(e) => setNewBucket({...newBucket, description: e.target.value})}
                placeholder="Deskripsi bucket"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="file-size-limit">File Size Limit (bytes)</Label>
                <Input
                  id="file-size-limit"
                  type="number"
                  value={newBucket.fileSizeLimit}
                  onChange={(e) => setNewBucket({...newBucket, fileSizeLimit: parseInt(e.target.value)})}
                  placeholder="10485760"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(newBucket.fileSizeLimit || 0)}
                </p>
              </div>
              
              <div>
                <Label>Visibility</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    checked={newBucket.public}
                    onChange={() => setNewBucket({...newBucket, public: true})}
                  />
                  <Label htmlFor="public">Public</Label>
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    checked={!newBucket.public}
                    onChange={() => setNewBucket({...newBucket, public: false})}
                  />
                  <Label htmlFor="private">Private</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Allowed MIME Types</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'application/zip',
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'image/jpeg',
                  'image/png',
                  'text/plain'
                ].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newBucket.allowedMimeTypes?.includes(type)}
                      onChange={(e) => {
                        const current = newBucket.allowedMimeTypes || []
                        if (e.target.checked) {
                          setNewBucket({...newBucket, allowedMimeTypes: [...current, type]})
                        } else {
                          setNewBucket({...newBucket, allowedMimeTypes: current.filter(t => t !== type)})
                        }
                      }}
                    />
                    <span className="text-sm">{type.split('/')[1].toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateBucket}>
                Buat Bucket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
