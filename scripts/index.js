// if (TG) {
//   TG.expand();
//   const tgUserId = TG.initDataUnsafe.user.id
// }

const render_data = (data, ref) => {
  console.log("data: ", data);
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

  /**
 *   {
    "boardId": "6518afaebca6d15e876b5c3c",
    "color": "#61B1FB",
    "id": "6518afaebca6d15e876b5c3f",
    "isClose": false,
    "name": "В работе",
    "projectId": "6518afaebca6d15e876b5c3a",
    "tasks": []
  },
 */

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
const getData = async () => window.fetchedData;
window.addEventListener("load", () => {
  // HERE!

  getData()
    .then((data) => {
      for (const column of data) {
        render_data(
          column.tasks,
          document.getElementById(createValidVariableName(column.name))
        );
      }
    })
    .catch((err) => errorModal(err.message))
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
      // HERE!
      getter("", {
        value: inp.value,
      })
        .then(window.location.reload())
        .catch((err) => errorModal(err.message));
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
// fetch("https://innoglobalhack.site/api/get_board", {
//   method: "POST",
//   body: JSON.stringify({
//     board_id: "6518afaebca6d15e876b5c3c",
//     user_id: "461656218",
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// FETCHING
// const getter = async (url, body) => {
//   return await fetch("https://innoglobalhack.site/api/" + url, {
//     method: "POST",
//     body: JSON.stringify({
//       user_id: TG.initDataUnsafe?.user?.id,
//       ...body,
//     }),
//   }).then((res) => res.json());
// };

const fetchTasks = async () => {
  getter("column")
    .then((data) => {
      if (!data.board_id) {
        errorModal("Сначала выберите доску в тг боте");
      }
    })
    .catch((err) => errorModal(err.message));
};
