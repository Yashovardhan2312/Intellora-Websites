/*
 * Behaviour for the static copy of the site.
 *
 * The original is a React app. Its saved page contains the final markup and styles, but not its
 * component code, so the three behaviours below are reconstructed from what the markup shows:
 *   1. Sections fade/slide in as they scroll into view (they ship hidden: opacity 0, translateY).
 *   2. The fixed header gains a translucent background once the page is scrolled.
 *   3. The menu button (visible below the md breakpoint) opens a list of the same links.
 * Only utility classes that already exist in assets/css/app.css are used.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Reveal on scroll ---------- */
  var hidden = Array.prototype.slice.call(document.querySelectorAll('[style*="opacity: 0"]'));

  function show(el, delay) {
    if (reduceMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    el.style.transition = "opacity 0.6s ease-out " + delay + "ms, transform 0.6s ease-out " + delay + "ms";
    el.style.opacity = "1";
    el.style.transform = "none";
    window.setTimeout(function () {
      el.style.transition = ""; // hand hover/focus transitions back to the stylesheet
    }, 600 + delay + 60);
  }

  if (!("IntersectionObserver" in window)) {
    hidden.forEach(function (el) {
      show(el, 0);
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          observer.unobserve(el);
          var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
            return hidden.indexOf(c) !== -1;
          });
          show(el, siblings.indexOf(el) * 100);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    hidden.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- 2. Header background on scroll ---------- */
  var header = document.querySelector("header");
  var SCROLLED = ["bg-[hsl(var(--background)/0.95)]", "backdrop-blur-md", "border-b", "border-border/40"];

  function onScroll() {
    if (!header) return;
    var scrolled = window.scrollY > 20;
    header.classList.toggle("bg-transparent", !scrolled);
    SCROLLED.forEach(function (c) {
      header.classList.toggle(c, scrolled);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Mobile menu ---------- */
  var button = header && header.querySelector("button[aria-expanded]");
  var desktopNav = header && header.querySelector('nav[aria-label="Main navigation"]');
  if (!button || !desktopNav) return;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var panel = document.createElement("div");
  panel.id = "mobile-menu";
  panel.className = "hidden md:hidden border-t border-border/40 bg-[hsl(var(--background)/0.98)]";

  var list = document.createElement("nav");
  list.setAttribute("aria-label", "Mobile navigation");
  list.className = "flex flex-col gap-1 px-4 py-4";

  Array.prototype.forEach.call(desktopNav.querySelectorAll("a"), function (src) {
    var a = document.createElement("a");
    var href = src.getAttribute("href");
    var current = (href.replace(/\/+$/, "") || "/") === path;
    a.href = href;
    a.textContent = src.firstChild.textContent.trim();
    a.className =
      "block px-4 py-3 text-sm font-medium rounded-md " + (current ? "text-primary" : "text-foreground/70 hover:text-foreground");
    list.appendChild(a);
  });

  var cta = document.createElement("a");
  cta.href = "/contact";
  cta.textContent = "Request a Demo";
  cta.className =
    "inline-flex items-center justify-center mt-2 px-5 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground";
  list.appendChild(cta);
  panel.appendChild(list);
  header.appendChild(panel);

  var MENU_ICON = button.innerHTML;
  var CLOSE_ICON =
    '<svg class="lucide lucide-x" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>';

  button.setAttribute("aria-controls", "mobile-menu");

  function setOpen(open) {
    panel.classList.toggle("hidden", !open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    button.innerHTML = open ? CLOSE_ICON : MENU_ICON;
    if (open) {
      header.classList.remove("bg-transparent");
      SCROLLED.forEach(function (c) {
        header.classList.add(c);
      });
    } else {
      onScroll();
    }
  }

  button.addEventListener("click", function () {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });
  window.matchMedia("(min-width: 768px)").addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
})();

/*
 * Contact form (contact page only).
 * The saved page contains the form markup but not its submit handler, so how the original delivered messages is unknown.
 * This version validates the required fields, then opens the visitor's email app with the message pre-filled and
 * addressed to the founder. Nothing is stored on a server.
 */
(function () {
  "use strict";
  var form = document.querySelector("main form");
  if (!form || !form.elements.businessName) return;

  var EMAIL = "yashovardhan.singh@intellora.co.in";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var LIMITS = { name: 100, businessName: 120, email: 254, phone: 30, businessType: 60, message: 2000 };

  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim().slice(0, LIMITS[name] || 200) : "";
  }

  function clearErrors() {
    Array.prototype.forEach.call(form.querySelectorAll("[data-form-error]"), function (n) {
      n.remove();
    });
    Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (n) {
      n.removeAttribute("aria-invalid");
    });
  }

  function fail(name, message) {
    var el = form.elements[name];
    var p = document.createElement("p");
    p.className = "text-xs";
    p.style.color = "hsl(var(--destructive))";
    p.setAttribute("data-form-error", "");
    p.id = "err-" + name;
    p.textContent = message;
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", p.id);
    el.parentNode.appendChild(p);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (val("_gotcha")) return; // honeypot filled in: ignore

    clearErrors();
    var ok = true;
    if (!val("name")) { fail("name", "Please enter your name."); ok = false; }
    if (!val("businessName")) { fail("businessName", "Please enter your business name."); ok = false; }
    if (!EMAIL_RE.test(val("email"))) { fail("email", "Please enter a valid email address."); ok = false; }
    if (!val("message")) { fail("message", "Please tell us a little about what you need."); ok = false; }
    if (!ok) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }

    var type = val("businessType");
    var lines = [
      "Name: " + val("name"),
      "Business: " + val("businessName"),
      "Business type: " + (type || "-"),
      "Email: " + val("email"),
      "Phone: " + (val("phone") || "-"),
      "",
      form.elements.message.value.trim().slice(0, LIMITS.message),
    ];
    var href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Demo request from " + val("name") + " (" + val("businessName") + ")") +
      "&body=" + encodeURIComponent(lines.join("\n"));

    var old = form.querySelector("[data-form-status]");
    if (old) old.remove();
    var box = document.createElement("div");
    box.setAttribute("data-form-status", "");
    box.setAttribute("role", "status");
    box.tabIndex = -1;
    box.className = "rounded-lg p-4 border border-border/70 text-sm text-muted-foreground flex flex-col gap-3";
    var msg = document.createElement("p");
    msg.textContent =
      "Almost done. Your email app should open with your message ready to send. If it did not, use the button below.";
    var link = document.createElement("a");
    link.href = href;
    link.textContent = "Open email with my message";
    link.className = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg text-primary-foreground w-fit";
    link.style.background = "hsl(var(--primary))";
    var direct = document.createElement("p");
    direct.className = "text-xs";
    direct.textContent = "Or write to " + EMAIL + " or call +91 96645 45993.";
    box.append(msg, link, direct);
    form.appendChild(box);
    box.focus();
    window.location.href = href;
  });
})();
