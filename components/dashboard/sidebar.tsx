"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArchiveIcon,
  CalendarIcon,
  CheckSquareIcon,
  ClipboardListIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  PanelLeftIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Fermer la sidebar sur mobile lors du changement de page
  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false)
    }
  }, [pathname, setOpen])

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/projects", label: "Projets", icon: ClipboardListIcon },
    { href: "/tasks", label: "Tâches", icon: CheckSquareIcon },
    { href: "/calendar", label: "Calendrier", icon: CalendarIcon },
    { href: "/team", label: "Équipe", icon: UsersIcon },
    { href: "/documents", label: "Documents", icon: FileTextIcon },
    { href: "/archive", label: "Archives", icon: ArchiveIcon },
    { href: "/settings", label: "Paramètres", icon: SettingsIcon },
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center">
          <PanelLeftIcon className="w-6 h-6 mr-2 text-primary" />
          <span className="text-lg font-semibold">TaskManager</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="md:hidden">
          <XIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8 bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <nav className="px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={`/api/avatar/${user?.id}`} alt={user?.username} />
              <AvatarFallback>
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-muted-foreground">{user?.role?.name || "Utilisateur"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOutIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
