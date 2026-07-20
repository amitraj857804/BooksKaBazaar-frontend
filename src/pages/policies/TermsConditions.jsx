import PolicyPage from "../../components/common/PolicyPage";
import { Link } from "react-router-dom";

const sections = [
  {
    heading: null,
    body: (
      <>
        <p className="mb-4">
          These Terms &amp; Conditions (<strong className="text-stone-700">"T&amp;C"</strong>) constitute a legally
          binding agreement between you (<strong className="text-stone-700">"User"</strong> — whether a Buyer, Seller,
          or visitor) and Books Ka Bazaar (<strong className="text-stone-700">"Platform", "we", "us", or "our"</strong>).
          By accessing, registering on, or using the Platform in any manner whatsoever, you confirm that you have read,
          understood, and unconditionally agree to be bound by these T&amp;C, together with the{" "}
          <Link to="/privacy" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Privacy Policy</Link>,{" "}
          <Link to="/returns" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Returns &amp; Refunds Policy</Link>,{" "}
          <Link to="/shipping" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Delivery &amp; Shipping Policy</Link>,{" "}
          <Link to="/seller-terms" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Seller Terms &amp; Conditions</Link>,{" "}
          <Link to="/digital-products-policy" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Digital Products Policy</Link>,{" "}
          <Link to="/ip-policy" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Intellectual Property &amp; Copyright Policy</Link>,{" "}
          <Link to="/prohibited-items" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Prohibited Items &amp; Content Policy</Link>,{" "}
          <Link to="/cancellation" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Cancellation Policy</Link>,{" "}
          <Link to="/payment-policy" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Payment &amp; Wallet Policy</Link>, and{" "}
          <Link to="/grievance" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">Grievance Redressal Policy</Link>,
          all of which are incorporated herein by reference and collectively constitute the complete agreement between
          you and Books Ka Bazaar.
        </p>
        <p className="bg-stone-50 border-l-4 border-[#E31E2E] pl-4 py-2 rounded-r-lg text-stone-600 italic">
          If you do not agree with any part of these T&amp;C or any associated policy, you must immediately discontinue
          your use of the Platform.
        </p>
      </>
    ),
  },
  {
    heading: "Acceptance of Terms",
    body: (
      <>
        <p className="mb-4">
          Access to or use of any part of the Platform — whether for browsing, registration, placing orders, listing
          products, or any other purpose — signifies your unconditional acceptance of these T&amp;C and all other
          policies published on the Platform. These T&amp;C supersede any prior agreements, arrangements,
          representations, or understandings between you and Books Ka Bazaar, whether written or oral, relating to
          the subject matter hereof.
        </p>
        <p>
          Books Ka Bazaar reserves the right to amend these T&amp;C at any time. Material amendments will be
          communicated to registered Users via email and/or a prominent notice on the Platform at least{" "}
          <strong className="text-stone-700">15 (fifteen) days</strong> before the amended terms take effect. Your
          continued use of the Platform after the effective date of any amendment shall constitute your acceptance of
          the revised T&amp;C.
        </p>
      </>
    ),
  },
  {
    heading: "Nature of the Platform — Intermediary Status",
    body: (
      <>
        <p className="mb-4">Books Ka Bazaar is a marketplace intermediary as defined under:</p>
        <ul className="space-y-2 mb-4 pl-4">
          {[
            "Section 2(1)(w) of the Information Technology Act, 2000",
            "Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021",
            "Consumer Protection (E-Commerce) Rules, 2020",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          The Platform facilitates transactions between independent buyers and registered sellers. Books Ka Bazaar does
          not manufacture, publish, warehouse, own, or guarantee any product listed on the Platform. Contracts of sale
          are directly and exclusively between the Buyer and the Seller. Books Ka Bazaar is not a party to any such
          contract unless a product is expressly identified as{" "}
          <strong className="text-stone-700">'Sold by Books Ka Bazaar'</strong>.
        </p>
      </>
    ),
  },
  {
    heading: "Eligibility",
    body: (
      <>
        <p className="mb-4">The following eligibility conditions apply to all Users of the Platform:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Users must be at least 18 (eighteen) years of age, or must transact under verifiable parental or legal guardian consent where applicable."],
            ["(b)", "Users must be lawfully competent to enter into binding contracts under the Indian Contract Act, 1872."],
            ["(c)", "Sellers must hold valid GST registration where mandated under the Goods and Services Tax Act, 2017 and rules made thereunder."],
            ["(d)", "Sellers must hold a valid PAN card for compliance with TDS provisions under the Income Tax Act, 1961."],
            ["(e)", "Books Ka Bazaar reserves the right to refuse service, registration, or access to any person or entity, at its sole discretion and without assigning any reason therefor."],
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
    heading: "User Accounts",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Each User may maintain only one (1) active account on the Platform. The creation or maintenance of multiple accounts for the purpose of circumventing Platform restrictions, bans, fee structures, or any other policy is strictly prohibited."],
          ["(b)", "Users are solely and entirely responsible for maintaining the confidentiality and security of their login credentials, and for all activities conducted under their account, whether authorised or not."],
          ["(c)", "Users must provide accurate, complete, and current information at the time of registration and must keep such information updated at all times during the subsistence of their account."],
          ["(d)", <>Any suspected or actual unauthorised access to a User's account must be reported immediately to <a href="mailto:support@bookskabazaar.com" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity">support@bookskabazaar.com</a>.</>],
          ["(e)", "Books Ka Bazaar reserves the right to suspend, restrict, or permanently terminate any User account, with or without prior notice, for violations of these T&C, any Platform policy, or any applicable law."],
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
    heading: "Seller Listings",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Sellers are solely and exclusively responsible for the accuracy, completeness, legality, authenticity, pricing, and quality of all products they list on the Platform."],
          ["(b)", "Sellers must hold full legal right to sell the products they list, whether as owner, authorised distributor, authorised reseller, or otherwise."],
          ["(c)", "Counterfeit, pirated, illegally reproduced, or copyright-infringing materials are strictly prohibited on the Platform and will result in immediate account termination and may attract legal action under applicable law."],
          ["(d)", <>All listings must clearly state the book's condition using Books Ka Bazaar's standardised grading system: <strong className="text-stone-700">'New', 'Very Good', 'Good', 'Acceptable', or 'Poor – Sold As-Is'</strong>.</>],
          ["(e)", "Books Ka Bazaar reserves the right to remove, modify, or disable any listing, without prior notice, that violates these T&C, any applicable law, or Platform guidelines."],
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
    heading: "Orders & Payments",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "An order is confirmed only after successful payment by the Buyer, or where applicable, after the Seller's explicit confirmation of the order."],
          ["(b)", "Prices displayed on the Platform are set solely by individual Sellers. Books Ka Bazaar does not control, fix, or influence the pricing of products listed by independent Sellers."],
          ["(c)", "Books Ka Bazaar facilitates payments through PCI-DSS compliant third-party payment gateways. Books Ka Bazaar does not store any payment card data, CVV codes, or net banking credentials."],
          ["(d)", "Platform convenience fees, if any, are non-refundable once a transaction is confirmed, regardless of the outcome of the order."],
          ["(e)", "Books Ka Bazaar may deduct applicable Tax Deducted at Source ('TDS') from Seller payouts as required under the provisions of the Income Tax Act, 1961, including Section 194-O thereof."],
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
    heading: "Marketplace Liability Disclaimer",
    body: (
      <>
        <p className="mb-4">As a marketplace intermediary, Books Ka Bazaar shall not be liable for:</p>
        <div className="space-y-3 mb-4">
          {[
            ["(a)", "The quality, authenticity, condition, or defects of any product listed or sold by independent Sellers on the Platform;"],
            ["(b)", "Any representations, warranties, or misrepresentations made by Sellers in their listings or communications;"],
            ["(c)", "Any delays, loss, or damage caused by third-party logistics partners or courier services;"],
            ["(d)", "Any disputes arising directly between Buyers and Sellers outside the Platform's designated dispute resolution mechanism;"],
            ["(e)", "Any indirect, incidental, special, punitive, or consequential damages arising out of or in connection with the use of the Platform or any transaction conducted thereon."],
          ].map(([code, text]) => (
            <div key={code} className="flex gap-3">
              <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          Books Ka Bazaar's maximum aggregate liability, if any, in connection with any specific transaction shall not
          exceed the platform commission actually received from that specific transaction.
        </p>
      </>
    ),
  },
  {
    heading: "Intellectual Property",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "All Platform content, including the Books Ka Bazaar name, logo, tagline, Platform design, user interface, source code, and all original editorial content created by or for Books Ka Bazaar, is the exclusive intellectual property of Books Ka Bazaar or its licensors and is protected under the Copyright Act, 1957, the Trade Marks Act, 1999, and other applicable laws."],
          ["(b)", "No content from the Platform may be reproduced, distributed, publicly displayed, or otherwise used without the prior written permission of Books Ka Bazaar."],
          ["(c)", "Sellers retain ownership of their original listing content but hereby grant Books Ka Bazaar a non-exclusive, royalty-free, worldwide licence to display, promote, reproduce, and use such content for the purposes of Platform operations and marketing during the term of their registration."],
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
    heading: "Force Majeure",
    body: (
      <p>
        Books Ka Bazaar shall not be held liable for any failure or delay in performance of its obligations under
        these T&amp;C due to circumstances beyond its reasonable control, including but not limited to acts of God,
        natural disasters, epidemics, pandemics, government actions or restrictions, civil unrest, war, cyberattacks,
        internet infrastructure failures, power outages, or actions of third-party service providers. In such
        circumstances, Books Ka Bazaar's obligations shall be suspended for the duration of the force majeure event.
      </p>
    ),
  },
  {
    heading: "Governing Law & Dispute Resolution",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "These T&C and all matters arising out of or in connection therewith shall be governed exclusively by the laws of the Republic of India."],
          ["(b)", "In the event of any dispute, claim, or controversy arising out of or in connection with these T&C, the parties shall first endeavour to resolve the matter through mediation within a period of 30 (thirty) days from the date on which the dispute is first raised in writing."],
          ["(c)", "If the dispute remains unresolved after the expiry of the said 30-day mediation period, the dispute shall be subject to the exclusive jurisdiction of the Noida at the location of the registered office of Books Ka Bazaar, India."],
        ].map(([code, text]) => (
          <div key={code} className="flex gap-3">
            <span className="text-[#E31E2E] font-bold shrink-0 w-6">{code}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function TermsConditions() {
  return <PolicyPage title="Terms & Conditions" sections={sections} />;
}
