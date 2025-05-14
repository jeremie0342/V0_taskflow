"use client"

import { useEffect } from "react"
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
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/lib/hooks/use-auth"

interface MobileNavProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function MobileNav({ open, setOpen }: MobileNavProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fermer la navigation mobile lors du changement de page
  useEffect(() => {
    setOpen(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="p-0">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="text-lg font-semibold">TaskManager</div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="px-4 py-6">
          <div className="flex items-center mb-6">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={`/api/avatar/${user?.id}`} alt={user?.username} />
              <AvatarFallback>
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.firstname} {user?.lastname}
              </div>
              <div className="text-sm text-muted-foreground">{user?.role?.name || "Utilisateur"}</div>
            </div>
          </div>
          <nav className="space-y-2">
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
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOutIcon className="w-5 h-5 mr-3" />
              Déconnexion
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
