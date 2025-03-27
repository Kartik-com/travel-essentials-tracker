// Pre-populated essentials (used as a default if no data exists in localStorage)
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

// Load items from localStorage or use defaultItems if none exist
let items = JSON.parse(localStorage.getItem("travelItems")) || defaultItems;

function saveItems() {
  localStorage.setItem("travelItems", JSON.stringify(items));
}

function addItem() {
  const input = document.getElementById("item-input");
  const itemName = input.value.trim();
  const message = document.getElementById("message");

  // Clear previous message and styles
  message.textContent = "";
  message.className = "message";

  if (!itemName) {
    message.textContent = "Please enter an item!";
    message.classList.add("error");
    return;
  }

  // Check for duplicates (case-insensitive)
  if (
    items.some((item) => item.name.toLowerCase() === itemName.toLowerCase())
  ) {
    message.textContent = `${itemName} already exists in the list!`;
    message.classList.add("error");
    input.value = ""; // Clear the input field
    setTimeout(() => {
      message.textContent = "";
      message.classList.remove("error");
    }, 2000);
    return;
  }

  // Add the new item
  const newItem = { name: itemName, packed: false };
  items.push(newItem);
  input.value = ""; // Clear the input field
  message.textContent = `${itemName} added successfully!`;
  message.classList.add("success");
  setTimeout(() => {
    message.textContent = "";
    message.classList.remove("success");
  }, 2000);
  saveItems(); // Save to localStorage
  updateLists();
}

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

function togglePacked(index) {
  items[index].packed = !items[index].packed;
  saveItems(); // Save to localStorage
  updateLists();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems(); // Save to localStorage
  updateLists();
}

// Initial render
updateLists();
