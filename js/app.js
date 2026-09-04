/* MobileWheels PK — shared UI */
(function () {
  const LS_KEY = "mw_user_listings_v1";

  function cityBySlug(slug) {
    return (MW.CITIES || []).find(function (c) {
      return c.slug === slug;
    });
  }

  function cityName(slug) {
    var c = cityBySlug(slug);
    return c ? c.name : slug || "";
  }

  function cityLabel(slug, area) {
    var name = cityName(slug);
    return area ? name + ", " + area : name;
  }

  function ptaMeta(id) {
    return (
      (MW.PTA || []).find(function (p) {
        return p.id === id;
      }) || MW.PTA[0]
    );
  }

  function formatPkr(n) {
    return "PKR " + (Number(n) || 0).toLocaleString("en-PK");
  }

  function listingTitle(l) {
    var brand = l.brand || "";
    var model = l.model || "";
    var name = model.toLowerCase().indexOf(brand.toLowerCase()) === 0 ? model : (brand + " " + model).trim();
    return l.storageGb ? name + " (" + l.storageGb + " GB)" : name;
  }

  function loadUserListings() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserListing(listing) {
    var all = loadUserListings();
    all.unshift(listing);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  }

  function allListings() {
    return loadUserListings().concat(MW.SEED_LISTINGS || []);
  }

  function getListing(id) {
    return allListings().find(function (l) {
      return l.id === id;
    });
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }

  function filterListings(f) {
    f = f || {};
    var q = (f.q || "").trim().toLowerCase();
    return allListings().filter(function (l) {
      if (f.featuredOnly && !l.featured) return false;
      if (f.city && l.citySlug !== f.city) return false;
      if (f.area && (l.area || "") !== f.area) return false;
      if (f.brand && l.brand !== f.brand) return false;
      if (f.pta && l.ptaStatus !== f.pta) return false;
      if (f.storage && Number(l.storageGb) !== Number(f.storage)) return false;
      if (f.minPrice && Number(l.pricePkr) < Number(f.minPrice)) return false;
      if (f.maxPrice && Number(l.pricePkr) > Number(f.maxPrice)) return false;
      if (q) {
        var hay = [l.brand, l.model, l.color, l.area, cityName(l.citySlug), l.description]
          .join(" ")
          .toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function addOption(parent, value, label, selected) {
    var o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    if (selected) o.selected = true;
    parent.appendChild(o);
    return o;
  }

  function fillCitySelect(select, selected, allowAll) {
    if (!select) return;
    select.innerHTML = "";
    addOption(
      select,
      "",
      allowAll ? "All cities in Pakistan (" + MW.CITY_COUNT + ")" : "Select city",
      !selected
    );
    (MW.PROVINCES || []).forEach(function (p) {
      var g = document.createElement("optgroup");
      g.label = p.name;
      MW.CITIES.filter(function (c) {
        return c.province === p.id;
      }).forEach(function (c) {
        addOption(g, c.slug, c.name, selected === c.slug);
      });
      select.appendChild(g);
    });
    if (selected) select.value = selected;
  }

  function fillAreaSelect(select, citySlug, selected, allowAll) {
    if (!select) return;
    var city = cityBySlug(citySlug);
    var areas = city ? city.areas : [];
    select.innerHTML = "";
    addOption(
      select,
      "",
      city ? (allowAll ? "All areas in " + city.name : "Select area") : "Pick a city first",
      !selected
    );
    areas.forEach(function (a) {
      addOption(select, a, a, selected === a);
    });
    select.disabled = !city;
    if (selected) select.value = selected;
  }

  function fillBrandSelect(select, selected, allowAll) {
    if (!select) return;
    select.innerHTML = "";
    addOption(select, "", allowAll ? "All brands" : "Select brand", !selected);
    (MW.BRANDS || []).forEach(function (b) {
      addOption(select, b.name, b.name, selected === b.name);
    });
    if (selected) select.value = selected;
  }

  function fillPtaSelect(select, selected, allowAll) {
    if (!select) return;
    select.innerHTML = "";
    addOption(select, "", allowAll ? "PTA approved & Non-PTA" : "Select PTA status", !selected);
    (MW.PTA || []).forEach(function (p) {
      addOption(select, p.id, p.label, selected === p.id);
    });
    if (selected) select.value = selected;
  }

  function fillStorageSelect(select, selected) {
    if (!select) return;
    select.innerHTML = "";
    addOption(select, "", "Any memory / storage", !selected);
    (MW.STORAGE_OPTIONS || []).forEach(function (n) {
      addOption(select, String(n), n + " GB", String(selected) === String(n));
    });
    if (selected) select.value = selected;
  }

  function bindCityArea(cityEl, areaEl, opts) {
    opts = opts || {};
    fillCitySelect(cityEl, opts.city || "", !!opts.allowAll);
    if (areaEl) fillAreaSelect(areaEl, opts.city || "", opts.area || "", !!opts.allowAll);
    if (cityEl && areaEl) {
      cityEl.addEventListener("change", function () {
        fillAreaSelect(areaEl, cityEl.value, "", !!opts.allowAll);
      });
    }
  }

  function brandImage(brand, model) {
    var m = (model || "").toLowerCase();
    if (m.indexOf("15 pro max") !== -1) return "ads/iphone-15-pro-max.jpg";
    if (m.indexOf("14 pro") !== -1) return "ads/iphone-14-pro.jpg";
    if (m.indexOf("13 pro") !== -1) return "ads/iphone-13-pro.jpg";
    if (m.indexOf("iphone 12") !== -1) return "ads/iphone-12.jpg";
    if (m.indexOf("s24 ultra") !== -1) return "ads/s24-ultra.jpg";
    if (m.indexOf("s23 ultra") !== -1) return "ads/s23-ultra.jpg";
    if (m.indexOf("a55") !== -1) return "ads/a55.jpg";
    if (m.indexOf("pixel") !== -1) return "ads/pixel-7-pro.jpg";
    if (m.indexOf("xiaomi 14") !== -1) return "ads/xiaomi-14.jpg";
    if (m.indexOf("note 13") !== -1) return "ads/redmi-note-13-pro.jpg";
    if (m.indexOf("v30") !== -1) return "ads/vivo-v30.jpg";
    if (m.indexOf("reno") !== -1) return "ads/oppo-reno-11.jpg";
    if (m.indexOf("note 40") !== -1) return "ads/infinix-note-40.jpg";
    if (m.indexOf("oneplus") !== -1 || brand === "OnePlus") return "ads/oneplus-12.jpg";
    return MW.BRAND_IMAGES[brand] || "ads/iphone-13-pro.jpg";
  }

  function cardHtml(l) {
    var pta = ptaMeta(l.ptaStatus);
    var spec = [
      l.storageGb ? l.storageGb + " GB" : null,
      l.ramGb ? l.ramGb + " GB RAM" : null,
      l.batteryHealth ? l.batteryHealth + "% battery" : null,
    ]
      .filter(Boolean)
      .join(" · ");
    var img = l.imageUrl || brandImage(l.brand, l.model);
    var featured = l.featured
      ? '<span class="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded">Featured</span>'
      : "";
    return (
      '<a href="phone.html?id=' +
      encodeURIComponent(l.id) +
      '" class="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block">' +
      '<div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">' +
      '<img src="' +
      img +
      '" alt="" class="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300">' +
      '<div class="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">' +
      featured +
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
    if (hours == null || hours < 1) return "Just now";
    if (hours < 24) return hours + " hour" + (hours === 1 ? "" : "s") + " ago";
    var d = Math.round(hours / 24);
    return d + " day" + (d === 1 ? "" : "s") + " ago";
  }

  function renderGrid(el, rows) {
    if (!el) return;
    if (!rows.length) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = rows.map(cardHtml).join("");
  }

  window.MW.ui = {
    cityBySlug: cityBySlug,
    cityName: cityName,
    cityLabel: cityLabel,
    ptaMeta: ptaMeta,
    formatPkr: formatPkr,
    listingTitle: listingTitle,
    allListings: allListings,
    getListing: getListing,
    filterListings: filterListings,
    saveUserListing: saveUserListing,
    qs: qs,
    bindCityArea: bindCityArea,
    fillCitySelect: fillCitySelect,
    fillAreaSelect: fillAreaSelect,
    fillBrandSelect: fillBrandSelect,
    fillPtaSelect: fillPtaSelect,
    fillStorageSelect: fillStorageSelect,
    cardHtml: cardHtml,
    timeAgo: timeAgo,
    brandImage: brandImage,
    renderGrid: renderGrid,
  };
})();
