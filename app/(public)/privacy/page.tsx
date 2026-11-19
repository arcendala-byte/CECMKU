import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Privacy Notice | CECMKU",
  description: "Learn what information the CECMKU Election Portal collects, how it is used, and how ballot and candidate information is handled.",
};

const sections: LegalSection[] = [
  {
    id: "who",
    title: "1. Who administers this information",
    paragraphs: [
      "The CECMKU election committee administers the portal for community election and membership purposes. Contact the committee through the portal's Contact page to ask questions, request access to information, or raise a privacy concern.",
      "The specific organization responsible for data protection decisions and the hosting location can depend on the portal's deployment arrangements. Ask the committee for current operational details if you need them.",
    ],
  },
  {
    id: "information",
    title: "2. Information the portal handles",
    bullets: [
      "Account information: name, email address, password hash, role, account status, and account creation or update information.",
      "Voter information: registration/admission number, voter ID, eligibility status, and election participation records.",
      "Candidate application information: name, registration number, email, phone, faculty or school, department, course, year of study, intended position, biography, manifesto, profile photograph, supporting documents, application reference, and review status.",
      "Candidate profile information: approved candidate names, photographs, biographies, manifestos, and related election assignments may be displayed on public candidate pages.",
      "Election records: election and position assignments, ballot submission time, ballot references, selections, and result records.",
      "Administration and security records: administrator actions, affected record identifiers, timestamps, and, where configured, related request information such as IP address or browser details.",
      "Essential session information used to keep users signed in and protect authenticated areas of the portal.",
    ],
  },
  {
    id: "purposes",
    title: "3. How information is used",
    paragraphs: [
      "Information is used to create and secure accounts; confirm voter eligibility; receive and review candidate applications; publish approved candidate material; configure elections; prevent duplicate voting; count and verify results; investigate reported issues; maintain audit records; and respond to requests or disputes.",
      "Passwords are processed for authentication and stored as password hashes rather than as plain-text passwords. Do not send your password to committee members or include it in a support request.",
    ],
  },
  {
    id: "ballots",
    title: "4. Ballot records and privacy limitations",
    paragraphs: [
      "The portal stores voter participation records separately from the ballot selections. A participation record identifies the voter profile and election and stores a unique ballot reference. A separate ballot record stores that same reference, and selections are attached to the ballot record.",
      "This separation is intended to keep voter identity fields out of the ballot-selection record and to enforce one ballot per voter. However, because the same reference is stored in both records, a person with privileged database access could technically correlate a participation record with its ballot and selections. The current implementation therefore should not be described as providing cryptographic or absolute anonymity against privileged access.",
      "The committee should restrict database and administrator access to authorized people and handle ballot information with care. Voters should not share credentials or attempt to access another person's records.",
    ],
    notice: "Important: although ballot selections are stored separately from voter profile fields, the shared ballot reference can be used to correlate the records by someone with privileged database access.",
  },
  {
    id: "candidate-files",
    title: "5. Candidate applications, files, and public display",
    paragraphs: [
      "Candidate application photographs and supporting documents are uploaded for committee review. Application files are stored outside the public web directory and are served through an administrator-authorized route. Supporting documents are not intended for public display.",
      "When an application is approved, the submitted profile photograph may be copied to the public candidate image area so that it can appear on the candidate's public profile. Candidate profile text and manifestos may also be displayed publicly. Do not include private or sensitive information in material intended for a public campaign profile.",
      "Only upload files you are authorized to provide. The portal accepts specified image formats for profile photographs and PDF files for supporting documents, subject to the upload size limits shown on the application form.",
    ],
  },
  {
    id: "sharing",
    title: "6. Who can access information",
    paragraphs: [
      "Authorized election administrators can access account and election-management information needed for their duties. Authorized administrators can review candidate applications and download supporting files. Public pages show published election information and approved candidate profiles.",
      "The portal does not use candidate or voter information for advertising or sell personal information. Information may be processed by the hosting, database, or file-storage services configured for the deployment, by technical support personnel when necessary to maintain the portal, or where disclosure is required to address a security incident or comply with an applicable legal obligation.",
    ],
  },
  {
    id: "retention",
    title: "7. Storage and retention",
    paragraphs: [
      "Portal records are stored in the configured MySQL database and application file storage. The actual storage location depends on the environment in which the portal is deployed.",
      "Information is retained for as long as reasonably needed to administer accounts and elections, verify results, handle disputes, maintain audit and election-integrity records, and meet applicable obligations. The portal does not currently publish a fixed deletion period for each category. Contact the committee to ask about a specific record or the current retention arrangements.",
      "A request to delete or change information may be limited where the record is needed to preserve a submitted ballot, election history, audit trail, or the integrity of a result. The committee should explain any applicable limitation when responding to a request.",
    ],
  },
  {
    id: "security",
    title: "8. Security and cookies",
    paragraphs: [
      "The portal uses authentication, role checks for administrative functions, database constraints, audit records, and restricted file routes to help protect information. No website or storage system can be guaranteed completely secure. Access is limited to the controls available in the deployed environment.",
      "Essential session cookies may be used to maintain sign-in and protect portal functions. The current site does not provide a separate advertising-cookie preference center. Avoid using shared or untrusted devices for voting, and sign out after use.",
      "If you suspect that an account or candidate file has been accessed improperly, contact the committee promptly through the Contact page. Do not send passwords or ballot selections in an unprotected message.",
    ],
  },
  {
    id: "choices",
    title: "9. Your choices and requests",
    paragraphs: [
      "You may ask the committee to confirm what information is held about you, correct inaccurate account or application details, or explain how a record is being used. Provide enough information to identify your account or application, such as your application reference, but do not send your password.",
      "Requests to erase, restrict, or change records are considered in light of applicable rules and the need to preserve voting integrity, submitted ballots, election results, and audit records. Candidate applicants may contact the committee to ask about withdrawing an application before it is used in election setup.",
      "Where you have a concern about how information is handled, contact the committee first. Any rights or complaint routes available under applicable data-protection law remain unaffected by this notice.",
    ],
  },
  {
    id: "children",
    title: "10. Changes to this notice",
    paragraphs: [
      "This notice may be updated when portal features, election procedures, or deployment arrangements change. The latest version and its update date will be shown on this page. Material changes should be communicated through an appropriate CECMKU channel.",
    ],
  },
  {
    id: "contact",
    title: "11. Privacy contact",
    paragraphs: [
      "For privacy questions or requests, contact the CECMKU election committee through the portal's Contact page. Include the relevant account or candidate application reference when appropriate.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Notice"
      summary="How the CECMKU Election Portal handles voter, candidate, ballot, and account information, including important limits on ballot anonymity."
      updated="November 18, 2026"
      sections={sections}
    />
  );
}
