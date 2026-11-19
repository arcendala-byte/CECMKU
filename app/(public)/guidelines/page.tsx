import { CheckCircle2, UserCheck, Shield, Vote, AlertTriangle } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1930] tracking-tight mb-4">Voter Guidelines</h1>
        <p className="text-[#667085] max-w-2xl mx-auto">
          Everything you need to know about participating in the MKU Community Election. Please read these guidelines carefully to ensure your vote is counted.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Eligibility */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserCheck className="h-5 w-5 text-[#2563EB]" />
            </div>
            <h2 className="text-lg font-semibold text-[#0B1930]">Eligibility Criteria</h2>
          </div>
          <ul className="space-y-3 text-sm text-[#667085]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
              <span>Must be a registered member of the Congolese Students Community at MKU.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
              <span>Must have an active, approved account on this portal.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
              <span>Must not be suspended by the Election Committee.</span>
            </li>
          </ul>
        </div>

        {/* Voting Rules */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield className="h-5 w-5 text-[#D97706]" />
            </div>
            <h2 className="text-lg font-semibold text-[#0B1930]">Voting Rules</h2>
          </div>
          <ul className="space-y-3 text-sm text-[#667085]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
              <span>Each voter is entitled to exactly <strong>one ballot</strong> per election.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A] mt-0.5 shrink-0" />
              <span>Once a ballot is submitted, it cannot be changed or withdrawn.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#D97706] mt-0.5 shrink-0" />
              <span>Sharing your login credentials with anyone is strictly prohibited.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step by Step */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#0B1930] mb-8 flex items-center gap-2">
          <Vote className="h-6 w-6 text-[#2563EB]" /> How to Cast Your Vote
        </h2>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E5E7EB] before:to-transparent">
          {[
            { step: 1, title: "Log In", desc: "Go to the Voter Login page and enter your assigned email and password." },
            { step: 2, title: "Access the Ballot", desc: "On your dashboard, click 'Vote Now' for the active election." },
            { step: 3, title: "Review Candidates", desc: "Read through the candidate profiles and manifestos provided on the ballot page." },
            { step: 4, title: "Make Your Selection", desc: "Select one candidate for each position. Mandatory positions must be filled." },
            { step: 5, title: "Submit and Confirm", desc: "Review your choices carefully, then click 'Submit Ballot'. A confirmation screen will appear." }
          ].map((item, i) => (
            <div key={i} className="relative flex items-start gap-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#142B4A] text-white font-bold shrink-0 z-10">
                {item.step}
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-[#0B1930]">{item.title}</h3>
                <p className="text-sm text-[#667085] mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
