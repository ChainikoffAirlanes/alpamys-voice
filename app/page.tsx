import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SubmissionForm } from "@/components/SubmissionForm";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <SubmissionForm />
      <HowItWorks />
      <Footer />
    </main>
  );
}
