export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  hospital_id?: string;
  specialization?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  clinic_name?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  blood_group?: string;
  contact?: string;
  address?: string;
  created_at?: string;
}

export interface ClinicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  symptoms?: string;
  diagnosis?: string;
  medicines?: string;
  tests?: string;
  notes?: string;
  created_at?: string;
}

export interface Referral {
  id: string;
  patient_id: string;
  patient_name?: string;
  from_doctor_id: string;
  doctor_name?: string;
  to_hospital_name?: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  doctor_notes?: string;
  status: 'pending' | 'accepted' | 'completed';
  token: string;
  created_at?: string;
}

export interface Report {
  id: string;
  referral_id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  content?: string;
  file_url?: string;
  created_at?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'PHC' | 'District' | 'Specialist';
  location: string;
}
