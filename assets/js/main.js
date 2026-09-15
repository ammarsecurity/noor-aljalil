(function () {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.querySelector(".drawer-backdrop");
  const navLinks = document.querySelectorAll('.nav-desktop a, .mobile-drawer nav a');
  const form = document.getElementById("contact-form");
  const WA_NUMBER = "9647700470999";
  const galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  let lightboxIndex = 0;

  function showLightbox(index) {
    if (!galleryItems.length) return;
    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[lightboxIndex];
    const img = item.querySelector("img");
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.getAttribute("data-caption") || img.alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
  }

  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    backdrop.hidden = !open;
    document.body.classList.toggle("drawer-open", open);
  }

  toggle.addEventListener("click", function () {
    setDrawer(!drawer.classList.contains("is-open"));
  });

  backdrop.addEventListener("click", function () {
    setDrawer(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setDrawer(false);
      closeLightbox();
    }
    if (lightbox && !lightbox.hidden && event.key === "ArrowLeft") showLightbox(lightboxIndex + 1);
    if (lightbox && !lightbox.hidden && event.key === "ArrowRight") showLightbox(lightboxIndex - 1);
  });

  document.querySelectorAll('.mobile-drawer a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      setDrawer(false);
    });
  });

  function updateActiveNav() {
    const sections = ["hero", "services", "about", "gallery", "contact"];
    const fromTop = window.scrollY + header.offsetHeight + 24;
    let current = "hero";

    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= fromTop) current = id;
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  document.querySelectorAll("img[data-local]").forEach(function (img) {
    const localSrc = img.getAttribute("data-local");
    if (!localSrc) return;
    const probe = new Image();
    probe.onload = function () {
      img.src = localSrc;
    };
    probe.src = localSrc;
  });

  function showError(field, message) {
    const group = field.closest(".field");
    const error = group.querySelector(".field-error");
    group.classList.add("is-invalid");
    error.hidden = false;
    error.textContent = message;
  }

  function clearError(field) {
    const group = field.closest(".field");
    const error = group.querySelector(".field-error");
    group.classList.remove("is-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  function normalizePhone(value) {
    return value.replace(/[^\d]/g, "").replace(/^964/, "").replace(/^0/, "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = form.name;
    const phone = form.phone;
    const message = form.message;
    let valid = true;

    [name, phone, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, "اكتب الاسم بشكل صحيح.");
      valid = false;
    }

    const digits = normalizePhone(phone.value);
    if (!/^7\d{9}$/.test(digits)) {
      showError(phone, "أدخل رقم عراقي من 10 أرقام يبدأ بـ 7.");
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 8) {
      showError(message, "اكتب تفاصيل الطلب في الرسالة.");
      valid = false;
    }

    if (!valid) {
      form.querySelector(".is-invalid input, .is-invalid textarea").focus();
      return;
    }

    const text = [
      "طلب من موقع نور الجليل",
      "الاسم: " + name.value.trim(),
      "الهاتف: +964" + digits,
      "الرسالة: " + message.value.trim(),
    ].join("\n");

    window.open(
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
  });

  ["name", "phone", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      clearError(this);
    });
  });

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      showLightbox(index);
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
    showLightbox(lightboxIndex - 1);
  });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
    showLightbox(lightboxIndex + 1);
  });
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });
})();
