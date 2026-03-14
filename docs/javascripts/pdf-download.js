document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".md-header__inner");
  if (!header) return;

  // Resolve PDF URL relative to the current versioned base
  var scripts = document.querySelectorAll("script[src]");
  var base = "/";
  for (var i = 0; i < scripts.length; i++) {
    var m = scripts[i].src.match(/^(.*?\/\d+\.\d+\/)/);
    if (m) { base = m[1]; break; }
  }
  // fallback: derive from pathname
  if (base === "/") {
    var parts = window.location.pathname.split("/");
    if (parts[1] && parts[1].match(/^\d/)) base = "/" + parts[1] + "/";
  }

  var btn = document.createElement("a");
  btn.href = base + "pdf/Nexapp-SDWAN-Playbook.pdf";
  btn.setAttribute("download", "Nexapp-SDWAN-Playbook.pdf");
  btn.className = "md-header__button nx-pdf-btn";
  btn.title = "Download Nexapp SDWAN Playbook (PDF)";
  btn.setAttribute("aria-label", "Download PDF Playbook");
  btn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>' +
    '<polyline points="14 2 14 8 20 8"/>' +
    '<line x1="12" y1="18" x2="12" y2="12"/>' +
    '<polyline points="9 15 12 18 15 15"/>' +
    "</svg>";

  // Insert before the search toggle
  var search = header.querySelector(".md-search");
  if (search) {
    header.insertBefore(btn, search);
  } else {
    header.appendChild(btn);
  }
});
