"use client"

import { useState } from "react"
import { AlertTriangle, Upload, X, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useData } from "@/lib/data-context"

const violationTypes = [
  "Ketidakhadiran Tanpa Keterangan",
  "Penyalahgunaan Wewenang",
  "Pelanggaran Etika",
  "Penyalahgunaan Aset Negara",
  "Konflik Kepentingan",
  "Pelanggaran Disiplin Kerja",
  "Tindakan Korupsi",
  "Lainnya"
]

export default function DisciplinaryReportPage() {
  const { addViolationReport } = useData()
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    reporterName: "",
    reportedName: "",
    nip: "",
    position: "",
    workUnit: "",
    violationType: "",
    description: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, violationType: value }))
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    addViolationReport({
      ...formData,
      documents: files.map(f => f.name)
    })
    
    setSubmitted(true)
    
    setTimeout(() => {
      setFormData({
        reporterName: "",
        reportedName: "",
        nip: "",
        position: "",
        workUnit: "",
        violationType: "",
        description: ""
      })
      setFiles([])
      setSubmitted(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Report Submitted</h2>
            <p className="text-center text-muted-foreground">
              Your disciplinary violation report has been submitted successfully. It will be reviewed by the appropriate authorities.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Disciplinary Violation Report</h1>
        </div>
        <p className="text-muted-foreground">
          Submit a report for disciplinary violations. All reports are confidential and will be reviewed thoroughly.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Reporter Information</CardTitle>
            <CardDescription>Your identity as the reporter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="reporterName">Reporter Name</Label>
              <Input
                id="reporterName"
                name="reporterName"
                placeholder="Enter your name"
                value={formData.reporterName}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Reported Person Information</CardTitle>
            <CardDescription>Details of the person being reported</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="reportedName">Reported Person Name</Label>
                <Input
                  id="reportedName"
                  name="reportedName"
                  placeholder="Full name of reported person"
                  value={formData.reportedName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nip">NIP (Employee ID)</Label>
                <Input
                  id="nip"
                  name="nip"
                  placeholder="Enter NIP"
                  value={formData.nip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Job position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workUnit">Work Unit / Department (Satker)</Label>
                <Input
                  id="workUnit"
                  name="workUnit"
                  placeholder="Work unit"
                  value={formData.workUnit}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Violation Details</CardTitle>
            <CardDescription>Describe the violation in detail</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="violationType">Violation Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.violationType}>
                <SelectTrigger id="violationType">
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  {violationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Violation Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the violation, including dates, locations, and any witnesses..."
                className="min-h-32"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
            <CardDescription>Upload evidence such as investigation reports, meeting notes, or other documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Click to upload evidence documents
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, MP4 (max 25MB each)
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Uploaded Files ({files.length})</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg">
          Submit Report
        </Button>
      </form>
    </div>
  )
}
