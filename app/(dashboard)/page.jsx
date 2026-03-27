"use client";

import Link from "next/link";
import {
  Scale,
  AlertTriangle,
  Eye,
  BarChart3,
  ArrowRight,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  {
    title: "Legal Consultation",
    description:
      "Submit legal consultation requests and get professional advice on regulations and procedures.",
    url: "/legal-consultation",
    icon: Scale,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Disciplinary Report",
    description:
      "Report disciplinary violations with supporting documents for investigation.",
    url: "/disciplinary-report",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Report Monitoring",
    description:
      "Track and manage all submitted reports, follow up on cases, and update statuses.",
    url: "/monitoring",
    icon: Eye,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Evaluation Dashboard",
    description:
      "View analytics, statistics, and comprehensive data visualization of all reports.",
    url: "/evaluation",
    icon: BarChart3,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export default function HomePage() {

  // console.log("user")
  // console.log(user)
  // console.log("user")
  const { getStats } = useData();
  const stats = getStats();
  const { user } = useAuth();
  const filteredMenu = menuItems.filter((item) => {
    if (item.url === "/evaluation" && user?.role !== "ADMIN") {
      return false;
    }

    if (
      item.url === "/monitoring" &&
      !["ADMIN", "KATIM"].includes(user?.role)
    ) {
      return false;
    }

    return true;
  });
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Government Administration Dashboard
            </h1>
            <p className="text-muted-foreground">
              Integrated system for legal consultation and disciplinary
              management
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Consultations</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalConsultations}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Violations</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalViolations}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.inProgress}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-foreground">
              {stats.completed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Menu Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredMenu.map((item) => (
          <Card
            key={item.title}
            className="group transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgColor}`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription className="text-sm">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full group-hover:bg-primary">
                <Link href={item.url}>
                  Access {item.title}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-2 font-semibold text-foreground">
          System Information
        </h3>
        <p className="text-sm text-muted-foreground">
          This administration dashboard provides a comprehensive solution for
          managing legal consultations and disciplinary violation reports. All
          data is securely stored and can be tracked through the monitoring
          system. For assistance, please contact the system administrator.
        </p>
      </div>
    </div>
  );
}
