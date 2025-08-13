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
  }
} 