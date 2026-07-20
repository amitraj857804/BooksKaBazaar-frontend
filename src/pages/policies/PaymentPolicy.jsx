import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: "Accepted Payment Methods",
    body: (
      <>
        <p className="mb-4">The following payment methods are accepted on the Platform:</p>
        <div className="space-y-3">
          {[
            ["(a)", "UPI (Google Pay, PhonePe, Paytm, BHIM, and other UPI-enabled applications);"],
            ["(b)", "Net Banking (all major Indian banks);"],
            ["(c)", "Debit Cards (Visa, Mastercard, RuPay);"],
            ["(d)", "Credit Cards (Visa, Mastercard, American Express);"],
            ["(e)", "Cash on Delivery (COD) — where available based on pin code serviceability and Seller settings;"],
            ["(f)", "Books Ka Bazaar Wallet Credits (earned through refunds, referral programmes, or promotional campaigns);"],
            ["(g)", "EMI options — subject to availability as offered by the relevant bank or payment gateway."],
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
    heading: "Payment Security",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "All payment transactions on the Platform are processed by PCI-DSS Level 1 compliant third-party payment gateways."],
          ["(b)", "Books Ka Bazaar does not store card numbers, CVV codes, or net banking credentials at any time."],
          ["(c)", "OTP-based authentication is used for all card and net banking transactions."],
          ["(d)", <span key="d">Any suspicious or unauthorised transaction must be reported immediately to{" "}<a href="mailto:support@bookskabazaar.com" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">support@bookskabazaar.com</a>.</span>],
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
    heading: "Books Ka Bazaar Wallet",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Wallet credits may be earned through refunds (fast-refund option), referral programmes, or promotional campaigns conducted by Books Ka Bazaar."],
          ["(b)", "Wallet credits are non-transferable, non-encashable for cash, and expire as per the specific terms stated at the time of credit."],
          ["(c)", "Wallet credits may be applied at checkout for any eligible purchase on the Platform."],
          ["(d)", "In the event of account termination, unexpired and valid wallet credits may be refunded to the original payment method at Books Ka Bazaar's discretion, subject to applicable legal requirements."],
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
    heading: "Failed & Disputed Payments",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "In the event of a payment failure, the amount deducted will be automatically refunded to the source account within 5–7 business days."],
          ["(b)", <span key="b">For payment disputes, Users are advised to first contact their bank or payment gateway. Unresolved disputes may be escalated to{" "}<a href="mailto:support@bookskabazaar.com" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">support@bookskabazaar.com</a>.</span>],
          ["(c)", "Chargebacks initiated with banks or card networks without first raising a formal dispute through the Platform may result in restrictions on the User's account."],
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
    heading: "GST on Transactions",
    body: (
      <p>
        GST is applicable on platform service fees and convenience fees at the prevailing statutory rate. Books Ka
        Bazaar does not collect GST on the sale price of books listed by independent Sellers (unless Books Ka Bazaar is
        the direct Seller), as the obligation to collect and remit GST on the sale price rests with the individual
        registered Seller.
      </p>
    ),
  },
];

export default function PaymentPolicy() {
  return <PolicyPage title="Payment & Wallet Policy" sections={sections} />;
}
