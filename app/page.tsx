"use client"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">TI</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Tech Internship</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#programs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Programs
              </a>
              <a
                href="#apply"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Apply
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Tech Internship.
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Students building real tools for our school community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-base px-8">
              See Projects
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base px-8 bg-transparent">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Text Content */}
            <div className="flex flex-col">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                About Us
              </h2>

              {/* Two Paragraphs */}
              <div className="space-y-4 mb-12">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  We're a student-led team delivering tech support, education events, and AI tools for our school. Our
                  mission is to bridge the gap between technology and learning, making digital tools accessible and
                  useful for everyone in our community.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  We find real problems, prototype fast, test with users, and share what works. Every project starts
                  with listening to our peers and teachers, then building solutions that actually make a difference.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full text-base px-8 bg-transparent"
                >
                  Meet the Team → Interns
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full text-base px-8 bg-transparent"
                >
                  Read our Stories → Blog
                </Button>
              </div>
            </div>

            {/* Image Slot */}
            <div className="relative w-full lg:max-h-[500px]">
              <div className="aspect-[4/3] lg:aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {/* Placeholder for image - users can replace this */}
                <div className="text-center p-8">
                  <svg
                    className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground/60">Image placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Our Mission
          </h2>

          <p className="mb-16 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We deliver peer tech support, run education events, and build AI-powered apps for our school. Our goal is to
            make technology easier for students and teachers and lead real change.
          </p>

          {/* Icon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {/* Impact Card */}
            <div className="rounded-2xl bg-card border border-border p-8 hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Impact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Creating meaningful change in our school community through technology
              </p>
            </div>

            {/* Learning Card */}
            <div className="rounded-2xl bg-card border border-border p-8 hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Learning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gaining hands-on experience with real-world projects and technologies
              </p>
            </div>

            {/* Service Card */}
            <div className="rounded-2xl bg-card border border-border p-8 hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Service</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Supporting our peers and teachers with dedicated tech assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We've Done Section */}
      <section
        id="accomplishments"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-muted/30"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            What We've Done
          </h2>

          <p className="mb-12 text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            We ship tools and host learning events that make technology easier for our community. Here are a few
            highlights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tech Support System */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Tech Support System</h3>
              <p className="text-sm text-muted-foreground">1,500+ requests resolved.</p>
            </div>

            {/* Innovation Day */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Innovation Day</h3>
              <p className="text-sm text-muted-foreground">Student apps for district leaders.</p>
            </div>

            {/* Google Innovator Grant */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Google Innovator Grant</h3>
              <p className="text-sm text-muted-foreground">$1,000 for AI policy tools.</p>
            </div>

            {/* Community Partnerships */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Community Partnerships</h3>
              <p className="text-sm text-muted-foreground">Co-building digital literacy.</p>
            </div>
          </div>

          {/* Read Stories Link - Bottom Right */}
          <div className="flex justify-end">
            <a
              href="#blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Read Stories → Blog
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Winter Showcase */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Winter Showcase</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Dec 15 · MVHS Library</p>
                <p>Student demos.</p>
              </div>
            </div>

            {/* Design with AI Workshop */}
            <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Design with AI Workshop</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Jan 20 · CS Lab</p>
                <p>Responsible AI intro.</p>
              </div>
            </div>
          </div>

          {/* See Recaps Link - Bottom Right */}
          <div className="flex justify-end">
            <a
              href="#blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              See Recaps → Blog
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Our Team
          </h2>

          {/* E-Board */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-foreground text-center">E-Board</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Myra Jain */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Myra Jain"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Myra Jain '28</h4>
                <p className="text-sm font-medium text-primary mb-2">Co-President</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leading AI initiatives and community outreach programs.
                </p>
              </div>

              {/* Yash Maheshwari */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Yash Maheshwari"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Yash Maheshwari '27</h4>
                <p className="text-sm font-medium text-primary mb-2">Co-President</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Managing tech support operations and student workshops.
                </p>
              </div>

              {/* Claire Schwarzhoff */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Claire Schwarzhoff"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Claire Schwarzhoff '27</h4>
                <p className="text-sm font-medium text-primary mb-2">Vice President</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Coordinating events and building partnerships with teachers.
                </p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="mb-8 text-2xl font-semibold text-foreground text-center">Members</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Travis Nguyen */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Travis Nguyen"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Travis Nguyen '28</h4>
                <p className="text-sm font-medium text-primary mb-2">Developer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Building web apps and automation tools for students.
                </p>
              </div>

              {/* Julie Patel */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Julie Patel"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Julie Patel '29</h4>
                <p className="text-sm font-medium text-primary mb-2">Designer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Creating user-friendly interfaces and visual content.
                </p>
              </div>

              {/* Vibhav Singh */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src="/professional-student-portrait.png"
                    alt="Vibhav Singh"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground">Vibhav Singh '27</h4>
                <p className="text-sm font-medium text-primary mb-2">Tech Lead</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Architecting systems and mentoring junior developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Stories from the Internship.
          </h2>

          <p className="mb-12 text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
            Deep dives on our events and projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Blog Post 1 */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10" />
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Building the Tech Support System</h3>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Yash Maheshwari</span>
                  <span>·</span>
                  <span>Nov 15, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  How we built a ticketing system that resolved over 1,500 student tech requests.
                </p>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10" />
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">AI Parent Night Recap</h3>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Myra Jain</span>
                  <span>·</span>
                  <span>Oct 28, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Families learned about AI safety, tools, and how to support digital literacy at home.
                </p>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10" />
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Innovation Day Success</h3>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Claire Schwarzhoff</span>
                  <span>·</span>
                  <span>Sep 20, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Students showcased AI-powered apps to district leaders and received funding support.
                </p>
              </div>
            </div>
          </div>

          {/* View All Posts Button */}
          <div className="flex justify-center">
            <Button size="lg" variant="outline" className="rounded-full text-base px-8 bg-transparent">
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Resources & Links
          </h2>

          <p className="mb-12 text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            Need help with tech issues or want to explore our tools? Check out our main tech support platform where you
            can submit tickets, browse FAQs, and access student-built resources. We're here to help make technology work
            for you.
          </p>

          <a
            href="https://mvhs-tech.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-xl bg-card border border-border p-6 hover:border-primary/50 hover:shadow-md transition-all max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  MVHS Tech Support Website
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">mvhs-tech.vercel.app</p>
              </div>
            </div>

            <svg
              className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Support Us Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Support Us
          </h2>

          <p className="mb-8 text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            Your support helps us continue building tools, hosting events, and expanding our impact across the school
            community.
          </p>

          <div className="flex justify-center mb-12">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-base px-8 bg-transparent"
              onClick={() => {
                const section = document.getElementById("accomplishments")
                section?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              What Your Money Goes To
            </Button>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M14 0V9a2 2 0 00-2-2M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Fund student projects</p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Cover conference travel</p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Expand AI education</p>
            </div>
          </div>

          {/* Thermometer Progress Bar */}
          <div className="mb-8 rounded-2xl bg-card border border-border p-8 max-w-2xl mx-auto">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Current: $0</span>
              <span className="font-semibold text-foreground">Goal: $2,000</span>
            </div>
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all" />
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="rounded-full text-base px-10">
              Donate
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center">
            Contact Us
          </h2>

          <p className="mb-12 text-base sm:text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            Educators, parents, partners — let's collaborate. We reply within 48 hours.
          </p>

          <div className="mx-auto max-w-2xl">
            {/* Contact Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project or question..."
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full rounded-lg text-base">
                Send Message
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-row gap-6 justify-center">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.948 0-3.259.014-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="font-medium text-xs">Instagram</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="font-medium text-xs">LinkedIn</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:contact@techinternship.org"
                  className="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-xs">Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Logo and Description */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Tech Internship.</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Students building real tools for our school community through tech support, education events, and
                AI-powered solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">Quick Links</h4>
              <nav className="flex flex-col gap-3">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
                <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <a href="#team" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Interns
                </a>
                <a href="#events" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Events
                </a>
                <a href="#blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
                <a href="#support" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
                <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </nav>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-300">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.948 0-3.259.014-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                <a
                  href="mailto:contact@techinternship.org"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="Email"
                >
                  <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Tech Internship. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
