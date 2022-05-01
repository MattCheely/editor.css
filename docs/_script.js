window.addEventListener("click", e => {
  switch (e.target.tagName) {
    case "BUTTON":
      buttonClick(e.target);
      break;
  }
});

function buttonClick(button) {
  if (button.classList.contains("theme-toggle")) {
    toggleTheme();
  }
}

function toggleTheme() {
  const docElement = document.documentElement;
  if (docElement.dataset.theme === "dark") {
    docElement.dataset.theme = "light";
  } else if (docElement.dataset.theme === "light") {
    docElement.dataset.theme = "dark";
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    docElement.dataset.theme = "light";
  }
}
