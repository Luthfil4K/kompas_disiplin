"use client";

import { useState } from "react";
import { Scale, Upload, X, FileText, Check } from "lucide-react";
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

import { useAuth } from "@/lib/auth-context";
import { postConsultationByKabkoKatim } from "../../services/postServices";

export default function LegalConsultationPage() {

  const { user, loading } = useAuth();
  const dataUser = user;
  if (loading) return <div>Loading...</div>;
 


  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    nip: "3400632811",
    fullName: "",
    position: "",
    workUnit: "",
    phone: "",
    topic: "",
    linkFile: "",
    userId:dataUser?.id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  
    e.preventDefault();
    await postConsultationByKabkoKatim(formData);

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        nip: 1,
        fullName: "",
        position: "",
        workUnit: "",
        phone: "",
        topic: "",
        
      });
      setFiles([]);
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
              Consultation Submitted
            </h2>
            <p className="text-center text-muted-foreground">
              Your legal consultation request has been submitted successfully.
              You will be contacted shortly.
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Form Konsultasi
          </h1>
        </div>
        <p className="text-muted-foreground">
          Ajukan konsultasi, lengkapi form dibawah ini.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Personal</CardTitle>
            <CardDescription>
              
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Isi nama lengkap anda"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Isi jabatan anda"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="workUnit">Kode (Satker)</Label>
                <Input
                  id="workUnit"
                  name="workUnit"
                  placeholder="Isi kode satker"
                  value={formData.workUnit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No Telp.</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Isi no telp/WA"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Detail Konsultasi</CardTitle>
            <CardDescription>
             
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="topic">Deskripsi Konsultasi</Label>
              <Textarea
                id="topic"
                name="topic"
                placeholder="Jelaskan deskripsi konsultasi"
                className="min-h-32"
                value={formData.topic}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Dokument Pendukung</CardTitle>
            <CardDescription>
              Unggah dokumen pendukung - Optional
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
          Submit Konsultasi
        </Button>
      </form>
    </div>
  );
}
