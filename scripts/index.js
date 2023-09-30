const TG = window.Telegram?.WebApp;
const theme = TG?.colorScheme || "dark";

if (theme === "light") {
  document.body.setAttribute("colorScheme", "white");
}

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

window.addEventListener("load", () => {
  console.log("onload");
  fetch("jsons/data.json")
    .then((res) => {
      if (res.ok) return res.json();
      else throw new Error("Something Went Wrong...");
    })
    .then((data) => {
      console.log(data);
      for (const elem of document.querySelectorAll(".dropdown-content")) {
        render_data(data, elem);
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setTimeout(() => {
        const loader = document.querySelector(".loader");
        loader.classList.add("hide");
        setTimeout(() => {
          loader.remove();
        }, 200);
      }, 1000);
    });
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

document.querySelector(".addCategory").addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.id = "modal-overlay";
  const header = document.createElement("h2");
  header.innerText = "Введите название для нового статуса";
  const wrapper = document.createElement("div");
  wrapper.appendChild(header);
  wrapper.classList.add("modal-wrapper");
  const inp = document.createElement("input");
  const btn = document.createElement("button");
  btn.innerText = "Добавить";
  inp.placeholder = "Hackich";
  btn.addEventListener("click", () => {
    if (inp.value) {
      fetch("", {
        body: JSON.stringify({
          value: inp.value,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("smth went wrong");
        })
        .then(window.location.reload());
    } else {
      inp.style.borderColor = "red";
    }
  });

  wrapper.appendChild(inp);
  wrapper.appendChild(btn);
  overlay.appendChild(wrapper);
  overlay.addEventListener("click", (e) => _onModalDismiss(e, overlay));
  document.body.appendChild(overlay);
});

// window.Telegram.WebApp.initDataUnsafe;
// window.Telegram.WebApp.colorScheme;
