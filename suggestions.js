// Initialize Parse
Parse.initialize("YOUR_APPLICATION_ID", "YOUR_JAVASCRIPT_KEY");
Parse.serverURL = "https://parseapi.back4app.com/";

let currentGroup = null;
let liveQueryClient = null;

// Check if user is logged in
document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    window.location.href = "index.html"; // Redirect to login page if not logged in
    return;
  }

  const savedGroup = localStorage.getItem("currentGroup");
  if (savedGroup) {
    document.getElementById("group-name-input").value = savedGroup;
    joinGroup();
  }
});

// Join or create a group
async function joinGroup() {
  const groupNameInput = document.getElementById("group-name-input");
  const groupName = groupNameInput.value.trim();
  const groupMessage = document.getElementById("group-message");

  groupMessage.textContent = "";
  groupMessage.className = "message";

  if (!groupName) {
    groupMessage.textContent = "Please enter a group name!";
    groupMessage.classList.add("error");
    return;
  }

  try {
    currentGroup = groupName;
    localStorage.setItem("currentGroup", currentGroup);

    document.getElementById("group-login-section").classList.add("hidden");
    document.getElementById("suggestions-content").classList.remove("hidden");
    document.getElementById(
      "group-welcome-message"
    ).textContent = `Group: ${currentGroup}`;

    await loadSuggestions();
    subscribeToSuggestions();
  } catch (error) {
    console.error("Error joining group:", error);
    groupMessage.textContent = "Error joining group. Please try again.";
    groupMessage.classList.add("error");
  }
}

// Leave the group
function leaveGroup() {
  if (liveQueryClient) {
    liveQueryClient.close();
  }
  currentGroup = null;
  localStorage.removeItem("currentGroup");
  document.getElementById("suggestions-content").classList.add("hidden");
  document.getElementById("group-login-section").classList.remove("hidden");
  document.getElementById("group-name-input").value = "";
  document.getElementById("group-message").textContent = "";
  document.getElementById("suggestions-list").innerHTML = "";
}

// Load suggestions for the current group
async function loadSuggestions() {
  try {
    const Suggestions = Parse.Object.extend("Suggestions");
    const query = new Parse.Query(Suggestions);
    query.equalTo("groupName", currentGroup);
    query.descending("createdAt");
    const suggestions = await query.find();

    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = "";

    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      const timestamp = new Date(suggestion.get("createdAt")).toLocaleString();
      li.textContent = `${suggestion.get("suggestion")} (by ${suggestion.get(
        "submittedBy"
      )} at ${timestamp})`;
      suggestionsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading suggestions:", error);
    const suggestionMessage = document.getElementById("suggestion-message");
    suggestionMessage.textContent = "Error loading suggestions.";
    suggestionMessage.classList.add("error");
  }
}

// Subscribe to real-time updates for suggestions
async function subscribeToSuggestions() {
  try {
    const Suggestions = Parse.Object.extend("Suggestions");
    const query = new Parse.Query(Suggestions);
    query.equalTo("groupName", currentGroup);

    liveQueryClient = await Parse.LiveQueryClient.connect({
      applicationId: "YOUR_APPLICATION_ID",
      javascriptKey: "YOUR_JAVASCRIPT_KEY",
      serverURL: "wss://YOUR_APP_ID.back4app.io",
    });

    const subscription = liveQueryClient.subscribe(query);
    subscription.on("create", (suggestion) => {
      const suggestionsList = document.getElementById("suggestions-list");
      const li = document.createElement("li");
      const timestamp = new Date(suggestion.get("createdAt")).toLocaleString();
      li.textContent = `${suggestion.get("suggestion")} (by ${suggestion.get(
        "submittedBy"
      )} at ${timestamp})`;
      suggestionsList.prepend(li);
    });
  } catch (error) {
    console.error("Error subscribing to suggestions:", error);
  }
}

// Add a new suggestion
async function addSuggestion() {
  const suggestionInput = document.getElementById("suggestion-input");
  const suggestionText = suggestionInput.value.trim();
  const anonymousCheckbox = document.getElementById("anonymous-checkbox");
  const suggestionMessage = document.getElementById("suggestion-message");

  suggestionMessage.textContent = "";
  suggestionMessage.className = "message";

  if (!suggestionText) {
    suggestionMessage.textContent = "Please enter a suggestion!";
    suggestionMessage.classList.add("error");
    return;
  }

  const submittedBy = anonymousCheckbox.checked
    ? "Anonymous"
    : localStorage.getItem("currentUser") || "Unknown";

  try {
    const Suggestions = Parse.Object.extend("Suggestions");
    const suggestion = new Suggestions();
    suggestion.set("groupName", currentGroup);
    suggestion.set("suggestion", suggestionText);
    suggestion.set("submittedBy", submittedBy);
    await suggestion.save();

    suggestionInput.value = "";
    anonymousCheckbox.checked = false;
    suggestionMessage.textContent = "Suggestion added successfully!";
    suggestionMessage.classList.add("success");
    setTimeout(() => {
      suggestionMessage.textContent = "";
      suggestionMessage.classList.remove("success");
    }, 2000);
  } catch (error) {
    console.error("Error adding suggestion:", error);
    suggestionMessage.textContent = "Error adding suggestion.";
    suggestionMessage.classList.add("error");
  }
}
