import { UserRole } from "@/types/user";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
}

export const PUBLIC_NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "Public Issues", href: "/issues" },
  { title: "About", href: "/about" },
];

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  resident: [
    { title: "Dashboard", href: "/resident/dashboard", iconName: "LayoutDashboard" },
    { title: "Report an Issue", href: "/resident/report-issue", iconName: "PlusCircle" },
    { title: "My Reports", href: "/resident/my-reports", iconName: "FileText" },
    { title: "My Profile", href: "/resident/profile", iconName: "User" },
  ],
  authority: [
    { title: "Authority Hub", href: "/authority/dashboard", iconName: "LayoutDashboard" },
    { title: "Assigned Issues", href: "/authority/assigned-issues", iconName: "ClipboardList" },
    { title: "Community Feed", href: "/issues", iconName: "Globe" },
    { title: "Profile", href: "/authority/profile", iconName: "User" },
  ],
  officer: [
    { title: "Field Dashboard", href: "/officer/dashboard", iconName: "LayoutDashboard" },
    { title: "Department Issues", href: "/officer/department-issues", iconName: "Briefcase" },
    { title: "Community Feed", href: "/issues", iconName: "Globe" },
    { title: "Profile", href: "/officer/profile", iconName: "User" },
  ],
  admin: [
    { title: "Admin Console", href: "/admin/dashboard", iconName: "LayoutDashboard" },
    { title: "User Directory", href: "/admin/users", iconName: "Users" },
    { title: "Departments", href: "/admin/departments", iconName: "Building2" },
    { title: "Municipal Reports", href: "/admin/reports", iconName: "BarChart3" },
    { title: "Platform Settings", href: "/admin/settings", iconName: "Settings" },
  ],
};

export const ROLE_LABELS: Record<UserRole, { title: string; badgeColor: string }> = {
  resident: { title: "Resident", badgeColor: "bg-teal-50 text-teal-700 border-teal-200" },
  authority: { title: "Authority Admin", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  officer: { title: "Department Officer", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  admin: { title: "System Administrator", badgeColor: "bg-purple-50 text-purple-700 border-purple-200" },
};

