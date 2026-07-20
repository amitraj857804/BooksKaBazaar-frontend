import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <>
        <p className="mb-4">
          The following items and categories of content are strictly prohibited on{" "}
          <strong className="text-[#E31E2E]">Books Ka Bazaar</strong>. Listings containing prohibited items will be
          removed without prior notice, and the Seller's account may be suspended or permanently terminated. Books Ka
          Bazaar may also take appropriate legal action where warranted.
        </p>
      </>
    ),
  },
  {
    heading: "Prohibited Physical Products",
    body: (
      <>
        <p className="mb-4">
          The following physical products may not be listed or sold on the Platform:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "Pirated books, photocopied editions, or any unauthorised reproductions of copyrighted publications;"],
            ["(b)", "Counterfeit books falsely represented as original publisher editions;"],
            ["(c)", "Books with altered, forged, or removed ISBNs, barcodes, or publisher marks;"],
            ["(d)", "Books reported as stolen property from libraries, educational institutions, or individuals;"],
            ["(e)", "Publications banned or prohibited under Indian law, including but not limited to obscene publications under applicable provisions of law, and publications prohibited by court order;"],
            ["(f)", "Materials promoting terrorism, incitement to violence, or content violating any applicable Indian law."],
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
    heading: "Prohibited Digital Products",
    body: (
      <>
        <p className="mb-4">
          The following digital products may not be listed or sold on the Platform:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "Pirated or unauthorised scanned PDFs or digital copies of copyrighted books, journals, or study materials;"],
            ["(b)", "DRM-cracked or illegally obtained eBooks or digital publications;"],
            ["(c)", "Malware-infected, Trojan-embedded, or otherwise harmful digital files;"],
            ["(d)", "Unauthorised reproductions of paid educational materials from coaching institutes, publishers, or examination bodies;"],
            ["(e)", "Content containing child sexual abuse material or any content harmful to minors."],
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
    heading: "Prohibited Seller Behaviour",
    body: (
      <>
        <p className="mb-4">
          The following Seller behaviours are prohibited on the Platform:
        </p>
        <div className="space-y-3">
          {[
            ["(a)", "Listing products over which the Seller has no legal right to sell;"],
            ["(b)", "Using the Platform to conduct transactions outside the Platform's payment system;"],
            ["(c)", "Creating fictitious or fraudulent listings to artificially generate reviews or manipulate search rankings;"],
            ["(d)", "Misrepresenting seller identity, location, credentials, or legal status."],
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
    heading: "Reporting Prohibited Items",
    body: (
      <>
        <p className="mb-4">
          Users and Buyers may report prohibited listings using the{" "}
          <strong className="text-stone-700">'Report This Listing'</strong> feature available on every product page, or
          by emailing{" "}
          <a
            href="mailto:compliance@bookskabazaar.com"
            className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            compliance@bookskabazaar.com
          </a>{" "}
          with the relevant details. All reports will be investigated in good faith.
        </p>
        <p className="bg-stone-50 border-l-4 border-[#E31E2E] pl-4 py-2 rounded-r-lg text-stone-600">
          Frivolous, malicious, or bad-faith reports may result in action against the reporting User.
        </p>
      </>
    ),
  },
];

export default function ProhibitedItemsPolicy() {
  return <PolicyPage title="Prohibited Items & Content Policy" sections={sections} />;
}
