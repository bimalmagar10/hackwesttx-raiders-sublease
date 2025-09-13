import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center space-x-2 ${className}`}
    >
      <div
        className={`bg-primary rounded-lg flex items-center justify-center ${sizeClasses[size]} shadow-lg dark:shadow-red-500/50 transition-all duration-300`}
      >
        <span className="text-primary-foreground font-bold">RS</span>
      </div>
      <span
        className={`font-bold text-primary ${textSizes[size]} dark:drop-shadow-glow transition-all duration-300`}
      >
        Raiders Sublease
      </span>
    </Link>
  );
}
