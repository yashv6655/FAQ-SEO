'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSSRSafeAuth } from '@/hooks/useSSRSafeAuth'
import { createClient } from '@/lib/supabase/client'
import { Plus, FileText, Calendar, ExternalLink, Loader2 } from 'lucide-react'
import type { FAQGeneration } from '@/lib/types'

export default function DashboardPage() {
  const { user, loading: authLoading } = useSSRSafeAuth()
  const [generations, setGenerations] = useState<FAQGeneration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGenerations()
    }
  }, [user])

  const fetchGenerations = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('faq_generations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching generations:', error)
      } else {
        setGenerations(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h1>
          <p className="text-gray-600 mb-8">Please sign in to view your dashboard.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your FAQ generations and projects
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Create New FAQ</CardTitle>
              <CardDescription>
                Generate SEO-optimized FAQs for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/generator">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate FAQs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {generations.length}
              </div>
              <p className="text-sm text-gray-600">FAQ sets created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {generations.reduce((total, gen) => total + gen.faqs.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Questions generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent FAQ Generations</CardTitle>
            <CardDescription>
              Your latest FAQ generations and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first FAQ generation
                </p>
                <Button asChild>
                  <Link href="/generator">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First FAQ
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {generations.map((generation) => (
                  <div
                    key={generation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {generation.title || `${generation.product} - ${generation.topic}`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {generation.meta_description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {generation.faqs.length} questions
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(generation.created_at).toLocaleDateString()}
                          </div>
                          <Badge variant="outline">
                            {generation.audience}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/generator?import=${generation.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}