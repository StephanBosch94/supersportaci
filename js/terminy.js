(function () {
  var PROJECT_ID = "bong2fyb";
  var DATASET = "production";
  var FALLBACK_FORM = "moeevgno";
  var CITIES = ["Liberec", "Jablonec nad Nisou"];
  var ELLIPSE =
    "/vendor/cdn_prod_website-files_com/6528fa00d496beba9baac33f/65291559ede77d73d74335e1_Ellipse 2.svg";

  var query =
    '{' +
    '"settings": *[_id == "nastaveni"][0]{formspreeId},' +
    '"terms": *[_type == "termin"] | order(startDate asc){' +
    "_id, city, location, startDate, endDate, price, headline, included, formspreeId" +
    "}" +
    "}";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return "";
    return parts[2] + "." + parts[1] + "." + parts[0];
  }

  function formatPrice(price) {
    return String(price) + ", -";
  }

  function field(label, name, type, placeholder, required, id) {
    return (
      '<div class="field"><div class="field-label-mandatory">' +
      '<label class="field-label">' +
      esc(label) +
      "</label>" +
      (required ? '<label class="mandtory">*</label>' : "") +
      "</div>" +
      '<input class="text-field w-input" maxlength="256" name="' +
      esc(name) +
      '" placeholder="' +
      esc(placeholder) +
      '" type="' +
      type +
      '" id="' +
      esc(id) +
      '"' +
      (type === "text" && name === "Datum narození dítěte"
        ? ' autocomplete="off" data-toggle="datepicker"'
        : "") +
      (required ? " required" : "") +
      "/></div>"
    );
  }

  function card(term, formId) {
    var id = term._id;
    var from = formatDate(term.startDate);
    var to = formatDate(term.endDate);
    var included = Array.isArray(term.included) ? term.included : [];
    var details = "";
    if (term.headline) details += "<p>" + esc(term.headline) + "</p>";
    if (included.length) {
      details += "<p><strong>V ceně:<br/></strong></p>";
      included.forEach(function (item) {
        details += "<p>" + esc(item) + "</p>";
      });
    }

    return (
      '<div role="listitem" class="collection-item w-dyn-item"><div class="time-slots">' +
      '<div class="time-slot"><div class="slot-information"><div class="time-slot-information">' +
      '<div class="date"><div class="location-name">' +
      esc(term.location) +
      "</div></div>" +
      '<div class="second-row-time-slot"><div class="div-block-4"><div class="date time">' +
      "<div>" +
      esc(from) +
      "</div><div>-</div><div>" +
      esc(to) +
      '</div><img src="' +
      ELLIPSE +
      '" alt="" class="image-4"/><div class="text-block-10 price">' +
      esc(formatPrice(term.price)) +
      "</div></div></div>" +
      (details ? '<div class="rich-text-block w-richtext">' + details + "</div>" : "") +
      "</div></div></div>" +
      '<a href="#" class="slot-button w-button">Přihláška</a></div>' +
      '<div class="form-block w-form" style="display:none">' +
      '<form class="terminform" method="POST" action="#" data-formspree="https://formspree.io/f/' +
      esc(formId) +
      '" id="prihlaska-' +
      esc(id) +
      '">' +
      '<input type="hidden" name="_subject" value="' +
      esc("Nová přihláška – " + term.city + " " + from + "–" + to) +
      '"/>' +
      '<input type="hidden" name="Město" value="' +
      esc(term.city) +
      '"/>' +
      '<input type="hidden" name="Lokalita" value="' +
      esc(term.location) +
      '"/>' +
      '<input type="hidden" name="Termin od" value="' +
      esc(from) +
      '"/>' +
      '<input type="hidden" name="Termin do" value="' +
      esc(to) +
      '"/>' +
      field(
        "Jméno zákonného zástupce",
        "Jméno zákonného zástupce",
        "text",
        "Zadejte jméno zákonného zástupce",
        true,
        id + "-parent"
      ) +
      field(
        "Telefon zákonného zástupce",
        "Telefon zákonného zástupce",
        "tel",
        "Zadejte telefon zákonného zástupce",
        true,
        id + "-phone"
      ) +
      field(
        "Email zákonného zástupce",
        "email",
        "email",
        "Zadejte email zákonného zástupce",
        true,
        id + "-email"
      ) +
      field("Jméno dítěte", "Jméno dítěte", "text", "Zadejte jméno dítěte", true, id + "-child") +
      field(
        "Datum narození dítěte",
        "Datum narození dítěte",
        "text",
        "Zadejte datum narození dítěte",
        true,
        id + "-birth"
      ) +
      field("Poznámky", "Poznámky", "text", "Napište poznámku", false, id + "-note") +
      '<input type="submit" data-wait="Počkejte prosím..." class="form-button w-button" value="Přihlásit se"/>' +
      "</form>" +
      '<div class="success-message-2 w-form-done"><div class="text-block-14">Děkujeme! Váš formulář byl přijat!</div></div>' +
      '<div class="error-message w-form-fail"><div>Ups! Při odesílání formuláře se něco pokazilo.</div></div>' +
      "</div></div></div>"
    );
  }

  function cityColumn(city, terms, defaultForm) {
    var body;
    if (!terms.length) {
      body =
        '<div class="w-dyn-list"><div class="empty-state w-dyn-empty"><div class="text-block-18">Termíny budou brzy zveřejněny</div></div></div>';
    } else {
      body =
        '<div class="w-dyn-list"><div role="list" class="collection-list w-dyn-items">' +
        terms
          .map(function (term) {
            return card(term, term.formspreeId || defaultForm);
          })
          .join("") +
        "</div></div>";
    }
    return (
      '<div class="time-slots"><div class="text-block-8">' + esc(city) + "</div>" + body + "</div>"
    );
  }

  function render(data) {
    var root = document.getElementById("terminy-list");
    if (!root) return;
    var defaultForm = (data.settings && data.settings.formspreeId) || FALLBACK_FORM;
    var terms = data.terms || [];
    var cities = CITIES.slice();
    terms.forEach(function (term) {
      if (term.city && cities.indexOf(term.city) === -1) cities.push(term.city);
    });
    root.innerHTML = cities
      .map(function (city) {
        return cityColumn(
          city,
          terms.filter(function (term) {
            return term.city === city;
          }),
          defaultForm
        );
      })
      .join("");
    if (window.bindTermForms) window.bindTermForms(root);
  }

  function load() {
    var url =
      "https://" +
      PROJECT_ID +
      ".api.sanity.io/v2026-10-24/data/query/" +
      DATASET +
      "?query=" +
      encodeURIComponent(query);
    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Sanity request failed");
        return response.json();
      })
      .then(function (payload) {
        if (payload && payload.result) render(payload.result);
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
