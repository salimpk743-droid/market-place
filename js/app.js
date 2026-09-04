/* MobileWheels PK — shared UI */
(function () {
  const LS_KEY = "mw_user_listings_v1";

  function cityBySlug(slug) {
    return (MW.CITIES || []).find((c) => c.slug === slug);
  }

  function cityName(slug) {
    return cityBySlug(slug)?.name || slug || "";
  }

  function cityLabel(slug, area) {
    const name = cityName(slug);
    return area ? name + ", " + area : name;
  }

  function ptaMeta(id) {
    return (MW.PTA || []).find((p) => p.id === id) || MW.PTA[0];
  }

  function formatPkr(n) {
    const x = Number(n) || 0;
    return "PKR " + x.toLocaleString("en-PK");
  }

  function listingTitle(l) {
    const name = (l.model || "").toLowerCase().startsWith((l.brand || "").toLowerCase())
      ? l.model
      : (l.brand + " " + l.model).trim();
    return l.storageGb ? name + " (" + l.storageGb + " GB)" : name;
  }

  function loadUserListings() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveUserListing(listing) {
    const all = loadUserListings();
    all.unshift(listing);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  function allListings() {
    return loadUserListings().concat(MW.SEED_LISTINGS || []);
  }

  function getListing(id) {
    return allListings().find((l) => l.id === id);
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }

  function filterListings(f) {
    const q = (f.q || "").trim().toLowerCase();
    return allListings().filter((l) => {
      if (f.featuredOnly && !l.featured) return false;
      if (f.city && l.citySlug !== f.city) return false;
      if (f.area && (l.area || "") !== f.area) return false;
      if (f.brand && l.brand !== f.brand) return false;
      if (f.pta && l.ptaStatus !== f.pta) return false;
      if (f.minPrice && Number(l.pricePkr) < Number(f.minPrice)) return false;
      if (f.maxPrice && Number(l.pricePkr) > Number(f.maxPrice)) return false;
      if (q) {
        const hay = [l.brand, l.model, l.color, l.area, cityName(l.citySlug), l.description]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function fillCitySelect(select, selected, allowAll) {
    if (!select) return;
    const groups = MW.PROVINCES.map((p) => ({
      ...p,
      cities: MW.CITIES.filter((c) => c.province === p.id),
    }));
    let html = allowAll ? '<option value="">All Cities / Locations</option>' : '<option value="">Select city</option>';
    groups.forEach((g) => {
      html += '<optgroup label="' + g.name + '">';
      g.cities.forEach((c) => {
        html +=
          '<option value="' +
          c.slug +
          '"' +
          (selected === c.slug ? " selected" : "") +
          ">" +
          c.name +
          "</option>";
      });
      html += "</optgroup>";
    });
    select.innerHTML = html;
    if (selected) select.value = selected;
  }

  function fillAreaSelect(select, citySlug, selected, allowAll) {
    if (!select) return;
    const city = cityBySlug(citySlug);
    const areas = city ? city.areas : [];
    let html = allowAll
      ? '<option value="">All areas</option>'
      : '<option value="">' + (city ? "Select area" : "Pick a city first") + "</option>";
    areas.forEach((a) => {
      html +=
        '<option value="' +
        a.replace(/"/g, """) +
        '"' +
        (selected === a ? " selected" : "") +
        ">" +
        a +
        "</option>";
    });
    select.innerHTML = html;
    select.disabled = !city;
    if (selected) select.value = selected;
  }

  function bindCityArea(cityEl, areaEl, opts) {
    const allowAll = !!(opts && opts.allowAll);
    fillCitySelect(cityEl, (opts && opts.city) || "", allowAll);
    fillAreaSelect(areaEl, (opts && opts.city) || "", (opts && opts.area) || "", allowAll);
    cityEl.addEventListener("change", () => {
      fillAreaSelect(areaEl, cityEl.value, "", allowAll);
    });
  }

  function cardHtml(l) {
    const pta = ptaMeta(l.ptaStatus);
    const spec = [
      l.storageGb ? l.storageGb + " GB" : null,
      l.ramGb ? l.ramGb + " GB RAM" : null,
      l.batteryHealth ? l.batteryHealth + "% BH" : null,
    ]
      .filter(Boolean)
      .join(" · ");
    const img = l.imageUrl || MW.BRAND_IMAGES[l.brand] || "ads/iphone-13-pro.jpg";
    return (
      '<a href="phone.html?id=' +
      encodeURIComponent(l.id) +
      '" class="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block">' +
      '<div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">' +
      '<img src="' +
      img +
      '" alt="' +
      listingTitle(l).replace(/"/g, "") +
      '" class="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300">' +
      '<div class="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">' +
      (l.featured
        ? '<span class="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded">Featured</span>'
        : "") +
      '<span class="' +
      pta.cls +
      ' text-[10px] font-bold px-2 py-0.5 rounded">' +
      pta.short +
      "</span></div></div>" +
      '<div class="p-4">' +
      '<h3 class="font-bold text-gray-900 leading-snug">' +
      listingTitle(l) +
      "</h3>" +
      '<p class="text-xl font-extrabold text-blue-700 mt-1">' +
      formatPkr(l.pricePkr) +
      "</p>" +
      (spec ? '<p class="text-xs text-gray-500 mt-1">' + spec + "</p>" : "") +
      '<p class="text-xs text-gray-500 mt-2"><i class="fa-solid fa-location-dot mr-1"></i>' +
      cityLabel(l.citySlug, l.area) +
      "</p></div></a>"
    );
  }

  function timeAgo(hours) {
    if (hours == null) return "Just now";
    if (hours < 1) return "Just now";
    if (hours < 24) return hours + " hour" + (hours === 1 ? "" : "s") + " ago";
    const d = Math.round(hours / 24);
    return d + " day" + (d === 1 ? "" : "s") + " ago";
  }

  function brandImage(brand, model) {
    const m = (model || "").toLowerCase();
    if (m.includes("15 pro max")) return "ads/iphone-15-pro-max.jpg";
    if (m.includes("14 pro")) return "ads/iphone-14-pro.jpg";
    if (m.includes("13 pro")) return "ads/iphone-13-pro.jpg";
    if (m.includes("iphone 12")) return "ads/iphone-12.jpg";
    if (m.includes("s24 ultra")) return "ads/s24-ultra.jpg";
    if (m.includes("s23 ultra")) return "ads/s23-ultra.jpg";
    if (m.includes("a55")) return "ads/a55.jpg";
    if (m.includes("pixel")) return "ads/pixel-7-pro.jpg";
    if (m.includes("xiaomi 14")) return "ads/xiaomi-14.jpg";
    if (m.includes("note 13")) return "ads/redmi-note-13-pro.jpg";
    if (m.includes("v30")) return "ads/vivo-v30.jpg";
    if (m.includes("reno")) return "ads/oppo-reno-11.jpg";
    if (m.includes("note 40")) return "ads/infinix-note-40.jpg";
    if (m.includes("oneplus") || brand === "OnePlus") return "ads/oneplus-12.jpg";
    return MW.BRAND_IMAGES[brand] || "ads/iphone-13-pro.jpg";
  }

  window.MW.ui = {
    cityBySlug,
    cityName,
    cityLabel,
    ptaMeta,
    formatPkr,
    listingTitle,
    allListings,
    getListing,
    filterListings,
    saveUserListing,
    qs,
    bindCityArea,
    fillCitySelect,
    fillAreaSelect,
    cardHtml,
    timeAgo,
    brandImage,
  };
})();
