import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <p>
        <strong className="text-[#E31E2E]">Books Ka Bazaar</strong> is a marketplace platform. The shipment and
        delivery of physical books is the sole operational responsibility of the registered Seller. Books Ka Bazaar
        establishes the framework and mandatory standards that all Sellers must follow.
      </p>
    ),
  },
  {
    heading: "Seller Shipping Obligations",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Sellers must hand over confirmed, ready-to-dispatch orders to Books Ka Bazaar's official courier partner within 2 (two) business days of payment confirmation, unless a different dispatch timeline is explicitly stated in the Seller's listing."],
          ["(b)", "The courier partner, once an order is confirmed, must provide a valid tracking number or Air Waybill (AWB) on the Platform within 24 (twenty-four) hours of order confirmation."],
          ["(c)", "Books must be appropriately and securely packed to prevent transit damage, including the use of bubble wrap, cardboard reinforcement for hardcovers, and other suitable protective materials."],
          ["(d)", "Sellers must comply with the Legal Metrology (Packaged Commodities) Rules, 2011 in respect of all physical product packaging."],
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
    heading: "Estimated Delivery Timelines",
    body: (
      <>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700">
                <th className="text-left px-4 py-3 font-semibold border border-stone-200 w-1/2">Region</th>
                <th className="text-left px-4 py-3 font-semibold border border-stone-200">Estimated Delivery Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Metro Cities — Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune", "2–4 business days"],
                ["Tier-2 / Tier-3 Cities — State capitals, district headquarters", "4–7 business days"],
                ["Remote & Rural Areas — Including North-East India, J&K, Andaman & Nicobar, Lakshadweep", "7–14 business days"],
                ["International — At Seller's discretion; clearly stated in listing", "Varies by destination"],
              ].map(([region, time], i) => (
                <tr key={region} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  <td className="px-4 py-3 font-medium text-stone-700 border border-stone-200">{region}</td>
                  <td className="px-4 py-3 text-stone-500 border border-stone-200">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          These are estimates only. Books Ka Bazaar does not guarantee delivery timelines as logistics are managed by
          third-party courier aggregator(s).
        </p>
      </>
    ),
  },
  {
    heading: "Shipping Charges",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Shipping charges are determined by Books Ka Bazaar's courier partner and are displayed clearly at checkout before order confirmation."],
          ["(b)", "Certain pin codes may be offered free shipping on orders above a specified value threshold, at the discretion of Books Ka Bazaar."],
          ["(c)", "Books Ka Bazaar may, from time to time, run platform-wide free shipping promotions independently of individual Seller settings."],
          ["(d)", "Digital products (eBooks, PDFs, digital study notes, reading room access passes) attract no shipping charges."],
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
    heading: "Cash on Delivery (COD)",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "COD availability is subject to the individual Seller's settings and the courier partner's serviceable pin codes."],
          ["(b)", "COD orders refused by the Buyer at the time of delivery without valid reason may result in restrictions on that Buyer's future COD ordering privileges."],
          ["(c)", "Books Ka Bazaar reserves the right to withdraw COD as a payment option for high-risk delivery locations or Buyer profiles, at its sole discretion."],
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
    heading: "Delivery Failures & Non-Delivery",
    body: (
      <>
        <p className="mb-4">
          In the event that an order is marked <strong className="text-stone-700">'Delivered'</strong> by the courier
          partner but has not been received by the Buyer:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "The Buyer must report non-receipt within 48 (forty-eight) hours of the courier's stated delivery timestamp;"],
            ["(b)", "Books Ka Bazaar will coordinate with the Seller and the courier partner to launch a formal investigation;"],
            ["(c)", "If non-delivery is confirmed following the investigation, a full refund will be processed to the Buyer within 5–7 business days;"],
            ["(d)", "False non-delivery reports are treated as fraudulent activity and may result in account suspension or termination."],
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
    heading: "Buyer Responsibilities",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Buyers are solely responsible for providing a complete, accurate, and current shipping address at the time of placing an order."],
          ["(b)", "Books Ka Bazaar and Sellers shall not be liable for delivery failures attributable to incorrect or incomplete address information provided by the Buyer."],
          ["(c)", "Buyers must ensure that a responsible person is available to receive the order at the delivery address, or must provide appropriate delivery instructions at the time of checkout."],
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
    heading: "Digital Delivery",
    body: (
      <>
        <p className="mb-4">
          For eBooks, PDFs, digital study notes, and reading room access passes, delivery is{" "}
          <strong className="text-stone-700">instantaneous upon payment confirmation</strong>. A secure download link or
          access credentials will be sent to the Buyer's registered email address and will also be accessible through{" "}
          <strong className="text-stone-700">My Orders → Digital Downloads</strong> in the Buyer's account dashboard.
        </p>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          Books Ka Bazaar shall not be responsible for digital delivery failures caused by incorrect email addresses
          provided by the Buyer, full or inactive mailboxes, or email spam filters.
        </p>
      </>
    ),
  },
];

export default function ShippingPolicy() {
  return <PolicyPage title="Delivery & Shipping Policy" sections={sections} />;
}
