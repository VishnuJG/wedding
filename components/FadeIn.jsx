"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}) {
  const { ref, isInView } = useInView();

  const directionClass = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  }[direction];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", directionClass),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
