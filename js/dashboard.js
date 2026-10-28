/**
 * FoodBridge Dashboard Controller
 * 
 * Manages calculations, data binding, and rendering for Donor,
 * NGO, and Admin dashboard interfaces using sessionStorage sessions
 * and the Express/MongoDB backend API data layer.
 */

(function () {
  "use strict";

  // Mock database representing system state for fallback/demonstration
  const demoDonations = [
    {
      id: "don-001",
      donorId: "user-001", // Raj Hotel
      donorName: "Raj Hotel",
      title: "Artisanal Sourdough Loaves",
      quantity: "12 Loaves",
      quantityNum: 12,
      category: "Bakery",
      status: "available", // available, requested, completed
      expiryText: "Expires in 4h",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVNkgcbe-ALJIpkCRcF5NNsbp79MmFwr4hfEUbotABmmsToYCjuNEGg_Q0SLG5uMpZcMkXHQlO7wCIJCUgjWNy6YdRLwQxzY4WlUz1Xp-t8iT1muB6aePCC-bCWvnYuzOy42FGh2KftjHLMyCHZG-aSVJCWPfIiceUxdVlp2CxX0svJHS5N7Nvcw99y5QNpZCadkBZqgoo-9fhr7JWQ1_c7rk4VQQSd9COLCe-ks1x_hZhUduGHu8z"
    },
    {
      id: "don-002",
      donorId: "user-001", // Raj Hotel
      donorName: "Raj Hotel",
      title: "Roasted Veg Salad Bowls",
      quantity: "8 Portions",
      quantityNum: 8,
      category: "Produce",
      status: "requested",
      expiryText: "Expires in 8h",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNiUiykuXsDWXgA0rmHUugQlFRy5DSxspaTKHKggDsE65ABam6kX5Q2_ouIDeJwfzpTvLz-McmnmaFjzAqqizg1l2W5E0MboWEEJ8vofR4U9B9BwldRi1orYFgBpWLY4ULuC21OgTrY0nwhDIPH7Y-jLVltO25ZGzWHs3rKPOsfqqQKPf3Oe1WRFYD7MjQWj4ntlYSSF4qH773fxF3BDF_K_ahX-okz9iuuAjoY2SGqWdQG5X3-xDw"
    },
    {
      id: "don-003",
      donorId: "user-001", // Raj Hotel
      donorName: "Raj Hotel",
      title: "Paneer Butter Masala & Rice",
      quantity: "25 Portions",
      quantityNum: 25,
      category: "Meals",
      status: "completed",
      expiryText: "Picked up yesterday",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMkpl4CwDdbtNNZSttASfdKrCsM3yX6ck5VMTIC-1RGVsjzMLpF3qRM-vWAvh6AHhoeXC3QQESI4hi28LJZgrJcHGgzaittwwsAenib6Sp6uaIPwatX1V89XabwKjzkksIDrE-9YdkvYsB7FHpDbrie_Y6yfQeqVRG-s1x-RUf9QA0f_avEQM2nk4Kpm7YskBO_9TkyiA6DE_tb30l5F7Wh7WQMyTVnedTJYGODvLMgQ0JEZOBmQ7K"
    },
    {
      id: "don-004",
      donorId: "other-donor",
      donorName: "Gourmet Garden",
      title: "Fresh Heirloom Tomatoes",
      quantity: "15 kg",
      quantityNum: 15,
      category: "Produce",
      status: "requested",
      expiryText: "Expires in 45 mins",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgz3uiCzLkyxwySsvmbrCMID7IeYrfwxGE78svIS43jJl9tfnFYr4A22mReMQuTg6XIm_93NtxTy3U0necDK2F0ln_lRGF0vQiJ-PspvacBstWLiyOFo-fORW2AjiqM9Bt-eWc6AqRVgU1qG9RPoKK57VFFEFNq30rh0VWpKUVWo7w4I2ctdHyNxjAIgz9VoYIOXy8EDchv_VCol0D5Rwy3agSn9-DmzxRm4YcmQR5CFY0JXqddRTo"
    },
    {
      id: "don-005",
      donorId: "other-donor-2",
      donorName: "Salad Spot",
      title: "Fresh Fruit Salad Cups",
      quantity: "10 Portions",
      quantityNum: 10,
      category: "Produce",
      status: "requested",
      expiryText: "Expires tomorrow 11 AM",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7GcB2jgsu7zxUNeN4xIWtvWp3KxwHno9-9P7ez28BE5NURfqCDqPIk_n3eNgezkGDw_vHEnqU7jrhsZdrToKPpJXVK9hGN8iwtBltPUZE_bnFL8E9zrsmc7RGkkYadvPTQy5-XbHfW9FCuDDb8sTig4dO_Bq60XybEKnKGuQCtWyuWYogyKGn5TLirKYQtqUayS4_eKKXsYRJhU4O6tK9B1DYM_K3k7H3kThhWlJGCY7NIVZ4QTte"
    }
  ];

  const demoUsers = [
    { name: "Raj Hotel", email: "donor@foodbridge.com", role: "donor" },
    { name: "Gourmet Garden", email: "gourmet@foodbridge.com", role: "donor" },
    { name: "Hope Foundation", email: "ngo@foodbridge.com", role: "ngo" },
    { name: "City Hope Shelter", email: "cityhope@foodbridge.com", role: "ngo" },
    { name: "FoodBridge Admin", email: "admin@foodbridge.com", role: "admin" }
  ];

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

  /**
   * Initializes the active dashboard layout based on global DOM identifiers.
   * Asynchronously fetches live backend donations with cache fallback.
   */
  async function initDashboard() {
    // Setup logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogoutClick);
    }

    // Determine page-specific rendering
    const isDonor = document.getElementById("donorDashboardBody") !== null;
    const isNgo = document.getElementById("ngoDashboardBody") !== null;
    const isAdmin = document.getElementById("adminDashboardBody") !== null;

    if (typeof getCurrentUser === "function") {
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        // Set greetings
        const greetingElement = document.getElementById("userGreeting");
        if (greetingElement && currentUser.name) {
          greetingElement.textContent = "Welcome back, " + currentUser.name + "!";
        }

        // Fetch fresh donations from backend API with fallback to localStorage / demo data
        let allDonations = [];
        try {
          if (typeof fetchDonations === "function") {
            const live = await fetchDonations();
            allDonations = Array.isArray(live) ? live : [];
          } else if (typeof getDonations === "function") {
            allDonations = getDonations();
          } else {
            allDonations = demoDonations;
          }
        } catch (err) {
          console.error("Dashboard error fetching live donations, falling back to cache:", err);
          allDonations = (typeof getDonations === "function") ? getDonations() : demoDonations;
        }

        if (isDonor) {
          renderDonorDashboard(currentUser.id, allDonations);
        } else if (isNgo) {
          renderNgoDashboard(allDonations);
        } else if (isAdmin) {
          renderAdminDashboard(allDonations);
        }
      }
    }
  }

  /**
   * Render statistics and listings feed for Donors
   * @param {string} donorId
   * @param {Array} [donationsList]
   */
  function renderDonorDashboard(donorId, donationsList) {
    // 1. Retrieve donations from provided list, localStorage, or fallback to demoDonations
    const allDonations = Array.isArray(donationsList)
      ? donationsList
      : ((typeof getDonations === "function") ? getDonations() : demoDonations);

    // Filter donations for current donor (matching donorId string or nested donor._id)
    const myDonations = allDonations.filter(function (don) {
      if (!don) return false;
      const dId = don.donorId || (don.donor && (don.donor._id || don.donor.id || don.donor));
      return dId !== undefined && dId !== null && String(dId) === String(donorId);
    });

    // 2. Compute statistics using Array methods
    const totalCount = myDonations.length;
    
    const activeCount = myDonations.filter(function (don) {
      return don && (don.status === "available" || don.status === "requested");
    }).length;

    // Sum up portions using reduce for completed actions to generate score
    const completedList = myDonations.filter(function (don) {
      return don && don.status === "completed";
    });
    const completedPortions = completedList.reduce(function (accumulator, currentItem) {
      const portionNum = currentItem.quantityNum || parseInt(currentItem.quantity, 10) || 0;
      return accumulator + portionNum;
    }, 0);

    const allPortions = myDonations.reduce(function (accumulator, currentItem) {
      const portionNum = currentItem.quantityNum || parseInt(currentItem.quantity, 10) || 0;
      return accumulator + portionNum;
    }, 0);

    const impactScore = completedPortions > 0
      ? (completedPortions * 10)
      : (allPortions > 0 ? (allPortions * 10) : 0);

    // 3. Render statistics to DOM
    const statTotal = document.getElementById("statDonorTotal");
    const statActive = document.getElementById("statDonorActive");
    const statImpact = document.getElementById("statDonorImpact");

    if (statTotal) statTotal.textContent = totalCount;
    if (statActive) statActive.textContent = activeCount;
    if (statImpact) statImpact.textContent = impactScore;

    // 4. Populate active list
    const activeDonationsList = document.getElementById("activeDonationsList");
    if (activeDonationsList) {
      activeDonationsList.innerHTML = "";

      const activeItems = myDonations.filter(function (don) {
        return don && don.status !== "completed" && don.status !== "cancelled";
      });

      if (activeItems.length === 0) {
        activeDonationsList.innerHTML = `
          <div class="empty-state">
            <span class="material-symbols-outlined empty-state__icon" aria-hidden="true">inventory_2</span>
            <h3 class="empty-state__title">No Active Listings</h3>
            <p class="empty-state__body">You haven't listed any surplus food yet. Let's list some food and feed the community.</p>
          </div>
        `;
      } else {
        activeItems.forEach(function (item) {
          const card = document.createElement("div");
          card.className = "db-item-card";
          
          let statusBadgeClass = "status-chip--available";
          let statusLabel = "Available";

          if (item.status === "requested") {
            statusBadgeClass = "status-chip--requested";
            statusLabel = "Requested";
          }

          card.style.cursor = "pointer";
          const itemId = item.id || item._id;
          card.addEventListener("click", function () {
            if (itemId) {
              window.location.href = "donation-details.html?id=" + encodeURIComponent(itemId);
            }
          });

          // Determine friendly expiry display text
          let expiryText = item.expiryText;
          if (!expiryText && item.expiry) {
            const expiryDate = new Date(item.expiry);
            const timeDiff = expiryDate - new Date();
            if (timeDiff > 0) {
              const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
              if (hoursLeft > 24) {
                expiryText = `Expires in ${Math.floor(hoursLeft / 24)} days`;
              } else if (hoursLeft > 0) {
                expiryText = `Expires in ${hoursLeft}h`;
              } else {
                const minsLeft = Math.floor(timeDiff / (1000 * 60));
                expiryText = `Expires in ${minsLeft} mins`;
              }
            } else {
              expiryText = "Expired";
            }
          }
          if (!expiryText) {
            expiryText = "Expiring soon";
          }

          card.innerHTML = `
            <div class="db-item-card__media">
              ${!item.imageUrl ? '<span class="material-symbols-outlined db-item-card__media--placeholder">local_dining</span>' : ''}
            </div>
            <div class="db-item-card__body">
              <div>
                <h3 class="db-item-card__title">${escapeHtml(item.title || '')}</h3>
                <p class="db-item-card__meta">${escapeHtml(item.quantity || '')} • ${escapeHtml(expiryText)}</p>
              </div>
              <div class="db-item-card__footer">
                <span class="status-chip ${statusBadgeClass}">${statusLabel}</span>
                <button type="button" class="db-item-card__action-btn" onclick="event.stopPropagation(); alert('Editing listings will be implemented in a future milestone.');">
                  <span class="material-symbols-outlined">edit</span>
                  Edit
                </button>
              </div>
            </div>
          `;

          // Safely apply background image via DOM API (only http/https allowed)
          if (item.imageUrl && typeof item.imageUrl === "string") {
            try {
              const parsedUrl = new URL(item.imageUrl.trim());
              if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
                const mediaEl = card.querySelector(".db-item-card__media");
                if (mediaEl) {
                  mediaEl.style.backgroundImage = `url("${parsedUrl.href}")`;
                }
              }
            } catch (urlErr) {
              // Invalid URL - leave background unset
            }
          }

          activeDonationsList.appendChild(card);
        });
      }
    }
  }

  /**
   * Render statistics and available donations feed for NGOs
   * @param {Array} [donationsList]
   */
  function renderNgoDashboard(donationsList) {
    // 1. Retrieve donations from provided list, localStorage, or fallback to demoDonations
    const allDonations = Array.isArray(donationsList)
      ? donationsList
      : ((typeof getDonations === "function") ? getDonations() : demoDonations);

    // Get available and requested items from general pool
    const availableList = allDonations.filter(function (don) {
      return don && (don.status === "available" || don.status === "requested");
    });

    const activePickupCount = availableList.length;
    const totalMealsReceived = 1245; // baseline representation (claiming history not yet in backend)
    const co2SavedKg = 3.2; // in tons/kilo

    // Render counts
    const countMeals = document.getElementById("ngoMealsCount");
    const countPeople = document.getElementById("ngoPeopleCount");
    const countCo2 = document.getElementById("ngoCo2Count");
    const countPickups = document.getElementById("ngoActivePickupsCount");

    if (countMeals) countMeals.textContent = totalMealsReceived.toLocaleString();
    if (countPeople) countPeople.textContent = "850";
    if (countCo2) countCo2.textContent = co2SavedKg + "k";
    if (countPickups) countPickups.textContent = activePickupCount;

    // Check for urgent banner in ngo-dashboard.html
    const noticeBanner = document.querySelector(".db-notice-banner");
    if (noticeBanner) {
      const now = new Date();
      const urgentCount = availableList.filter(function (don) {
        if (!don || !don.expiry) return false;
        const timeDiff = new Date(don.expiry) - now;
        return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000;
      }).length;

      if (urgentCount > 0) {
        const textSpan = noticeBanner.querySelector("span:not(.material-symbols-outlined)") || noticeBanner.lastElementChild;
        if (textSpan) {
          textSpan.textContent = urgentCount + " donation" + (urgentCount > 1 ? "s" : "") + " near you expire" + (urgentCount > 1 ? "" : "s") + " in less than 2 hours.";
        }
        noticeBanner.style.display = "flex";
      } else {
        noticeBanner.style.display = "none";
      }
    }

    // 2. Render pickup cards feed
    const pickupsContainer = document.getElementById("ngoUpcomingPickups");
    if (pickupsContainer) {
      pickupsContainer.innerHTML = "";

      if (availableList.length === 0) {
        pickupsContainer.innerHTML = `
          <div class="empty-state">
            <span class="material-symbols-outlined empty-state__icon" aria-hidden="true">inventory_2</span>
            <h3 class="empty-state__title">No Available Donations</h3>
            <p class="empty-state__body">There are no available surplus food listings at the moment. Check back soon for new donations.</p>
          </div>
        `;
      } else {
        availableList.forEach(function (item, index) {
          const card = document.createElement("div");
          card.className = "db-item-card";
          card.style.cursor = "pointer";

          // Determine dynamic expiry / pickup timing
          let pickupTime = item.expiryText || (index === 0 ? "Pickup today by 8:30 PM" : "Pickup tomorrow by 11:00 AM");
          if (item.expiry) {
            const expiryDate = new Date(item.expiry);
            const timeDiff = expiryDate - new Date();
            if (timeDiff > 0) {
              const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
              if (hoursLeft > 24) {
                pickupTime = `Expires in ${Math.floor(hoursLeft / 24)} days`;
              } else if (hoursLeft > 0) {
                pickupTime = `Expires in ${hoursLeft}h`;
              } else {
                const minsLeft = Math.floor(timeDiff / (1000 * 60));
                pickupTime = `Expires in ${minsLeft} mins`;
              }
            } else {
              pickupTime = "Expired";
            }
          }

          const statusLabel = item.status === "requested" ? "Requested" : "Available";
          const statusClass = item.status === "requested" ? "status-chip--urgent" : "status-chip--available";

          const itemId = item.id || item._id;
          card.addEventListener("click", function () {
            if (itemId) {
              window.location.href = "donation-details.html?id=" + encodeURIComponent(itemId);
            }
          });

          card.innerHTML = `
            <div class="db-item-card__media">
              ${!item.imageUrl ? '<span class="material-symbols-outlined db-item-card__media--placeholder">restaurant</span>' : ''}
            </div>
            <div class="db-item-card__body">
              <div>
                <h3 class="db-item-card__title">${escapeHtml(item.title || '')}</h3>
                <p class="db-item-card__meta">${escapeHtml(item.donorName || 'Local Donor')} • ${escapeHtml(pickupTime)}</p>
              </div>
              <div class="db-item-card__footer">
                <span class="status-chip ${statusClass}">${statusLabel}</span>
                <button type="button" class="db-item-card__action-btn">
                  Details
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          `;

          const detailsBtn = card.querySelector(".db-item-card__action-btn");
          if (detailsBtn && itemId) {
            detailsBtn.addEventListener("click", function (e) {
              e.stopPropagation();
              window.location.href = "donation-details.html?id=" + encodeURIComponent(itemId);
            });
          }

          // Safely apply background image via DOM API (only http/https allowed)
          if (item.imageUrl && typeof item.imageUrl === "string") {
            try {
              const parsedUrl = new URL(item.imageUrl.trim());
              if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
                const mediaEl = card.querySelector(".db-item-card__media");
                if (mediaEl) {
                  mediaEl.style.backgroundImage = `url("${parsedUrl.href}")`;
                }
              }
            } catch (urlErr) {
              // Invalid URL - leave background unset
            }
          }

          pickupsContainer.appendChild(card);
        });
      }
    }
  }

  /**
   * Render overview statistics and logging feeds for Admins
   * @param {Array} [donationsList]
   */
  function renderAdminDashboard(donationsList) {
    const allDonations = Array.isArray(donationsList)
      ? donationsList
      : ((typeof getDonations === "function") ? getDonations() : demoDonations);

    // 1. Calculate general overview parameters using ES6/Array iteration
    const totalDonations = allDonations.length;
    
    const activeDonations = allDonations.filter(function (don) {
      return don && (don.status === "available" || don.status === "requested");
    }).length;
    
    const completedDonations = allDonations.filter(function (don) {
      return don && don.status === "completed";
    }).length;

    const donorUsers = demoUsers.filter(function (u) { return u.role === "donor"; });
    const ngoUsers = demoUsers.filter(function (u) { return u.role === "ngo"; });

    // Render stats
    const elTotal = document.getElementById("adminStatTotal");
    const elActive = document.getElementById("adminStatActive");
    const elCompleted = document.getElementById("adminStatCompleted");
    const elDonors = document.getElementById("adminStatDonors");
    const elNgos = document.getElementById("adminStatNgos");

    if (elTotal) elTotal.textContent = totalDonations;
    if (elActive) elActive.textContent = activeDonations;
    if (elCompleted) elCompleted.textContent = completedDonations;
    if (elDonors) elDonors.textContent = donorUsers.length;
    if (elNgos) elNgos.textContent = ngoUsers.length;

    // 2. Populate recent listing activities table
    const tableBody = document.getElementById("adminRecentTableBody");
    if (tableBody) {
      tableBody.innerHTML = "";
      
      allDonations.forEach(function (don) {
        if (!don) return;
        const row = document.createElement("tr");
        
        let badgeClass = "status-chip--available";
        let labelText = "Available";
        
        if (don.status === "requested") {
          badgeClass = "status-chip--requested";
          labelText = "Requested";
        } else if (don.status === "completed") {
          badgeClass = "status-chip--urgent";
          labelText = "Completed";
        }

        const itemId = don.id || don._id;
        row.style.cursor = "pointer";
        row.addEventListener("click", function () {
          if (itemId) {
            window.location.href = "donation-details.html?id=" + encodeURIComponent(itemId);
          }
        });

        row.innerHTML = `
          <td><strong>${escapeHtml(don.title || '')}</strong></td>
          <td>${escapeHtml(don.donorName || 'Anonymous')}</td>
          <td>${escapeHtml(don.category || 'Other')}</td>
          <td><span class="status-chip ${badgeClass}">${labelText}</span></td>
        `;
        tableBody.appendChild(row);
      });
    }

    // 3. Populate entity list grids
    const donorsList = document.getElementById("adminDonorsGrid");
    const ngosList = document.getElementById("adminNgosGrid");

    if (donorsList) {
      donorsList.innerHTML = "";
      donorUsers.forEach(function (u) {
        const donorCard = document.createElement("div");
        donorCard.className = "db-entity-card";
        donorCard.innerHTML = `
          <div class="db-entity-card__avatar">
            <span class="material-symbols-outlined">storefront</span>
          </div>
          <div>
            <h4 class="db-entity-card__name">${escapeHtml(u.name || '')}</h4>
            <p class="db-entity-card__email">${escapeHtml(u.email || '')}</p>
          </div>
        `;
        donorsList.appendChild(donorCard);
      });
    }

    if (ngosList) {
      ngosList.innerHTML = "";
      ngoUsers.forEach(function (u) {
        const ngoCard = document.createElement("div");
        ngoCard.className = "db-entity-card";
        ngoCard.innerHTML = `
          <div class="db-entity-card__avatar">
            <span class="material-symbols-outlined">favorite</span>
          </div>
          <div>
            <h4 class="db-entity-card__name">${escapeHtml(u.name || '')}</h4>
            <p class="db-entity-card__email">${escapeHtml(u.email || '')}</p>
          </div>
        `;
        ngosList.appendChild(ngoCard);
      });
    }
  }

  /**
   * Handle logout button events.
   */
  function handleLogoutClick(e) {
    e.preventDefault();
    if (typeof logoutUser === "function") {
      logoutUser();
    }
    window.location.replace("index.html");
  }

  // Expose methods for testing and external consumers
  if (typeof window !== "undefined") {
    window.initDashboard = initDashboard;
    window.renderDonorDashboard = renderDonorDashboard;
    window.renderNgoDashboard = renderNgoDashboard;
    window.renderAdminDashboard = renderAdminDashboard;
  }
  if (typeof global !== "undefined") {
    global.initDashboard = initDashboard;
    global.renderDonorDashboard = renderDonorDashboard;
    global.renderNgoDashboard = renderNgoDashboard;
    global.renderAdminDashboard = renderAdminDashboard;
  }

  // Load handler
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDashboard);
    } else {
      initDashboard();
    }
  }

})();
