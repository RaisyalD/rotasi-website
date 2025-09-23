# Fitur Tampilan Tugas untuk Mentor - Dashboard Mentor

Dokumen ini menjelaskan fitur tampilan tugas yang telah ditambahkan ke dashboard mentor, memungkinkan mentor untuk melihat tugas yang diberikan oleh divisi acara untuk sektornya.

## Overview

Fitur ini memungkinkan mentor untuk:
- Melihat daftar tugas yang diberikan oleh divisi acara untuk sektor mereka
- Memantau progress submission dari mentee
- Melihat detail tugas lengkap
- Memantau deadline dan status tugas

## Fitur yang Ditambahkan

### 1. Tab "Tugas Sektor"
**Lokasi**: Dashboard Mentor → Tab "Tugas Sektor"

**Fitur**:
- Daftar semua tugas untuk sektor mentor
- Progress bar submission per tugas
- Indikator tugas terlambat
- Tombol "Detail" untuk melihat informasi lengkap

### 2. Summary Cards yang Diperbaharui
**Perubahan**:
- Menambahkan card "Total Tugas" dengan icon Calendar
- Mengubah grid dari 2 kolom menjadi 3 kolom
- Memperbarui label "Tugas Dikumpulkan" menjadi "Submission Dikumpulkan"

### 3. Dialog Detail Tugas
**Fitur**:
- Informasi lengkap tugas (judul, deskripsi, deadline, status)
- Progress submission dengan visual progress bar
- Daftar mentee yang sudah mengumpulkan tugas
- Indikator tugas terlambat

## Implementasi Teknis

### State Management
```typescript
const [tasks, setTasks] = useState<Task[]>([])
const [selectedTask, setSelectedTask] = useState<Task | null>(null)
const [taskDetailDialog, setTaskDetailDialog] = useState(false)
```

### API Integration
```typescript
// Fetch tasks for the sector
const tasksResponse = await fetch(`/api/tasks?sector=${user.sektor}`)
const tasksData = await tasksResponse.json()

if (tasksData.success) {
  setTasks(tasksData.tasks)
}
```

### Helper Functions

#### 1. isTaskOverdue()
```typescript
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
```

#### 2. getTaskSubmissionStatus()
```typescript
const getTaskSubmissionStatus = (taskId: string) => {
  const taskSubmissions = submissions.filter(sub => sub.task_id === taskId)
  const submittedCount = taskSubmissions.filter(sub => sub.status === 'submitted' || sub.status === 'evaluated').length
  return {
    total: mentees.length,
    submitted: submittedCount,
    pending: mentees.length - submittedCount
  }
}
```

## UI Components

### 1. Task Card
```tsx
<div className="border rounded-lg p-4 bg-gray-900/20 dark:bg-gray-800">
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
    <Button size="sm" variant="outline" onClick={() => {
      setSelectedTask(task)
      setTaskDetailDialog(true)
    }}>
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
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${(submissionStatus.submitted / submissionStatus.total) * 100}%` }}
      ></div>
    </div>
  </div>
</div>
```

### 2. Task Detail Dialog
```tsx
<Dialog open={taskDetailDialog} onOpenChange={setTaskDetailDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Detail Tugas</DialogTitle>
      <DialogDescription>{selectedTask?.title}</DialogDescription>
    </DialogHeader>
    {selectedTask && (
      <div className="space-y-4">
        {/* Task Information */}
        {/* Progress Information */}
        {/* Submission List */}
      </div>
    )}
  </DialogContent>
</Dialog>
```

## Data Flow

### 1. Data Fetching
```
Dashboard Load → fetchMentees() → 
├── Fetch mentees from /api/users?role=peserta&sektor=${user.sektor}
├── Fetch submissions from /api/submissions?sector=${user.sektor}
└── Fetch tasks from /api/tasks?sector=${user.sektor}
```

### 2. Task Display
```
Tasks Data → Map through tasks → 
├── Calculate submission status
├── Check if task is overdue
├── Render task card
└── Show progress bar
```

### 3. Task Detail
```
Click "Detail" → setSelectedTask() → 
├── Open taskDetailDialog
├── Show task information
├── Show submission progress
└── List mentee submissions
```

## Features Breakdown

### 1. Task List View
- **Empty State**: Menampilkan pesan jika belum ada tugas
- **Task Cards**: Setiap tugas ditampilkan dalam card dengan informasi lengkap
- **Progress Indicator**: Progress bar menunjukkan berapa mentee yang sudah mengumpulkan
- **Status Badges**: Badge untuk sektor, status terlambat, dll

### 2. Task Detail View
- **Basic Information**: Judul, deskripsi, deadline, status
- **Progress Tracking**: Visual progress bar dengan persentase
- **Submission List**: Daftar mentee yang sudah mengumpulkan
- **Overdue Indicator**: Badge merah jika tugas terlambat

### 3. Summary Cards
- **Total Mentee**: Jumlah mentee di sektor
- **Total Tugas**: Jumlah tugas aktif
- **Submission Dikumpulkan**: Jumlah submission yang sudah dikumpulkan

## Responsive Design

### Mobile (< 640px)
- Grid summary cards: 1 kolom
- Task cards: Full width
- Dialog: Full width dengan margin

### Tablet (640px - 1024px)
- Grid summary cards: 2-3 kolom
- Task cards: Responsive width
- Dialog: Max width dengan margin

### Desktop (> 1024px)
- Grid summary cards: 3 kolom
- Task cards: Optimal width
- Dialog: Max width 2xl

## Testing

### Manual Testing Checklist
- [ ] Test tampilan tugas di dashboard mentor
- [ ] Test tab "Tugas Sektor"
- [ ] Test dialog detail tugas
- [ ] Test progress bar submission
- [ ] Test indikator tugas terlambat
- [ ] Test empty state (belum ada tugas)
- [ ] Test responsive design
- [ ] Test dengan berbagai data tugas

### Expected Behavior
1. **Task List**: Menampilkan tugas untuk sektor mentor
2. **Progress Bar**: Menunjukkan progress submission yang akurat
3. **Detail Dialog**: Informasi lengkap tugas dan submission
4. **Responsive**: Tampilan yang baik di semua device

## Future Enhancements

Potensi pengembangan lebih lanjut:
1. **Task Filtering**: Filter berdasarkan status, deadline, dll
2. **Task Search**: Pencarian tugas berdasarkan judul/deskripsi
3. **Task Sorting**: Urutkan berdasarkan deadline, status, dll
4. **Bulk Actions**: Aksi massal untuk tugas
5. **Task Notifications**: Notifikasi untuk deadline yang mendekat
6. **Export Data**: Export data tugas ke Excel/PDF
