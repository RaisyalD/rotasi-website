import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  nama_lengkap: string
  email?: string
  nim?: string
  role: 'peserta' | 'mentor' | 'acara' | 'komdis'
  sektor?: number
  password_hash?: string
  login_password_hash?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SectorPassword {
  id: number
  sector_number: number
  sector_name: string
  uuid_password: string
  created_at: string
}

export interface DivisionPassword {
  id: number
  division_name: string
  uuid_password: string
  created_at: string
}

// Authentication functions
export const authService = {
  // Register functions
  async registerPeserta(data: {
    nama_lengkap: string
    nim: string
    email: string
    sektor: number
    sectorPassword: string
  }) {
    // Validate sector password
    const { data: sectorData, error: sectorError } = await supabase
      .from('sector_passwords')
      .select('*')
      .eq('sector_number', data.sektor)
      .eq('uuid_password', data.sectorPassword)
      .single()

    if (sectorError || !sectorData) {
      throw new Error('Password sektor tidak valid')
    }

    // Check if NIM already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('nim', data.nim)
      .single()

    if (existingUser) {
      throw new Error('NIM sudah terdaftar')
    }

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        nama_lengkap: data.nama_lengkap,
        nim: data.nim,
        email: data.email,
        role: 'peserta',
        sektor: data.sektor,
        password_hash: data.sectorPassword // Store sector password for login
      })
      .select()
      .single()

    if (error) throw error
    return user
  },

  async registerMentor(data: {
    nama_lengkap: string
    email: string
    loginPassword: string
    sektor: number
    sectorPassword: string
  }) {
    // Validate sector password
    const { data: sectorData, error: sectorError } = await supabase
      .from('sector_passwords')
      .select('*')
      .eq('sector_number', data.sektor)
      .eq('uuid_password', data.sectorPassword)
      .single()

    if (sectorError || !sectorData) {
      throw new Error('Password sektor tidak valid')
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        nama_lengkap: data.nama_lengkap,
        email: data.email,
        role: 'mentor',
        sektor: data.sektor,
        password_hash: data.sectorPassword,
        login_password_hash: data.loginPassword
      })
      .select()
      .single()

    if (error) throw error
    return user
  },

  async registerDivisi(data: {
    nama_lengkap: string
    email: string
    loginPassword: string
    divisionPassword: string
    role: 'acara' | 'komdis'
  }) {
    // Validate division password
    const { data: divisionData, error: divisionError } = await supabase
      .from('division_passwords')
      .select('*')
      .eq('division_name', data.role === 'acara' ? 'Divisi Acara' : 'Komdis')
      .eq('uuid_password', data.divisionPassword)
      .single()

    if (divisionError || !divisionData) {
      throw new Error('Password divisi tidak valid')
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        nama_lengkap: data.nama_lengkap,
        email: data.email,
        role: data.role,
        password_hash: data.divisionPassword,
        login_password_hash: data.loginPassword
      })
      .select()
      .single()

    if (error) throw error
    return user
  },

  // Login functions
  async loginPeserta(data: {
    nama_lengkap: string
    sektor: number
    sectorPassword: string
  }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nama_lengkap', data.nama_lengkap)
      .eq('sektor', data.sektor)
      .eq('role', 'peserta')
      .eq('password_hash', data.sectorPassword)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      throw new Error('Data login tidak valid')
    }

    return user
  },

  async loginMentor(data: {
    nama_lengkap: string
    sektor: number
    sectorPassword: string
  }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nama_lengkap', data.nama_lengkap)
      .eq('sektor', data.sektor)
      .eq('role', 'mentor')
      .eq('password_hash', data.sectorPassword)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      throw new Error('Data login tidak valid')
    }

    return user
  },

  async loginDivisi(data: {
    nama_lengkap: string
    loginPassword: string
    role: 'acara' | 'komdis'
  }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nama_lengkap', data.nama_lengkap)
      .eq('role', data.role)
      .eq('login_password_hash', data.loginPassword)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      throw new Error('Data login tidak valid')
    }

    return user
  },

  // Get sectors for dropdown
  async getSectors() {
    const { data, error } = await supabase
      .from('sector_passwords')
      .select('sector_number, sector_name')
      .order('sector_number')

    if (error) throw error
    return data
  },

  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Get all users (for acara/komdis)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get users by role
  async getUsersByRole(role: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get users by role and sector
  async getUsersByRoleAndSector(role: string, sektor: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('sektor', sektor)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Task management functions
  async createTask(data: {
    title: string
    description: string
    sector: number
    due_date: string
    created_by: string
  }) {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: data.title,
        description: data.description,
        sector: data.sector,
        due_date: data.due_date,
        created_by: data.created_by
      })
      .select()
      .single()

    if (error) throw error
    return task
  },

  async updateTask(id: string, data: {
    title?: string
    description?: string
    sector?: number
    due_date?: string
    status?: string
  }) {
    const { data: task, error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return task
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getTasks(sector?: number) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (sector) {
      query = query.eq('sector', sector)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Task submission functions
  async createTaskSubmission(data: {
    task_id: string
    participant_id: string
    submission_text?: string
    file_url?: string
    file_name?: string
  }) {
    const { data: submission, error } = await supabase
      .from('task_submissions')
      .insert({
        task_id: data.task_id,
        participant_id: data.participant_id,
        submission_text: data.submission_text,
        file_url: data.file_url,
        file_name: data.file_name
      })
      .select()
      .single()

    if (error) throw error
    return submission
  },

  async getTaskSubmissions(taskId?: string, participantId?: string, sector?: number) {
    let query = supabase
      .from('task_submissions')
      .select(`
        *,
        tasks (
          id,
          title,
          description,
          sector,
          due_date
        ),
        participants:users!task_submissions_participant_id_fkey (
          id,
          nama_lengkap,
          nim,
          email
        ),
        evaluators:users!task_submissions_evaluated_by_fkey (
          id,
          nama_lengkap
        )
      `)
      .order('submitted_at', { ascending: false })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }

    if (participantId) {
      query = query.eq('participant_id', participantId)
    }

    if (sector) {
      query = query.eq('tasks.sector', sector)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async evaluateTaskSubmission(id: string, data: {
    evaluation_score: number
    evaluation_comment: string
    evaluated_by: string
  }) {
    const { data: submission, error } = await supabase
      .from('task_submissions')
      .update({
        evaluation_score: data.evaluation_score,
        evaluation_comment: data.evaluation_comment,
        evaluated_by: data.evaluated_by,
        status: 'evaluated',
        evaluated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return submission
  }
} 