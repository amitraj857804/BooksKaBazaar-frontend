import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <p>
        This policy applies to all digital offerings on{" "}
        <strong className="text-[#E31E2E]">Books Ka Bazaar</strong>, including eBooks, downloadable PDFs, instant
        digital study notes, and online reading room subscriptions. These offerings may be listed by registered Sellers
        or provided directly by Books Ka Bazaar.
      </p>
    ),
  },
  {
    heading: "License, Not Sale",
    body: (
      <p>
        All digital products on Books Ka Bazaar are <strong className="text-stone-700">licensed</strong> to the
        purchaser, not sold. By purchasing a digital product, you receive a limited, non-exclusive, non-transferable,
        revocable license for personal, non-commercial use only. Title, ownership, and intellectual property rights
        remain with the content creator, publisher, or rights holder.
      </p>
    ),
  },
  {
    heading: "Permitted Uses",
    body: (
      <>
        <p className="mb-4">Under the licence granted upon purchase, you are permitted to:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Download and access purchased content on your personal devices, subject to any device limit specified at the time of purchase;"],
            ["(b)", "Print a limited number of pages for personal study use only, where the content and file format permit such printing;"],
            ["(c)", "Access online reading room content during the validity period of your purchased access pass."],
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
    heading: "Prohibited Uses",
    body: (
      <>
        <p className="mb-4">The following uses of digital products are strictly prohibited:</p>
        <div className="space-y-3">
          {[
            ["(a)", "Redistribution, resale, sublicensing, or sharing access with any third party;"],
            ["(b)", "Uploading digital products to any public or private file-sharing platform or cloud storage accessible to others;"],
            ["(c)", "Reproducing, photocopying, or screenshotting content beyond fair use as permitted under the Copyright Act, 1957;"],
            ["(d)", "Using digital content for any commercial purpose, including distribution to students in classroom settings, coaching institutes, or training programmes, without a valid commercial licence;"],
            ["(e)", 'Circumventing any Digital Rights Management ("DRM") protection applied to any digital file;'],
            ["(f)", "Using automated tools to download, scrape, or bulk-access online reading room content."],
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
    heading: "Refunds for Digital Products",
    body: (
      <>
        <p className="mb-4">
          Due to the irreversible nature of digital access, all digital product purchases are{" "}
          <strong className="text-stone-700">final</strong>. Refunds are issued only in the following limited
          circumstances:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "The file is permanently corrupted and is not remedied by the Seller within 48 (forty-eight) hours;"],
            ["(b)", "The content materially and significantly differs from the listing description;"],
            ["(c)", "A duplicate payment occurred due to a technical error on the Platform or payment gateway;"],
            ["(d)", "Access credentials were never delivered to the Buyer despite confirmed payment."],
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
    heading: "Online Reading Rooms",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Online reading room access passes are valid for the duration specified at the time of purchase."],
          ["(b)", "Books Ka Bazaar does not guarantee uninterrupted access to online reading rooms and will provide advance notice of planned maintenance where practicable."],
          ["(c)", "Access passes are non-transferable and cannot be paused, gifted, or extended, except in documented cases of technical failure attributable to Books Ka Bazaar."],
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
    heading: "Content Standards for Sellers Listing Digital Products",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Sellers must hold valid and documented rights (authorship, publishing rights, or distributor licence) to all digital content listed on the Platform."],
          ["(b)", "Listing pirated, unauthorised, or DRM-cracked digital files is strictly prohibited and constitutes grounds for immediate account termination and legal action under applicable law."],
          ["(c)", "All digital files must be virus-free and in the format clearly described in the listing (PDF, ePub, MOBI, etc.)."],
          ["(d)", "Study notes and educational PDFs must be original work and must not reproduce substantial portions of copyrighted textbooks or other protected materials without appropriate authorisation from the rights holder."],
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

export default function DigitalProductsPolicy() {
  return <PolicyPage title="Digital Products Policy" sections={sections} />;
}
