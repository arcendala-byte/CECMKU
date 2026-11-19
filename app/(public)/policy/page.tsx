import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Election Policy | CECMKU",
  description: "Participation, candidate, campaign, voting, and results policies for the CECMKU Election Portal.",
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "1. Purpose and scope",
    paragraphs: [
      "This policy explains the rules for using the CECMKU Election Portal to register, administer, and participate in community elections. It applies to voters, candidate applicants, candidates, and administrators.",
      "This policy works alongside the CECMKU Constitution, the current election notice, and any election-specific rules published by the election committee. Where a specific election notice sets a deadline or procedure, follow that notice. The committee should resolve any inconsistency with the governing community documents.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility and accounts",
    bullets: [
      "Voting is limited to eligible CECMKU members with an active, approved portal account and voter profile.",
      "Account registration details must be accurate and belong to the person using the account. Do not impersonate another member, create duplicate accounts, or share login credentials.",
      "An account may be pending until reviewed, suspended if eligibility or security concerns arise, or reactivated after committee review.",
      "Keep your password private, use a device you trust, and sign out when using a shared device. Contact the committee promptly if you suspect account access by another person.",
    ],
  },
  {
    id: "candidate-applications",
    title: "3. Candidate applications and campaign information",
    paragraphs: [
      "Candidate applications may be submitted before an election has been created. Submission creates a reference number for follow-up; it is not confirmation of eligibility, approval, nomination, or a place on a ballot.",
      "Applicants must provide truthful academic and contact details, identify the position they intend to contest, and submit their own profile and manifesto. The committee may review the application and request clarification or supporting material before making a decision.",
      "The portal prevents more than one application using the same registration number within a calendar-year cycle. Contact the committee if you believe a duplicate submission was made in error.",
    ],
    bullets: [
      "Only applications approved by authorized administrators are added to the candidate roster for election setup.",
      "Administrators assign approved candidates to election positions. The intended position on an application is considered during assignment.",
      "Once approved, a candidate's profile photograph, biography, and manifesto may be displayed publicly with the candidate listing. Supporting documents remain restricted to authorized administrators.",
      "Applicants must have the right to provide every uploaded image or document and must not submit unlawful, misleading, abusive, or malicious content.",
    ],
  },
  {
    id: "campaign-conduct",
    title: "4. Campaign conduct and acceptable use",
    paragraphs: [
      "Campaigning must follow the Constitution, the current election notice, and committee directions. Candidates and supporters are responsible for keeping campaign communication respectful and based on accurate information.",
    ],
    bullets: [
      "Do not buy, sell, coerce, or improperly influence votes, or interfere with another member's ability to participate freely.",
      "Do not harass, threaten, discriminate against, or impersonate another person.",
      "Do not submit false information, forged documents, another person's photograph, or material you are not authorized to use.",
      "Do not attempt to access another account, bypass eligibility checks, submit multiple ballots, probe or disrupt the portal, or interfere with election records.",
      "Report suspected security issues or election misconduct to the committee rather than attempting to investigate by accessing data or accounts.",
    ],
  },
  {
    id: "voting",
    title: "5. Voting rules and ballot submission",
    bullets: [
      "A voter may submit one ballot per election. The portal enforces this using the voter profile and election participation records.",
      "A ballot can be submitted only while the election is open and within its published voting period. Follow the ballot instructions for mandatory positions and selection limits.",
      "Review all selections before submitting. A submitted ballot cannot be edited or withdrawn through the portal.",
      "Do not ask another person to vote using your account or attempt to learn how an individual voted.",
      "If a technical problem prevents submission, contact the committee promptly and include the election name and a description of the issue. Do not send your password or ballot selections in a public channel.",
    ],
    notice: "Ballot privacy is described in the Privacy Notice. The portal separates ballot selections from voter profile fields, but it does not currently guarantee that a privileged administrator with database access could not correlate records using the shared ballot reference.",
  },
  {
    id: "administration",
    title: "6. Election administration and results",
    paragraphs: [
      "Authorized administrators manage voter accounts, candidate applications, election schedules, positions, candidate assignments, and results. Administrative actions are recorded in audit logs to support accountability.",
      "The committee may pause, reschedule, close, or otherwise manage an election where required by the Constitution, the election notice, security, or operational circumstances. Any material change should be communicated through an official community channel.",
      "After voting closes, results may be checked and verified before publication. The official published result and the committee's announced process govern; dashboard counts or preliminary information should not be treated as final unless expressly marked official.",
    ],
  },
  {
    id: "complaints",
    title: "7. Questions, disputes, and complaints",
    paragraphs: [
      "Raise eligibility questions, suspected duplicate accounts, candidate-application concerns, accessibility problems, or election disputes with the election committee using the contact details on the Contact page. Include the election name and relevant reference number where available, but do not include your password.",
      "Follow the deadlines and appeal procedure in the applicable election notice or Constitution. The portal does not create a separate appeal deadline or replace those governing procedures.",
    ],
  },
  {
    id: "availability",
    title: "8. Availability and policy changes",
    paragraphs: [
      "The portal is provided to support community election administration. Access may be interrupted for maintenance, security response, network conditions, or technical failure. Keep track of published deadlines and contact the committee promptly if an interruption affects your participation.",
      "The committee may update this policy to reflect changes to the portal or election procedures. The version displayed on this page is the current portal policy; election-specific notices and governing community documents remain important.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact",
    paragraphs: [
      "For questions about this policy or how it applies to a particular election, contact the CECMKU election committee through the portal's Contact page.",
    ],
  },
];

export default function PolicyPage() {
  return (
    <LegalPage
      title="Election and Acceptable Use Policy"
      summary="The rules for voter participation, candidate applications, campaigns, election administration, and responsible use of the CECMKU Election Portal."
      updated="November 18, 2026"
      sections={sections}
    />
  );
}
