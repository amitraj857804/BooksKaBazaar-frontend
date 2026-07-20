import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <>
        <p className="mb-4">
          These Terms of Use govern your day-to-day conduct on the Platform. By browsing, registering, or transacting on{" "}
          <strong className="text-[#E31E2E]">Books Ka Bazaar</strong>, you agree to abide by these rules in addition to
          the Terms &amp; Conditions and all other applicable Platform policies.
        </p>
      </>
    ),
  },
  {
    heading: "Permitted Use",
    body: (
      <>
        <p className="mb-4">
          The Platform is made available for lawful, personal, and commercial use strictly in accordance with these
          terms. You are permitted to:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "Browse and search listings of books and educational resources on the Platform;"],
            ["(b)", "Register as a Buyer or Seller in accordance with the applicable eligibility criteria;"],
            ["(c)", "Place orders and make payments for products listed on the Platform;"],
            ["(d)", "Communicate with Sellers through the Platform's designated messaging system;"],
            ["(e)", "Leave genuine, verified reviews for completed orders as a Buyer."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    heading: "Prohibited Conduct",
    body: (
      <>
        <p className="mb-4">You must not, under any circumstances:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Upload, post, publish, or transmit any content that is false, misleading, defamatory, offensive, obscene, harassing, or unlawful;"],
            ["(b)", "Attempt to gain unauthorised access to any User account, Platform infrastructure, server, database, or network;"],
            ["(c)", "Use automated bots, scrapers, crawlers, spiders, or scripts to access, monitor, or harvest data from the Platform without the express prior written consent of Books Ka Bazaar;"],
            ["(d)", "Reverse-engineer, decompile, disassemble, or copy any part of the Platform's source code, design, or architecture;"],
            ["(e)", "Engage in off-platform transactions with Sellers or Buyers introduced through the Platform, for the purpose of bypassing Platform fees or payment systems;"],
            ["(f)", "Create multiple accounts to circumvent restrictions, bans, fee structures, or any other Platform policy;"],
            ["(g)", "Impersonate any person, company, entity, or public authority;"],
            ["(h)", "Transmit, upload, or introduce any malware, viruses, Trojan horses, ransomware, worms, or any other malicious code designed to disrupt, damage, or interfere with Platform functionality or security;"],
            ["(i)", "Violate any applicable Indian law, including but not limited to the Information Technology Act, 2000, the Copyright Act, 1957, and the Consumer Protection Act, 2019."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    heading: "Reviews & Ratings",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Reviews on the Platform may only be submitted by Buyers who have completed a verified purchase of the relevant product from the relevant Seller."],
          ["(b)", "All reviews must be truthful, relevant, and based on the Buyer's genuine personal experience with the product or transaction."],
          ["(c)", "Sellers must not offer incentives, discounts, gifts, threats, or any other inducement to solicit, manipulate, or suppress reviews or ratings."],
          ["(d)", "Books Ka Bazaar reserves the right to remove any review that is found to be false, defamatory, incentivised, commercially motivated, or otherwise in violation of these Terms of Use or community guidelines."],
          ["(e)", "Repeated submission of false, fabricated, or manipulated reviews may result in account suspension or permanent termination."],
        ].map(([code, text]) => (
          <div key={code} className="flex gap-3">
            <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "Platform Availability & Modifications",
    body: (
      <p>
        Books Ka Bazaar does not guarantee uninterrupted, continuous, or error-free access to the Platform. Scheduled or
        emergency maintenance activities may result in temporary unavailability of the Platform or specific features
        thereof. Books Ka Bazaar reserves the right to modify, update, suspend, or permanently discontinue any feature,
        functionality, or section of the Platform at any time, with reasonable prior notice where practicable.
      </p>
    ),
  },
  {
    heading: "Third-Party Links & Services",
    body: (
      <p>
        The Platform may contain hyperlinks to third-party websites, payment gateways, logistics tracking portals, or
        other external services. Books Ka Bazaar is not responsible for the content, accuracy, privacy practices,
        security standards, or terms of service of any third-party site or service. Your access to and use of any
        third-party service is entirely at your own risk and subject to the respective terms and policies of that third
        party.
      </p>
    ),
  },
  {
    heading: "Account Termination",
    body: (
      <>
        <div className="space-y-3 mb-5">
          <div className="flex gap-3">
            <span className="text-[#E31E2E] font-bold shrink-0 w-6">(a)</span>
            <span>
              Books Ka Bazaar may suspend or permanently terminate your account, with or without prior notice, for any of
              the following reasons:
            </span>
          </div>
        </div>
        <ul className="space-y-2 mb-5 pl-10">
          {[
            "Violation of these Terms of Use or any Platform policy;",
            "Fraudulent activity, misrepresentation, or provision of false information;",
            "Action required pursuant to a law enforcement request or judicial order;",
            "Repeated or severe violations of Seller performance standards.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <span className="text-[#E31E2E] font-bold shrink-0 w-6">(b)</span>
          <span>
            You may voluntarily close your account at any time by contacting{" "}
            <a
              href="mailto:support@bookskabazaar.com"
              className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              support@bookskabazaar.com
            </a>
            . Pending transactions, active disputes, or outstanding payout settlements will be completed before account
            closure is finalised.
          </span>
        </div>
      </>
    ),
  },
  {
    heading: "Amendments",
    body: (
      <p>
        Books Ka Bazaar reserves the right to amend these Terms of Use at any time. Users will be notified of all
        material changes via email and/or a prominent notice on the Platform at least{" "}
        <strong className="text-stone-700">15 (fifteen) days</strong> before the change takes effect. Your continued use
        of the Platform after the effective date of any amendment shall constitute your acceptance of the revised Terms
        of Use.
      </p>
    ),
  },
];

export default function TermsOfUse() {
  return <PolicyPage title="Terms of Use" sections={sections} />;
}
