"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/language-provider";

export function TypewriterHeading({ className }: { className?: string }) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const lines = language === "fr"
    ? ["Votre voix.", "Votre leadership.", "Votre avenir."]
    : ["Your Voice.", "Your Leadership.", "Your Future."];
  const fullHeading = lines.join(" ");
  let characterIndex = 0;

  return (
    <h1 className={className}>
      <span className="sr-only">{fullHeading}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span key={`${language}-${lineIndex}`} className="block">
            {Array.from(line).map((character, index) => {
              const delay = characterIndex++ * 0.045;
              return (
                <motion.span
                  key={`${language}-${lineIndex}-${index}`}
                  className="inline-block"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.01, delay: reduceMotion ? 0 : delay }}
                >
                  {character === " " ? "\u00a0" : character}
                </motion.span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function HomeEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomeReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
