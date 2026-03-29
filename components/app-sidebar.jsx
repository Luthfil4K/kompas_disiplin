"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Scale,
  AlertTriangle,
  Eye,
  BarChart3,
  Shield,
  LogOut // ✅ tambahin ini
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

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";


const menuItemsKabkoKatim = [
  {
    title: "Form Konsultasi",
    url: "/legal-consultation",
    icon: Scale
  },
  {
    title: "Form Pelanggaran Disiplin",
    url: "/disciplinary-report",
    icon: AlertTriangle
  },
  {
    title: "Report Monitoring",
    url: "/monitoring",
    icon: Eye
  },


]
const menuItemsKabag = [

  {
    title: "Report Monitoring",
    url: "/monitoring",
    icon: Eye
  },
  {
    title: "Evaluation Dashboard",
    url: "/evaluation",
    icon: BarChart3
  },

]

const menuItemsAdmin = [
  {
    title: "Dashboard",
    url: "/evaluation",
    icon: BarChart3
  },
   {
    title: "Monitoring Laporan",
    url: "/monitoring",
    icon: Eye
  },
  {
    title: "Form Konsultasi",
    url: "/legal-consultation",
    icon: Scale
  },
  {
    title: "Form Pelanggaran Disiplin",
    url: "/disciplinary-report",
    icon: AlertTriangle
  },
 
  

]

export function AppSidebar() {
  const { user } = useAuth();

  const role = user?.role;
  const pathname = usePathname()

  console.log(role)
  const router = useRouter();
  const { setUser } = useAuth();


 const handleLogout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });

  setUser(null); // 🔥 reset context
  router.push("/login");
};

  // console.log("ini role: ",role)
  //   console.log("isrole=kabagtu: ", role === "KABAG_TU")

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Kompas Disiplin
            </span>
            <span className="text-xs text-muted-foreground">
              BPS Prov. Bali
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(role === "KABAG_TU" || role === "ADMIN" || role === "SUPERADMIN"
                ? menuItemsAdmin
                : menuItemsKabkoKatim
              ).map((item) => (
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
