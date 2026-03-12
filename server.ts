import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("arogya_vahini.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('doctor', 'patient', 'admin')) NOT NULL,
    hospital_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT NOT NULL,
    gender TEXT NOT NULL,
    blood_group TEXT,
    contact TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clinical_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    medicines TEXT,
    tests TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    from_doctor_id TEXT NOT NULL,
    to_hospital_name TEXT,
    reason TEXT NOT NULL,
    urgency TEXT CHECK(urgency IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
    doctor_notes TEXT,
    status TEXT CHECK(status IN ('pending', 'accepted', 'completed')) DEFAULT 'pending',
    token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(from_doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    referral_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(referral_id) REFERENCES referrals(id),
    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('PHC', 'District', 'Specialist')) NOT NULL,
    location TEXT NOT NULL
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { id, name, email, password, role, hospital_id } = req.body;
    try {
      db.prepare("INSERT INTO users (id, name, email, password, role, hospital_id) VALUES (?, ?, ?, ?, ?, ?)")
        .run(id, name, email, password, role, hospital_id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  // Patients API
  app.get("/api/patients", (req, res) => {
    const patients = db.prepare("SELECT * FROM patients").all();
    res.json(patients);
  });

  app.get("/api/patients/:id", (req, res) => {
    const patient = db.prepare("SELECT * FROM patients WHERE id = ?").get(req.params.id);
    if (patient) res.json(patient);
    else res.status(404).json({ message: "Patient not found" });
  });

  app.post("/api/patients", (req, res) => {
    const { id, name, dob, gender, blood_group, contact, address } = req.body;
    db.prepare("INSERT INTO patients (id, name, dob, gender, blood_group, contact, address) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, name, dob, gender, blood_group, contact, address);
    res.json({ success: true });
  });

  // Clinical Records API
  app.get("/api/clinical-records/:patientId", (req, res) => {
    const records = db.prepare("SELECT * FROM clinical_records WHERE patient_id = ? ORDER BY created_at DESC").all(req.params.patientId);
    res.json(records);
  });

  app.post("/api/clinical-records", (req, res) => {
    const { id, patient_id, doctor_id, doctor_name, symptoms, diagnosis, medicines, tests, notes } = req.body;
    db.prepare("INSERT INTO clinical_records (id, patient_id, doctor_id, doctor_name, symptoms, diagnosis, medicines, tests, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(id, patient_id, doctor_id, doctor_name, symptoms, diagnosis, medicines, tests, notes);
    res.json({ success: true });
  });

  // Referrals API
  app.get("/api/referrals", (req, res) => {
    const referrals = db.prepare(`
      SELECT r.*, p.name as patient_name, d.name as doctor_name 
      FROM referrals r 
      JOIN patients p ON r.patient_id = p.id 
      JOIN users d ON r.from_doctor_id = d.id
    `).all();
    res.json(referrals);
  });

  app.get("/api/referrals/patient/:patientId", (req, res) => {
    const referrals = db.prepare(`
      SELECT r.*, d.name as doctor_name 
      FROM referrals r 
      JOIN users d ON r.from_doctor_id = d.id
      WHERE r.patient_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.patientId);
    res.json(referrals);
  });

  app.post("/api/referrals", (req, res) => {
    const { id, patient_id, from_doctor_id, to_hospital_name, reason, urgency, doctor_notes, token } = req.body;
    db.prepare(`
      INSERT INTO referrals (id, patient_id, from_doctor_id, to_hospital_name, reason, urgency, doctor_notes, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, patient_id, from_doctor_id, to_hospital_name, reason, urgency, doctor_notes, token);
    res.json({ success: true });
  });

  app.get("/api/referrals/token/:token", (req, res) => {
    const referral = db.prepare(`
      SELECT r.*, p.name as patient_name, p.dob, p.gender, p.blood_group, d.name as doctor_name 
      FROM referrals r 
      JOIN patients p ON r.patient_id = p.id 
      JOIN users d ON r.from_doctor_id = d.id
      WHERE r.token = ?
    `).get(req.params.token);
    if (referral) {
      res.json(referral);
    } else {
      res.status(404).json({ message: "Referral not found" });
    }
  });

  // Reports API
  app.get("/api/reports/:patientId", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports WHERE patient_id = ?").all(req.params.patientId);
    res.json(reports);
  });

  app.post("/api/reports", (req, res) => {
    const { id, referral_id, patient_id, doctor_id, title, content, file_url } = req.body;
    db.prepare("INSERT INTO reports (id, referral_id, patient_id, doctor_id, title, content, file_url) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, referral_id, patient_id, doctor_id, title, content, file_url);
    res.json({ success: true });
  });

  // Hospitals API
  app.get("/api/hospitals", (req, res) => {
    const hospitals = db.prepare("SELECT * FROM hospitals").all();
    res.json(hospitals);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
