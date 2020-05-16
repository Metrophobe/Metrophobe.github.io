import UI from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  let ui = new UI();
  await ui.init();
});
