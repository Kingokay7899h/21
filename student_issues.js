let selectedItem = null;

document.addEventListener("DOMContentLoaded", () => {
  fetch("display_issue_items.php")
    .then(res => res.json())
    .then(data => populateItems(data));

  fetch("display_issues_table.php")
    .then(res => res.json())
    .then(data => populateIssues(data));
});

function populateItems(data) {
  const tbody = document.getElementById("issueItemsBody");
  tbody.innerHTML = "";
  data.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type='radio' name='selectItem' onclick='selectItem(${JSON.stringify(item)})'></td>
      <td>${i + 1}</td>
      <td>${item.name_of_the_item}</td>
      <td>${item.lab_id}</td>
    `;
    tbody.appendChild(tr);
  });
}

function selectItem(item) {
  selectedItem = item;
}

function openCreateIssue() {
  if (!selectedItem) return alert("Please select an item first");
  document.getElementById("createItemName").value = selectedItem.name_of_the_item;
  document.getElementById("createLabID").value = selectedItem.lab_id;
  document.getElementById("createIssueModal").style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

document.getElementById("createIssueForm").addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("item", selectedItem.name_of_the_item);
  formData.append("lab_id", selectedItem.lab_id);
  formData.append("issue", document.getElementById("issueText").value);
  formData.append("status", "Pending");

  fetch("create_issue.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        closeModal("createIssueModal");
        showToast("✔️ Issue Created Successfully");
        location.reload();
      }
    });
});

function populateIssues(data) {
  const tbody = document.getElementById("issuesBody");
  tbody.innerHTML = "";
  data.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.name_of_the_item}</td>
      <td>${item.lab_id}</td>
      <td>${item.issue}</td>
      <td>${item.status}</td>
      <td><button onclick='openStatusPopup(${JSON.stringify(item)})'>Update</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function openStatusPopup(item) {
  document.getElementById("statusItemName").value = item.name_of_the_item;
  document.getElementById("statusLabID").value = item.lab_id;
  document.getElementById("statusIssueText").value = item.issue;
  document.getElementById("statusSelect").value = item.status;
  document.getElementById("statusModal").dataset.id = item.id;
  document.getElementById("statusModal").style.display = "flex";
}

document.getElementById("statusUpdateForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("statusModal").dataset.id;
  const formData = new FormData();
  formData.append("id", id);
  formData.append("status", document.getElementById("statusSelect").value);

  fetch("update_issue_status.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        closeModal("statusModal");
        showToast("✅ Status Updated");
        location.reload();
      }
    });
});

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

