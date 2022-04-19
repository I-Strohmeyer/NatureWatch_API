// Click on method button expands to show the method details
function openFold() {
  document.querySelector("#fold").addEventListener("click", function () {
    document.querySelector("#foldout").classList.toggle("active");
  });
}

function xxx() {
  let fold = document.querySelectorAll("#fold");
  let foldout = document.querySelectorAll("#foldout");
  console.log(fold);
  for (let i = 0; i < fold.length; i++) {
    fold[i].addEventListener("click", function () {
      console.log("click");
      foldout[i].classList.toggle("active");
    });
  }
}

// Click tab menu to show either movie or user endpoints
function tabMenu() {
  document.querySelector("#movies").addEventListener("click", function () {
    document.querySelector(".movie-wrapper").classList.remove("not-active");
    document.querySelector(".movie-wrapper").classList.add("active");
    document.querySelector(".user-wrapper").classList.remove("active");
  });
  document.querySelector("#users").addEventListener("click", function () {
    document.querySelector(".user-wrapper").classList.add("active");
    document.querySelector(".movie-wrapper").classList.remove("active");
    document.querySelector(".movie-wrapper").classList.add("not-active");
  });
}

tabMenu();

xxx();
