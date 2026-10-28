/**
 * FoodBridge Donation Data Layer Helper
 *
 * Manages retrieval, storage, adding, normalization, and asynchronous API synchronization
 * of food donation listings using localStorage and the Express/MongoDB backend API.
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Asynchronous Fetch API operations with error handling and fallback
 * - Normalization across MongoDB ObjectId schemas and CA1 client models
 * - Offline-first caching strategy (stale-while-revalidate / cache-then-network)
 * - Safe error handling avoiding credential or stack trace leakage
 */

// Default demonstration listings to seed when localStorage is empty
const SEED_DONATIONS = [
  {
    id: "don-001",
    title: "Vegetable Rice Boxes",
    category: "prepared",
    quantity: "15 Boxes",
    expiry: "2026-08-25T18:00",
    description: "Vibrant and healthy vegetable fried rice boxes. Freshly cooked under high hygiene standards. Packaged in single-portion biodegradable boxes.",
    pickupLocation: "Rajpura Green Kitchen",
    pickupInstructions: "Go to the kitchen loading dock at the back. Ask for Chef John.",
    donorId: "user-001", // Raj Hotel
    donorName: "Raj Hotel",
    status: "available",
    createdAt: "2026-08-25T11:00",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMkpl4CwDdbtNNZSttASfdKrCsM3yX6ck5VMTIC-1RGVsjzMLpF3qRM-vWAvh6AHhoeXC3QQESI4hi28LJZgrJcHGgzaittwwsAenib6Sp6uaIPwatX1V89XabwKjzkksIDrE-9YdkvYsB7FHpDbrie_Y6yfQeqVRG-s1x-RUf9QA0f_avEQM2nk4Kpm7YskBO_9TkyiA6DE_tb30l5F7Wh7WQMyTVnedTJYGODvLMgQ0JEZOBmQ7K"
  },
  {
    id: "don-002",
    title: "Bakery Surplus Pack",
    category: "bakery",
    quantity: "20 Loaves",
    expiry: "2026-08-26T10:00",
    description: "Assorted fresh artisanal bread rolls, baguettes, and sourdough loaves baked yesterday evening. Excellent condition, stored in dry bins.",
    pickupLocation: "Crumb & Crust Bakery, Main Street",
    pickupInstructions: "Enter from the front counter, let the staff know you are here to rescue the bread.",
    donorId: "user-001", // Raj Hotel
    donorName: "Raj Hotel",
    status: "available",
    createdAt: "2026-08-25T11:30",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7GcB2jgsu7zxUNeN4xIWtvWp3KxwHno9-9P7ez28BE5NURfqCDqPIk_n3eNgezkGDw_vHEnqU7jrhsZdrToKPpJXVK9hGN8iwtBltPUZE_bnFL8E9zrsmc7RGkkYadvPTQy5-XbHfW9FCuDDb8sTig4dO_Bq60XybEKnKGuQCtWyuWYogyKGn5TLirKYQtqUayS4_eKKXsYRJhU4O6tK9B1DYM_K3k7H3kThhWlJGCY7NIVZ4QTte"
  },
  {
    id: "don-003",
    title: "Prepared Lunch Boxes",
    category: "prepared",
    quantity: "30 Portions",
    expiry: "2026-08-25T15:30",
    description: "Nutritious flatbreads, cooked lentils, and mixed seasonal vegetables. Packed in hygienic takeaway containers. Kept in warmers.",
    pickupLocation: "Hope Catering Hall, Downtown",
    pickupInstructions: "Park in the side delivery alley, ring bell buzzer #2. Security will assist you.",
    donorId: "other-donor",
    donorName: "Hope Catering",
    status: "available",
    createdAt: "2026-08-25T12:00",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNiUiykuXsDWXgA0rmHUugQlFRy5DSxspaTKHKggDsE65ABam6kX5Q2_ouIDeJwfzpTvLz-McmnmaFjzAqqizg1l2W5E0MboWEEJ8vofR4U9B9BwldRi1orYFgBpWLY4ULuC21OgTrY0nwhDIPH7Y-jLVltO25ZGzWHs3rKPOsfqqQKPf3Oe1WRFYD7MjQWj4ntlYSSF4qH773fxF3BDF_K_ahX-okz9iuuAjoY2SGqWdQG5X3-xDw"
  },
  {
    id: "don-004",
    title: "Fresh Produce Crates",
    category: "produce",
    quantity: "15 kg",
    expiry: "2026-08-25T20:00",
    description: "Organic heirloom tomatoes, crisp spinach bunches, and fresh carrots. Sorted, washed, and boxed in sturdy crates. Ready for distribution.",
    pickupLocation: "Sunny Patch Farm, Local Area",
    pickupInstructions: "Park at the side bay, ask for Sarah in the produce department.",
    donorId: "other-donor-2",
    donorName: "Sunny Patch Farm",
    status: "available",
    createdAt: "2026-08-25T12:30",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgz3uiCzLkyxwySsvmbrCMID7IeYrfwxGE78svIS43jJl9tfnFYr4A22mReMQuTg6XIm_93NtxTy3U0necDK2F0ln_lRGF0vQiJ-PspvacBstWLiyOFo-fORW2AjiqM9Bt-eWc6AqRVgU1qG9RPoKK57VFFEFNq30rh0VWpKUVWo7w4I2ctdHyNxjAIgz9VoYIOXy8EDchv_VCol0D5Rwy3agSn9-DmzxRm4YcmQR5CFY0JXqddRTo"
  }
];

const LOCAL_STORAGE_KEY = "foodbridge_donations";

/**
 * Returns the current list of donations. Seeds standard ones if empty.
 * Preserves synchronous execution for CA1 frontend compatibility.
 * @returns {Array} Array of donation objects
 */
function getDonations() {
  const donationsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!donationsJson) {
    saveDonations(SEED_DONATIONS);
    return SEED_DONATIONS;
  }
  try {
    return JSON.parse(donationsJson);
  } catch (error) {
    console.error("Error parsing donations from localStorage, reseeding database...", error);
    saveDonations(SEED_DONATIONS);
    return SEED_DONATIONS;
  }
}

/**
 * Saves a list of donations to localStorage.
 * @param {Array} donations - Array of donation objects
 */
function saveDonations(donations) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(donations));
}

/**
 * Appends a single new donation object to the database.
 * @param {Object} donation - The new donation object
 */
function addDonation(donation) {
  if (!donation) return;
  const donations = getDonations();
  donations.push(donation);
  saveDonations(donations);
}

/**
 * Normalizes a donation object to ensure both CA1 client properties (id, donorId)
 * and backend MongoDB properties (_id, donor) are consistently accessible as strings.
 * Preserves all server-provided metadata without fabricating missing donor identities.
 *
 * @param {Object} doc - Raw donation document or object
 * @returns {Object|null} Normalized donation object or null
 */
function normalizeDonation(doc) {
  if (!doc || typeof doc !== "object") return null;

  const normalized = { ...doc };

  // 1. Ensure id and _id both contain the donation identifier string
  const rawId = doc._id !== undefined && doc._id !== null ? doc._id : doc.id;
  if (rawId !== undefined && rawId !== null) {
    const idStr = String(rawId);
    normalized.id = idStr;
    normalized._id = idStr;
  }

  // 2. Extract donor ID without fabricating values if absent
  let extractedDonorId = null;
  if (doc.donor !== undefined && doc.donor !== null) {
    if (typeof doc.donor === "object") {
      if (doc.donor._id !== undefined && doc.donor._id !== null) {
        extractedDonorId = String(doc.donor._id);
      } else if (doc.donor.id !== undefined && doc.donor.id !== null) {
        extractedDonorId = String(doc.donor.id);
      }
    } else {
      extractedDonorId = String(doc.donor);
    }
  } else if (doc.donorId !== undefined && doc.donorId !== null) {
    extractedDonorId = String(doc.donorId);
  }

  if (extractedDonorId !== null) {
    normalized.donorId = extractedDonorId;
  }

  return normalized;
}

/**
 * Asynchronously fetches live donations from the backend API, normalizes records,
 * and updates localStorage cache.
 * Falls back to cached data gracefully on network or server errors.
 *
 * @returns {Promise<Array>} Array of normalized donation objects
 */
async function fetchDonations() {
  try {
    const baseUrl = (typeof API_BASE_URL !== "undefined")
      ? API_BASE_URL
      : (typeof window !== "undefined" && window.API_BASE_URL)
        ? window.API_BASE_URL
        : "http://localhost:5000/api";

    const response = await fetch(`${baseUrl}/donations`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch live donations (HTTP ${response.status}). Using cached data.`);
      return getDonations();
    }

    let data = null;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse donations response JSON. Using cached data.");
      return getDonations();
    }

    if (!Array.isArray(data)) {
      console.error("Server response for donations is not an array. Using cached data.");
      return getDonations();
    }

    // Normalize all valid server objects
    const normalizedList = data
      .filter(item => item && typeof item === "object")
      .map(normalizeDonation);

    // Cache the live backend array (including valid empty array [])
    // Note: seed records are not repopulated over a successful empty backend response
    saveDonations(normalizedList);

    return normalizedList;
  } catch (error) {
    console.error("Network error while fetching donations. Using cached data:", error.message || error);
    return getDonations();
  }
}

/**
 * Asynchronously retrieves a single donation by ID.
 * First checks local cache; if missing and ID matches MongoDB ObjectId format (24 hex characters),
 * fetches from the backend API, normalizes, caches without duplicate, and returns it.
 *
 * @param {string} id - Donation ID string
 * @returns {Promise<Object|null>} The normalized donation object or null
 */
async function fetchDonationById(id) {
  if (!id || typeof id !== "string") {
    return null;
  }

  const cleanId = id.trim();
  if (!cleanId) {
    return null;
  }

  // 1. Search existing cache first (by id or _id)
  const cachedDonations = getDonations();
  const cachedItem = cachedDonations.find(
    don => (don.id && String(don.id) === cleanId) || (don._id && String(don._id) === cleanId)
  );

  if (cachedItem) {
    return normalizeDonation(cachedItem);
  }

  // 2. Check if ID format is a 24-character hexadecimal MongoDB ObjectId
  const isMongoObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId);
  if (!isMongoObjectId) {
    // Legacy / non-mongo IDs not in cache: do not request API; return null
    return null;
  }

  // 3. Request single donation from API
  try {
    const baseUrl = (typeof API_BASE_URL !== "undefined")
      ? API_BASE_URL
      : (typeof window !== "undefined" && window.API_BASE_URL)
        ? window.API_BASE_URL
        : "http://localhost:5000/api";

    const response = await fetch(`${baseUrl}/donations/${encodeURIComponent(cleanId)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    let data = null;
    try {
      data = await response.json();
    } catch (parseError) {
      return null;
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return null;
    }

    const normalizedItem = normalizeDonation(data);
    if (!normalizedItem || !normalizedItem.id) {
      return null;
    }

    // Cache without duplicating an existing record
    const currentList = getDonations();
    const existingIndex = currentList.findIndex(
      don => (don.id && String(don.id) === normalizedItem.id) || (don._id && String(don._id) === normalizedItem._id)
    );

    if (existingIndex >= 0) {
      currentList[existingIndex] = normalizedItem;
    } else {
      currentList.push(normalizedItem);
    }
    saveDonations(currentList);

    return normalizedItem;
  } catch (error) {
    console.error("Error fetching donation by ID:", error.message || error);
    return null;
  }
}

// Expose functions globally for browser and test environments
if (typeof window !== "undefined") {
  window.getDonations = getDonations;
  window.saveDonations = saveDonations;
  window.addDonation = addDonation;
  window.normalizeDonation = normalizeDonation;
  window.fetchDonations = fetchDonations;
  window.fetchDonationById = fetchDonationById;
} else if (typeof global !== "undefined") {
  global.getDonations = getDonations;
  global.saveDonations = saveDonations;
  global.addDonation = addDonation;
  global.normalizeDonation = normalizeDonation;
  global.fetchDonations = fetchDonations;
  global.fetchDonationById = fetchDonationById;
}
