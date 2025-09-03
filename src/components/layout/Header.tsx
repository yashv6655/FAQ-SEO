import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FAQBuilder</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/generator" className="text-sm font-medium hover:text-primary transition-colors">
            Generator
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>

        <UserMenu />
      </div>
    </header>
  )
}