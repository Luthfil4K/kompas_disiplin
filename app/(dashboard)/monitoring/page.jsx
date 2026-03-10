"use client"

import { useState, useMemo } from "react"
import { Eye, Search, Filter, Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useData } from "@/lib/data-context"

const statusConfig = {
  submitted: { label: "Submitted", variant: "secondary" },
  "in-review": { label: "In Review", variant: "default" },
  "followed-up": { label: "Followed Up", variant: "outline" },
  completed: { label: "Completed", variant: "default" }
}

const ITEMS_PER_PAGE = 10

export default function MonitoringPage() {
  const { getAllReports, updateReportStatus, addFollowUp } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [workUnitFilter, setWorkUnitFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [followUpModal, setFollowUpModal] = useState(false)
  const [statusModal, setStatusModal] = useState(false)
  const [followUpData, setFollowUpData] = useState({ notes: "", documents: [] })
  const [newStatus, setNewStatus] = useState("")

  const allReports = getAllReports()

  const workUnits = useMemo(() => {
    const units = new Set(allReports.map(r => r.workUnit))
    return Array.from(units)
  }, [allReports])

  const filteredReports = useMemo(() => {
    return allReports.filter(report => {
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        (report.fullName?.toLowerCase().includes(searchLower)) ||
        (report.reporterName?.toLowerCase().includes(searchLower)) ||
        (report.reportedName?.toLowerCase().includes(searchLower)) ||
        report.workUnit.toLowerCase().includes(searchLower) ||
        report.id.toLowerCase().includes(searchLower)

      const matchesStatus = statusFilter === "all" || report.status === statusFilter
      const matchesWorkUnit = workUnitFilter === "all" || report.workUnit === workUnitFilter

      return matchesSearch && matchesStatus && matchesWorkUnit
    })
  }, [allReports, search, statusFilter, workUnitFilter])

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleViewDetails = (report) => {
    setSelectedReport(report)
  }

  const handleFollowUp = (report) => {
    setSelectedReport(report)
    setFollowUpModal(true)
  }

  const handleChangeStatus = (report) => {
    setSelectedReport(report)
    setNewStatus(report.status)
    setStatusModal(true)
  }

  const handleFollowUpSubmit = () => {
    if (selectedReport && followUpData.notes) {
      addFollowUp({
        reportId: selectedReport.id,
        notes: followUpData.notes,
        documents: followUpData.documents.map(f => f.name)
      })
      setFollowUpModal(false)
      setFollowUpData({ notes: "", documents: [] })
      setSelectedReport(null)
    }
  }

  const handleStatusSubmit = () => {
    if (selectedReport && newStatus) {
      updateReportStatus(selectedReport.id, newStatus)
      setStatusModal(false)
      setSelectedReport(null)
      setNewStatus("")
    }
  }

  const handleFollowUpFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFollowUpData(prev => ({ 
      ...prev, 
      documents: [...prev.documents, ...newFiles] 
    }))
  }

  const removeFollowUpFile = (index) => {
    setFollowUpData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const getReporterName = (report) => {
    return report.type === "consultation" ? report.fullName : report.reporterName
  }

  const getSubjectName = (report) => {
    return report.type === "consultation" ? report.fullName : report.reportedName
  }

  const getTypeLabel = (type) => {
    return type === "consultation" ? "Consultation" : "Violation Report"
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <Eye className="h-5 w-5 text-info" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Report Monitoring</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor and manage all submitted reports. Track status, follow up on cases, and update report statuses.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search and filter reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or work unit..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="followed-up">Followed Up</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workUnitFilter} onValueChange={(value) => {
              setWorkUnitFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Work Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Units</SelectItem>
                {workUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reporter Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Work Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No reports found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm">{report.date}</TableCell>
                    <TableCell>
                      <Badge variant={report.type === "consultation" ? "secondary" : "destructive"}>
                        {getTypeLabel(report.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getReporterName(report)}</TableCell>
                    <TableCell>{getSubjectName(report)}</TableCell>
                    <TableCell>{report.workUnit}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusConfig[report.status]?.variant}
                        className={
                          report.status === "completed" 
                            ? "bg-success text-success-foreground" 
                            : report.status === "in-review"
                            ? "bg-warning text-warning-foreground"
                            : ""
                        }
                      >
                        {statusConfig[report.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(report)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUp(report)}
                        >
                          Follow Up
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeStatus(report)}
                        >
                          Status
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} reports
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedReport && !followUpModal && !statusModal} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details - {selectedReport?.id}</DialogTitle>
            <DialogDescription>
              {selectedReport?.type === "consultation" ? "Legal Consultation" : "Violation Report"} submitted on {selectedReport?.date}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Reporter</Label>
                  <p className="font-medium">{getReporterName(selectedReport)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Work Unit</Label>
                  <p className="font-medium">{selectedReport.workUnit}</p>
                </div>
              </div>
              {selectedReport.type === "violation" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Reported Person</Label>
                    <p className="font-medium">{selectedReport.reportedName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">NIP</Label>
                    <p className="font-medium">{selectedReport.nip}</p>
                  </div>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">
                  {selectedReport.type === "consultation" ? "Consultation Topic" : "Violation Type"}
                </Label>
                <p className="font-medium">
                  {selectedReport.type === "consultation" ? selectedReport.topic : selectedReport.violationType}
                </p>
              </div>
              {selectedReport.type === "violation" && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedReport.description}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge 
                  variant={statusConfig[selectedReport.status]?.variant}
                  className={
                    selectedReport.status === "completed" 
                      ? "bg-success text-success-foreground" 
                      : selectedReport.status === "in-review"
                      ? "bg-warning text-warning-foreground"
                      : ""
                  }
                >
                  {statusConfig[selectedReport.status]?.label}
                </Badge>
              </div>
              {selectedReport.documents?.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Attached Documents</Label>
                  <div className="mt-2 space-y-2">
                    {selectedReport.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-lg bg-muted p-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow Up Dialog */}
      <Dialog open={followUpModal} onOpenChange={setFollowUpModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Follow Up Report</DialogTitle>
            <DialogDescription>
              Add follow up notes and documents for {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="followUpNotes">Follow Up Notes</Label>
              <Textarea
                id="followUpNotes"
                placeholder="Enter follow up notes..."
                className="min-h-24"
                value={followUpData.notes}
                onChange={(e) => setFollowUpData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Upload Follow Up Document</Label>
              <div className="rounded-lg border-2 border-dashed border-border p-4 text-center">
                <input
                  type="file"
                  id="followup-file"
                  className="hidden"
                  multiple
                  onChange={handleFollowUpFileChange}
                />
                <label htmlFor="followup-file" className="flex cursor-pointer flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload documents</span>
                </label>
              </div>
              {followUpData.documents.length > 0 && (
                <div className="space-y-2">
                  {followUpData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFollowUpFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFollowUpModal(false)
              setFollowUpData({ notes: "", documents: [] })
            }}>
              Cancel
            </Button>
            <Button onClick={handleFollowUpSubmit} disabled={!followUpData.notes}>
              Save Follow Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusModal} onOpenChange={setStatusModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newStatus">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="newStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="followed-up">Followed Up</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setStatusModal(false)
              setNewStatus("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleStatusSubmit}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
