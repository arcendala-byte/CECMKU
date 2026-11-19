import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  notice?: string;
};

export function LegalPage({
  title,
  summary,
  updated,
  sections,
}: {
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 rounded-2xl bg-[#0B1930] px-5 py-8 text-white sm:px-8 sm:py-10">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck className="h-6 w-6 text-blue-200" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">CECMKU · Community Election Portal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">{summary}</p>
        <p className="mt-5 text-xs text-slate-300">Last updated: {updated}</p>
      </header>

      <nav aria-label="On this page" className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#0B1930]">On this page</h2>
        <ul className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <Link href={`#${section.id}`} className="inline-flex rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#475467] transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB] bg-white px-5 sm:px-8">
        {sections.map((section) => (
          <section id={section.id} key={section.id} className="scroll-mt-24 py-6 sm:py-8">
            <h2 className="text-lg font-semibold text-[#0B1930] sm:text-xl">{section.title}</h2>
            {section.notice && <p className="mt-4 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{section.notice}</p>}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-[#475467]">{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#475467] marker:text-[#2563EB]">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}
      </article>

      <aside className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-[#344054]">
        Questions about this information? <Link href="/contact" className="font-semibold text-[#1D4ED8] underline underline-offset-2">Contact the election committee</Link>.
      </aside>
    </div>
  );
}
