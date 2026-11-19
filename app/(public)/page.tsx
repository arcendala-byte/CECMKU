import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/database/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ElectionCountdown } from "@/components/public/election-countdown";
import { HomeEntrance, HomeReveal, TypewriterHeading } from "@/components/public/home-motion";
import { ArrowRight, Vote, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let activeElection = await prisma.election.findFirst({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });

  if (!activeElection) {
    activeElection = await prisma.election.findFirst({
      where: { status: { in: ["SCHEDULED", "CLOSED", "PUBLISHED"] } },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="flex flex-col bg-white">

      {/* FULL-SCREEN HERO WITH OVERLAY */}
      <section className="relative w-full min-h-[78vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B1930]">
        <Image
          src="/images/congo.jpg"
          alt="MKU Congolese Students Community"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0B1930]/70 z-10" />

        <HomeEntrance className="relative z-20 flex w-full max-w-6xl mx-auto justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto hero-enter text-center">
            <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase mb-4">
              MKU Congolese Students Community
            </p>
            <TypewriterHeading className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6" />
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl mx-auto">
              Every vote shapes the future of our community. Discover the candidates, explore their vision and take part in choosing the leaders who will represent us.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/candidates">
                <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1d4ed8] text-white border-0">
                  Explore Candidates
                </Button>
              </Link>
              <Link href="/guidelines">
                <Button size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  How Voting Works
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              An election platform for registered community members.
            </p>
          </div>
        </HomeEntrance>
      </section>

      {/* ELECTION INFORMATION */}
      <section className="border-y border-[#E5E7EB] bg-white">
        <HomeReveal className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          {activeElection ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-start">
              <div>
                <p className="text-xs md:text-sm font-medium text-[#667085] mb-1">Current Election</p>
                <p className="text-sm md:text-base font-semibold text-[#0B1930] line-clamp-2">{activeElection.title}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[#667085] mb-2">Status</p>
                <StatusBadge status={activeElection.status} />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[#667085] mb-1">Voting Opens</p>
                <p className="text-sm md:text-base font-medium text-[#0B1930]">{format(activeElection.startAt, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[#667085] mb-1">Voting Closes</p>
                <p className="text-sm md:text-base font-medium text-[#0B1930]">{format(activeElection.endAt, "MMM d, yyyy")}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#667085]">No active election at the moment.</p>
            </div>
          )}
        </HomeReveal>
      </section>

      {/* COUNTDOWN SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-28 w-full border-b border-[#E5E7EB]">
        <HomeReveal className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1930] tracking-tight mb-2 md:mb-3">
            {activeElection?.status === "SCHEDULED"
              ? "Get Ready to Vote"
              : activeElection?.status === "OPEN"
                ? "Voting is Currently Open"
                : "Election Timeline"}
          </h2>
          <p className="text-[#667085] text-sm sm:text-lg">
            {activeElection?.status === "SCHEDULED"
              ? "The official voting period is approaching. Make sure your account is active and ready."
              : activeElection?.status === "OPEN"
                ? "The polls are open! Make sure you cast your ballot before time runs out."
                : "Stay informed about the current election status and when you can cast your ballot."}
          </p>
        </HomeReveal>

        {activeElection ? (
          <HomeReveal className="flex flex-col items-center justify-center">

            {activeElection.status === "SCHEDULED" && (
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl sm:rounded-3xl p-3 sm:p-8 md:p-12 shadow-sm text-center w-full max-w-2xl flex flex-col items-center">
                <p className="text-[10px] sm:text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3 sm:mb-5 md:mb-8">
                  Voting Begins In
                </p>
                <ElectionCountdown targetDate={activeElection.startAt.toISOString()} theme="light" />
              </div>
            )}

            {activeElection.status === "OPEN" && (
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl sm:rounded-3xl p-3 sm:p-8 md:p-12 shadow-sm text-center w-full max-w-2xl flex flex-col items-center">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 sm:mb-6">
                  <Vote className="h-5 w-5 sm:h-8 sm:w-8 text-[#16A34A]" />
                </div>
                <h3 className="text-base sm:text-2xl font-bold text-[#0B1930] mb-3 sm:mb-5 md:mb-8">Voting Closes In</h3>

                <div className="w-full mb-3 sm:mb-6 md:mb-10">
                  <ElectionCountdown targetDate={activeElection.endAt.toISOString()} theme="light" />
                </div>

                <Link href="/login">
                  <Button size="lg" className="bg-[#142B4A] hover:bg-[#0B1930] text-white px-5 sm:px-8 text-sm sm:text-base">
                    Access Voter Portal
                  </Button>
                </Link>
              </div>
            )}

            {(activeElection.status === "CLOSED" || activeElection.status === "RESULTS_PENDING") && (
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm text-center w-full max-w-2xl flex flex-col items-center">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <ShieldCheck className="h-5 w-5 sm:h-8 sm:w-8 text-[#D97706]" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-[#0B1930] mb-2">Voting has Concluded</h3>
                <p className="text-xs sm:text-base text-[#667085] mb-6 sm:mb-8 max-w-md mx-auto">
                  The election committee is currently verifying the final results. Official results will be published shortly.
                </p>
              </div>
            )}

            {activeElection.status === "PUBLISHED" && (
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm text-center w-full max-w-2xl flex flex-col items-center">
                <h3 className="text-lg sm:text-2xl font-bold text-[#0B1930] mb-2">Official Results Published</h3>
                <p className="text-xs sm:text-base text-[#667085] mb-6 sm:mb-8 max-w-md mx-auto">
                  The verified results for the {activeElection.title} are now available for public viewing.
                </p>
                <Link href="/results">
                  <Button size="lg" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm sm:text-base">
                    View Official Results <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

          </HomeReveal>
        ) : (
          <HomeReveal className="border border-[#E5E7EB] rounded-3xl p-12 text-center bg-[#F7F8FA] w-full max-w-2xl mx-auto">
            <p className="text-[#667085]">Check back soon for upcoming election timelines.</p>
          </HomeReveal>
        )}
      </section>

      {/* HOW VOTING WORKS */}
      <section className="bg-white py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <HomeReveal className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1930] tracking-tight mb-2 md:mb-3">Your Vote. Your Choice.</h2>
            <p className="text-[#667085] text-sm sm:text-lg">A straightforward, secure process designed to ensure every voice is heard.</p>
          </HomeReveal>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <HomeReveal delay={0}>
              <span className="block text-3xl md:text-4xl font-light text-[#2563EB] mb-2 md:mb-4">01</span>
              <h3 className="text-base md:text-lg font-semibold text-[#0B1930] mb-1 md:mb-2">Sign In</h3>
              <p className="text-sm md:text-base text-[#667085] leading-relaxed">Access the platform using your registered voter credentials.</p>
            </HomeReveal>
            <HomeReveal delay={0.1}>
              <span className="block text-3xl md:text-4xl font-light text-[#2563EB] mb-2 md:mb-4">02</span>
              <h3 className="text-base md:text-lg font-semibold text-[#0B1930] mb-1 md:mb-2">Choose Your Candidates</h3>
              <p className="text-sm md:text-base text-[#667085] leading-relaxed">Review candidate profiles and select your preferred representatives.</p>
            </HomeReveal>
            <HomeReveal delay={0.2}>
              <span className="block text-3xl md:text-4xl font-light text-[#2563EB] mb-2 md:mb-4">03</span>
              <h3 className="text-base md:text-lg font-semibold text-[#0B1930] mb-1 md:mb-2">Submit Your Vote</h3>
              <p className="text-sm md:text-base text-[#667085] leading-relaxed">Review your selections and securely submit your ballot.</p>
            </HomeReveal>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative isolate overflow-hidden min-h-[420px] md:min-h-[480px] flex items-center py-14 md:py-24 px-4">
        <Image
          src="/images/congo.jpg"
          alt="Students participating in their community"
          fill
          sizes="100vw"
          className="object-cover object-center -z-20"
        />
        <div className="absolute inset-0 bg-[#081426]/75 -z-10" />
        <HomeEntrance className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Be Part of the Decision.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
            Your participation matters. Take an active role in shaping the future of our community.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-[#142B4A] hover:bg-gray-100 px-6 sm:px-8 text-sm sm:text-base">
              Access Voter Portal
            </Button>
          </Link>
          <Link href="/candidate-registration" className="mt-4 inline-block text-sm font-medium text-white underline underline-offset-4 hover:text-blue-100">
            Register as a candidate
          </Link>
        </HomeEntrance>
      </section>

    </div>
  );
}
