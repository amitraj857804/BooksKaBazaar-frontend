import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <p>
        These Seller Terms supplement and must be read together with the General Terms &amp; Conditions (Section 2).
        They apply exclusively to all registered Sellers on{" "}
        <strong className="text-[#E31E2E]">Books Ka Bazaar</strong>.
      </p>
    ),
  },
  {
    heading: "Seller Eligibility & Registration",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Any individual, bookstore, publisher, distributor, or authorised reseller may apply to become a registered Seller on the Platform."],
          ["(b)", "Sellers must complete full KYC verification before listing any product. Required documents include: a valid government-issued photo identity document, PAN card, and bank account details for payout purposes."],
          ["(c)", "Business Sellers must provide a valid GST registration number where mandated under applicable law."],
          ["(d)", "Approval of Seller registration is at Books Ka Bazaar's sole discretion and may be revoked at any time without assigning reason."],
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
    heading: "Seller Responsibilities",
    body: (
      <>
        <p className="mb-4">All registered Sellers on the Platform are obligated to:</p>
        <div className="space-y-3">
          {[
            ["(a)", "List only genuine, legally saleable products over which the Seller holds full legal title or authorised resale rights;"],
            ["(b)", "Maintain accurate inventory counts; listings must not reflect availability for out-of-stock items;"],
            ["(c)", "Clearly describe book condition using Books Ka Bazaar's standardised grading system;"],
            ["(d)", "Dispatch confirmed orders within the committed dispatch timeframe;"],
            ["(e)", "Ensure all books are properly packed to prevent transit damage;"],
            ["(f)", "Respond to Buyer queries via Platform messaging within 24 (twenty-four) hours;"],
            ["(g)", "Issue GST-compliant tax invoices or bills of supply to Buyers as required under applicable law;"],
            ["(h)", "Comply with the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020;"],
            ["(i)", "Update pricing promptly and accurately; Sellers may not refuse to honour correctly priced listings, and manifest listing errors may be addressed only with Books Ka Bazaar's prior approval."],
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
    heading: "Prohibited Seller Activities",
    body: (
      <>
        <p className="mb-4">The following activities are strictly prohibited for all registered Sellers:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Selling pirated, photocopied, counterfeit, or unauthorised reprint editions of any publication;"],
            ["(b)", "Selling books bearing stolen library stamps or reported as stolen property;"],
            ["(c)", "Selling books with removed, altered, or forged ISBNs, barcodes, or publisher marks;"],
            ["(d)", "Listing or selling unauthorised scanned PDFs or digital reproductions of copyrighted books or educational materials;"],
            ["(e)", "Misrepresenting product condition, edition, year of publication, authorship, or authenticity;"],
            ["(f)", "Soliciting, manipulating, or suppressing Buyer reviews and ratings;"],
            ["(g)", "Engaging in off-platform transactions to circumvent Platform fees or payment systems;"],
            ["(h)", "Selling content that violates any applicable Indian law, including obscenity laws, hate speech provisions, or any other scheduled or prohibited materials."],
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
    heading: "Seller Performance Standards",
    body: (
      <>
        <p className="mb-4">
          All registered Sellers are expected to consistently maintain the following minimum performance metrics:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700">
                <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/2">Metric</th>
                <th className="text-left px-4 py-3 font-semibold border border-stone-200">Standard</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Order Fulfilment Rate", "≥ 95% of confirmed orders dispatched"],
                ["On-Time Dispatch Rate", "≥ 90% of orders dispatched within the committed window"],
                ["Dispute / Return Rate", "≤ 3% of completed orders in any rolling 30-day period"],
                ["Buyer Response Rate", "≥ 90% of Buyer messages responded to within 24 hours"],
                ["Tracking Upload Compliance", "100% of dispatched orders must have tracking details uploaded within 24 hours"],
              ].map(([metric, standard], i) => (
                <tr key={metric} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{metric}</td>
                  <td className="px-4 py-3 text-stone-500 border border-stone-200">{standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bg-stone-50 border-l-4 border-[#E31E2E] pl-4 py-2 rounded-r-lg text-stone-600">
          Failure to maintain these standards may result in reduced listing visibility, temporary suspension, or
          permanent de-registration as a Seller.
        </p>
      </>
    ),
  },
  {
    heading: "Commission, Fees & Payouts",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Books Ka Bazaar charges a platform commission on each completed transaction. Applicable commission rates are published in the Seller Dashboard and are subject to revision with 15 (fifteen) days' advance notice to Sellers."],
          ["(b)", "GST is applicable on all platform fees at the prevailing statutory rate."],
          ["(c)", "Payouts for completed, non-disputed orders are processed within 7 (seven) business days of confirmed delivery to the Buyer."],
          ["(d)", "Payout calculation: Transaction Value – Platform Commission – GST on Commission – Return Deductions – Any Applicable Penalties."],
          ["(e)", "Books Ka Bazaar will deduct TDS at the applicable rate on commissions as required under Section 194-O of the Income Tax Act, 1961. Form 26AS credit will be available to Sellers accordingly."],
          ["(f)", "The minimum payout threshold and payout schedule are specified in the Seller Dashboard and may be updated from time to time with appropriate notice."],
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
    heading: "Suspension, De-registration & Appeals",
    body: (
      <>
        <p className="mb-4">
          Books Ka Bazaar may suspend a Seller account with immediate effect for any of the following reasons:
        </p>
        <div className="space-y-3 mb-5">
          {[
            ["(a)", "Confirmed sale of counterfeit, pirated, or prohibited items;"],
            ["(b)", "Multiple substantiated fraud or misrepresentation complaints received from Buyers;"],
            ["(c)", "Receipt of a legal notice, court order, or law enforcement request pertaining to the Seller's activities;"],
            ["(d)", "Persistent failure to meet Seller Performance Standards as set out above;"],
            ["(e)", "Provision of false, incomplete, or misleading information during KYC or registration."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          Suspended Sellers may file an appeal by emailing{" "}
          <a
            href="mailto:support@bookskabazaar.com"
            className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            support@bookskabazaar.com
          </a>{" "}
          within <strong className="text-stone-700">15 (fifteen) days</strong> of receiving the suspension notice,
          providing a detailed written explanation and all relevant supporting evidence. Books Ka Bazaar's determination
          on appeal shall be final and binding.
        </p>
      </>
    ),
  },
  {
    heading: "Self-Publishing & Print Services (Upcoming)",
    body: (
      <p>
        When self-publishing and print-on-demand services are launched on the Platform, Sellers and authors who opt into
        these services will be subject to additional terms and conditions covering content moderation, ISBN procurement
        assistance, pricing policies, and royalty and revenue-sharing arrangements. Interested Sellers may register
        their interest through the{" "}
        <strong className="text-stone-700">Seller Dashboard</strong> and will be notified when these features are
        launched along with the applicable terms.
      </p>
    ),
  },
];

export default function SellerTerms() {
  return <PolicyPage title="Seller Terms & Conditions" sections={sections} />;
}
