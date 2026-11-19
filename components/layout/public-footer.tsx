import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/images/logo.png"
              alt="CECMKU Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[#0B1930] text-lg leading-tight">CECMKU</span>
              <span className="text-xs text-[#667085] leading-tight">(Communauté des Étudiants Congolais à MKU)</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#667085] max-w-sm">
            The official electronic voting platform for the Congolese Students Community at Mount Kenya University.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-[#0B1930] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#667085]">
            <li><Link href="/about" className="hover:text-[#2563EB]">About Us</Link></li>
            <li><Link href="/election" className="hover:text-[#2563EB]">Election Info</Link></li>
            <li><Link href="/candidates" className="hover:text-[#2563EB]">Candidates</Link></li>
            <li><Link href="/candidate-registration" className="hover:text-[#2563EB]">Candidate Registration</Link></li>
            <li><Link href="/policy" className="hover:text-[#2563EB]">Election Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-[#2563EB]">Privacy Notice</Link></li>
            <li><Link href="/results" className="hover:text-[#2563EB]">Results</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#0B1930] mb-4">Support & Transparency</h4>
          <ul className="space-y-2 text-sm text-[#667085]">
            <li><Link href="/contact" className="hover:text-[#2563EB]">Contact Us</Link></li>
            <li><Link href="/guidelines" className="hover:text-[#2563EB]">Voter Guidelines</Link></li>
            <li><Link href="/transparency" className="hover:text-[#2563EB]">Election Transparency</Link></li>
            <li>
              <a
                href="/documents/constitution.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2563EB] flex items-center gap-1"
              >
                Constitution (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-[#E5E7EB] text-sm text-[#667085] text-center">
        © {new Date().getFullYear()} CECMKU (Communauté des Étudiants Congolais à MKU). All rights reserved.
      </div>
    </footer>
  );
}
