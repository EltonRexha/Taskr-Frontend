import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { StaggeredCards } from "@/components/StaggeredCards";

export function CTA() {
  return (
    <section className="py-16 sm:py-20 px-4 border-t border-border">
      <StaggeredCards className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Ready to take control of your projects?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Join thousands of teams using Taskr to ship faster. Free forever, no
          strings attached.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8"
            >
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://github.com/taskr/taskr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <Github className="mr-2 h-4 w-4" />
              View Source Code
            </Button>
          </a>
        </div>
      </StaggeredCards>
    </section>
  );
}
