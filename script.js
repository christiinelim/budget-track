// menu button
document.querySelector("#menu-button-click").addEventListener("click", () => {
    if (document.querySelector(".bi-list")){
        document.querySelector("#navbar-small").style.height = "100vh";
        document.querySelector("#dropdown-small").style.display = "flex";
        document.querySelector(".bi").classList.remove("bi-list");
        document.querySelector(".bi").classList.add("bi-box-arrow-right");
    } else {
        document.querySelector("#navbar-small").style.height = "50px";
        document.querySelector("#dropdown-small").style.display = "none";
        document.querySelector(".bi").classList.remove("bi-box-arrow-right");
        document.querySelector(".bi").classList.add("bi-list");
    }
});

document.querySelector(".dropdown-option-small").addEventListener("click", () => {
    document.querySelector("#navbar-small").style.height = "50px";
    document.querySelector("#dropdown-small").style.display = "none";
    document.querySelector(".bi").classList.remove("bi-box-arrow-right");
    document.querySelector(".bi").classList.add("bi-list");
})