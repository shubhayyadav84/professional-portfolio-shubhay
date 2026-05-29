import { Award, ExternalLink, ShieldCheck } from "lucide-react";

const certifications = [
  {
    title: "Apna College Delta 6.0",
    issuer: "Full Stack Development Certification",
    date: "Dec 2024",
    description:
      "Comprehensive engineering curriculum covering MERN architecture, RESTful services, database structures, and systems scaling.",
    link: "https://drive.google.com/drive/folders/1JeOAF5lb7O-ZUYUo-lhzt2yzIO1gLS7y",
  },
  {
    title: "Infosys Python Programming",
    issuer: "Python Core Concepts & Algorithms",
    date: "Feb 2025",
    description:
      "Demonstrated competence in object-oriented programming principles, algorithms, and automated scripting workflows.",
    link: "https://drive.google.com/drive/folders/1JeOAF5lb7O-ZUYUo-lhzt2yzIO1gLS7y",
  },
  {
    title: "JPMorgan Chase & Co.",
    issuer: "Software Engineering Virtual Experience",
    date: "Aug 2025",
    description:
      "Completed hands-on software development tasks simulating financial technology pipelines, perspective chart analysis, and real-time visualization dashboards.",
    link: "https://drive.google.com/drive/folders/1JeOAF5lb7O-ZUYUo-lhzt2yzIO1gLS7y",
  },
];

export const Certifications = () => {
  return (
    <section id="certifications" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-highlight/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            My Credentials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Certifications &{" "}
            <span className="font-serif italic font-normal text-white">
              Achievements.
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            Verified accomplishments, core skill endorsements, and specialized training archives representing my technical journey.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="glass p-8 rounded-3xl glow-border flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group"
            >
              <div>
                {/* Header Icon & Verification */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Title & Info */}
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  {cert.issuer}
                </span>
                <h3 className="text-xl font-bold mb-3 text-secondary-foreground group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {cert.description}
                </p>
              </div>

              {/* Footer Date & Link */}
              <div className="flex items-center justify-between pt-6 border-t border-border/40">
                <span className="text-xs font-medium text-muted-foreground">
                  {cert.date}
                </span>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-primary transition-colors"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
