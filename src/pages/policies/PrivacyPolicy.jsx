import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <>
        <p className="mb-4">
          This Privacy Policy explains how <strong className="text-[#E31E2E]">Books Ka Bazaar</strong> collects, uses,
          stores, shares, and protects personal data in compliance with:
        </p>
        <ul className="space-y-2 mb-4 pl-2">
          {[
            "The Digital Personal Data Protection Act, 2023 (\u201cDPDP Act\u201d) and rules made thereunder;",
            "The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011;",
            "The Information Technology Act, 2000.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          By using the Platform, you consent to the collection, processing, and use of your personal data as described
          in this Privacy Policy. This Policy should be read in conjunction with the Terms &amp; Conditions.
        </p>
      </>
    ),
  },
  {
    heading: "Categories of Personal Data Collected",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-700">
              <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/3">Data Category</th>
              <th className="text-left px-4 py-3 font-semibold border border-stone-200">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Identity Data", "Full name, date of birth, PAN, Aadhaar (for KYC where applicable)"],
              ["Contact Data", "Email address, mobile number, billing and shipping address"],
              ["Financial Data", "Bank account details, UPI ID (processed by PCI-DSS compliant gateways; not stored by Books Ka Bazaar)"],
              ["Transaction Data", "Order history, purchase amounts, dispute records, Seller payout records"],
              ["Communication Data", "Messages exchanged with Sellers via Platform messaging, support tickets"],
              ["Technical Data", "IP address, device type, browser type, operating system, device identifiers"],
              ["Usage Data", "Pages visited, search queries, wishlist activity, click patterns, time on site"],
              ["Cookies & Tracking", "Session cookies, analytics cookies, preference cookies"],
            ].map(([category, description], i) => (
              <tr key={category} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{category}</td>
                <td className="px-4 py-3 text-stone-500 border border-stone-200">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    heading: "Purposes of Processing",
    body: (
      <>
        <p className="mb-4">Books Ka Bazaar processes personal data for the following purposes:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Account creation, authentication, and identity verification (KYC);"],
            ["(b)", "Processing and fulfilling orders, payments, and refunds;"],
            ["(c)", "Facilitating communication between Buyers and Sellers through the Platform's messaging system;"],
            ["(d)", "Sending transactional notifications including order confirmations, dispatch alerts, OTPs, and refund status updates;"],
            ["(e)", "Sending promotional communications and newsletters, subject to your explicit consent (you may unsubscribe at any time);"],
            ["(f)", "Fraud detection, prevention, and platform security;"],
            ["(g)", "Analytics and improvement of Platform features and User experience;"],
            ["(h)", "Compliance with statutory and regulatory obligations including GST, TDS, court orders, and law enforcement requests;"],
            ["(i)", "Resolving disputes and enforcing Platform policies."],
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
    heading: "Legal Basis for Processing",
    body: (
      <div className="space-y-3">
        {[
          ["Contract performance", "Processing necessary to execute your orders and manage your account."],
          ["Legal obligation", "Compliance with Indian tax, regulatory, and law enforcement requirements."],
          ["Legitimate interests", "Fraud prevention, security, analytics, and Platform improvement."],
          ["Consent", "Marketing communications (withdrawal of consent will not affect prior processing)."],
        ].map(([basis, desc]) => (
          <div key={basis} className="flex gap-3">
            <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
            <span>
              <strong className="text-stone-700">{basis}:</strong> {desc}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "Data Sharing — With Whom & Why",
    body: (
      <>
        <p className="mb-4">
          Books Ka Bazaar shares personal data only to the extent necessary for the following purposes:
        </p>
        <div className="space-y-3 mb-5">
          {[
            ["(a)", "Registered Sellers: Name, delivery address, and phone number are shared to enable the Seller to fulfil your order."],
            ["(b)", "Payment Gateways & Banks: Financial data is shared for secure transaction processing. Payment service providers maintain their own privacy policies and security standards."],
            ["(c)", "Logistics / Courier Partners: Name, delivery address, and contact number are shared for the purpose of physical book delivery."],
            ["(d)", "Cloud & Technology Service Providers: Hosting, analytics, email, and communication service providers, under strict data processing agreements that bind them to confidentiality and security obligations."],
            ["(e)", "Legal & Regulatory Authorities: Personal data may be disclosed when required by law, court order, government directive, or where Books Ka Bazaar has a good-faith belief that disclosure is necessary to prevent or investigate harm, fraud, or illegal activity."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="bg-stone-50 border-l-4 border-[#E31E2E] pl-4 py-2 rounded-r-lg text-stone-600 italic">
          Books Ka Bazaar does <strong className="not-italic text-stone-700">NOT</strong> sell, rent, or trade your
          personal information to any third party for advertising or commercial purposes.
        </p>
      </>
    ),
  },
  {
    heading: "Data Retention",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-700">
              <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/2">Data Type</th>
              <th className="text-left px-4 py-3 font-semibold border border-stone-200">Retention Period</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Account & Profile Data", "Duration of account + 5 years post-closure (legal compliance)"],
              ["Transaction Records", "8 years (GST Act / Income Tax Act requirements)"],
              ["Communication Records", "3 years from the date of communication"],
              ["Marketing Preferences", "Until consent is withdrawn"],
              ["KYC Documents", "As mandated by applicable law or regulatory guidance"],
            ].map(([type, period], i) => (
              <tr key={type} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{type}</td>
                <td className="px-4 py-3 text-stone-500 border border-stone-200">{period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    heading: "Your Rights Under the DPDP Act, 2023",
    body: (
      <>
        <p className="mb-4">
          Under the Digital Personal Data Protection Act, 2023, you have the following rights with respect to your
          personal data:
        </p>
        <div className="space-y-3 mb-5">
          {[
            ["(a)", "Right to Access: You may request a summary of personal data that Books Ka Bazaar processes about you."],
            ["(b)", "Right to Correction: You may request the correction of inaccurate or outdated personal data."],
            ["(c)", "Right to Erasure: You may request the deletion of your personal data, subject to Books Ka Bazaar's legal retention obligations."],
            ["(d)", "Right to Grievance Redressal: You may file a complaint with our designated Data Protection Officer."],
            ["(e)", "Right to Nominate: You may nominate a person to exercise your data rights in the event of your death or incapacity."],
            ["(f)", "Right to Withdraw Consent: You may withdraw your consent to marketing communications at any time, without affecting the lawfulness of processing carried out prior to withdrawal."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          To exercise any of the above rights, please send an email to{" "}
          <a
            href="mailto:privacy@bookskabazaar.com"
            className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            privacy@bookskabazaar.com
          </a>{" "}
          with the subject line:{" "}
          <em>'Data Rights Request – [Your Registered Email Address]'</em>. Books Ka Bazaar will respond to your request
          within <strong className="text-stone-700">30 (thirty) days</strong> of receipt.
        </p>
      </>
    ),
  },
  {
    heading: "Cookies & Tracking Technologies",
    body: (
      <>
        <p className="mb-4">We use the following categories of cookies on the Platform:</p>
        <div className="space-y-3 mb-4">
          {[
            ["(a)", "Strictly Necessary Cookies: Required for core Platform functionality, including login sessions and shopping cart management. These cannot be disabled without impairing Platform functionality."],
            ["(b)", "Analytics Cookies: Used to understand how Users interact with the Platform, including page visits, search behaviour, and navigation patterns (e.g., Google Analytics)."],
            ["(c)", "Preference Cookies: Used to remember your settings and personalise your browsing experience on the Platform."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="text-stone-500">
          You may manage your cookie preferences through your browser settings at any time. Please note that disabling
          strictly necessary cookies may impair or prevent certain Platform features from functioning correctly.
        </p>
      </>
    ),
  },
  {
    heading: "Data Security",
    body: (
      <p>
        Books Ka Bazaar implements commercially reasonable administrative, technical, and physical security measures to
        protect your personal data, including encryption in transit (TLS/SSL), access controls, and periodic security
        audits. However, no method of internet transmission or electronic data storage is completely secure. Books Ka
        Bazaar shall not be liable for any unauthorised access to or disclosure of personal data resulting from
        circumstances beyond its reasonable control.
      </p>
    ),
  },
  {
    heading: "Children's Privacy",
    body: (
      <p>
        The Platform is not intended for use by children under the age of{" "}
        <strong className="text-stone-700">13 (thirteen) years</strong>. Books Ka Bazaar does not knowingly collect
        personal data from children below this age. If Books Ka Bazaar becomes aware that a child has provided personal
        data without verifiable parental consent, such data will be deleted promptly.
      </p>
    ),
  },
  {
    heading: "Data Protection Officer",
    body: (
      <>
        <p className="mb-3">
          Books Ka Bazaar has designated a Data Protection Officer in accordance with applicable law. The Data
          Protection Officer may be contacted at:
        </p>
        <p>
          <strong className="text-stone-700">Email: </strong>
          <a
            href="mailto:dpo@bookskabazaar.com"
            className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            dpo@bookskabazaar.com
          </a>
        </p>
      </>
    ),
  },
  {
    heading: "Changes to this Policy",
    body: (
      <p>
        Material changes to this Privacy Policy will be communicated to registered Users via email and/or a prominent
        notice on the Platform at least{" "}
        <strong className="text-stone-700">15 (fifteen) days</strong> before the change takes effect. Your continued use
        of the Platform after the effective date shall constitute acceptance of the revised Privacy Policy.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return <PolicyPage title="Privacy Policy" sections={sections} />;
}
