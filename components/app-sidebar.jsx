"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Scale,
  AlertTriangle,
  Eye,
  BarChart3,
  Shield
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Legal Consultation",
    url: "/legal-consultation",
    icon: Scale
  },
  {
    title: "Disciplinary Report",
    url: "/disciplinary-report",
    icon: AlertTriangle
  },
  {
    title: "Report Monitoring",
    url: "/monitoring",
    icon: Eye
  },
  {
    title: "Evaluation Dashboard",
    url: "/evaluation",
    icon: BarChart3
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Admin Panel</span>
            <span className="text-xs text-muted-foreground">Government System</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Administrator</span>
            <span className="text-xs text-muted-foreground">admin@gov.id</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
