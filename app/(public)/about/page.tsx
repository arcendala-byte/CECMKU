import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#0B1930] mb-6">About the Election</h1>
        <div className="prose prose-slate max-w-none text-[#667085]">
          <p className="mb-4 text-lg">
            Welcome to the official election portal for the Congolese Students Community at Mount Kenya University.
            This platform was built to ensure a free, fair, and transparent democratic process for all eligible members.
          </p>
          <p className="mb-4">
            Our goal is to provide a seamless digital voting experience that protects the integrity of every ballot.
            Voter profile fields are stored separately from ballot selections, although shared ballot references may allow privileged database users to correlate records.
          </p>

          <h2 className="text-xl font-semibold text-[#0B1930] mt-8 mb-4">Our Commitment</h2>
          <ul className="list-disc pl-6 space-y-2 mb-10">
            <li><strong className="text-[#0B1930]">Integrity:</strong> Every vote is counted accurately and securely.</li>
            <li><strong className="text-[#0B1930]">Transparency:</strong> The process is open to observation by all community members.</li>
            <li><strong className="text-[#0B1930]">Accessibility:</strong> The platform works on any device, ensuring everyone can participate.</li>
          </ul>
        </div>
      </div>

      {/* Constitution Download Card */}
      <div className="bg-[#142B4A] rounded-xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg shrink-0">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Community Constitution</h2>
            <p className="text-gray-300 text-sm max-w-md">
              Read the official rules, regulations, and guidelines that govern the Congolese Students Community and its elections.
            </p>
          </div>
        </div>

        <a
          href="/documents/constitution.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-full md:w-auto"
        >
          <Button size="lg" className="w-full md:w-auto bg-white text-[#142B4A] hover:bg-gray-100">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </a>
      </div>
    </div>
  );
}
