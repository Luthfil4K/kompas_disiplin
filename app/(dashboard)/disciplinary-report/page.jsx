"use client";

import { useState } from "react";
import { AlertTriangle, Upload, X, FileText, Check } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";

import { postDisciplineByKabkoKatim } from "../../services/postServices";

const violationTypes = [
  { id: "1", label: "Pelanggaran Ringan" },
  { id: "2", label: "Pelanggaran Sedang" },
  { id: "3", label: "Pelanggaran Berat" },
];

export default function DisciplinaryReportPage() {
  const {user} = useAuth()

  // console.log("user")
  // console.log(user)
  // console.log(user)
  // console.log("user")
  
  const [submitted, setSubmitted] = useState(false);
 
  const [formData, setFormData] = useState({
    reporterName: "",
    reportedName: "",
    nip: "",
    position: "",
    workUnit: "",
    violationType: "",
    description: "",
    linkFile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, violationType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await postDisciplineByKabkoKatim(formData);

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        reporterName: "",
        reportedName: "",
        nip: "",
        position: "",
        workUnit: "",
        violationType: "",
        description: "",
        linkFile: "",
      });
     
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Report Submitted
            </h2>
            <p className="text-center text-muted-foreground">
              Your disciplinary violation report has been submitted
              successfully. It will be reviewed by the appropriate authorities.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Disciplinary Violation Report
          </h1>
        </div>
        <p className="text-muted-foreground">
          Submit a report for disciplinary violations. All reports are
          confidential and will be reviewed thoroughly.
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
            <CardTitle className="text-lg">
              Reported Person Information
            </CardTitle>
            <CardDescription>
              Details of the person being reported
            </CardDescription>
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
                <Label htmlFor="workUnit">
                  Work Unit / Department (Satker)
                </Label>
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
              <Select
                onValueChange={handleSelectChange}
                value={formData.violationType}
              >
                <SelectTrigger id="violationType">
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  {violationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
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
            <CardDescription>
              Upload evidence such as investigation reports, meeting notes, or
              other documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="linkFile"></Label>
            <Input
              id="linkFile"
              name="linkFile"
              type="linkFile"
              placeholder="Inputkan Tautan Dokumen Pendukung"
              value={formData.linkFile}
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg">
          Submit Report
        </Button>
      </form>
    </div>
  );
}
