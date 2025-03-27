// Initialize Parse
Parse.initialize(
  "R45ukbqr72fqzId6Z54eJA6NEnnKsLLSLxAm6eEK",
  "I2Ecepl0Ae8jYsTb62CE6TamdEYU57BJHJp7ovUo"
); // Replace with your Back4App keys
Parse.serverURL = "https://parseapi.back4app.com/";

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

// Sign up a new user
async function signUp() {
  const username = document.getElementById("username-input").value.trim();
  const password = document.getElementById("password-input").value.trim();
  const loginMessage = document.getElementById("login-message");

  loginMessage.textContent = "";
  loginMessage.className = "message";

  if (!username || !password) {
    loginMessage.textContent = "Please enter both username and password!";
    loginMessage.classList.add("error");
    return;
  }

  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password);

  try {
    await user.signUp();
    loginMessage.textContent = "Sign-up successful! Please log in.";
    loginMessage.classList.add("success");
    document.getElementById("username-input").value = "";
    document.getElementById("password-input").value = "";
  } catch (error) {
    loginMessage.textContent = `Error: ${error.message}`;
    loginMessage.classList.add("error");
  }
}

// Log in an existing user
async function login() {
  const username = document.getElementById("username-input").value.trim();
  const password = document.getElementById("password-input").value.trim();
  const loginMessage = document.getElementById("login-message");

  loginMessage.textContent = "";
  loginMessage.className = "message";

  if (!username || !password) {
    loginMessage.textContent = "Please enter both username and password!";
    loginMessage.classList.add("error");
    return;
  }

  try {
    const user = await Parse.User.logIn(username, password);
    currentUser = user;
    localStorage.setItem("currentUser", username); // For suggestions page

    // Load user progress from Back4App
    await loadUserProgress();

    // Show main content
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    document.getElementById(
      "welcome-message"
    ).textContent = `Welcome, ${username}! Pack smart for your journey to Dalhousie, Dharamshala, Delhi, Agra, Mathura, and Vrindavan!`;
    updateLists();
  } catch (error) {
    loginMessage.textContent = `Error: ${error.message}`;
    loginMessage.classList.add("error");
  }
}

// Log out the user
async function logout() {
  try {
    await Parse.User.logOut();
    currentUser = null;
    localStorage.removeItem("currentUser");
    items = [];
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("username-input").value = "";
    document.getElementById("password-input").value = "";
    document.getElementById("login-message").textContent = "";
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Load user progress from Back4App
async function loadUserProgress() {
  const username = Parse.User.current().get("username");
  const UserProgress = Parse.Object.extend("UserProgress");
  const query = new Parse.Query(UserProgress);
  query.equalTo("username", username);

  try {
    const results = await query.first();
    if (results) {
      items = results.get("items") || [...defaultItems];
    } else {
      items = [...defaultItems];
      await saveUserProgress();
    }
  } catch (error) {
    console.error("Error loading user progress:", error);
    items = [...defaultItems];
  }
}

// Save user progress to Back4App
async function saveUserProgress() {
  const username = Parse.User.current().get("username");
  const UserProgress = Parse.Object.extend("UserProgress");
  const query = new Parse.Query(UserProgress);
  query.equalTo("username", username);

  try {
    const result = await query.first();
    let userProgress;

    if (result) {
      userProgress = result;
    } else {
      userProgress = new UserProgress();
      userProgress.set("username", username);
    }

    userProgress.set("items", items);
    await userProgress.save();
  } catch (error) {
    console.error("Error saving user progress:", error);
  }
}

// Add a new item to the packing list
async function addItem() {
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
  await saveUserProgress();
  updateLists();
}

// Update the UI with the current packing list
function updateLists() {
  const unpackedList = document.getElementById("unpacked-list");
  const packedList = document.getElementById("packed-list");
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
}

// Toggle the packed status of an item
async function togglePacked(index) {
  items[index].packed = !items[index].packed;
  await saveUserProgress();
  updateLists();
}

// Delete an item from the packing list
async function deleteItem(index) {
  items.splice(index, 1);
  await saveUserProgress();
  updateLists();
}

// Check if a user is already logged in
document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = Parse.User.current();
  if (currentUser) {
    const username = currentUser.get("username");
    localStorage.setItem("currentUser", username);
    await loadUserProgress();
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    document.getElementById(
      "welcome-message"
    ).textContent = `Welcome, ${username}! Pack smart for your journey to Dalhousie, Dharamshala, Delhi, Agra, Mathura, and Vrindavan!`;
    updateLists();
  }
});
