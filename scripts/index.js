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

  // Create card content using template literals
  container.innerHTML = `
  <div class="card" draggable="true">
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

const taskComponent = (data) => {
  const mainDiv = document.createElement("div");
  mainDiv.id = data.id;

  // референс задачи
  const taskParentDiv = document.createElement("div");
  taskParentDiv.className = "task-parent";

  // заголовок задачи
  const taskHeadDiv = document.createElement("div");
  taskHeadDiv.className = "task-head";

  // // тот кто должен выполнять
  // const taskWorkerDiv = document.createElement("div");
  // taskWorkerDiv.className = "task-worker";
  // taskWorkerDiv.innerText = data.lastName.at(0) + data.firstName.at(0);

  // заголовок задачи
  const taskDateDiv = document.createElement("div");
  taskDateDiv.className = "task-date";
  taskDateDiv.innerText = _getDate(data.endDate);

  // инфа
  const taskInfoDiv = document.createElement("div");
  taskInfoDiv.className = "task-info";

  // описание
  const taskTextDiv = document.createElement("div");
  taskTextDiv.className = "task-text";
  taskTextDiv.innerText = data.description;

  // теги
  // const taskTagsDiv = document.createElement("div");
  // taskTagsDiv.className = "task-tags";
  // data.forEach(element => {

  // });

  // taskHeadDiv.appendChild(taskWorkerDiv);
  taskHeadDiv.appendChild(taskDateDiv);
  taskInfoDiv.appendChild(taskTextDiv);
  // taskInfoDiv.appendChild(taskTagsDiv);
  mainDiv.appendChild(taskParentDiv);
  mainDiv.appendChild(taskHeadDiv);
  mainDiv.appendChild(taskInfoDiv);
  return mainDiv;
};

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

  overlay.innerHTML += `
  <div class="modal-wrapper">
  ${children}
  </div>
  `;
  overlay.addEventListener("click", (e) => _onModalDismiss(e, overlay));
  document.body.appendChild(overlay);
};

// showModal(
// );

// DND
const onDNDstart = (e) => {
  e.target.parentNode.appendChild(_optionsCard());
};

const _optionsCard = () => {
  const optionCard = document.createElement("div");
  optionCard.classList.add("optionCard");
  optionCard.innerHTML = `
  <div class="drop-zone" ondrop="drop(event)" ondragover="allowDrop(event)">Drop Zone 1</div>
  <div class="drop-zone" ondrop="drop(event)" ondragover="allowDrop(event)">Drop Zone 2</div>
  <div class="drop-zone" ondrop="drop(event)" ondragover="allowDrop(event)">Drop Zone 3</div>
  <div class="drop-zone" ondrop="drop(event)" ondragover="allowDrop(event)">Drop Zone 4</div>
  
  `;
};
