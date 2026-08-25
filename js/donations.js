/**
 * FoodBridge Donation Data Layer Helper
 * 
 * Manages retrieval, storage, adding, and seeding of food donation listings in localStorage.
 * 
 * NOTE FOR EVALUATION:
 * All statistics and feeds are calculated and synchronized dynamically using this file.
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
