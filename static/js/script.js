document.addEventListener("click", function (e) {
  if (hasClass(e.target, "btn-dropdown") || e.target.closest(".btn-dropdown")) {
    const dropdown = e.target.closest(".dropdown");
    const menu = dropdown.querySelector(".menu");
    if (!hasClass(menu, "d-none")) {
      menu.classList.add("d-none");
    } else {
      document.querySelectorAll(".dropdown .menu").forEach(function (ele) {
        ele.classList.add("d-none");
      });
      if (window.innerHeight - e.clientY < 167) {
        menu.style.top = "-32px";
      } else {
        menu.style.top = "38px";
      }
      menu.classList.remove("d-none");
    }
  } else {
    document.querySelectorAll(".dropdown .menu").forEach(function (ele) {
      ele.classList.add("d-none");
    });
  }
});

function hasClass(element, className) {
  return [...element.classList].includes(className);
}
