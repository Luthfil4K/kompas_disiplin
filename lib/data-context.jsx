"use client"

import { createContext, useContext, useState } from "react"

// Mock data for initial state
const initialConsultations = [
  {
    id: "CON-001",
    fullName: "Ahmad Fauzi",
    position: "Staff Administrasi",
    workUnit: "Dinas Pendidikan",
    phone: "081234567890",
    topic: "Pertanyaan mengenai prosedur cuti tahunan dan persyaratan yang diperlukan untuk pengajuan.",
    documents: ["Surat_Permohonan.pdf"],
    status: "submitted",
    date: "2024-01-15",
    type: "consultation"
  },
]

const initialViolationReports = [
  {
    id: "VIO-001",
    reporterName: "Dewi Lestari",
    reportedName: "Andi Wijaya",
    nip: "198507152010011001",
    position: "Bendahara",
    workUnit: "Dinas Keuangan",
    violationType: "Ketidakhadiran Tanpa Keterangan",
    description: "Tidak hadir selama 3 hari berturut-turut tanpa pemberitahuan atau izin resmi dari atasan.",
    documents: ["BAP_Pemeriksaan.pdf", "Rekap_Absensi.xlsx"],
    status: "submitted",
    date: "2024-01-16",
    type: "violation"
  },
]

const initialFollowUps = [
  {
    id: "FU-001",
    reportId: "VIO-002",
    notes: "Telah dilakukan pemanggilan dan pemeriksaan terhadap yang bersangkutan. Menunggu hasil investigasi lanjutan.",
    documents: ["Berita_Acara_Pemeriksaan.pdf"],
    date: "2024-01-14"
  }
]

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [consultations, setConsultations] = useState(initialConsultations)
  const [violationReports, setViolationReports] = useState(initialViolationReports)
  const [followUps, setFollowUps] = useState(initialFollowUps)

  const addConsultation = (consultation) => {
    const newConsultation = {
      ...consultation,
      id: `CON-${String(consultations.length + 1).padStart(3, "0")}`,
      status: "submitted",
      date: new Date().toISOString().split("T")[0],
      type: "consultation"
    }
    setConsultations([newConsultation, ...consultations])
    return newConsultation
  }

  const addViolationReport = (report) => {
    const newReport = {
      ...report,
      id: `VIO-${String(violationReports.length + 1).padStart(3, "0")}`,
      status: "submitted",
      date: new Date().toISOString().split("T")[0],
      type: "violation"
    }
    setViolationReports([newReport, ...violationReports])
    return newReport
  }

  const updateReportStatus = (id, status) => {
    const isConsultation = id.startsWith("CON")
    if (isConsultation) {
      setConsultations(consultations.map(c => 
        c.id === id ? { ...c, status } : c
      ))
    } else {
      setViolationReports(violationReports.map(r => 
        r.id === id ? { ...r, status } : r
      ))
    }
  }

  const addFollowUp = (followUp) => {
    const newFollowUp = {
      ...followUp,
      id: `FU-${String(followUps.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0]
    }
    setFollowUps([...followUps, newFollowUp])
    updateReportStatus(followUp.reportId, "followed-up")
    return newFollowUp
  }

  const getAllReports = () => {
    return [...consultations, ...violationReports].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )
  }

  const getStats = () => {
    const allReports = getAllReports()
    return {
      totalConsultations: consultations.length,
      totalViolations: violationReports.length,
      inProgress: allReports.filter(r => ["submitted", "in-review", "followed-up"].includes(r.status)).length,
      completed: allReports.filter(r => r.status === "completed").length
    }
  }

  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, index) => ({
      month,
      consultations: Math.floor(Math.random() * 15) + 5,
      violations: Math.floor(Math.random() * 10) + 2
    }))
  }

  const getViolationCategories = () => {
    const categories = {}
    violationReports.forEach(report => {
      categories[report.violationType] = (categories[report.violationType] || 0) + 1
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }

  const getAllDocuments = () => {
    const docs = []
    consultations.forEach(c => {
      c.documents.forEach(doc => {
        docs.push({ name: doc, reportId: c.id, reportType: "Konsultasi", date: c.date })
      })
    })
    violationReports.forEach(r => {
      r.documents.forEach(doc => {
        docs.push({ name: doc, reportId: r.id, reportType: "Pelanggaran", date: r.date })
      })
    })
    followUps.forEach(f => {
      f.documents.forEach(doc => {
        docs.push({ name: doc, reportId: f.reportId, reportType: "Tindak Lanjut", date: f.date })
      })
    })
    return docs.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getPunishmentSummary = () => {
    return [
      { type: "Teguran Lisan", count: 5, percentage: 35 },
      { type: "Teguran Tertulis", count: 3, percentage: 21 },
      { type: "Penundaan Kenaikan Pangkat", count: 2, percentage: 14 },
      { type: "Penurunan Pangkat", count: 2, percentage: 14 },
      { type: "Pembebasan Jabatan", count: 1, percentage: 8 },
      { type: "Pemberhentian", count: 1, percentage: 8 }
    ]
  }

  return (
    <DataContext.Provider value={{
      consultations,
      violationReports,
      followUps,
      addConsultation,
      addViolationReport,
      updateReportStatus,
      addFollowUp,
      getAllReports,
      getStats,
      getMonthlyData,
      getViolationCategories,
      getAllDocuments,
      getPunishmentSummary
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
