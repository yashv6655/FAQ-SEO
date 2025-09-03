'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Download, Copy, Code, Eye } from 'lucide-react'
import { FAQGenerationRequest, FAQGenerationResponse } from '@/lib/types'

export default function GeneratorPage() {
  const [formData, setFormData] = useState<FAQGenerationRequest>({
    topic: '',
    product: '',
    audience: 'Developers',
    num_questions: 8,
    tone: 'clear and helpful',
    language: 'en'
  })
  const [result, setResult] = useState<FAQGenerationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'jsonld' | 'export'>('preview')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    // Track FAQ generation start
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('faq_generation_started', {
        topic: formData.topic,
        product: formData.product,
        audience: formData.audience,
        num_questions: formData.num_questions,
        tone: formData.tone
      })
    }

    try {
      const response = await fetch('/api/faqbuilder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FAQGenerationResponse = await response.json()
      setResult(data)

      // Track successful generation
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('faq_generation_completed', {
          topic: formData.topic,
          product: formData.product,
          audience: formData.audience,
          num_questions: formData.num_questions,
          faqs_generated: data.faqs.length,
          has_jsonld: !!data.jsonld
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)

      // Track generation error
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('faq_generation_error', {
          error: errorMessage,
          topic: formData.topic,
          product: formData.product
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            <Sparkles className="inline h-8 w-8 text-primary mr-3" />
            FAQ Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Generate SEO-optimized FAQs with JSON-LD schema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Configuration</CardTitle>
                <CardDescription>
                  Describe your product and target audience to generate relevant FAQs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <Label htmlFor="topic">Topic/Feature *</Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g., Edge functions for ecommerce checkouts"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="product">Product Name *</Label>
                    <Input
                      id="product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      placeholder="e.g., Acme Edge, MyAPI, DevTools Pro"
                      required
                    />
                  </div>

                  <div className="pb-4">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select 
                      value={formData.audience} 
                      onValueChange={(value) => setFormData({ ...formData, audience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Developers">Developers</SelectItem>
                        <SelectItem value="Senior frontend engineers">Senior Frontend Engineers</SelectItem>
                        <SelectItem value="Backend developers">Backend Developers</SelectItem>
                        <SelectItem value="DevOps engineers">DevOps Engineers</SelectItem>
                        <SelectItem value="Product managers">Product Managers</SelectItem>
                        <SelectItem value="Technical decision makers">Technical Decision Makers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="num_questions">Number of Questions</Label>
                      <Select 
                        value={formData.num_questions.toString()} 
                        onValueChange={(value) => setFormData({ ...formData, num_questions: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="8">8 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="12">12 questions</SelectItem>
                          <SelectItem value="15">15 questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tone">Tone</Label>
                      <Select 
                        value={formData.tone} 
                        onValueChange={(value) => setFormData({ ...formData, tone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear and helpful">Clear and Helpful</SelectItem>
                          <SelectItem value="concise and technical">Concise and Technical</SelectItem>
                          <SelectItem value="friendly and approachable">Friendly and Approachable</SelectItem>
                          <SelectItem value="authoritative and professional">Authoritative and Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || !formData.topic || !formData.product}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating FAQs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate FAQs
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={activeTab === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('preview')}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={activeTab === 'jsonld' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('jsonld')}
                    className="flex-1"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    JSON-LD
                  </Button>
                  <Button
                    variant={activeTab === 'export' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('export')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {result.title}
                        <Badge variant="secondary">
                          {result.faqs.length} FAQs
                        </Badge>
                      </CardTitle>
                      <CardDescription>{result.meta_description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.faqs.map((faq, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{faq.question}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {result.notes.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-medium text-blue-900 mb-2">Generation Notes:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                            {result.notes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* JSON-LD Tab */}
                {activeTab === 'jsonld' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        JSON-LD Schema
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(result.jsonld)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Add this to your page&apos;s &lt;head&gt; section for rich snippets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                        <code className="text-sm">
                          {`<script type="application/ld+json">\n${JSON.stringify(JSON.parse(result.jsonld), null, 2)}\n</script>`}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Export Tab */}
                {activeTab === 'export' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Options</CardTitle>
                      <CardDescription>
                        Export your FAQs in various formats
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", "faq-data.json");
                          document.body.appendChild(downloadAnchorNode);
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download as JSON
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => copyToClipboard(result.faqs.map(faq => `**${faq.question}**\n\n${faq.answer}`).join('\n\n---\n\n'))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as Markdown
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => copyToClipboard(`<script type="application/ld+json">\n${result.jsonld}\n</script>`)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Copy JSON-LD Script Tag
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Fill out the form to generate your FAQs</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}