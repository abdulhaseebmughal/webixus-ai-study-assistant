"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, BookOpen, Brain, Lightbulb, MessageSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/summarizer", label: "Summarizer", icon: BookOpen },
    { href: "/quiz", label: "Quiz", icon: Brain },
    { href: "/flashcards", label: "Flashcards", icon: Lightbulb },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/study-buddy", label: "Study Buddy", icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">StudyAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:block">
            <Link href="/dashboard">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            <Link href="/dashboard">
              <Button variant="default" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
