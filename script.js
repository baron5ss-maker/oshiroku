const homeScreen = document.getElementById("home-screen");
const addScreen = document.getElementById("add-screen");

document.getElementById("home-btn").addEventListener("click", () => {

    homeScreen.style.display = "block";
    addScreen.style.display = "none";

});

document.getElementById("add-btn").addEventListener("click", () => {

    homeScreen.style.display = "none";
    addScreen.style.display = "block";

});