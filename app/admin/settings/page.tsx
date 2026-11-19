import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Database, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0B1930]">System Settings</h1>
        <p className="text-[#667085] mt-1">Manage platform configuration and security preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
            Election Integrity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
            <div>
              <p className="font-medium text-[#0B1930]">              Ballot Record Separation</p>
              <p className="text-sm text-[#667085]">Voter profile fields are stored separately from ballot selections; shared references may still permit correlation by privileged database users.</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Separate records
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
            <div>
              <p className="font-medium text-[#0B1930]">Double Voting Prevention</p>
              <p className="text-sm text-[#667085]">Database constraints prevent a voter from submitting more than one ballot.</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Active
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#2563EB]" />
            Database Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
            <p className="font-medium text-[#0B1930] mb-2">Automated Backups</p>
            <p className="text-sm text-[#667085] mb-4">It is highly recommended to back up your MySQL database regularly, especially before major elections.</p>
            <Button variant="secondary" className="text-sm">
              Download Database Backup (.sql)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Application Name</Label>
              <Input defaultValue="MKU Community Election Portal" disabled />
            </div>
            <div>
              <Label>Version</Label>
              <Input defaultValue="1.0.0 (Production)" disabled />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button disabled>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
