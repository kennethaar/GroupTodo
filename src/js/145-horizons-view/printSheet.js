/* A sheet of its own: only it is printed, and it goes again after. */
function printSheet(sheet) {
  document.querySelector("#printsheet")?.remove();
  sheet.id = "printsheet";
  document.body.append(sheet);
  document.body.classList.add("printsheet");
  window.addEventListener("afterprint", () => {
    sheet.remove();
    document.body.classList.remove("printsheet");
  }, {once: true});
  window.print();
}
