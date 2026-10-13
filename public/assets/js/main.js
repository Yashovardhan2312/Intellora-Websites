(function () {
  "use strict";

  var EMAIL = "yashovardhan.singh@intellora.co.in";
  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var isDark = explicit ? explicit === "dark" : systemDark;
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* ---------- Contact form: opens a pre-filled email ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var LIMITS = { name: 100, business: 120, email: 254, phone: 30, message: 2000 };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function setError(field, message) {
    var el = form.querySelector('[data-error-for="' + field + '"]');
    var input = form.elements[field];
    if (el) el.textContent = message || "";
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate(data) {
    var ok = true;
    ["name", "business", "email", "phone", "message"].forEach(function (f) {
      setError(f, "");
    });
    if (!data.name) {
      setError("name", "Please enter your name.");
      ok = false;
    }
    if (!EMAIL_RE.test(data.email)) {
      setError("email", "Please enter a valid email address.");
      ok = false;
    }
    if (!data.message) {
      setError("message", "Please tell us a little about what you need.");
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fd = new FormData(form);
    if (clean(fd.get("website"))) return; // honeypot field filled in: ignore

    var data = {
      name: clean(fd.get("name")).slice(0, LIMITS.name),
      business: clean(fd.get("business")).slice(0, LIMITS.business),
      email: clean(fd.get("email")).slice(0, LIMITS.email),
      phone: clean(fd.get("phone")).slice(0, LIMITS.phone),
      type: clean(fd.get("type")),
      message: String(fd.get("message") || "").trim().slice(0, LIMITS.message),
    };

    if (!validate(data)) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var lines = [
      "Name: " + data.name,
      "Business: " + (data.business || "-"),
      "Business type: " + (data.type || "-"),
      "Email: " + data.email,
      "Phone: " + (data.phone || "-"),
      "",
      data.message,
    ];
    var subject = "Website enquiry from " + data.name;
    var href =
      "mailto:" +
      EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    status.hidden = false;
    status.textContent = "";
    var p = document.createElement("p");
    p.textContent =
      "Almost done. Your email app should open with your message ready to send. " +
      "If it did not, use the button below, or write to us directly.";
    var link = document.createElement("a");
    link.className = "btn btn-primary";
    link.href = href;
    link.textContent = "Open email with my message";
    var direct = document.createElement("p");
    direct.className = "muted";
    direct.textContent = "Email: " + EMAIL + " · Phone: +91 96645 45993";
    status.append(p, link, direct);
    status.focus();

    window.location.href = href;
  });
})();
