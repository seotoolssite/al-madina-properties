// ---- CONFIG: replace once a custom domain / real data source exists ----
const SITE = {
  name: "Al Madina Properties",
  owner: "Muhammad Nabeel Khan",
  phone: "+923017998607",
  whatsapp: "923017998607",
  email: "propertylinks07@gmail.com",
  address: "Gulshan-e-Gani, near Stadium Rd, Burewala, Vehari, Punjab 61010, Pakistan",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Al Madina Properties, Gulshan-e-Gani, Stadium Rd, Burewala, Vehari, Punjab 61010, Pakistan")
};

// ---- SAMPLE LISTINGS (clearly placeholder structure — replace with real properties) ----
// This array is the single source of truth for both index.html's grid and property.html's detail view.
// Later this can be swapped for a fetch() to a JSON file, Google Sheet, Supabase table, or WordPress REST API
// without changing the rendering code below.
const LISTINGS = [
  {
    id: "AMP-001",
    title: "5 Marla Residential Plot",
    type: "Plot",
    purpose: "Sale",
    location: "Burewala",
    size: "5 Marla",
    price: "Contact for price",
    description: "Sample listing structure. Replace with a real plot's details: exact block/phase, possession status, and price.",
    features: ["Residential", "Add real features here"]
  },
  {
    id: "AMP-002",
    title: "Commercial Shop — Main Bazaar Area",
    type: "Commercial",
    purpose: "Rent",
    location: "Burewala",
    size: "Add size",
    price: "Contact for price",
    description: "Sample listing structure. Replace with a real shop's floor, frontage, and rent terms.",
    features: ["Commercial", "Add real features here"]
  },
  {
    id: "AMP-003",
    title: "10 Marla House",
    type: "House",
    purpose: "Sale",
    location: "Burewala",
    size: "10 Marla",
    price: "Contact for price",
    description: "Sample listing structure. Replace with a real house's bedrooms, bathrooms, and construction details.",
    features: ["Residential", "Add real features here"]
  }
];

function waLink(message){
  return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(message);
}

function listingCard(l){
  const msg = `Hello, I am interested in Property ID ${l.id} (${l.title}). Please share the current details.`;
  return `
  <div class="listing-card" data-type="${l.type}" data-purpose="${l.purpose}">
    <div class="listing-media"><span class="badge">Sample listing</span>Property photo — to be added</div>
    <div class="listing-body">
      <h3>${l.title}</h3>
      <p>${l.location} · ${l.size} · ${l.purpose}</p>
      <p class="price">${l.price}</p>
      <div class="listing-actions">
        <a href="property.html?id=${l.id}">View details</a>
        <a class="wa" target="_blank" rel="noopener" href="${waLink(msg)}">WhatsApp</a>
      </div>
    </div>
  </div>`;
}

function renderListings(filterType, filterPurpose){
  const grid = document.getElementById("listing-grid");
  if(!grid) return;
  const filtered = LISTINGS.filter(l =>
    (filterType === "all" || l.type === filterType) &&
    (filterPurpose === "all" || l.purpose === filterPurpose)
  );
  grid.innerHTML = filtered.map(listingCard).join("") || `<p>No sample listings match that filter.</p>`;
}

function initListings(){
  const grid = document.getElementById("listing-grid");
  if(!grid) return;
  renderListings("all","all");
  const typeSel = document.getElementById("filter-type");
  const purposeSel = document.getElementById("filter-purpose");
  function update(){ renderListings(typeSel.value, purposeSel.value); }
  typeSel && typeSel.addEventListener("change", update);
  purposeSel && purposeSel.addEventListener("change", update);
}

function initPropertyPage(){
  const el = document.getElementById("property-detail");
  if(!el) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const l = LISTINGS.find(x => x.id === id);
  if(!l){
    el.innerHTML = `<p>Property not found. <a href="index.html#listings">Back to listings</a>.</p>`;
    return;
  }
  const msg = `Hello, I am interested in Property ID ${l.id} (${l.title}). Please share the current details.`;
  document.title = l.title + " — " + SITE.name;
  el.innerHTML = `
    <span class="badge" style="position:static;display:inline-block;margin-bottom:14px;">Sample listing structure</span>
    <h1>${l.title}</h1>
    <p style="color:var(--muted);margin-top:8px;">Property ID: ${l.id} · ${l.location} · ${l.size} · ${l.purpose}</p>
    <div class="listing-media" style="margin-top:20px;max-width:520px;">Image gallery — to be added</div>
    <p style="margin-top:20px;max-width:60ch;">${l.description}</p>
    <ul style="margin-top:14px;">${l.features.map(f=>`<li>${f}</li>`).join("")}</ul>
    <div class="hero-cta" style="margin-top:26px;">
      <a class="btn wa" target="_blank" rel="noopener" href="${waLink(msg)}">Chat on WhatsApp</a>
      <a class="btn outline" href="tel:${SITE.phone}">Call ${SITE.phone}</a>
    </div>`;
}

function initMobileNav(){
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav-links");
  if(!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.style.display === "flex";
    nav.style.display = open ? "none" : "flex";
    nav.style.flexDirection = "column";
    btn.setAttribute("aria-expanded", String(!open));
  });
}

function initReveal(){
  const items = document.querySelectorAll(".fade");
  if(!("IntersectionObserver" in window) || items.length === 0){
    items.forEach(i => i.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:0.15});
  items.forEach(i => io.observe(i));
}

document.addEventListener("DOMContentLoaded", () => {
  initListings();
  initPropertyPage();
  initMobileNav();
  initReveal();
});
// Formspree + reCAPTCHA
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdekzagz";

function setupForm(formId, fieldMap) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Remove the old demo submit behavior
  form.onsubmit = null;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const confirm = form.querySelector(".confirm");

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      const token = await grecaptcha.execute(
        "6Ldeu8otAAAAAMp-dWH-2ldZg4gnURsqWsA44BWV",
        { action: "submit" }
      );

      const formData = new FormData();

      fieldMap.forEach(([name, id]) => {
        const field = document.getElementById(id);
        if (field) {
          formData.append(name, field.value);
        }
      });

      formData.append("g-recaptcha-response", token);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();

      if (confirm) {
        confirm.textContent =
          "Thank you! Your inquiry has been received. We will contact you soon.";
        confirm.style.display = "block";
      }

    } catch (error) {
      if (confirm) {
        confirm.textContent =
          "Sorry, something went wrong. Please contact us by WhatsApp or phone.";
        confirm.style.display = "block";
      }
    }

    if (button) {
      button.disabled = false;
      button.textContent =
        formId === "buyer-form"
          ? "Submit Inquiry"
          : "Request Property Evaluation";
    }
  });
}


// Buyer form
setupForm("buyer-form", [
  ["name", "b-name"],
  ["phone", "b-phone"],
  ["email", "b-email"],
  ["property_type", "b-type"],
  ["purpose", "b-purpose"],
  ["location", "b-location"],
  ["budget", "b-budget"],
  ["notes", "b-notes"]
]);


// Seller form
setupForm("seller-form", [
  ["name", "s-name"],
  ["phone", "s-phone"],
  ["email", "s-email"],
  ["property_type", "s-type"],
  ["property_size", "s-size"],
  ["location", "s-location"],
  ["expected_price", "s-price"],
  ["description", "s-desc"]
]);
