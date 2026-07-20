import PolicyPage from "../../components/common/PolicyPage";

const sections = [
  {
    heading: null,
    body: (
      <>
        <p className="mb-4">
          <strong className="text-[#E31E2E]">Books Ka Bazaar</strong> respects intellectual property rights and expects
          all Users, Sellers, and visitors to do the same. This policy is established in compliance with the Copyright
          Act, 1957, the Trade Marks Act, 1999, and the Information Technology Act, 2000.
        </p>
      </>
    ),
  },
  {
    heading: "Books Ka Bazaar's IP Rights",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", `The Books Ka Bazaar name, logo, tagline ("Beyond Books, It's an Emotion"), Platform design, user interface, source code, and all original content created by or for Books Ka Bazaar are protected intellectual property owned by Books Ka Bazaar or its licensors.`],
          ["(b)", "Unauthorised use, reproduction, imitation, or misappropriation of Books Ka Bazaar's brand, trademarks, or Platform design is strictly prohibited and is actionable under applicable law."],
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
    heading: "Seller & User Obligations",
    body: (
      <div className="space-y-3">
        {[
          ["(a)", "Users and Sellers must not upload, distribute, list, or sell any content that infringes any copyright, trademark, patent, trade secret, or other proprietary right of any third party."],
          ["(b)", "Physical book Sellers must ensure that all books listed are genuine originals or lawfully authorised reprints."],
          ["(c)", "Digital product Sellers must hold clear, documented, and verifiable rights to all content they list on the Platform."],
          ["(d)", "Educational material Sellers must ensure that their study notes and materials do not reproduce protected textbook or educational content beyond fair use as permitted under the Copyright Act, 1957."],
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
    heading: "Copyright Infringement Notice",
    body: (
      <>
        <p className="mb-4">
          Rights holders who believe that their copyrighted material has been infringed on the Platform may submit a
          formal written notice to:{" "}
          <a
            href="mailto:ip@bookskabazaar.com"
            className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            ip@bookskabazaar.com
          </a>
          , containing all of the following:
        </p>
        <ul className="space-y-2 mb-5 pl-2">
          {[
            "Identification of the copyrighted work claimed to have been infringed;",
            "Specific URL(s) or listing ID(s) of the allegedly infringing content on the Platform;",
            "The complainant's full name, mailing address, telephone number, and email address;",
            "A statement that the complainant has a good-faith belief that the disputed use is not authorised by the copyright owner, its agent, or applicable law;",
            "A statement, made under penalty of perjury, that the information in the notice is accurate and that the complainant is the copyright owner or is authorised to act on the owner's behalf;",
            "The complainant's physical or electronic signature.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#E31E2E] shrink-0 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="bg-stone-50 border-l-4 border-stone-300 pl-4 py-2 rounded-r-lg text-stone-600">
          Upon receiving a valid and complete notice, Books Ka Bazaar will act expeditiously to review the complaint,
          notify the relevant Seller, and where appropriate, remove or disable access to the allegedly infringing
          content, and take such further action as may be required under applicable law.
        </p>
      </>
    ),
  },
  {
    heading: "Counter-Notice",
    body: (
      <p>
        A Seller whose content has been removed pursuant to an infringement notice may submit a counter-notice to{" "}
        <a
          href="mailto:ip@bookskabazaar.com"
          className="text-[#E31E2E] underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          ip@bookskabazaar.com
        </a>{" "}
        if the Seller believes the removal was made in error, providing supporting documentation evidencing the Seller's
        rights to the removed content. Books Ka Bazaar will review the counter-notice and take appropriate action in
        accordance with applicable law.
      </p>
    ),
  },
  {
    heading: "Repeat Infringers",
    body: (
      <p>
        Books Ka Bazaar will <strong className="text-stone-700">permanently terminate</strong> the accounts of Sellers
        and Users who are found to be repeat infringers of intellectual property rights, in accordance with its
        obligations under applicable law.
      </p>
    ),
  },
];

export default function IPPolicy() {
  return <PolicyPage title="Intellectual Property & Copyright Policy" sections={sections} />;
}
