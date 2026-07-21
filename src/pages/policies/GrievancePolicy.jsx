import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <p>
        In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules,
        2021, the Consumer Protection Act, 2019, and the Consumer Protection (E-Commerce) Rules, 2020,{" "}
        <strong className="text-[#E31E2E]">Books Ka Bazaar</strong> has designated a Grievance Officer to handle user
        complaints.
      </p>
    ),
  },
  {
    heading: "Scope of Grievances",
    body: (
      <div className="space-y-2">
        {[
          "Order-related issues: non-delivery, wrong product, damaged product, refund delays",
          "Seller conduct: misrepresentation, fraud, harassment, counterfeit products",
          "Privacy and data protection complaints",
          "Content and listing violations (prohibited items, IP infringement)",
          "Platform functionality and technical issues",
          "Account suspension or termination disputes",
        ].map((item) => (
          <div key={item} className="flex gap-2">
            <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "How to File a Grievance",
    body: (
      <>
        <div className="space-y-4 mb-5">
          {[
            ["Step 1", "Self-Service", "Use the My Orders → Raise Dispute tool for order-related issues."],
            ["Step 2", "Support Email", <>If unresolved, email{" "}<a href="mailto:support@bookskabazaar.com" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">support@bookskabazaar.com</a>{" "}with your Order ID, account email, and a description of the issue.</>],
            ["Step 3", "Grievance Officer", <>For unresolved issues or formal complaints, contact our designated Grievance Officer at{" "}<a href="mailto:grievance@bookskabazaar.com" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">grievance@bookskabazaar.com</a>.</>],
          ].map(([step, label, desc]) => (
            <div key={step} className="flex gap-4">
              <span className="bg-[#E31E2E] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 h-fit mt-0.5 whitespace-nowrap">
                {step}
              </span>
              <span>
                <strong className="text-stone-700">{label}: </strong>
                {desc}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-sm">
          <p className="font-semibold text-stone-700 mb-1">Grievance Officer Details</p>
          {[
            ["Grievance Officer", "Books Ka Bazaar Grievance Team"],
            ["Email", <a key="email" href="mailto:grievance@bookskabazaar.com" className="text-[#E31E2E]  underline underline-offset-2 hover:opacity-75 transition-opacity">grievance@bookskabazaar.com</a>],
            ["Acknowledgement", "Within 48 hours of receipt"],
            ["Resolution", "Within 15–30 business days depending on complexity"],
            ["Hours", "Monday to Saturday, 10:00 AM – 6:00 PM IST (excluding public holidays)"],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <span className="text-stone-500 shrink-0 w-36">{label}:</span>
              <span className="text-stone-700 min-w-0 break-all">{value}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    heading: "Escalation",
    body: (
      <>
        <p className="mb-4">
          If you are dissatisfied with Books Ka Bazaar's grievance resolution, you may approach:
        </p>
        <div className="space-y-2">
          {[
            "The National Consumer Disputes Redressal Commission (NCDRC) or State/District Consumer Forums under the Consumer Protection Act, 2019",
            "The Cyber Crime portal of the Ministry of Home Affairs (cybercrime.gov.in) for cybercrime-related complaints",
            "The Ministry of Electronics and Information Technology (MEITY) for complaints under the IT Act",
          ].map((item) => (
            <div key={item} className="flex gap-2">
              <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function GrievancePolicy() {
  return <PolicyPage title="Grievance Redressal Policy" sections={sections} />;
}
