const TG = window.Telegram?.WebApp;

const errorModal = (message) => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.id = "modal-overlay";
  const header = document.createElement("h2");
  header.innerText = "Что-то пошло не так..";
  const wrapper = document.createElement("div");
  wrapper.appendChild(header);
  wrapper.classList.add("modal-wrapper");
  const container = document.createElement("p");
  container.innerText = message;
  wrapper.appendChild(container);
  overlay.appendChild(wrapper);
  overlay.addEventListener("click", (e) => _onModalDismiss(e, overlay));
  document.body.appendChild(overlay);
};

const fields = [
  { label: "Task Name:", type: "text", name: "taskName", required: true },
  { label: "Task Description:", type: "textarea", name: "taskDescription" },
  {
    label: "Priority:",
    type: "select",
    name: "priority",
    options: ["Low", "Medium", "High"],
  },
  { label: "End Date:", type: "date", name: "endDate" },
];

function toggleDropdown(category) {
  const dropdown = document.getElementById(category);

  dropdown.classList.toggle("open");
}

const showAddTaskModal = (children) => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.id = "modal-overlay";
  const header = document.createElement("h2");
  header.innerText = "Создание новой задачи";
  const wrapper = document.createElement("div");
  wrapper.appendChild(header);
  wrapper.classList.add("modal-wrapper");
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");
  const form = document.createElement("form");
  form.classList.add("form-container");

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.innerText = field.label;

    if (field.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.name = field.name;
      form.appendChild(label);
      form.appendChild(textarea);
    } else if (field.type === "select") {
      const select = document.createElement("select");
      select.name = field.name;

      field.options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText.toLowerCase();
        option.text = optionText;
        select.appendChild(option);
      });

      form.appendChild(label);
      form.appendChild(select);
    } else {
      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      if (field.required) {
        input.required = true;
      }
      form.appendChild(label);
      form.appendChild(input);
    }
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerText = "Добавить";
  form.appendChild(submitButton);
  formContainer.appendChild(form);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(e);
  });
  //

  wrapper.appendChild(formContainer);
  overlay.appendChild(wrapper);
  overlay.addEventListener("click", (e) => _onModalDismiss(e, overlay));
  document.body.appendChild(overlay);
};

function addTask(e, status) {
  e.stopPropagation();
  showAddTaskModal();
}
const getter = async (url, body) => {
  console.log({
    user_id: TG.initDataUnsafe?.user?.id,
    ...body,
  });
  return await fetch("https://innoglobalhack.site/api/" + url, {
    method: "POST",
    body: JSON.stringify({
      user_id: TG.initDataUnsafe?.user?.id,
      ...body,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
};

getter("get_columns_by_user_id")
  // .then((res) =>
  //   res.ok && 0 ? res.json() : ["inWork", "done", "planned", "closed"]
  // )
  .then((data) => {
    console.log("RESPONSE: ", data);
    window.fetchedData = data;
    const container = document.querySelector(".tasks");
    let html = "";
    data.forEach(({ name }) => {
      html += `
      <div class="dropdown category" id="${createValidVariableName(name)}">
      <div class="dropdown-btn" onclick="toggleDropdown('${createValidVariableName(
        name
      )}')">
        <p>${name}</p>
        <div class="addTask" onclick="addTask(event)">        
          <img src="/assets/icons/add.svg" alt="Добавить" />
        </div>
      </div>
      <div class="dropdown-content"></div>
    </div>
      `;
    });
    container.innerHTML = html;
    return data;
  })
  .then((data) => {
    console.log("1: ", data);
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
  })
  .catch((err) => errorModal(err.message));

function createValidVariableName(str) {
  // Remove any non-alphanumeric characters
  const cleanedStr = str.replace(/[^а-яА-Яa-zA-Z0-9_$]/g, "");

  // Ensure the first character is a letter, underscore, or dollar sign
  let validName = cleanedStr.charAt(0).match(/[а-яА-Яa-zA-Z_$]/)
    ? cleanedStr.charAt(0)
    : "_";

  // Replace any remaining spaces with underscores
  validName += cleanedStr.slice(1).replace(/\s+/g, "_");

  return validName;
}
// fghkjlklk.kjgjfghvbjhj;lkufjkgcjhvkjblhklyktyjdgjvhbjhl;kuryjdjghcvjhlulfykjdghxmcvkjlfkjgdhmcvjglfhjkgcmbvbjlh;glfhjcgbbjlg;kh,jbn.blh;ogul
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
// window.addEventListener("load", () => {
//   // HERE!

//   Promise.resolve(window.fetchedData)
//     .then((data) => {
//       console.log("1: ", data);
//       for (const column of data) {
//         render_data(
//           column.tasks,
//           document.getElementById(createValidVariableName(column.name))
//         );
//       }
//     })
//     .catch((err) => errorModal(err.message))
//     .finally(() => {
//       setTimeout(() => {
//         const loader = document.querySelector(".loader");
//         loader.classList.add("hide");
//         setTimeout(() => {
//           loader.remove();
//         }, 200);
//       }, 1000);
//     });
// });

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
