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

import { useAuth } from "@/lib/auth-context";
import { postDisciplineByKabkoKatim } from "../../services/postServices";

const violationTypes = [
  { id: "1", label: "Pelanggaran Ringan" },
  { id: "2", label: "Pelanggaran Sedang" },
  { id: "3", label: "Pelanggaran Berat" },
];

export default function DisciplinaryReportPage() {
  const { user, loading } = useAuth();
  const dataUser = user;
  if (loading) return <div>Loading...</div>;

  
  
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
    userId:dataUser?.id,
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
              Form Laporan Pelanggaran
            </h2>
            <p className="text-center text-muted-foreground">
              Laporan pelanggaran disiplin Anda telah berhasil dikirim. Laporan ini akan ditinjau oleh Admin BPS Provinsi
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
            Laporan Pelanggaran Disiplin
          </h1>
        </div>
        <p className="text-muted-foreground">
          Form laporan untuk pelanggaran disiplin. Semua laporan bersifat rahasia dan akan ditinjau secara menyeluruh.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pelapor</CardTitle>
            <CardDescription>Identitas anda sebagai pelapor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="reporterName">Nama Pelapor</Label>
              <Input
                id="reporterName"
                name="reporterName"
                placeholder="Inputkan nama anda"
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
              Informasi Pihak Terlapor
            </CardTitle>
            <CardDescription>
              Detail informasi pihak yang akan dilaporkan
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="reportedName">Nama Orang Terlapor</Label>
                <Input
                  id="reportedName"
                  name="reportedName"
                  placeholder="Nama lengkap pihak terlapor"
                  value={formData.reportedName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  name="nip"
                  placeholder="NIP"
                  value={formData.nip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Jabatan"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workUnit">
                  Satuan Kerja
                </Label>
                <Input
                  id="workUnit"
                  name="workUnit"
                  placeholder="Satuan kerja"
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
            <CardTitle className="text-lg">Detail Pelanggaran Disiplin</CardTitle>
            <CardDescription>Jelaskan pelanggaran yang dilakukan pihak terlapor</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="violationType">Jenis Pelanggaran Disiplin</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.violationType}
              >
                <SelectTrigger id="violationType">
                  <SelectValue placeholder="Pilih jenis pelanggaran" />
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
              <Label htmlFor="description">Jelaskan pelanggaran yang dilakukan secara detail</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detail pelanggaran..."
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
            <CardTitle className="text-lg">Dokumen Pendukung (optional)</CardTitle>
            <CardDescription>
              Ungga bukti dokumen atau dokumen pendukung lainnya...
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
          Submit Laporan
        </Button>
      </form>
    </div>
  );
}
