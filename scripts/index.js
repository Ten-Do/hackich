const render_data = (data, ref) => {
  const container = document.createElement("div");
  container.classList.add("tasks-container");
  data.forEach((element) => {
    container.appendChild(createTaskCard(element));
  });
  console.log(container);
  ref.appendChild(container);
};

function createTaskCard(data) {
  // Create a card container
  var container = document.createElement("div");

  // Format the endDate to "DD.MM.YY" format
  var endDate = new Date(data.endDate);
  var formattedEndDate = endDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  container.addEventListener("click", () => {
    showModal();
  });
  // Create card content using template literals
  container.innerHTML = `
  <div class="card">
      <div class="card-header">
          <h2>${data.name}</h2>
          <p>Created by: ${data.creator.name}</p>
      </div>
      <div class="card-description">
          <p>${data.description}</p>
      </div>
      <div class="card-details">
        <p>${data.taskNumber}</p>
        <p>Priority: ${data.priority}</p>
        <p>${formattedEndDate}</p>
      </div></div>
  `;

  // Append the card to a container in your HTML (e.g., by selecting a container element)
  return container;
}

const _getDate = (stringDate) => {
  const date = new Date(stringDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const dateString = `${day}.${month}.${year}`;
  return dateString;
};

const ct = {
  inWork: document.getElementById("inWork"),
  done: document.getElementById("done"),
  planned: document.getElementById("planned"),
  closed: document.getElementById("closed"),
};

function toggleDropdown(category) {
  const dropdown = ct[category];

  dropdown.classList.toggle("open");
}

window.addEventListener("load", () => {
  console.log("onload");
  fetch("jsons/data.json")
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error("Something Went Wrong...");
    })
    .then((data) => {
      console.log(data);
      for (const key in ct) {
        render_data(data, ct[key].querySelector(".dropdown-content"));
      }
    })
    .catch((err) => console.log(err));
});

// МОДАЛКА
const _onModalDismiss = (e, overlay) => {
  if (overlay === e.target) overlay.remove();
};

const showModal = (children) => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.id = "modal-overlay";
  const header = document.createElement("h2");
  header.innerText = "Выберите, куда перенести задачу.";
  const wrapper = document.createElement("div");
  wrapper.appendChild(header);
  wrapper.classList.add("modal-wrapper");
  const container = document.createElement("div");
  for (let i = 0; i < 4; i++) {
    container.innerHTML += `<div class="cat-btn">${i}</div>`;
  }
  wrapper.appendChild(container);
  overlay.appendChild(wrapper);
  overlay.addEventListener("click", (e) => _onModalDismiss(e, overlay));
  document.body.appendChild(overlay);
};
