-- Database Schema for ROTASI Authentication System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for sector UUID passwords
CREATE TABLE sector_passwords (
    id SERIAL PRIMARY KEY,
    sector_number INTEGER UNIQUE NOT NULL,
    sector_name VARCHAR(100) NOT NULL,
    uuid_password VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for division UUID passwords
CREATE TABLE division_passwords (
    id SERIAL PRIMARY KEY,
    division_name VARCHAR(100) UNIQUE NOT NULL,
    uuid_password VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    nim VARCHAR(20) UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('peserta', 'mentor', 'acara', 'komdis')),
    sektor INTEGER,
    password_hash VARCHAR(255),
    login_password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sector INTEGER NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for task submissions
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url VARCHAR(500), -- URL to Supabase Storage
    file_name VARCHAR(255),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'evaluated', 'rejected')),
    evaluation_score INTEGER CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
    evaluation_comment TEXT,
    evaluated_by UUID REFERENCES users(id),
    evaluated_at TIMESTAMP WITH TIME ZONE
);

-- Insert default sector passwords (1-10)
INSERT INTO sector_passwords (sector_number, sector_name, uuid_password) VALUES
(1, 'Sektor 1', 'abc-123'),
(2, 'Sektor 2', 'def-456'),
(3, 'Sektor 3', 'ghi-789'),
(4, 'Sektor 4', 'jkl-012'),
(5, 'Sektor 5', 'mno-345'),
(6, 'Sektor 6', 'pqr-678'),
(7, 'Sektor 7', 'stu-901'),
(8, 'Sektor 8', 'vwx-234'),
(9, 'Sektor 9', 'yza-567'),
(10, 'Sektor 10', 'bcd-890');

-- Insert division passwords
INSERT INTO division_passwords (division_name, uuid_password) VALUES
('Divisi Acara', 'acara-2024'),
('Komdis', 'komdis-2024');

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_sektor ON users(sektor);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nim ON users(nim);
CREATE INDEX idx_tasks_sector ON tasks(sector);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_participant_id ON task_submissions(participant_id);
CREATE INDEX idx_task_submissions_status ON task_submissions(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE division_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Acara can view all data" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'acara'
        )
    );

CREATE POLICY "Komdis can view all data" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'komdis'
        )
    );

-- Policies for sector_passwords table
CREATE POLICY "Public read access for sector passwords" ON sector_passwords
    FOR SELECT USING (true);

-- Policies for division_passwords table
CREATE POLICY "Public read access for division passwords" ON division_passwords
    FOR SELECT USING (true);

-- Policies for tasks table
CREATE POLICY "Public read access for tasks" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Acara can manage tasks" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'acara'
        )
    );

-- Policies for task_submissions table
CREATE POLICY "Users can view their own submissions" ON task_submissions
    FOR SELECT USING (participant_id = auth.uid());

CREATE POLICY "Mentor can view submissions from their sector" ON task_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u, tasks t
            WHERE u.id = auth.uid() 
            AND u.role = 'mentor'
            AND t.id = task_submissions.task_id
            AND t.sector = u.sektor
        )
    );

CREATE POLICY "Acara can view all submissions" ON task_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'acara'
        )
    );

CREATE POLICY "Komdis can view all submissions" ON task_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'komdis'
        )
    ); 