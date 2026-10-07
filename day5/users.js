const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

async function loadUsers() {
  try {
    status.textContent = "Loading users...";
    loadButton.disabled = true;

   const response = await fetch(
  "https://jsonplaceholder.typicode.com/users"
);

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    users = await response.json();
    renderUsers(users);

    status.textContent = "Users loaded successfully.";
  } catch (error) {
    status.textContent = "Error loading users.";
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

function renderUsers(list) {
  usersList.innerHTML = "";

  list.forEach((user) => {
    const li = document.createElement("li");

    li.textContent = `${user.name} - ${user.email} - ${user.address.city} - ${user.company.name}`;

    usersList.appendChild(li);
  });
}

filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.toLowerCase();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);

  if (filteredUsers.length === 0) {
    status.textContent = "No users match your filter.";
  } else {
    status.textContent = "Users loaded successfully.";
  }
});