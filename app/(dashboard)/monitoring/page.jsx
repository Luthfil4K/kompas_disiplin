"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Search, Filter, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useData } from "@/lib/data-context";

import { getAllDiscipline } from "../../services/getServices";
import { getAllConsultation } from "../../services/getServices";
import { postFollowUps } from "../../services/postServices"
import { patchFollowUps } from "../../services/putServices"
import { patchStatus } from "../../services/putServices";

const statusConfig = {
  SUBMITTED: { label: "Submitted", variant: "secondary" },
  IN_REVIEW: { label: "In Review", variant: "default" },
  FOLLOWED_UP: { label: "Followed Up", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "default" },
};

const ITEMS_PER_PAGE = 10;

const formatDateWITA = (dateString) => {
  const date = new Date(dateString);

  const options = {
    timeZone: "Asia/Makassar",
  };

  const d = new Date(date.toLocaleString("en-US", options));

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function MonitoringPage() {
  const { getAllReports, updateReportStatus, addFollowUp } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workUnitFilter, setWorkUnitFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [followUpModal, setFollowUpModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    notes: "",
    linkFile:"" ,
  });
  const [newStatus, setNewStatus] = useState("");

  const [dataConsultation, setDataConsultation] = useState();
  const [dataViolation, setDataViolation] = useState();
  const [allData,setAllData] = useState()

  const allReports = getAllReports();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cons = await getAllConsultation();
        const vio = await getAllDiscipline();

        setDataConsultation(cons);
        setDataViolation(vio);

        //  mapping consultation
        const mappedCons = cons.map((item) => ({
          id: item.id,
          date: item.createdAt,
          description: item.topic,
          documents: item.linkFile ? [item.linkFile] : [],
          nip: '',
          position: item.position,
          reportedName: item.name,
          reporterName: item.name, // atau field lain kalau beda
          status: item.status || "submitted",
          type: "consultation",
          followUps:item.followUps,
          violationType: null,
          isFollowUp: item.followUps.length > 0 ? "1" : "0",
          topic:item.topic,
          workUnit: item.workUnit?.name || item.workUnit,
        }));

        // mapping violation
        const mappedVio = vio.map((item) => ({
          id: item.id,
          date: item.createdAt,
          description: item.violationDesc,
          documents: item.linkFile ? [item.linkFile] : [],
          nip: item.reportedNip,
          position: item.reportedPosition,
          reportedName: item.reportedName,
          reporterName: item.reporterName,
          topic:item.violationDesc,
          status: item.status || "submitted",
          type: "violation",
          followUps:item.followUps,
          violationType: item.violationType,
          isFollowUp: item.followUps.length > 0 ? "1" : "0",
          workUnit: item.workUnit?.name || item.workUnit,
        }));

        const combined = [...mappedCons, ...mappedVio];

        // (opsional) sort by date terbaru
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllData(combined);

        console.log("ALL DATA:", combined);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  const workUnits = useMemo(() => {
    const units = new Set(allData?.map((r) => r.workUnit));
    return Array.from(units);
  }, [allData]);

  const filteredReports = useMemo(() => {
    return allData?.filter((report) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        report.fullName?.toLowerCase().includes(searchLower) ||
        report.reporterName?.toLowerCase().includes(searchLower) ||
        report.reportedName?.toLowerCase().includes(searchLower) ||
        report.workUnit.toLowerCase().includes(searchLower) ||
        report.id.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesWorkUnit =
        workUnitFilter === "all" || report.workUnit === workUnitFilter;

      return matchesSearch && matchesStatus && matchesWorkUnit;
    });
  }, [allData, search, statusFilter, workUnitFilter]);

  const totalPages = Math.ceil(filteredReports?.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const handleFollowUp = (report) => {
  setSelectedReport(report);

  if (report.followUps?.length > 0) {
    setFollowUpData({
      notes: report.followUps[0].notes || "",
      linkFile: report.followUps[0].linkFile || "",
      id: report.followUps[0].id, 
    });
  } else {
    setFollowUpData({
      notes: "",
      linkFile: "",
      id: null,
    });
  }

  setFollowUpModal(true);
};

  const handleChangeStatus = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusModal(true);
  };

  const handleFollowUpSubmit = async () => {
  if (selectedReport && followUpData.notes) {
    const payload = {
      ...followUpData,
      userId: "1",
      type: selectedReport.type,
      consultationId:
        selectedReport.type === "consultation"
          ? selectedReport.id
          : null,
      violationId:
        selectedReport.type === "violation"
          ? selectedReport.id
          : null,
    };

    let newFollowUp;

    if (selectedReport.followUps?.length > 0) {
      // UPDATE
      const res = await patchFollowUps({
        id: selectedReport.followUps[0].id,
        data: payload,
      });
      newFollowUp = res.data;
    } else {
      // CREATE
      const res = await postFollowUps(payload);
      newFollowUp = res.data;
    }

    
    setAllData((prev) =>
      prev.map((item) => {
        if (item.id === selectedReport.id) {
          return {
            ...item,
            followUps: [newFollowUp],
            isFollowUp: "1",
          };
        }
        return item;
      })
    );

   
    setSelectedReport((prev) => ({
      ...prev,
      followUps: [newFollowUp],
      isFollowUp: "1",
    }));

    setFollowUpModal(false);
    setFollowUpData({ notes: "", linkFile: "" });
  }
};

  const handleStatusSubmit = async () => {
  if (selectedReport && newStatus) {
    const payload = {
      status: newStatus,
      type: selectedReport.type,
    };

    await patchStatus({
      id: selectedReport.id,
      data: payload,
    });

    // 🔥 update UI tanpa reload
    setAllData((prev) =>
      prev.map((item) =>
        item.id === selectedReport.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    setSelectedReport((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setStatusModal(false);
    setSelectedReport(null);
    setNewStatus("");
  }
};


  const getReporterName = (report) => {
    return report.type === "consultation"
      ? report.reporterName
      : report.reporterName;
  };

  const getSubjectName = (report) => {
    return report.type === "consultation"
      ? report.reporterName
      : report.reportedName;
  };

  const getTypeLabel = (type) => {
    return type === "consultation" ? "Consultation" : "Violation Report";
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <Eye className="h-5 w-5 text-info" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Report Monitoring
          </h1>
        </div>
        <p className="text-muted-foreground">
          Monitor and manage all submitted reports. Track status, follow up on
          cases, and update report statuses.
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
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="FOLLOWED-UP">Followed Up</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={workUnitFilter}
              onValueChange={(value) => {
                setWorkUnitFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Work Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Units</SelectItem>
                {workUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
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
              {paginatedReports?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No reports found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-sm">
                      {formatDateWITA(report.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.type === "consultation"
                            ? "secondary"
                            : "destructive"
                        }
                      >
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
                          report.status === "COMPLETED"
                            ? "bg-success text-success-foreground"
                            : report.status === "IN_REVIEW"
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
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of{" "}
            {filteredReports.length} reports
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
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
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedReport && !followUpModal && !statusModal}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details - {selectedReport?.id}</DialogTitle>
            <DialogDescription>
              {selectedReport?.type === "consultation"
                ? "Legal Consultation"
                : "Violation Report"}{" "}
              submitted on {formatDateWITA(selectedReport?.date)}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Reporter</Label>
                  <p className="font-medium">
                    {getReporterName(selectedReport)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Work Unit</Label>
                  <p className="font-medium">{selectedReport.workUnit}</p>
                </div>
              </div>
              {selectedReport.type === "violation" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">
                      Reported Person
                    </Label>
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
                  {selectedReport.type === "consultation"
                    ? "Consultation Topic"
                    : "Violation Type"}
                </Label>
                <p className="font-medium">
                  {selectedReport.type === "consultation"
                    ? selectedReport.topic
                    : selectedReport.violationDesc}
                </p>
              </div>
              {selectedReport.type === "violation" && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedReport.violationDesc}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge
                  variant={statusConfig[selectedReport.status]?.variant}
                  className={
                    selectedReport.status === "COMPLETED"
                      ? "bg-success text-success-foreground"
                      : selectedReport.status === "IN_REVIEW"
                        ? "bg-warning text-warning-foreground"
                        : ""
                  }
                >
                  {statusConfig[selectedReport.status]?.label}
                </Badge>
              </div>
              {selectedReport.documents?.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">
                    Attached Documents
                  </Label>
                  <div className="mt-2 space-y-2">
                    {selectedReport.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-muted p-2"
                      >
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
              <Label htmlFor="followUpNotes">Catatan tindak lanjut</Label>
              <Textarea
                value={followUpData.notes}
                onChange={(e) =>
                  setFollowUpData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkFile">
                Tautan dokumen pendukung (optional)
              </Label>
              <Input
                value={followUpData.linkFile}
                onChange={(e) =>
                  setFollowUpData((prev) => ({
                    ...prev,
                    linkFile: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFollowUpModal(false);
                setFollowUpData({ notes: "", documents: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFollowUpSubmit}
              disabled={
                !followUpData.notes || selectedReport?.status === "COMPLETED"
              }
            >
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
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="FOLLOWED_UP">Followed Up</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusModal(false);
                setNewStatus("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusSubmit}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
