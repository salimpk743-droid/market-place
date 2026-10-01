export type PlaceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PlaceGuide = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: PlaceSection[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  sources: { href: string; label: string }[];
};

const updated = "1 October 2026";

export const placeGuides: PlaceGuide[] = [
  {
    slug: "best-mobile-markets-in-pakistan",
    title: "What are the best mobile markets in Pakistan?",
    description:
      "Best mobile market in Karachi, Lahore, Islamabad and Rawalpindi: Saddar, Hafeez Centre, Blue Area and Singapore Plaza, plus shop names you can actually find.",
    updated,
    intro:
      "People searching for the best mobile market in Pakistan are usually deciding which building to walk, not which blog award to trust. There is no official ranking. Karachi uses Saddar. Lahore uses Hafeez Centre. Islamabad is spread across Blue Area, G-9 and F-7. Rawalpindi uses Saddar, and Singapore Plaza is the building shoppers name. A famous market is not a warranty.",
    sections: [
      {
        heading: "Which city market should I start with?",
        paragraphs: [
          "Start in the city where you can hold the phone. Karachi buyers use Star City Mall, Amma Tower and Al Najeebi Tower around Abdullah Haroon Road. Lahore buyers use Hafeez Centre on Main Boulevard, Gulberg III, then Hall Road if they still need a part or a second quote. Islamabad buyers use Blue Area, G-9 Markaz (Karachi Company) and Jinnah Super in F-7. Rawalpindi buyers use Singapore Plaza on Bank Road, Saddar.",
          "Each city page below names counters that a distributor, a brand trade-in page, or the shop itself publishes with an address. That is a way to find a shutter. It is not a score for honesty or price.",
        ],
      },
      {
        heading: "What is the difference between a market shop and an authorized dealer?",
        paragraphs: [
          "Most counters in these markets are traders. An authorized Apple or Samsung dealer is a shop the brand, or the brand's distributor, will stand behind. Pakistan does not have an Apple Store. Mercantile and GNEXT both describe themselves as Apple authorized distributors. Samsung publishes its own service locator. A painted logo on a shutter is not that list.",
        ],
        bullets: [
          "Match the IMEI on the phone, the box and the bill.",
          "Send that IMEI by SMS to 8484 before you pay.",
          "Ask whether the warranty is the brand's warranty or only the shop's.",
          "Do not leave a cash advance with a counter you have not dealt with.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the biggest mobile market in Pakistan?",
        answer:
          "Hafeez Centre in Gulberg, Lahore, is the market buyers name most often. Karachi's Saddar cluster and Rawalpindi's Singapore Plaza are the equivalent hubs in those cities. Size is not a better price or a real warranty.",
      },
      {
        question: "Where can I see shop names for my city?",
        answer:
          "Open the Karachi, Lahore, Islamabad or Rawalpindi page. Each one lists shops that publish an address, and says who published it.",
      },
      {
        question: "Are mobile market shops authorized brand dealers?",
        answer:
          "Usually no. Use the authorized dealers page, then confirm the shop on Mercantile's, GNEXT's or Samsung's own locator the day you go.",
      },
    ],
    related: [
      { href: "/guides/best-mobile-market-in-karachi", label: "Best mobile market in Karachi" },
      { href: "/guides/best-mobile-market-in-lahore", label: "Best mobile market in Lahore" },
      { href: "/guides/best-mobile-market-in-islamabad", label: "Best mobile market in Islamabad" },
      { href: "/guides/best-mobile-market-in-rawalpindi", label: "Best mobile market in Rawalpindi" },
      { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized Apple and Samsung dealers" },
    ],
    sources: [
      { href: "https://saddarmobilemarket.com/about-us/", label: "Saddar Mobile Market, about the Karachi buildings" },
      { href: "https://singaporeplaza.pk/", label: "Singapore Plaza, Rawalpindi" },
      { href: "https://mercantile.com.pk/", label: "Mercantile, Apple authorized distributor" },
    ],
  },
  {
    slug: "best-mobile-market-in-karachi",
    title: "What is the best mobile market in Karachi?",
    description:
      "The best mobile market in Karachi is Saddar: Star City Mall, Amma Tower and Al Najeebi Tower, plus Saddar shop names and mall stores with a published address.",
    updated,
    intro:
      "If you ask for the best mobile shops in Karachi, the answer you will get on the street is Saddar. The useful part is which building, and which counters publish a name you can find again. A crowded mall is not proof the set is PTA approved.",
    sections: [
      {
        heading: "Where is the mobile market in Karachi?",
        paragraphs: [
          "The Saddar mobile market sits around Abdullah Haroon Road. The market's own about page names three buildings as its base: Star City Mall, Amma Tower and Al Najeebi Tower. Buyers use Star City Mall for boxed phones, Amma Tower when the job is a repair, and the surrounding counters for accessories and used sets.",
          "Cooperative Market, nearby in Saddar, is where people go for bulk accessories. It is not a substitute for checking the handset. Sareena Market is another Saddar-area mobile mall, not the same building as Star City.",
        ],
      },
      {
        heading: "Which Saddar shops publish a name?",
        paragraphs: [
          "Airlink Communication's where-to-buy page, last modified on that site on 27 March 2026, lists these Karachi partners in or next to Saddar. This is a distributor's retail list for brands it carries, including Xiaomi, Tecno, Samsung and itel. It is not a ranking, and a shop can leave the list.",
        ],
        bullets: [
          "Green Apple Trading, Star City, Saddar",
          "Godil Communication, Saddar",
          "Jibran Electronics, Saddar",
          "Kashan Mobile, Saddar",
          "Nizam Mobile, Saddar",
          "Minhas Electronics, Saddar and DHA",
          "Blue Link Communication, Sareena Market",
        ],
      },
      {
        heading: "Where are the mall stores, outside the bazaar?",
        paragraphs: [
          "Airlink's own stores page publishes these Karachi addresses. They are easier to find again than a third-floor counter, and the price is often higher. The same page labels only its Xinhua Mall shop in Lahore as an Apple Authorized Reseller, not these Karachi shops.",
        ],
        bullets: [
          "Airlink, shop 7, second floor, Lucky One Mall",
          "Samsung Premium Outlet, shop LG-19, Lucky One Mall",
          "Airlink, first floor, Dolmen Mall Clifton, next to Miniso",
        ],
      },
      {
        heading: "What should I do inside Star City Mall?",
        paragraphs: [
          "Pick the model, the storage and the PTA status first, then ask two counters for that exact set. A cheaper quote is often a non-PTA phone, a shop-only warranty, or an opened box. Ask for a bill with the shop name, the IMEI and a phone number. Send the IMEI to 8484 while you are standing there.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best mobile market in Karachi?",
        answer:
          "Saddar. Start at Star City Mall for a boxed phone and Amma Tower for a repair. Compare more than one counter, and use the shop names above only as addresses you can find.",
      },
      {
        question: "Which mobile shops are in Star City Mall Karachi?",
        answer:
          "Green Apple Trading is the Star City name on Airlink's March 2026 retail list. Hundreds of other counters share the mall and are not on that list. Walk the floor.",
      },
      {
        question: "Is every shop in Saddar an authorized dealer?",
        answer:
          "No. Most are traders. For an official Apple or Samsung warranty, use the authorized dealers guide and the brand's own locator.",
      },
    ],
    related: [
      { href: "/used-phones/karachi", label: "Used phones in Karachi" },
      { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized dealers in Pakistan" },
      { href: "/guides/pta-status", label: "How to check PTA status" },
      { href: "/guides/best-mobile-markets-in-pakistan", label: "Markets in other cities" },
    ],
    sources: [
      { href: "https://saddarmobilemarket.com/about-us/", label: "Saddar Mobile Market, about the buildings" },
      { href: "https://www.airlinkcommunication.com/where-to-buy/", label: "Airlink, where to buy" },
      { href: "https://www.airlinkcommunication.com/airlink-stores/", label: "Airlink stores, Lucky One and Dolmen" },
    ],
  },
  {
    slug: "best-mobile-market-in-lahore",
    title: "What is the best mobile market in Lahore?",
    description:
      "The best mobile market in Lahore is Hafeez Centre, Gulberg. Hall Road is the older strip. Here are Hafeez Centre shop names with a published address.",
    updated,
    intro:
      "If you ask where to buy a mobile in Lahore, the answer is Hafeez Centre. It is the multi-storey market on Main Boulevard, Gulberg III, full of new phones, used phones, parts and repairs. Hall Road is the older electronics strip. Neither one is a guarantee.",
    sections: [
      {
        heading: "Where should I go in Lahore?",
        paragraphs: [
          "Hafeez Centre is the main stop. Hassan Tower and the other Gulberg buildings sit close enough that people check them on the same visit. Hall Road is still used for parts, accessories and some phones. It is not the same market.",
          "There is no single timetable for every counter. Many shops in the market close on Sunday. Call the counter before you cross the city.",
        ],
      },
      {
        heading: "Which Hafeez Centre and Hall Road shops are publicly listed?",
        paragraphs: [
          "Two public lists overlap here. Airlink's where-to-buy page, last modified 27 March 2026, names retail partners. Samsung Pakistan's trade-in page names collection counters with a shop number. Where both name the same shop, that address is the one to use. This is not a top-10 ranking.",
        ],
        bullets: [
          "The Fone Shop, G-11, Hafeez Centre (Samsung trade-in; also on Airlink's list)",
          "Nexgen Mobile, G-19, Hafeez Centre (Samsung trade-in)",
          "Arham Mobile, LG-7, Hafeez Centre (Samsung trade-in)",
          "Cell Ever, LG-129, Hafeez Centre (Samsung trade-in)",
          "Al-Hafeez Mobile, Hafeez Centre (Airlink list)",
          "Mobile Store, Hafeez Centre (Airlink list)",
          "Yasir Electronics, Hafeez Centre (Airlink list)",
          "AA Trading, G-1, Hassan Tower, Gulberg III (Samsung trade-in; Airlink lists the same name at Hafeez Centre)",
          "GM Communications, Sultan Mobile and Younis Mobile, Hall Road (Airlink list)",
        ],
      },
      {
        heading: "Which Lahore shops are easier to find than a market counter?",
        paragraphs: [
          "CellMart publishes its own site and says it has traded at Hafeez Centre since 2009. That is the shop's own claim about its address, not a brand authorization and not a ranking.",
          "Airlink's stores page publishes mall addresses that do not depend on finding a floor in Hafeez Centre. It labels the Xinhua Mall outlet, and only that outlet on the page, as an Apple Authorized Reseller.",
        ],
        bullets: [
          "Airlink, G-1, Xinhua Mall, 24-B/2 Mian Mehmood Ali Kasuri Road, Gulberg III, labeled Apple Authorized Reseller on Airlink's stores page",
          "Airlink flagship, shop 1080, first floor, Packages Mall",
          "Samsung Experience Store, shop 1079, first floor, Packages Mall",
          "Samsung Experience Store, shop G-27, Emporium Mall, Johar Town",
          "Samsung store, shop G-29, Dolmen Mall, DHA Phase 6",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best mobile market in Lahore?",
        answer:
          "Hafeez Centre, Main Boulevard, Gulberg III. Use Hall Road for a second quote or a part. The shop numbers above are published addresses, not a quality score.",
      },
      {
        question: "Is Hall Road the same as Hafeez Centre?",
        answer:
          "No. Hall Road is the older electronics market. Hafeez Centre is the main phone market. GM Communications, Sultan Mobile and Younis Mobile are Hall Road names on Airlink's retail list.",
      },
      {
        question: "Is there an Apple authorized shop in Lahore?",
        answer:
          "Airlink labels its Xinhua Mall Gulberg outlet as an Apple Authorized Reseller. Mercantile also runs Apple authorized service in Lahore. Confirm the shop on the distributor's locator before you treat a Hafeez Centre counter as authorized.",
      },
    ],
    related: [
      { href: "/used-phones/lahore", label: "Used phones in Lahore" },
      { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized Apple dealers" },
      { href: "/guides/best-mobile-markets-in-pakistan", label: "Markets in other cities" },
      { href: "/guides/pta-status", label: "How to check PTA status" },
    ],
    sources: [
      { href: "https://www.airlinkcommunication.com/where-to-buy/", label: "Airlink, where to buy" },
      { href: "https://www.samsung.com/pk/trade-in/", label: "Samsung Pakistan trade-in counters" },
      { href: "https://www.airlinkcommunication.com/airlink-stores/", label: "Airlink stores, including Xinhua Mall" },
      { href: "https://cellmart.pk/", label: "CellMart, Hafeez Centre" },
    ],
  },
  {
    slug: "best-mobile-market-in-islamabad",
    title: "What is the best mobile market in Islamabad?",
    description:
      "Islamabad has no single Hafeez Centre. Blue Area, G-9 Markaz, Jinnah Super F-7 and Centaurus, with shop names and addresses buyers can check.",
    updated,
    intro:
      "Islamabad phone shopping is spread across markets. The right stop depends on whether you want several counters, a used set, or a mall shop with a printed bill. Rawalpindi Saddar, a short drive away, is the bigger bazaar for the twin cities.",
    sections: [
      {
        heading: "Which Islamabad markets do people use?",
        paragraphs: [
          "Blue Area, along Fazl-e-Haq Road and Jinnah Avenue, is the commercial strip buyers name first. G-9 Markaz, also called Karachi Company, is a large trading market for phones, parts and repairs. Jinnah Super Market in F-7 is the other markaz people check for a second quote.",
          "Centaurus Mall is retail, not a bazaar. Prices are often higher than a markaz counter. The advantage is a shop you can find again. Giga Mall and F-6 Supermarket sit in the same kind of trip: one or two named shops, not a whole floor of traders.",
        ],
      },
      {
        heading: "Which Islamabad shops publish an address?",
        paragraphs: [
          "Airlink's where-to-buy list, last modified 27 March 2026, names three Islamabad partners. Samsung Pakistan's trade-in page names counters with a shop number. Use both as a map, not as a verdict.",
        ],
        bullets: [
          "Abbas Mobile and Gadget, Eagle Plaza (Airlink list)",
          "Cellz and Computer, F-11 Markaz (Airlink list)",
          "Gadgets Mobile, F-6 Supermarket (Airlink list)",
          "UniCell, shop 10, ground floor, Black Horse Plaza, Fazl-e-Haq Road, Blue Area (Samsung trade-in)",
          "Fone Store, shop 9, ground floor, Black Horse Plaza, Blue Area (Samsung trade-in)",
          "5G Zone, shop 3, Rehman Plaza, ground floor, Blue Area (Samsung trade-in)",
          "Outlet Mobile, shop 176, first floor, Centaurus (Samsung trade-in)",
          "Samsung Store, Afzal Corporation, shops 268 and 269, second floor, Centaurus (Samsung trade-in)",
        ],
      },
      {
        heading: "Should I go to Rawalpindi instead?",
        paragraphs: [
          "Go to Rawalpindi Saddar, including Singapore Plaza on Bank Road, when Blue Area does not have the set or you want to compare many prices in one building. Stay in Islamabad when you want a mall bill or you are already in F-7 or F-8. The checks are the same in both cities: IMEI on the phone, IMEI on the bill, SMS to 8484.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best place to buy a mobile in Islamabad?",
        answer:
          "Start in Blue Area or G-9 Markaz if you want to compare counters. Use Centaurus, including the Samsung and Outlet Mobile shop numbers above, if you want a mall shop. Check Rawalpindi Saddar if you need more choice.",
      },
      {
        question: "Is G-9 Markaz the same as Karachi Company?",
        answer: "Yes. Karachi Company is the name people use for G-9 Markaz.",
      },
      {
        question: "Where is a Samsung shop in Islamabad?",
        answer:
          "Samsung's trade-in page names Afzal Corporation at shops 268 and 269 on the second floor of Centaurus, plus UniCell and Fone Store in Black Horse Plaza, Blue Area. The service-center locator on Samsung's site is the page to recheck, because counters change.",
      },
    ],
    related: [
      { href: "/used-phones/islamabad", label: "Used phones in Islamabad" },
      { href: "/guides/best-mobile-market-in-rawalpindi", label: "Rawalpindi mobile market" },
      { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized dealers" },
      { href: "/guides/pta-status", label: "How to check PTA status" },
    ],
    sources: [
      { href: "https://www.airlinkcommunication.com/where-to-buy/", label: "Airlink, where to buy" },
      { href: "https://www.samsung.com/pk/trade-in/", label: "Samsung Pakistan trade-in counters" },
      { href: "https://www.samsung.com/pk/support/service-center/", label: "Samsung service locator" },
    ],
  },
  {
    slug: "best-mobile-market-in-rawalpindi",
    title: "What is the best mobile market in Rawalpindi?",
    description:
      "The best mobile market in Rawalpindi is Saddar. Singapore Plaza on Bank Road has about 450 shops. Here are Saddar counters Samsung publishes by name.",
    updated,
    intro:
      "Rawalpindi and Islamabad share shoppers, but the bazaar is in Rawalpindi Saddar. If you want many mobile shops in one building, Singapore Plaza is the stop people send you to. A mall in Islamabad is the quieter alternative, not the same market.",
    sections: [
      {
        heading: "Where is Singapore Plaza Rawalpindi?",
        paragraphs: [
          "Singapore Plaza says it was built in 1995 by Zarkon Group, on Bank Road in Saddar, and that the seven-storey building has 450 shops. It is also called Mobile Plaza. The plaza's site publishes hours of 11am to 10pm, seven days, and says individual selling is still by the shop. Confirm the counter before you go. The entrance shops are not the only price.",
        ],
      },
      {
        heading: "Which Rawalpindi shops does Samsung name?",
        paragraphs: [
          "Samsung Pakistan's trade-in page names these Rawalpindi collection counters. A trade-in partner is a shop Samsung listed for that programme. It is not a certificate that every phone in the shop is PTA approved, and it is not a ranking against the other 400 counters in Singapore Plaza.",
        ],
        bullets: [
          "Sim Collection, shop 22, first floor, Singapore Plaza, Bank Road, Saddar",
          "A Tech Mobile, shop LG-07, Rania Mall, Saddar",
          "Beeps & Bells, shops 11 and 12, ground floor, Shahbaz Plaza, Bank Road, Saddar",
          "DA Mobilica, CSD Super Mall, Lal Kurti",
        ],
      },
      {
        heading: "Which shop should I trust?",
        paragraphs: [
          "Trust the bill and the IMEI, not a painted 'original' sign. Ask the shop to write the IMEI on the receipt. Send that IMEI to 8484. The same model is often on three floors at three prices because PTA status, warranty and whether the box is sealed are different.",
          "If you need an official Apple warranty, this market is the wrong test by itself. Use the authorized dealers page, then come back to Saddar only for a set you have already decided to inspect.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best mobile market in Rawalpindi?",
        answer:
          "Saddar, and inside it Singapore Plaza on Bank Road. Rania Mall and Shahbaz Plaza are the other Saddar buildings on Samsung's trade-in list. Compare more than one counter.",
      },
      {
        question: "What are Singapore Plaza timings?",
        answer:
          "The plaza's own site says 11am to 10pm, Monday to Sunday. A single shop can close earlier. Call ahead.",
      },
      {
        question: "Should I go to Rawalpindi or Islamabad?",
        answer:
          "Rawalpindi Saddar has the larger bazaar. Islamabad Blue Area, Centaurus and F-6 are better when you want one of the named shops rather than a whole market.",
      },
    ],
    related: [
      { href: "/used-phones/rawalpindi", label: "Used phones in Rawalpindi" },
      { href: "/guides/best-mobile-market-in-islamabad", label: "Islamabad mobile markets" },
      { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized dealers" },
      { href: "/guides/pta-status", label: "How to check PTA status" },
    ],
    sources: [
      { href: "https://singaporeplaza.pk/", label: "Singapore Plaza" },
      { href: "https://www.samsung.com/pk/trade-in/", label: "Samsung Pakistan trade-in counters" },
    ],
  },
  {
    slug: "authorized-mobile-dealers-in-pakistan",
    title: "Who are the authorized Apple dealers in Pakistan?",
    description:
      "Authorized Apple dealers in Pakistan, plus Samsung, Xiaomi and Tecno: there is no Apple Store. Here is how to check a real dealer in Karachi, Lahore, Islamabad and Rawalpindi.",
    updated,
    intro:
      "An authorized dealer can give you the brand's warranty and a bill the brand will accept. A busy counter in Hafeez Centre, Saddar Karachi or Singapore Plaza can sell a genuine phone and still not be authorized. Check the brand, not the shutter.",
    sections: [
      {
        heading: "Is there an Apple Store in Pakistan?",
        paragraphs: [
          "No. There is no Apple Store in Karachi, Lahore, Islamabad or Rawalpindi. Official iPhones are sold through distributors and the resellers those distributors list. A shop that paints an Apple logo on the glass is not an Apple Store.",
        ],
      },
      {
        heading: "Who are the authorized Apple distributors?",
        paragraphs: [
          "Two companies publicly describe themselves as Apple authorized distributors in Pakistan. Mercantile says it has been Apple's authorized distributor here since 2019, and its site has a reseller locator plus Mercantile Care service centres in Lahore and Islamabad. GNEXT describes itself as an Apple authorized distributor and service provider. In late September 2026, PTML (Ufone and Telenor) announced a partnership with GNEXT for the iPhone 18 Pro series, and said customers could use Ufone–Telenor joint shops in Karachi, Lahore, Islamabad and Rawalpindi for that offer.",
          "Those are distributor claims and a launch announcement, not a permanent map of every counter. Open the distributor's own locator on the day you travel. A partner for one launch week is not every shop in the market.",
          "Airlink's stores page labels one outlet, and only that outlet, as an Apple Authorized Reseller: G-1, Xinhua Mall, Gulberg III, Lahore. Treat that as Airlink's own label. The invoice should still show the warranty you were promised.",
        ],
      },
      {
        heading: "Where do people buy an official iPhone in each city?",
        paragraphs: [
          "Use the locator first. These are the public doors, not a complete reseller list.",
        ],
        bullets: [
          "Lahore: Airlink at Xinhua Mall, G-1, Gulberg, labeled Apple Authorized Reseller on Airlink's stores page. Mercantile Care for service in Lahore.",
          "Karachi: Mercantile's reseller locator, and GNEXT's retail partners. Airlink's Lucky One and Dolmen Clifton shops are Airlink stores; Airlink's stores page does not label them as the Apple reseller.",
          "Islamabad: Mercantile Care for service. For a launch offer, the September 2026 PTML announcement named Ufone–Telenor joint shops, not a single market counter.",
          "Rawalpindi: same rule. Singapore Plaza is a bazaar. Do not treat a counter there as an Apple dealer unless the distributor's locator shows that shop.",
        ],
      },
      {
        heading: "Who are the authorized Samsung dealers?",
        paragraphs: [
          "Samsung publishes a service-center locator for Pakistan. Search your city there, and increase the radius if the first result is empty. Samsung's own pages also name these experience outlets and trade-in counters. A Samsung sticker in a market can be printed by the shop. The bill, and a warranty check on Samsung's site, are the proof.",
        ],
        bullets: [
          "Karachi: Samsung Premium Outlet, shop LG-19, Lucky One Mall",
          "Lahore: Samsung Experience Store, shop G-27, Emporium Mall; shop 1079, Packages Mall; shop G-29, Dolmen Mall DHA Phase 6",
          "Islamabad: Afzal Corporation, shops 268–269, second floor, Centaurus; UniCell and Fone Store, Black Horse Plaza, Blue Area",
          "Rawalpindi: Sim Collection, shop 22, first floor, Singapore Plaza; A Tech Mobile, Rania Mall; Beeps & Bells, Shahbaz Plaza",
        ],
      },
      {
        heading: "What about Xiaomi, Tecno, Infinix, Oppo, Vivo and itel?",
        paragraphs: [
          "These brands sell through distributors and also through ordinary market counters. Airlink says it distributes Xiaomi, Tecno, Samsung, itel and others, which is why its where-to-buy list is full of Saddar, Hafeez Centre and Hall Road names. That list means the shop is in a distributor's retail network. It does not mean every box in the shop carries the brand warranty.",
          "Tecno and itel service is often routed through Carlcare. Oppo, Vivo, Infinix and Xiaomi each have their own Pakistan warranty check. A shop can be a normal retailer of a genuine box without being a service centre. That is fine if the warranty check passes. It is not fine if the seller says the brand does not check IMEI.",
        ],
      },
      {
        heading: "How do I tell a dealer from a market counter?",
        paragraphs: [
          "A dealer can show the current authorization, will put the shop name and IMEI on the invoice, and will not rush you out of the PTA check. A market counter can still be the right place for a used phone, if you inspect it. Do not pay a dealer price in cash to a person who will not write a bill.",
        ],
        bullets: [
          "Apple: Mercantile's reseller locator, or GNEXT's own channel, then the coverage check on the serial.",
          "Samsung: samsung.com/pk service locator, not a Facebook post.",
          "Other brands: the brand's Pakistan warranty page, not a blog ranking.",
          "Every brand: the IMEI on the phone matches the box, then SMS that IMEI to 8484. Authorization and PTA status are different checks.",
        ],
      },
    ],
    faqs: [
      {
        question: "Who is the authorized Apple distributor in Pakistan?",
        answer:
          "Mercantile says it has been an Apple authorized distributor since 2019. GNEXT also describes itself as an Apple authorized distributor and service provider, and was named in PTML's September 2026 iPhone 18 Pro launch. Confirm the shop on the distributor's own locator. There is no Apple Store.",
      },
      {
        question: "Where are authorized Apple resellers in Lahore?",
        answer:
          "The outlet Airlink itself labels as an Apple Authorized Reseller is G-1, Xinhua Mall, Gulberg III. Other Hafeez Centre counters need a current line on Mercantile's or GNEXT's locator before you treat them as authorized.",
      },
      {
        question: "Does an authorized dealer mean the phone is PTA approved?",
        answer:
          "No. Send the IMEI to 8484 even when the bill looks official. A dealer invoice and a PTA registration are two different things.",
      },
      {
        question: "How do I find a Samsung service center in Pakistan?",
        answer:
          "Use Samsung's service locator and search the city. The mall outlets and trade-in counters on this page are examples from Samsung's own pages, not a full list.",
      },
    ],
    related: [
      { href: "/phones/apple", label: "Apple phones on Mobile Market" },
      { href: "/phones/samsung", label: "Samsung phones on Mobile Market" },
      { href: "/guides/pta-status", label: "PTA status guide" },
      { href: "/guides/best-mobile-markets-in-pakistan", label: "Mobile markets by city" },
    ],
    sources: [
      { href: "https://mercantile.com.pk/", label: "Mercantile" },
      { href: "https://mercantile.com.pk/care", label: "Mercantile Care service centres" },
      { href: "https://mercantile.com.pk/locate-reseller", label: "Mercantile reseller locator" },
      { href: "https://www.airlinkcommunication.com/airlink-stores/", label: "Airlink stores" },
      { href: "https://www.samsung.com/pk/support/service-center/", label: "Samsung service locator" },
      { href: "https://www.samsung.com/pk/trade-in/", label: "Samsung trade-in counters" },
      { href: "https://www.nation.com.pk/30-Sep-2026/ptml-gnext-pair-iphone-18-pro-series-next-generation-5g-enhanced-digital-experience", label: "PTML and GNEXT, 30 September 2026" },
    ],
  },
];

export function placeGuideBySlug(slug: string) {
  return placeGuides.find((guide) => guide.slug === slug);
}
