import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Search, Zap, Code, Target, Sparkles, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Generation",
      description: "Uses Claude AI to generate People Also Ask-style questions and answers optimized for SEO"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "JSON-LD Schema",
      description: "Automatically generates structured data markup for rich snippets in search results"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Developer-Focused",
      description: "Perfect for SaaS products, developer tools, and technical documentation"
    }
  ]

  const exampleFAQs = [
    { 
      question: "What are edge functions in ecommerce?", 
      answer: "Edge functions are serverless functions that run at CDN edge locations, enabling faster response times for ecommerce operations like checkout processing.",
      tags: ["Performance", "Architecture"] 
    },
    { 
      question: "How do edge functions improve checkout speed?", 
      answer: "By processing checkout logic closer to users geographically, edge functions reduce latency and provide faster, more reliable checkout experiences.",
      tags: ["Performance", "UX"] 
    },
    { 
      question: "What's the difference between edge functions and serverless?", 
      answer: "Edge functions run at multiple geographic locations simultaneously, while traditional serverless functions typically run in a single region.",
      tags: ["Architecture", "Comparison"] 
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-white py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge variant="outline" className="mb-8 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered SEO Tool
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Generate SEO-friendly 
              <span className="text-primary block sm:inline"> FAQ pages</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Create People Also Ask-style questions and answers with embedded JSON-LD schema. 
              Perfect for developer tools, SaaS products, and technical documentation that needs better search visibility.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild className="shadow-soft-lg">
                <Link href="/generator">
                  Start Building FAQs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#example">View Example</Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>JSON-LD included</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>SEO optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple three-step process to generate professional FAQ pages that rank well in search results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-soft bg-white">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example FAQ */}
      <section id="example" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              See it in action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here&apos;s what a generated FAQ looks like for edge function documentation
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/10 shadow-soft-lg bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Edge Functions for Ecommerce Checkouts: FAQs</CardTitle>
                    <CardDescription className="text-base">
                      Learn how edge functions improve checkout reliability, latency, and A/B testing for ecommerce.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <Code className="h-3 w-3 mr-1" />
                    JSON-LD Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {exampleFAQs.map((faq, index) => (
                    <Card key={index} className="border border-gray-100 bg-white shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg leading-tight">{faq.question}</CardTitle>
                          <div className="flex space-x-1 shrink-0">
                            {faq.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm leading-relaxed text-gray-700">
                          {faq.answer}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    <Code className="h-4 w-4 inline mr-1" />
                    Includes JSON-LD Schema:
                  </p>
                  <code className="text-xs text-gray-500 font-mono">
                    {`{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [...]}`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Ready to boost your SEO?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Start generating SEO-optimized FAQ pages with JSON-LD schema in minutes. 
              Perfect for developer tools, SaaS products, and technical documentation.
            </p>
            <Button size="lg" variant="secondary" asChild className="shadow-soft-lg">
              <Link href="/generator">
                Create Your First FAQ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
