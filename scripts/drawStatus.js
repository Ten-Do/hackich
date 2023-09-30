function toggleDropdown(category) {
  const dropdown = document.getElementById(category);

  dropdown.classList.toggle("open");
}

fetch('')
  .then((res) =>
    res.ok && 0? res.json() : ["inWork", "done", "planned", "closed"]
  )
  .then((data) => {
    const container = document.querySelector(".tasks");
    let html = "";
    data.forEach((element) => {
      html += `
      <div class="dropdown category" id="${element}">
      <div class="dropdown-btn" onclick="toggleDropdown('${element}')">
        <p>${element}</p>
        <div class="counter">0</div>
      </div>
      <div class="dropdown-content"></div>
    </div>
      `;
    });
    container.innerHTML = html;
  });
