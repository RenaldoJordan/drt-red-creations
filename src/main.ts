// Main TypeScript file for DRT RED CREATIONS
// This file controls navigation, forms, filters, FAQ accordion,
// the custom order preview, price estimate, and upload preview.

import "./style.css";

type CupType = "ceramic" | "glass" | "skinny" | "steel" | "kids";

interface CupPricing {
  label: string;
  basePrice: number;
}

const pricingMap: Record<CupType, CupPricing> = {
  ceramic: {
    label: "Ceramic Mug",
    basePrice: 18
  },
  glass: {
    label: "Glass Mug",
    basePrice: 20
  },
  skinny: {
    label: "Skinny Tumbler",
    basePrice: 28
  },
  steel: {
    label: "Stainless Steel Tumbler",
    basePrice: 32
  },
  kids: {
    label: "Kids Cup",
    basePrice: 16
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupVendorFilters();
  setupFaqAccordion();
  setupVendorForm();
  setupCustomOrderBuilder();
});

function setupMobileMenu(): void {
  const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
  const navLinks = document.querySelector<HTMLElement>(".nav-links");

  if (!menuButton || !navLinks) return;

  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}

function setupVendorFilters(): void {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
  const vendorItems = document.querySelectorAll<HTMLElement>(".vendor-item");

  if (!filterButtons.length || !vendorItems.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter ?? "all";

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      vendorItems.forEach((item) => {
        const category = item.dataset.category;

        if (selectedFilter === "all" || category === selectedFilter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

function setupFaqAccordion(): void {
  const faqItems = document.querySelectorAll<HTMLElement>(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector<HTMLButtonElement>(".faq-question");

    question?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((faq) => faq.classList.remove("open"));

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

function setupVendorForm(): void {
  const vendorForm = document.querySelector<HTMLFormElement>("#vendorForm");
  const vendorStatus = document.querySelector<HTMLElement>("#vendorStatus");

  if (!vendorForm || !vendorStatus) return;

  vendorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!vendorForm.checkValidity()) {
      vendorStatus.textContent = "Please complete all required fields.";
      vendorStatus.className = "form-status error";
      return;
    }

    vendorStatus.textContent =
      "Thank you! Your vendor pricing request has been received. We will email pricing details soon.";
    vendorStatus.className = "form-status success";

    vendorForm.reset();
  });
}

function setupCustomOrderBuilder(): void {
  const customForm = document.querySelector<HTMLFormElement>("#customOrderForm");

  if (!customForm) return;

  const customTextInput = document.querySelector<HTMLInputElement>("#customText");
  const cupTypeSelect = document.querySelector<HTMLSelectElement>("#cupType");
  const cupColorInput = document.querySelector<HTMLInputElement>("#cupColor");
  const fontStyleSelect = document.querySelector<HTMLSelectElement>("#fontStyle");
  const quantityInput = document.querySelector<HTMLInputElement>("#quantity");
  const imageUpload = document.querySelector<HTMLInputElement>("#imageUpload");

  const cupPreview = document.querySelector<HTMLElement>("#cupPreview");
  const previewText = document.querySelector<HTMLElement>("#previewText");
  const previewImage = document.querySelector<HTMLImageElement>("#previewImage");
  const priceEstimate = document.querySelector<HTMLElement>("#priceEstimate");
  const customStatus = document.querySelector<HTMLElement>("#customStatus");

  const requiredElements = [
    customTextInput,
    cupTypeSelect,
    cupColorInput,
    fontStyleSelect,
    quantityInput,
    cupPreview,
    previewText,
    priceEstimate
  ];

  if (requiredElements.some((element) => !element)) return;

  const updatePreview = (): void => {
    const selectedCupType = cupTypeSelect!.value as CupType;
    const selectedPricing = pricingMap[selectedCupType];
    const quantity = Math.max(Number(quantityInput!.value) || 1, 1);

    const rushValue =
      customForm.querySelector<HTMLInputElement>('input[name="rush"]:checked')?.value ?? "no";

    const rushFee = rushValue === "yes" ? 15 : 0;
    const total = selectedPricing.basePrice * quantity + rushFee;

    previewText!.textContent = customTextInput!.value.trim() || "Your Text";
    cupPreview!.style.backgroundColor = cupColorInput!.value;

    cupPreview!.classList.remove("font-bold", "font-script", "font-playful", "font-clean");
    cupPreview!.classList.add(`font-${fontStyleSelect!.value}`);

    cupPreview!.dataset.cupType = selectedCupType;

    priceEstimate!.textContent = `$${total.toFixed(2)}`;
  };

  customTextInput!.addEventListener("input", updatePreview);
  cupTypeSelect!.addEventListener("change", updatePreview);
  cupColorInput!.addEventListener("input", updatePreview);
  fontStyleSelect!.addEventListener("change", updatePreview);
  quantityInput!.addEventListener("input", updatePreview);

  customForm.querySelectorAll<HTMLInputElement>('input[name="rush"]').forEach((radio) => {
    radio.addEventListener("change", updatePreview);
  });

  imageUpload?.addEventListener("change", () => {
    const file = imageUpload.files?.[0];

    if (!file || !previewImage) return;

    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
    previewImage.style.display = "block";
  });

  customForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!customForm.checkValidity()) {
      if (customStatus) {
        customStatus.textContent = "Please complete the required custom order fields.";
        customStatus.className = "form-status error";
      }
      return;
    }

    if (customStatus) {
      customStatus.textContent =
        "Your custom order request was submitted! We will contact you with a proof and final price.";
      customStatus.className = "form-status success";
    }

    customForm.reset();

    if (previewImage) {
      previewImage.removeAttribute("src");
      previewImage.style.display = "none";
    }

    updatePreview();
  });

  updatePreview();
}