import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <p>
        This Returns &amp; Refunds Policy governs all transactions conducted on the{" "}
        <strong className="text-[#E31E2E]">Books Ka Bazaar</strong> platform between Buyers and registered Sellers.
        Books Ka Bazaar acts solely as a marketplace intermediary and does not itself hold inventory or dispatch goods.
        All return and refund processes are facilitated by Books Ka Bazaar in accordance with the framework set out
        below.
      </p>
    ),
  },
  {
    heading: "Scope & Applicability",
    body: (
      <div className="space-y-2">
        {[
          "Hardbound books",
          "eBooks, PDFs, and digital study notes",
          "Online reading rooms",
          "Self-publishing and print service orders (when available)",
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
    heading: "Physical Books — Return Eligibility",
    body: (
      <>
        <p className="mb-4">
          A buyer may raise a return request within{" "}
          <strong className="text-stone-700">7 (seven) calendar days</strong> of confirmed delivery for the following
          reasons:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700">
                <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/3">Eligible Return Reason</th>
                <th className="text-left px-4 py-3 font-semibold border border-stone-200">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Wrong product delivered", "Item received is significantly different from the Seller's listing description (wrong title, wrong edition, wrong author)"],
                ["Damaged / defective item", "Book received is damaged (torn pages, broken spine, water damage) beyond the stated condition"],
                ["Counterfeit / unauthorized reprint", "Seller listed as original but item is a pirated or photocopied copy"],
                ["Incomplete order", "Missing volumes in a multi-volume set or missing supplementary materials described in listing"],
              ].map(([reason, desc], i) => (
                <tr key={reason} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{reason}</td>
                  <td className="px-4 py-3 text-stone-500 border border-stone-200">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    heading: "Physical Books — Non-Returnable Situations",
    body: (
      <div className="space-y-2">
        {[
          "Change of mind after delivery.",
          "Books where the listing explicitly disclosed the condition of the book(s) (e.g., 'heavily annotated', 'cover torn') and the Buyer now objects to that disclosed condition.",
          "Books that show signs of use or damage caused by the Buyer after delivery.",
          "Rare, antiquarian, or 'Sold As-Is' books explicitly marked non-returnable by the Seller.",
          "Books purchased under a 'Final Sale' or promotional designation.",
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
    heading: "Digital Products — Return Eligibility",
    body: (
      <>
        <p className="mb-4">
          Due to the irreversible nature of digital access, all digital product purchases are{" "}
          <strong className="text-stone-700">non-refundable</strong> once accessed or downloaded, except in the
          following limited circumstances:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "The file is permanently corrupted and the Seller fails to provide a working replacement within 48 (forty-eight) hours of the Buyer's complaint;"],
            ["(b)", "The content of the digital product is materially and significantly different from the listing description;"],
            ["(c)", "A duplicate charge occurred due to a platform or payment gateway technical error;"],
            ["(d)", "Access credentials were not delivered to the Buyer despite confirmed payment, and the issue is not resolved within 48 (forty-eight) hours of being reported."],
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
    heading: "Step-by-Step Return Process",
    body: (
      <>
        <p className="mb-4">The return process shall be conducted as follows:</p>
        <div className="space-y-4">
          {[
            ["Step 1", "Log in to your account and navigate to My Orders → Select Order → Raise Dispute within 7 (seven) days of confirmed delivery."],
            ["Step 2", "Select the applicable return reason and upload clear photographs of the book, its packaging, and any visible damage or discrepancy."],
            ["Step 3", "The Seller will be notified of the return request and has 48 (forty-eight) hours to accept or contest the request."],
            ["Step 4", "If the Seller accepts the return request, the Buyer will proceed with return shipment. If the Seller contests the request, Books Ka Bazaar's team will review evidence submitted by both parties."],
            ["Step 5", "Books Ka Bazaar will issue a final determination within 5 (five) business days of receiving all relevant evidence from both parties."],
            ["Step 6", "If the return is approved, the book(s) will be shipped back to the Seller through Books Ka Bazaar's designated logistics process. Return shipping costs shall be borne by the Seller."],
            ["Step 7", "The Seller must confirm receipt of the returned item within 48 (forty-eight) hours of delivery."],
            ["Step 8", "Refund is initiated within 7 (seven) business days of the Seller confirming receipt of the returned item."],
          ].map(([step, text]) => (
            <div key={step} className="flex gap-4">
              <span className="bg-[#E31E2E] text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0 h-fit mt-0.5 whitespace-nowrap">
                {step}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    heading: "Refund Timelines & Methods",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-700">
              <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/2">Payment Method</th>
              <th className="text-left px-4 py-3 font-semibold border border-stone-200">Refund Timeline</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["UPI / Net Banking / Debit Card", "3–5 business days"],
              ["Credit Card", "5–7 business days (subject to issuing bank processing time)"],
              ["Cash on Delivery (COD) orders", "Via UPI or bank transfer after Buyer provides account details (3–5 days)"],
            ].map(([method, timeline], i) => (
              <tr key={method} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{method}</td>
                <td className="px-4 py-3 text-stone-500 border border-stone-200">{timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    heading: "Non-Refundable Items & Charges",
    body: (
      <>
        <p className="mb-4">
          The following items and charges are non-refundable under any circumstances:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "Platform convenience fee (if any) — non-refundable regardless of the outcome of the order;"],
            ["(b)", "Original shipping charge — refunded only if the return is attributable to Seller error;"],
            ["(c)", "Downloaded or accessed paid digital content (subject to the limited exceptions in the Digital Products section above)."],
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
    heading: "Fraudulent Returns",
    body: (
      <p>
        Books Ka Bazaar reserves the right to reject any return request that is found to be fraudulent, abusive, or
        made in bad faith. Buyers with a history of repeated or proven fraudulent return requests may be restricted from
        future return privileges, and their account access may be suspended or permanently terminated.
      </p>
    ),
  },
];

export default function ReturnsRefunds() {
  return <PolicyPage title="Returns & Refunds Policy" sections={sections} />;
}
