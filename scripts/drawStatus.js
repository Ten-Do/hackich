const TG = window.Telegram?.WebApp;
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
  return await fetch("https://innoglobalhack.site/api/" + url, {
    method: "POST",
    body: JSON.stringify({
      user_id: TG.initDataUnsafe?.user?.id,
      ...body,
    }),
  }).then((res) => res.json());
};

getter("get_columns_by_user_id", )
  // .then((res) =>
  //   res.ok && 0 ? res.json() : ["inWork", "done", "planned", "closed"]
  // )
  .then((data) => {
    localStorage.setItem("data", data);
    const container = document.querySelector(".tasks");
    let html = "";
    data.forEach((element) => {
      html += `
      <div class="dropdown category" id="${createValidVariableName(element)}">
      <div class="dropdown-btn" onclick="toggleDropdown('${element}')">
        <p>${element}</p>
        <div class="addTask" onclick="addTask(event)">        
          <img src="/assets/icons/add.svg" alt="Добавить" />
        </div>
      </div>
      <div class="dropdown-content"></div>
    </div>
      `;
    });
    container.innerHTML = html;
  });

function createValidVariableName(str) {
  // Remove any non-alphanumeric characters
  const cleanedStr = str.replace(/[^a-zA-Z0-9_$]/g, "");

  // Ensure the first character is a letter, underscore, or dollar sign
  let validName = cleanedStr.charAt(0).match(/[a-zA-Z_$]/)
    ? cleanedStr.charAt(0)
    : "_";

  // Replace any remaining spaces with underscores
  validName += cleanedStr.slice(1).replace(/\s+/g, "_");

  return validName;
}

