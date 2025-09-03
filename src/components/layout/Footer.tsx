import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">FAQBuilder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate SEO-friendly FAQs with JSON-LD schema for better search visibility.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/generator" className="text-muted-foreground hover:text-foreground">FAQ Generator</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link href="/examples" className="text-muted-foreground hover:text-foreground">Examples</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 FAQBuilder. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for Fun
          </p>
        </div>
      </div>
    </footer>
  )
}