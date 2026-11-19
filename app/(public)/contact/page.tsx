import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Headphones,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function buildWhatsAppDirectUrl(phone: string) {
  const url = new URL("https://wa.me");
  url.pathname = ["", phone].join("/");
  url.searchParams.set(
    "text",
    "Hello CECMKU Election Committee, I need assistance with the election portal."
  );
  return url.toString();
}

const contactMethods = [
  {
    number: "+254 780 003 817",
    tel: "tel:+254780003817",
    whatsappUrl: buildWhatsAppDirectUrl("254780003817"),
  },
  {
    number: "+254 115 755 868",
    tel: "tel:+254115755868",
    whatsappUrl: buildWhatsAppDirectUrl("254115755868"),
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#2563EB] text-sm font-semibold mb-6">
            <Headphones className="w-4 h-4" />
            We&apos;re here to help
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1930] tracking-tight mb-5">
            Get in Touch
            <span className="text-[#2563EB]">.</span>
          </h1>

          <p className="text-[#667085] text-base md:text-lg leading-relaxed">
            Have questions about the election process, need assistance with
            your account, or require more information? Reach out to our team
            through any of the channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone and WhatsApp */}
          <Card className="border border-[#E5E7EB] shadow-none rounded-xl bg-white">
            <CardContent className="p-7 md:p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-[#2563EB]" />
              </div>

              <h2 className="text-xl font-bold text-[#0B1930] mb-2">
                Call or WhatsApp
              </h2>

              <p className="text-sm text-[#667085] leading-relaxed mb-7">
                Speak directly with our team or send us a message on WhatsApp.
              </p>

              <div className="space-y-5">
                {contactMethods.map((contact) => (
                  <div
                    key={contact.tel}
                    className="border-t border-[#E5E7EB] pt-5"
                  >
                    <p className="text-lg font-semibold text-[#0B1930] mb-4">
                      {contact.number}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={contact.tel}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>

                      <a
                        href={contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[#16A34A] text-[#16A34A] text-sm font-medium hover:bg-green-50 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border border-[#E5E7EB] shadow-none rounded-xl bg-white">
            <CardContent className="p-7 md:p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-[#2563EB]" />
              </div>

              <h2 className="text-xl font-bold text-[#0B1930] mb-2">
                Email Us
              </h2>

              <p className="text-sm text-[#667085] leading-relaxed mb-7">
                For general inquiries, election-related questions, or
                assistance, send us an email.
              </p>

              <div className="border-t border-[#E5E7EB] pt-5">
                <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider mb-2">
                  Email Address
                </p>

                <a
                  href="mailto:arcelndala@gmail.com"
                  className="text-lg md:text-xl font-semibold text-[#2563EB] hover:underline break-all"
                >
                  arcelndala@gmail.com
                </a>

                <a
                  href="mailto:arcelndala@gmail.com"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send an Email
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start gap-4 p-6 bg-white border border-[#E5E7EB] rounded-xl">
            <div className="w-11 h-11 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#D97706]" />
            </div>

            <div>
              <h3 className="font-semibold text-[#0B1930] mb-1">
                Our Location
              </h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Mount Kenya University
                <br />
                Thika, Kenya
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white border border-[#E5E7EB] rounded-xl">
            <div className="w-11 h-11 shrink-0 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#16A34A]" />
            </div>

            <div>
              <h3 className="font-semibold text-[#0B1930] mb-1">
                Contact Availability
              </h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Contact us by phone, WhatsApp, or email.
                <br />
                Our team will respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-[#0B1930] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            We&apos;re Ready to Assist You
          </h2>

          <p className="text-blue-100/75 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-7">
            Your questions and concerns matter. Get in touch with us and let us
            help you navigate the election process.
          </p>

          <a
            href={contactMethods[0].whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0B1930] rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat With Us
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
