/**
 * FoodBridge Dashboard Controller
 * 
 * Manages calculations, data binding, and rendering for Donor,
 * NGO, and Admin dashboard interfaces using sessionStorage sessions.
 */

(function () {
  "use strict";

  // Mock database representing system state for the first evaluation
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
   * Initializes the active dashboard layout based on global DOM identifiers.
   */
  function initDashboard() {
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
        if (greetingElement) {
          greetingElement.textContent = "Welcome back, " + currentUser.name + "!";
        }

        if (isDonor) {
          renderDonorDashboard(currentUser.id);
        } else if (isNgo) {
          renderNgoDashboard();
        } else if (isAdmin) {
          renderAdminDashboard();
        }
      }
    }
  }

  /**
   * Render statistics and listings feed for Donors
   */
  function renderDonorDashboard(donorId) {
    // 1. Retrieve donations from localStorage (via getDonations), fallback to demoDonations
    const allDonations = (typeof getDonations === "function") ? getDonations() : demoDonations;

    // Filter donations for current donor
    const myDonations = allDonations.filter(function (don) {
      return don.donorId === donorId;
    });

    // 2. Compute statistics using Array methods
    const totalCount = myDonations.length;
    
    const activeCount = myDonations.filter(function (don) {
      return don.status === "available" || don.status === "requested";
    }).length;

    // Sum up portions using reduce for completed actions to generate a mock score
    const completedList = myDonations.filter(function (don) {
      return don.status === "completed";
    });
    const completedPortions = completedList.reduce(function (accumulator, currentItem) {
      const portionNum = currentItem.quantityNum || parseInt(currentItem.quantity, 10) || 0;
      return accumulator + portionNum;
    }, 0);
    const impactScore = completedPortions * 10 || 120; // fallback default baseline

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
        return don.status !== "completed";
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
          card.addEventListener("click", function () {
            window.location.href = "donation-details.html?id=" + item.id;
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
            <div class="db-item-card__media" style="background-image: url('${item.imageUrl || ''}');">
              ${!item.imageUrl ? '<span class="material-symbols-outlined db-item-card__media--placeholder">local_dining</span>' : ''}
            </div>
            <div class="db-item-card__body">
              <div>
                <h3 class="db-item-card__title">${item.title}</h3>
                <p class="db-item-card__meta">${item.quantity} • ${expiryText}</p>
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
          activeDonationsList.appendChild(card);
        });
      }
    }
  }

  /**
   * Render statistics and upcoming pickups for NGOs
   */
  function renderNgoDashboard() {
    // 1. Static/Dynamic NGO Calculations
    // Get requested items from general pool
    const claimedList = demoDonations.filter(function (don) {
      return don.status === "requested";
    });

    const activePickupCount = claimedList.length;
    const totalMealsReceived = 1245; // baseline representation
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

    // 2. Render pickup cards feed
    const pickupsContainer = document.getElementById("ngoUpcomingPickups");
    if (pickupsContainer) {
      pickupsContainer.innerHTML = "";

      if (claimedList.length === 0) {
        pickupsContainer.innerHTML = `
          <div class="empty-state">
            <span class="material-symbols-outlined empty-state__icon" aria-hidden="true">local_shipping</span>
            <h3 class="empty-state__title">No Claimed Pickups</h3>
            <p class="empty-state__body">You have no active claims. Head over to the donations search page to request surplus food.</p>
          </div>
        `;
      } else {
        claimedList.forEach(function (item, index) {
          const card = document.createElement("div");
          card.className = "db-item-card";
          
          // Switch visual tags based on demo index
          const pickupTime = index === 0 ? "Pickup today by 8:30 PM" : "Pickup tomorrow by 11:00 AM";
          const statusLabel = index === 0 ? "Confirmed" : "Pending";
          const statusClass = index === 0 ? "status-chip--available" : "status-chip--urgent";

          card.style.cursor = "pointer";
          card.addEventListener("click", function () {
            window.location.href = "donation-details.html?id=" + item.id;
          });

          card.innerHTML = `
            <div class="db-item-card__media" style="background-image: url('${item.imageUrl || ''}');">
              ${!item.imageUrl ? '<span class="material-symbols-outlined db-item-card__media--placeholder">restaurant</span>' : ''}
            </div>
            <div class="db-item-card__body">
              <div>
                <h3 class="db-item-card__title">${item.title}</h3>
                <p class="db-item-card__meta">${item.donorName} • ${pickupTime}</p>
              </div>
              <div class="db-item-card__footer">
                <span class="status-chip ${statusClass}">${statusLabel}</span>
                <button type="button" class="db-item-card__action-btn" onclick="event.stopPropagation(); alert('Viewing pickup details will be implemented in a future milestone.');">
                  Details
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          `;
          pickupsContainer.appendChild(card);
        });
      }
    }
  }

  /**
   * Render overview statistics and logging feeds for Admins
   */
  function renderAdminDashboard() {
    // 1. Calculate general overview parameters using ES6/Array iteration
    const totalDonations = demoDonations.length;
    
    const activeDonations = demoDonations.filter(function (don) {
      return don.status === "available" || don.status === "requested";
    }).length;
    
    const completedDonations = demoDonations.filter(function (don) {
      return don.status === "completed";
    }).length;

    const donorUsers = demoUsers.filter(function (u) { return u.role === "donor"; });
    const ngoUsers = demoUsers.filter(function (u) { return u.role === "ngo"; });

    // Render stats
    document.getElementById("adminStatTotal").textContent = totalDonations;
    document.getElementById("adminStatActive").textContent = activeDonations;
    document.getElementById("adminStatCompleted").textContent = completedDonations;
    document.getElementById("adminStatDonors").textContent = donorUsers.length;
    document.getElementById("adminStatNgos").textContent = ngoUsers.length;

    // 2. Populate recent listing activities table
    const tableBody = document.getElementById("adminRecentTableBody");
    if (tableBody) {
      tableBody.innerHTML = "";
      
      demoDonations.forEach(function (don) {
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

        row.style.cursor = "pointer";
        row.addEventListener("click", function () {
          window.location.href = "donation-details.html?id=" + don.id;
        });

        row.innerHTML = `
          <td><strong>${don.title}</strong></td>
          <td>${don.donorName}</td>
          <td>${don.category}</td>
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
            <h4 class="db-entity-card__name">${u.name}</h4>
            <p class="db-entity-card__email">${u.email}</p>
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
            <h4 class="db-entity-card__name">${u.name}</h4>
            <p class="db-entity-card__email">${u.email}</p>
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

  // Load handler
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
  } else {
    initDashboard();
  }

})();
