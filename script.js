const home = document.getElementById("home-screen");
const add = document.getElementById("add-screen");

const buttons = document.querySelectorAll("nav button");

buttons[1].addEventListener("click", () => {

    home.style.display = "none";
    add.style.display = "block";

});

buttons[0].addEventListener("click", () => {

    add.style.display = "none";
    home.style.display = "block";

});