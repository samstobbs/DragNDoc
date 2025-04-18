import { Upload, Paintbrush, Globe, Lock, Users, Zap, Search, Code } from "lucide-react"

export function FeatureSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted-foreground/20 px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need for API documentation
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to create beautiful, interactive API documentation.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Upload className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Easy Upload</h3>
            <p className="text-center text-muted-foreground">
              Upload your OpenAPI specification with a simple drag and drop interface.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Paintbrush className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Customization</h3>
            <p className="text-center text-muted-foreground">
              Customize your documentation with your brand colors, logo, and theme.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Globe className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Custom Domains</h3>
            <p className="text-center text-muted-foreground">
              Use your own domain for your API documentation (Pro and Enterprise).
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Lock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Authentication</h3>
            <p className="text-center text-muted-foreground">
              Protect your documentation with password or OAuth authentication.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Users className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Team Collaboration</h3>
            <p className="text-center text-muted-foreground">
              Collaborate with your team on API documentation (Enterprise).
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Zap className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Try It Feature</h3>
            <p className="text-center text-muted-foreground">
              Let users test your API endpoints directly from the documentation.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Search className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Search</h3>
            <p className="text-center text-muted-foreground">
              Powerful search functionality to find endpoints quickly.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Code className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Code Samples</h3>
            <p className="text-center text-muted-foreground">
              Automatically generated code samples in multiple languages.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-primary/5">
            <div className="rounded-full bg-primary/20 p-2">
              <span className="text-lg font-bold text-primary">+</span>
            </div>
            <h3 className="text-xl font-bold">And More</h3>
            <p className="text-center text-muted-foreground">
              Versioning, analytics, webhooks, and more features coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
