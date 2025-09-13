import Link from "next/link";
import { Button } from "./ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
        <div className="animate-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Join thousands of students who have found their perfect short-term
            housing through SubLease Pro. Start your search today or list your
            property in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-background text-primary dark:bg-background/90 hover:bg-background/90 px-8 py-4 text-lg"
              >
                Sign Up Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
