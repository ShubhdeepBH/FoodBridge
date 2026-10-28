/**
 * FoodBridge App Controller - Homepage & Shell Initializer
 *
 * Connects the homepage "Available Now" feed to the backend Express/MongoDB API,
 * manages responsive layouts, card interactions, and empty/fallback states.
 */

(function () {
  "use strict";

  const appState = {
    initializedAt: new Date().toISOString(),
    currentView: "landing",
  };

  /**
   * Sample fallback donations for offline or complete API failure scenario.
   */
  const sampleFallbackDonations = [
    {
      id: "sample-001",
      title: "Fresh Baguettes & Bread",
      category: "bakery",
      donorName: "Le Petit Four",
      pickupLocation: "Le Petit Four, 1.2km",
      expiryText: "Exp: Today 5PM",
      status: "available",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDSsM5fTgAxhUrKB6oBAPShsMApxsND8MdFdtX0Ff8GntIF_kmnm567-A8vbws5nnp0jCSOnTq2E9oCeXmTpoA1x5zOER30unPB-Fmr3kRBJNTJC2FNB8USJJ_PV4pxZvkti8w8eIk08g8EAXJygZtln693zzJbWBBNcqZ5YiIQV0JhZ77x7LFxiHJv0kTH5Txywu4UoMaKANsXlK8EKUl2i98Wl2efAIhFrPFAcfYJQORq8Ee0nzd"
    },
    {
      id: "sample-002",
      title: "Mixed Organic Veggie Box",
      category: "produce",
      donorName: "Green Grocer",
      pickupLocation: "Green Grocer, 2.5km",
      expiryText: "Exp: Tmrw 10AM",
      status: "available",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH7G1IX-XDBhvBlwd4Kph7UmrJ6ICNxzj63B7Nv7pyYtuhPkB1lqj5pHl7VxPPGjLsWWovKqDvXjfrH1ToyFr2uzb08MzgqeSdWMoCxMDBd6F_X4vZQ9Eqgl0WOdwGYwuiK3cfA9jqlgnmYU7k17Pv0DIDSAgmEqVaZ_Bawfwh_LlEG06HKxs-kD_8IgxeikgYfGiD8cU77u23jN-DUmpoZmBanaDsp7tZ9xeZDi0utugFIxKJigyX"
    }
  ];

  /**
   * Safe mapping for category badges on donation cards.
   */
  const categoryLabels = {
    bakery: "Bakery",
    produce: "Produce",
    prepared: "Prepared",
    dairy: "Dairy",
    meals: "Meals"
  };

  /**
   * Safely escapes HTML entities to prevent XSS injection.
   * @param {*} value
   * @returns {string}
   */
  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initAppShell() {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.dataset.app = "foodbridge";
      document.documentElement.dataset.view = appState.currentView;
    }
  }

  /**
   * Constructs and returns a donation card DOM element matching the homepage design.
   * @param {Object} don - Normalized donation record
   * @returns {HTMLElement}
   */
  function createDonationCard(don) {
    const card = document.createElement("article");
    card.className = "donation-card";

    const donId = don ? (don.id || don._id) : null;
    if (donId) {
      card.style.cursor = "pointer";
      card.addEventListener("click", function () {
        window.location.href = "donation-details.html?id=" + encodeURIComponent(donId);
      });
    }

    const catKey = don && don.category ? String(don.category).toLowerCase().trim() : "";
    const categoryText = Object.prototype.hasOwnProperty.call(categoryLabels, catKey)
      ? categoryLabels[catKey]
      : (don && don.category ? escapeHtml(don.category) : "Other");

    const locationText = (don && (don.pickupLocation || don.donorName))
      ? (don.pickupLocation || don.donorName)
      : "Local Donor";

    // Format friendly expiry display text
    let expiryDisplay = "";
    if (don && don.expiry) {
      const timeDiff = new Date(don.expiry) - new Date();
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          expiryDisplay = `Exp: in ${days}d`;
        } else if (hours > 0) {
          expiryDisplay = `Exp: in ${hours}h`;
        } else {
          const mins = Math.floor(timeDiff / (1000 * 60));
          expiryDisplay = `Exp: in ${mins}m`;
        }
      } else {
        expiryDisplay = "Expired";
      }
    }
    if (!expiryDisplay && don && don.expiryText) {
      expiryDisplay = don.expiryText;
    }
    if (!expiryDisplay) {
      expiryDisplay = "Exp: Soon";
    }

    const titleText = (don && don.title) ? don.title : "Untitled Donation";

    card.innerHTML = `
      <div
        class="donation-card__image"
        role="img"
        aria-label="${escapeHtml(titleText)}"
      >
        <span>${categoryText}</span>
      </div>
      <div class="donation-card__body">
        <h3>${escapeHtml(titleText)}</h3>
        <p>
          <span class="material-symbols-outlined" aria-hidden="true">location_on</span>
          ${escapeHtml(locationText)}
        </p>
        <div class="donation-card__footer">
          <span class="expiry-chip">${escapeHtml(expiryDisplay)}</span>
          <button type="button" aria-label="View ${escapeHtml(titleText)}">
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </div>
    `;

    // Attach click handler to the arrow button with stopPropagation
    const arrowBtn = card.querySelector(".donation-card__footer button");
    if (arrowBtn && donId) {
      arrowBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        window.location.href = "donation-details.html?id=" + encodeURIComponent(donId);
      });
    }

    // Safely apply background image via DOM API (only http/https allowed)
    if (don && don.imageUrl && typeof don.imageUrl === "string") {
      try {
        const parsedUrl = new URL(don.imageUrl.trim());
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
          const imageEl = card.querySelector(".donation-card__image");
          if (imageEl) {
            imageEl.style.backgroundImage = `url("${parsedUrl.href}")`;
          }
        }
      } catch (urlErr) {
        // Invalid URL - leave background unset
      }
    }

    return card;
  }

  /**
   * Initializes the "Available Now" feed on the homepage.
   */
  async function initAvailableNow() {
    if (typeof document === "undefined") return;

    const scrollContainer = document.getElementById("homepageDonationsFeed") ||
      document.querySelector(".available-section .donation-scroll");
    if (!scrollContainer) return;

    let allDonations = [];
    let fetchErrorOccurred = false;

    try {
      if (typeof fetchDonations === "function") {
        allDonations = await fetchDonations();
      } else if (typeof getDonations === "function") {
        allDonations = getDonations();
      } else {
        allDonations = sampleFallbackDonations;
      }
    } catch (err) {
      console.error("Homepage error fetching donations:", err);
      fetchErrorOccurred = true;
      try {
        allDonations = (typeof getDonations === "function") ? getDonations() : sampleFallbackDonations;
      } catch (cacheErr) {
        allDonations = sampleFallbackDonations;
      }
    }

    if (!Array.isArray(allDonations) || (fetchErrorOccurred && allDonations.length === 0)) {
      allDonations = sampleFallbackDonations;
    }

    // Filter for available donations only, capped at a sensible limit for the homepage
    const availableItems = allDonations
      .filter(function (don) {
        return don && don.status === "available";
      })
      .slice(0, 6);

    scrollContainer.innerHTML = "";

    if (availableItems.length === 0) {
      if (fetchErrorOccurred) {
        // If API completely failed and no cache, render sample fallback cards
        sampleFallbackDonations.forEach(function (sample) {
          scrollContainer.appendChild(createDonationCard(sample));
        });
        const spacer = document.createElement("div");
        spacer.className = "donation-scroll__spacer";
        spacer.setAttribute("aria-hidden", "true");
        scrollContainer.appendChild(spacer);
      } else {
        // Successful API response with 0 available items: show empty state
        scrollContainer.innerHTML = `
          <div class="empty-state" style="margin: 0 var(--page-margin); width: 100%;">
            <span class="material-symbols-outlined empty-state__icon" aria-hidden="true">inventory_2</span>
            <h3 class="empty-state__title">No Donations Available Right Now</h3>
            <p class="empty-state__body">Check back soon or post surplus food to help the community.</p>
          </div>
        `;
      }
      return;
    }

    availableItems.forEach(function (don) {
      scrollContainer.appendChild(createDonationCard(don));
    });

    const spacer = document.createElement("div");
    spacer.className = "donation-scroll__spacer";
    spacer.setAttribute("aria-hidden", "true");
    scrollContainer.appendChild(spacer);
  }

  async function init() {
    initAppShell();
    await initAvailableNow();
  }

  // Expose methods for testing and external consumers
  if (typeof window !== "undefined") {
    window.initAvailableNow = initAvailableNow;
    window.createDonationCard = createDonationCard;
    window.sampleFallbackDonations = sampleFallbackDonations;
  }
  if (typeof global !== "undefined") {
    global.initAvailableNow = initAvailableNow;
    global.createDonationCard = createDonationCard;
    global.sampleFallbackDonations = sampleFallbackDonations;
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
