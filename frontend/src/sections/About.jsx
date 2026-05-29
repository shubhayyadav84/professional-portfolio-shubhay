import { Code2, Lightbulb, GraduationCap, Rocket, Users } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Writing maintainable, scalable code that stands the test of time.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Optimizing for speed and delivering lightning-fast user experiences.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working closely with teams to bring ideas to life.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Staying ahead with the latest technologies and best practices.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
              Building the future,
              <span className="font-serif italic font-normal text-white">
                {" "}
                one component at a time.
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              <p>
                I am a second-year Computer Engineering student and Full Stack Developer with hands-on experience building web applications. I focus on writing clean, efficient code and developing robust backend systems coupled with responsive user interfaces.
              </p>
              <p>
                My expertise spans modern technologies including React.js, Node.js, Express.js, MongoDB, and PostgreSQL. I have a strong foundation in database management, RESTful API design, performance optimization, and version control using Git.
              </p>
              <p>
                Currently, I am pursuing a MERN Stack Internship at UptoSkills, where I collaborate on building and debugging production-grade projects. I am actively seeking software engineering intern opportunities where I can contribute to scaling systems and creating impactful user experiences.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
              <p className="text-lg font-medium italic text-foreground">
                "Focused on building scalable applications, optimization, and seamless frontend-backend integration to solve complex real-world challenges."
              </p>
            </div>
          </div>

          {/* Right Column - Highlights & Education */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="glass p-6 rounded-2xl animate-fade-in"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Education Card */}
            <div className="glass p-8 rounded-3xl glow-border space-y-6 relative overflow-hidden animate-fade-in animation-delay-400">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-primary font-medium tracking-wide">
                    2024 — 2028
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    Education
                  </h3>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-secondary-foreground">
                  B.Tech in Computer Science & Engineering
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lokmanya Tilak College of Engineering, Navi Mumbai
                </p>
                <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                  Specializing in IoT, Cybersecurity & Blockchain Technology. Currently in Second Year. Maintaining a 8.32 CGPA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
