import { BookOpen, Calendar, Clock, User } from "lucide-react";

export const Blog = () => {
  return (
    <section id="blog" className="py-32 relative overflow-hidden">
      {/* Background sweeps */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            My Thoughts
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Stories &{" "}
            <span className="font-serif italic font-normal text-white">
              Insights.
            </span>
          </h2>
        </div>

        {/* Blog Post Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 md:p-12 rounded-3xl glow-border animate-fade-in animation-delay-200">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 border-b border-border/40 pb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>May 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>3 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Shubhay Yadav</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Full Stack
                </span>
              </div>
            </div>

            {/* Post Content */}
            <article className="prose prose-invert max-w-none space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-6 leading-tight">
                My Journey into Full Stack Development
              </h3>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                My journey into Full Stack Development started with a simple curiosity about how websites work behind the scenes. What began with learning HTML, CSS, and JavaScript eventually evolved into building complete web applications using the MERN stack.
              </p>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                As I progressed, I explored React.js for creating dynamic user interfaces, Node.js and Express.js for backend development, and MongoDB for managing application data. Building projects taught me more than tutorials ever could. Every bug fixed, feature implemented, and deployment completed helped me grow as a developer.
              </p>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Currently, I am pursuing a MERN Stack Internship where I work on real-world applications, develop REST APIs, optimize performance, and collaborate using Git and GitHub workflows. This experience has strengthened both my technical and problem-solving abilities.
              </p>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-medium text-white border-l-4 border-primary pl-4 py-1 bg-primary/5 rounded-r-xl">
                My goal is to continue learning modern technologies, contribute to impactful software products, and secure a Software Engineering Internship where I can further develop my skills and create meaningful solutions.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
