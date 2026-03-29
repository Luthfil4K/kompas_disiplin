"use client"

import { BarChart3, Scale, AlertTriangle, Clock, CheckCircle, FileText, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts"
import { useData } from "@/lib/data-context"

import { getAllDiscipline } from "../../services/getServices";
import { getAllConsultation } from "../../services/getServices";
import { useState, useEffect } from "react"

const chartConfig = {
  consultations: {
    label: "Konsultasi",
    color: "var(--chart-1)"
  },
  violations: {
    label: "Laporan Pelanggaran",
    color: "var(--chart-4)"
  }
}

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
]

export default function EvaluationPage() {
  const {
    getStats,
    getMonthlyData,
    getViolationCategories,
    getAllDocuments,
    getPunishmentSummary
  } = useData()

  const [dashboardData, setDashboardData] = useState({
    consultations: [],
    violations: [],
    totalConsultations: 0,
    totalViolations: 0,
    totalInProgress: 0,
    totalCompleted: 0,
    totalInProgressVio: 0,
    totalInProgressCons: 0,
    totalInCompleteVio: 0,
    totalInCompleteCons: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cons = await getAllConsultation();
        const vio = await getAllDiscipline();

        console.log(cons)
        console.log(vio)

        const inProgressCons = cons.filter(
          (item) => item.status !== "COMPLETED"
        ).length;

        const completedCons = cons.filter(
          (item) => item.status === "COMPLETED"
        ).length;

        const inProgressVio = vio.filter(
          (item) => item.status !== "COMPLETED"
        ).length;

        const completedVio = vio.filter(
          (item) => item.status === "COMPLETED"
        ).length;

        setDashboardData({
          consultations: cons,
          violations: vio,
          totalConsultations: cons.length,
          totalViolations: vio.length,
          totalInProgress: inProgressCons + inProgressVio,
          totalCompleted: completedCons + completedVio,
          totalInProgressVio: inProgressVio,
          totalInProgressCons: inProgressCons,
          totalInCompleteVio: completedVio,
          totalInCompleteCons: completedCons,
        });

      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, []);

  const generateMonthlyData = (cons, vio) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const result = months.map((month, index) => ({
      month,
      consultations: 0,
      violations: 0,
    }));

    cons.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      result[monthIndex].consultations += 1;
    });

    vio.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      result[monthIndex].violations += 1;
    });

    return result;
  };

  const getViolationCategoriesFromData = (vio) => {
    const categories = {
      tinggi: 0,
      sedang: 0,
      rendah: 0,
    };

    vio.forEach((item) => {
      const type = item?.violationType?.name?.toLowerCase();

      if (categories[type] !== undefined) {
        categories[type]++;
      }
    });
    return Object.keys(categories).map((key) => ({
      name: key,
      value: categories[key] || 0,
    }));
  };


  const mergedDocuments = [
    ...dashboardData.consultations.map((item) => ({
      id: item.id,
      name: item.name,
      linkFile: item.linkFile,
      type: "Consultation",
      date: item.createdAt,
    })),
    ...dashboardData.violations.map((item) => ({
      id: item.id,
      name: item.reporterName,
      linkFile: item.linkFile,
      type: "Violation",
      date: item.createdAt,
    })),
  ];
  const stats = getStats()
  const monthlyData = generateMonthlyData(
    dashboardData.consultations || [],
    dashboardData.violations || []
  );
  const violationCategories = getViolationCategoriesFromData(
    dashboardData.violations
  );
  const documents = getAllDocuments()
  const punishmentSummary = getPunishmentSummary()

  const statCards = [
    {
      title: "Total Consultations",
      value: dashboardData.totalConsultations,
      icon: Scale,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Violations",
      value: dashboardData.totalViolations,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "In Progress",
      value: dashboardData.totalInProgress,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      sub: [
        { label: "Konsultasi", value: dashboardData.totalInProgressCons },
        { label: "Laporan Pelanggaran", value: dashboardData.totalInProgressVio },
      ],
    },
    {
      title: "Completed",
      value: dashboardData.totalCompleted,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      sub: [
        { label: "Konsultasi", value: dashboardData.totalInCompleteCons },
        { label: "Laporan Pelanggaran", value: dashboardData.totalInCompleteVio },
      ],
    },
  ];
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Statistik, analitik, dan dokumentasi dari semua laporan yang dikirimkan.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-start gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>

              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">{stat.title}</p>

                {/* VALUE + SUB INLINE */}
                <div className="flex items-end gap-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>

                </div>
                 {stat.sub && (
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {stat.sub.map((item) => (
                        <div key={item.label} className="flex items-start gap-1">
                          <span>{item.label}:</span>
                          <span className="font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Monthly Reports Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Laporan Bulanan
            </CardTitle>
            <CardDescription>Konsultasi dan Laporan Pelanggaran per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="consultations"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="violations"
                  fill="var(--chart-4)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Violation Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Violation Categories
            </CardTitle>
            <CardDescription>Distribution of violation types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {violationCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {violationCategories.map((category, index) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Punishment Summary Table */}
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Disciplinary Punishment Summary
          </CardTitle>
          <CardDescription>Overview of disciplinary actions taken</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Punishment Type</TableHead>
                <TableHead className="text-center">Count</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead>Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {punishmentSummary.map((item) => (
                <TableRow key={item.type}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell className="text-center">{item.count}</TableCell>
                  <TableCell className="text-center">{item.percentage}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Dokumen Pendukung
          </CardTitle>
          <CardDescription>Semua dokumen yang diajukan melalui formulir</CardDescription>
        </CardHeader>
        <CardContent>
          {mergedDocuments.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mergedDocuments.slice(0, 10).map((doc, index) => (
                  <TableRow key={index}>
                    {/* NAME (klik jadi link) */}
                    <TableCell>
                      <a
                        href={`https://${doc.linkFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-medium text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        {doc.name}
                      </a>
                    </TableCell>

                    {/* TYPE */}
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>

                    {/* LINK FILE (opsional tampil) */}
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.linkFile}
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="text-muted-foreground">
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {mergedDocuments.length > 10 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing 10 of {documents.length} documents
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
