"use client";
import {
  useWebsiteBuilderStore,
  HeroBlock,
  AboutBlock,
  FeaturesBlock,
  ContactBlock,
  NavbarBlock,
  TestimonialBlock,
  FooterBlock,
  FaqBlock,
  ProgramsBlock,
} from "@/lib/websiteBuilderStore";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Star,
  Target,
  Heart,
  Award,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Star,
  Target,
  Heart,
  Award,
};

export function WebsitePreview() {
  const { blocks, selectedBlockId, selectBlock } = useWebsiteBuilderStore();

  return (
    <div className="bg-card dark:bg-card rounded-lg shadow-lg overflow-hidden">
      {/* Browser Chrome */}
      <div className="bg-muted border-b px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/70" />
          <div className="w-3 h-3 rounded-full bg-warning" />
          <div className="w-3 h-3 rounded-full bg-success" />
        </div>
        <div className="flex-1 ml-4">
          <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground max-w-md">
            https://springfieldacademy.edu
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={cn(
              "relative cursor-pointer transition-all",
              selectedBlockId === block.id && "ring-2 ring-primary ring-inset",
            )}
            onClick={() => selectBlock(block.id)}
          >
            {block.type === "hero" && <HeroPreview block={block} />}
            {block.type === "about" && <AboutPreview block={block} />}
            {block.type === "features" && <FeaturesPreview block={block} />}
            {block.type === "contact" && <ContactPreview block={block} />}
            {block.type === "navbar" && <NavbarPreview block={block} />}
            {block.type === "testimonial" && (
              <TestimonialsPreview block={block} />
            )}
            {block.type === "footer" && <FooterPreview block={block} />}
            {block.type === "faq" && <FaqPreview block={block} />}
            {block.type === "programs" && <ProgramPreview block={block} />}

            {selectedBlockId === block.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Editing
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroPreview({ block }: { block: HeroBlock }) {
  return (
    <div
      className="relative h-80 flex items-center justify-center text-center p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${block.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{block.title}</h1>
        <p className="text-lg mb-6 opacity-90">{block.subtitle}</p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          {block.cta_text_1}
        </Button>
      </div>
    </div>
  );
}

function AboutPreview({ block }: { block: AboutBlock }) {
  return (
    <div className="py-16 px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {block.title}
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          {block.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Our Mission</h3>
            <p className="text-muted-foreground text-sm">{block.mission}</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Our Vision</h3>
            <p className="text-muted-foreground text-sm">{block.vision}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesPreview({ block }: { block: FeaturesBlock }) {
  return (
    <div className="py-16 px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          {block.title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {block.features.map((feature) => {
            const Icon = iconMap[feature.icon] || Star;
            return (
              <div key={feature.id} className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContactPreview({ block }: { block: ContactBlock }) {
  return (
    <div className="py-16 px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          {block.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-sm text-muted-foreground">{block.address}</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground">{block.phone}</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">{block.email}</p>
          </div>
        </div>

        {block.mapEmbedUrl && (
          <div className="mt-8 rounded-lg overflow-hidden">
            <iframe
              src={block.mapEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NavbarPreview({ block }: { block: NavbarBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();
  const handleUpdate = () => {
    updateBlock(block.id, {
      links: block.links.map((link) =>
        link.id === "home" ? { ...link, label: "Updated Home" } : link,
      ),
    });
  };

  return (
    <div className="bg-card dark:bg-card shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl text-primary">School Logo</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {block.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            onClick={handleUpdate}
            className="ml-4 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialsPreview({ block }: { block: TestimonialBlock }) {
  return (
    <div className="py-16 px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          {block.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {block.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background p-6 rounded-lg shadow-sm"
            >
              <p className="text-sm text-muted-foreground italic">
                {testimonial.feedback}
              </p>
              <div className="mt-4 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={testimonial.avatarUrl} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterPreview({ block }: { block: FooterBlock }) {
  return (
    <div className="bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-lg font-bold mb-2 text-foreground">
          {block.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{block.content}</p>
        <div className="text-sm text-muted-foreground">
          <p>{block.address}</p>
          <p>{block.phone}</p>
          <p>{block.email}</p>
        </div>
      </div>
    </div>
  );
}

function FaqPreview({ block }: { block: FaqBlock }) {
  return (
    <div className="py-16 px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          {block.title}
        </h2>
        <div className="space-y-4">
          {block.faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-background p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgramPreview({ block }: { block: ProgramsBlock }) {
  return (
    <div className="py-16 px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
          {block.title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.programs.map((program) => (
            <div
              key={program.id}
              className="text-center p-4 border rounded-lg hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2 text-foreground">
                {program.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
