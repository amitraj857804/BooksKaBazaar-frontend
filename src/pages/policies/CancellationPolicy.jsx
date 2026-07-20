import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: "Buyer Cancellations",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Orders may be cancelled by the Buyer at any time before the Seller has dispatched the item."],
          ["(b)", "To request cancellation, navigate to: My Orders → Select Order → Request Cancellation."],
          ["(c)", "Once the Seller has dispatched the order and provided a valid tracking number, cancellation is no longer possible. In such cases, the Buyer must wait for delivery and thereafter initiate a return request if applicable, in accordance with the Returns & Refunds Policy."],
          ["(d)", "For digital products: Cancellation is not possible once the download link or access credentials have been delivered to the Buyer."],
          ["(e)", "Refunds for approved cancellations are processed within 3–5 business days to the original payment method."],
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
    heading: "Seller Cancellations",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Sellers must not cancel confirmed orders unless there are genuine and documented circumstances necessitating cancellation, such as out-of-stock situations, item damage discovered after order confirmation, or verified Buyer fraud."],
          ["(b)", "Sellers may not cancel orders on account of pricing errors after a Buyer has placed an order at the listed price, except with Books Ka Bazaar's prior approval in cases of manifest listing errors."],
          ["(c)", "Repeated Seller-initiated cancellations will be treated as a performance failure and may result in reduced listing visibility, account suspension, or permanent de-registration."],
          ["(d)", "If a Seller cancels a confirmed order, the Buyer shall receive a full refund including any shipping charges paid."],
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
    heading: "Books Ka Bazaar-Initiated Cancellations",
    body: (
      <>
        <p className="mb-4">
          Books Ka Bazaar reserves the right to cancel any order if:
        </p>
        <div className="space-y-3 mb-5">
          {[
            ["(a)", "The product is found to be prohibited or in violation of Platform policies;"],
            ["(b)", "Fraud or suspicious activity is detected in the transaction;"],
            ["(c)", "A regulatory, legal, or law enforcement requirement necessitates cancellation."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          In all such cases, a <strong className="text-stone-700">full refund</strong> will be processed to the Buyer.
        </p>
      </>
    ),
  },
];

export default function CancellationPolicy() {
  return <PolicyPage title="Cancellation Policy" sections={sections} />;
}
