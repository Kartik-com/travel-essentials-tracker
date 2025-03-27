let currentGroup = null;
let suggestions = [];
let currentUser = null;

// Join group function
function joinGroup() {
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

  currentGroup = groupName;
  localStorage.setItem("currentGroup", currentGroup);

  // Load group-specific suggestions
  const groupSuggestionsKey = `suggestions_${currentGroup}`;
  suggestions = JSON.parse(localStorage.getItem(groupSuggestionsKey)) || [];
  saveSuggestions();

  // Load current user
  currentUser = localStorage.getItem("currentUser") || "Anonymous";

  // Show suggestions content
  document.getElementById("group-login-section").classList.add("hidden");
  document.getElementById("suggestions-content").classList.remove("hidden");
  document.getElementById(
    "group-welcome-message"
  ).textContent = `Welcome to ${currentGroup}, ${currentUser}! Share your travel suggestions below.`;
  updateSuggestionsList();
}

// Leave group function
function leaveGroup() {
  currentGroup = null;
  localStorage.removeItem("currentGroup");
  suggestions = [];
  document.getElementById("suggestions-content").classList.add("hidden");
  document.getElementById("group-login-section").classList.remove("hidden");
  document.getElementById("group-name-input").value = "";
  document.getElementById("group-message").textContent = "";
}

// Save suggestions for the current group
function saveSuggestions() {
  if (currentGroup) {
    const groupSuggestionsKey = `suggestions_${currentGroup}`;
    localStorage.setItem(groupSuggestionsKey, JSON.stringify(suggestions));
  }
}

function addSuggestion() {
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

  const submitter = anonymousCheckbox.checked ? "Anonymous" : currentUser;
  const newSuggestion = {
    text: suggestionText,
    submitter: submitter,
    timestamp: new Date().toLocaleString(),
  };
  suggestions.push(newSuggestion);
  suggestionInput.value = "";
  anonymousCheckbox.checked = false;
  suggestionMessage.textContent = "Suggestion added successfully!";
  suggestionMessage.classList.add("success");
  setTimeout(() => {
    suggestionMessage.textContent = "";
    suggestionMessage.classList.remove("success");
  }, 2000);
  saveSuggestions();
  updateSuggestionsList();
}

function updateSuggestionsList() {
  const suggestionsList = document.getElementById("suggestions-list");
  suggestionsList.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${suggestion.text} (by ${suggestion.submitter} at ${suggestion.timestamp})</span>
        `;
    suggestionsList.appendChild(li);
  });
}

// Check if a group is already joined
document.addEventListener("DOMContentLoaded", () => {
  const savedGroup = localStorage.getItem("currentGroup");
  if (savedGroup) {
    document.getElementById("group-name-input").value = savedGroup;
    joinGroup();
  }
});
