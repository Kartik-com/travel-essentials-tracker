// Pre-populated essentials
const defaultItems = [
  { name: "ID Proof (Aadhar/Passport)", packed: false },
  { name: "Train Tickets", packed: false },
  { name: "Mobile Phone & Charger", packed: false },
  { name: "Power Bank", packed: false },
  { name: "Hand Sanitizer", packed: false },
  { name: "First-Aid Kit", packed: false },
  { name: "Sunscreen", packed: false },
  { name: "Perfume/Deodorant", packed: false },
  { name: "Toothbrush & Toothpaste", packed: false },
  { name: "Face Wash", packed: false },
  { name: "Moisturizer", packed: false },
  { name: "Reusable Water Bottle", packed: false },
  { name: "Snacks (Dry Fruits/Biscuits)", packed: false },
  { name: "Light Sweater (for Hills)", packed: false },
  { name: "Cotton T-Shirts", packed: false },
  { name: "Jeans/Trousers", packed: false },
  { name: "Comfortable Walking Shoes", packed: false },
  { name: "Sandals (for Plains)", packed: false },
  { name: "Travel Pillow", packed: false },
  { name: "Small Blanket (for Train)", packed: false },
  { name: "Sunglasses", packed: false },
  { name: "Cap/Hat", packed: false },
];

let currentUser = null;
let items = [];

// Login function with error handling
function login() {
  try {
    const usernameInput = document.getElementById("username-input");
    const username = usernameInput.value.trim();
    const loginMessage = document.getElementById("login-message");

    loginMessage.textContent = "";
    loginMessage.className = "message";

    if (!username) {
      loginMessage.textContent = "Please enter a username!";
      loginMessage.classList.add("error");
      return;
    }

    currentUser = username;
    localStorage.setItem("currentUser", currentUser);

    // Load user-specific items
    const userItemsKey = `travelItems_${currentUser}`;
    try {
      const storedItems = localStorage.getItem(userItemsKey);
      items = storedItems ? JSON.parse(storedItems) : [...defaultItems];
    } catch (error) {
      console.error("Error loading items from localStorage:", error);
      items = [...defaultItems]; // Fallback to default items
    }
    saveItems();

    // Show main content
    const loginSection = document.getElementById("login-section");
    const mainContent = document.getElementById("main-content");
    const welcomeMessage = document.getElementById("welcome-message");

    if (!loginSection || !mainContent || !welcomeMessage) {
      throw new Error("Required DOM elements not found");
    }

    loginSection.classList.add("hidden");
    mainContent.classList.remove("hidden");
    welcomeMessage.textContent = `Welcome, ${currentUser}! Pack smart for your journey to Dalhousie, Dharamshala, Delhi, Agra, Mathura, and Vrindavan!`;

    // Update lists asynchronously to improve responsiveness
    setTimeout(() => {
      updateLists();
    }, 0);
  } catch (error) {
    console.error("Error during login:", error);
    const loginMessage = document.getElementById("login-message");
    loginMessage.textContent =
      "An error occurred during login. Please try again.";
    loginMessage.classList.add("error");
  }
}

// Logout function
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  items = [];
  document.getElementById("main-content").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("username-input").value = "";
  document.getElementById("login-message").textContent = "";
}

// Save items for the current user
function saveItems() {
  if (currentUser) {
    const userItemsKey = `travelItems_${currentUser}`;
    try {
      localStorage.setItem(userItemsKey, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items to localStorage:", error);
    }
  }
}

function addItem() {
  const input = document.getElementById("item-input");
  const itemName = input.value.trim();
  const message = document.getElementById("message");

  message.textContent = "";
  message.className = "message";

  if (!itemName) {
    message.textContent = "Please enter an item!";
    message.classList.add("error");
    return;
  }

  if (
    items.some((item) => item.name.toLowerCase() === itemName.toLowerCase())
  ) {
    message.textContent = `${itemName} already exists in the list!`;
    message.classList.add("error");
    input.value = "";
    setTimeout(() => {
      message.textContent = "";
      message.classList.remove("error");
    }, 2000);
    return;
  }

  const newItem = { name: itemName, packed: false };
  items.push(newItem);
  input.value = "";
  message.textContent = `${itemName} added successfully!`;
  message.classList.add("success");
  setTimeout(() => {
    message.textContent = "";
    message.classList.remove("success");
  }, 2000);
  saveItems();
  updateLists();
}

function updateLists() {
  try {
    const unpackedList = document.getElementById("unpacked-list");
    const packedList = document.getElementById("packed-list");
    if (!unpackedList || !packedList) {
      throw new Error("List containers not found");
    }

    unpackedList.innerHTML = "";
    packedList.innerHTML = "";

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <input type="checkbox" onchange="togglePacked(${index})" ${
        item.packed ? "checked" : ""
      }>
              <span>${item.name}</span>
              <button onclick="deleteItem(${index})">Delete</button>
          `;
      if (item.packed) {
        li.classList.add("packed");
        packedList.appendChild(li);
      } else {
        unpackedList.appendChild(li);
      }
    });
  } catch (error) {
    console.error("Error updating lists:", error);
    const message = document.getElementById("message");
    message.textContent = "Error updating lists. Please refresh the page.";
    message.classList.add("error");
  }
}

function togglePacked(index) {
  items[index].packed = !items[index].packed;
  saveItems();
  updateLists();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  updateLists();
}

// Check if a user is already logged in
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    document.getElementById("username-input").value = savedUser;
    login();
  }
});
