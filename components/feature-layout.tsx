"use client"

import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"

interface FeatureLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function FeatureLayout({ title, description, children }: FeatureLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">{children}</section>
    </div>
  )
}
