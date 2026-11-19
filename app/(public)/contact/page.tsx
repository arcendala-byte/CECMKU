import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1930] tracking-tight mb-4">Contact the Committee</h1>
        <p className="text-[#667085] max-w-2xl mx-auto">
          Have questions about the election process or need help with your account? Our team is here to assist you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Mail className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B1930]">Email</h3>
                <p className="text-sm text-[#667085] mt-1">elections@mkucommunity.ac.ke</p>
                <p className="text-xs text-[#667085] mt-2">We aim to respond within 24 hours.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-2 bg-green-50 rounded-lg shrink-0">
                <Phone className="h-5 w-5 text-[#16A34A]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B1930]">Phone</h3>
                <p className="text-sm text-[#667085] mt-1">+254 700 000 000</p>
                <p className="text-xs text-[#667085] mt-2">Mon-Fri, 9:00 AM - 5:00 PM.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                <MapPin className="h-5 w-5 text-[#D97706]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0B1930]">Location</h3>
                <p className="text-sm text-[#667085] mt-1">Mount Kenya University<br />Thika, Kenya</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-[#0B1930] mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Write your message here..."
                  />
                </div>
                <Button type="button" className="w-full sm:w-auto mt-2">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
