/// <reference types='../@types/jquery' />

$(".sideBarControl .openIcon").on("click", function () {
  $(".sideBarControl .openIcon").css("display", "none");
  $(".sideBarControl .closeIcon").css("display", "block");
  $("aside .sidBar").css("left", "0px");
  $(".sideBarControl").css("left", "270px");
  for(let i = 0 ; i<=5; i++){
    $('.links a').eq(i).animate({top:0},(i+5)*100)
  }
});

$(".sideBarControl .closeIcon").on("click", function () {
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
  for(let i = 0 ; i<=5; i++){
    $('.links a').eq(i).animate({top:300},500)
  }
});


let dataArray = [];

//  display random meals when document is ready
function displayMeals(data) {
  let box = "";
  for (let i = 0; i < 20; i++) {
    if (data[i]) {
      box += `
        <div class="col-md-3" onclick="recipeDetailsApi('${data[i].idMeal}')">
          <div class="image"><img src="${data[i].strMealThumb}" alt="" class="w-100">
            <div class="overlay position-absolute bottom-0 start-0 end-0 text-center">
              <h3>${data[i].strMeal}</h3>
            </div>
          </div>
        </div>
      `;
    }
  }
  $(".meals .row").html(box);
}
async function fetchRandomMeals() {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayMeals(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching random meals:", error);
  }
}
fetchRandomMeals();

$(".sidBar #Category").on("click", function () {
  $(".area").css("display", "none");
  $(".details").css("display", "none");
  $(".search").css("display", "none");
  $(".contact").css("display", "none");
  $(".meals").css("display", "block");
  getCategories();
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
});
// fetch api for categories
async function getCategories() {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let response = await url.json();
    dataArray = response.categories;
    display(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
// display meals by category
function displayCat(data) {
  let box = "";
  for (let i = 0; i < 20; i++) {
    if (data[i]) {
      box += `
              <div class="col-md-3" onclick="recipeDetailsApi('${data[i].idMeal}')">
                  <div class="image"><img src="${data[i].strMealThumb}" alt="" class="w-100">
                      <div class="overlay position-absolute bottom-0 start-0 end-0 text-center">
                      <h3>${data[i].strMeal}</h3>
                  </div>
                      </div>
              </div>
          `;
    }
  }
  $(".meals .row").html(box);
}
// fetch api for each category
async function filterCat(cat) {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayCat(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
// display data(category) in meals section
function display(data) {
  let box = "";
  for (let i = 0; i < 20; i++) {
    if (data[i]) {
      box += `
                <div class="col-md-3" onclick="filterCat('${
                  data[i].strCategory
                }')">
                    <div class="image"><img src="${
                      data[i].strCategoryThumb
                    }" alt="" class="w-100">
                        <div class="overlay position-absolute bottom-0 start-0 end-0 text-center">
                        <h3>${data[i].strCategory}</h3>
                        <p>${data[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                        </div>
                </div>
            `;
    }
  }
  $(".meals .row").html(box);
}

// fetch api details for each meal using id
async function recipeDetailsApi(id) {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayDetails(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
// display details into details section
function displayDetails(data) {
  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
    let ingredient = data[0][`strIngredient${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`<span>${ingredient}</span>`);
    }
  }
  let box = `
  <div class="close w-100 d-flex align-items-end mb-4"><i class="fa-solid fa-xmark fa-2xl ms-auto" style="color: #ffffff;"></i></div>
    <div class="col-md-4">
      <div class="image">
        <img src="${data[0].strMealThumb}" alt="" class="w-100">
        <h2>${data[0].strMeal}</h2>
      </div>
    </div>
    <div class="col-md-8">
      <div class="alldetails">
        <h2>Instructions</h2>
        <p>${data[0].strInstructions}</p>
        <span>Area :</span><span> ${data[0].strArea}</span><br>
        <span>Category :</span><span> ${data[0].strCategory}</span><br>
        <span>Recipes :</span>
        <div class="Ingredient">
        ${
          ingredients.length > 0
            ? ingredients.join(" ")
            : "No ingredients listed"
        }
        </div>
        <span>Tags :</span><br>
        <span class="special">${data[0].strTags}</span><br>
        <a class="source" href ="${data[0].strSource}">source</a>
        <a class="youtube" href ="${data[0].strYoutube}">Youtube</a>
      </div>
    </div>
  `;
  $(".meals").css("display", "none");
  $(".details").css("display", "block");
  $(".details .row").html(box);

  $(".details .close").on("click", function () {
    $(".meals").css("display", "block");
    $(".details").css("display", "none");
  });
}

$(".sidBar #area").on("click", function () {
  $(".meals").css("display", "none");
  $(".details").css("display", "none");
  $(".search").css("display", "none");
  $(".contact").css("display", "none");
  $(".ingredients").css("display", "none");
  $(".area").css("display", "block");
  recipeAreaApi();
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
});
// fetch api for areas
async function recipeAreaApi() {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayArea(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
// display areas into area section
function displayArea(data) {
  let box = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i].strArea) {
      box += `
        <div class="col-md-3" onclick="filterArea('${data[i].strArea}')">
          <div class="image">
            <div class="icon">
              <i class="fa-solid fa-house-laptop fa-6x"></i>
            </div>
            <h3 class="">${data[i].strArea}</h3>
          </div>
        </div>
      `;
    }
  }
  $(".area .row").html(box);
}
// fetch api for each area and display it into meal section
async function filterArea(area) {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    let response = await url.json();
    dataArray = response.meals;
    $(".area").css("display", "none");
    $(".meals").css("display", "block");
    displayCat(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

$(".sidBar #ingredients").on("click", function () {
  $(".meals").css("display", "none");
  $(".details").css("display", "none");
  $(".area").css("display", "none");
  $(".search").css("display", "none");
  $(".contact").css("display", "none");
  $(".ingredients").css("display", "block");
  recipeIngredientsApi();
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
});
// fetch api for ingredient 
async function recipeIngredientsApi() {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayIngredients(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
// display ingredient into ingredient section
function displayIngredients(data) {
  let box = "";
  for (let i = 0; i < 20; i++) {
    box += `
        <div class="col-md-3 d-flex justify-content-center align-items-center" onclick="filterIng('${
          data[i].strIngredient
        }')">
          <div class="image">
            <div class="icon">
              <i class="fa-solid fa-drumstick-bite fa-4x" style="color: #ffffff;"></i>
            </div>
            <h3 class="">${data[i].strIngredient}</h3>
            <p class="">${data[i].strDescription
              .split(" ")
              .slice(0, 15)
              .join(" ")}</p>
          </div>
        </div>
      `;
  }

  $(".ingredients .row").html(box);
}
// fetch api for each ingredient and display it into meal section
async function filterIng(ingredient) {
  $(".loading").css("display", "flex");
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    let response = await url.json();
    dataArray = response.meals;
    $(".area").css("display", "none");
    $(".ingredients").css("display", "none");
    $(".meals").css("display", "block");
    displayCat(dataArray);
    $(".loading").css("display", "none");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

$("#search").on("click", function () {
  $(".search").css("display", "block");
  $(".meals").css("display", "none");
  $(".details").css("display", "none");
  $(".contact").css("display", "none");
  $(".area").css("display", "none");
  $(".ingredients").css("display", "none");
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
});
// fetch api to search by letter
async function fetchMealsByLetter(letter) {
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayMeals(dataArray);
    $(".meals").css("display", "block");
  } catch (error) {
    console.error("Error fetching meals by letter:", error);
  }
}
$(".letter").on("input", function () {
  if ($(".letter").val() != "") {
    let letter = $(".letter").val();
    fetchMealsByLetter(letter);
  } else {
    fetchRandomMeals();
  }
});
// fetch api to search by name
async function fetchMealsByName(name) {
  try {
    let url = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );
    let response = await url.json();
    dataArray = response.meals;
    displayMeals(dataArray);
    $(".meals").css("display", "block");
  } catch (error) {
    console.error("Error fetching meals by letter:", error);
  }
}
$(".name").on("input", function () {
  if ($(".name").val() != "") {
    let name = $(".name").val();
    fetchMealsByName(name);
  } else {
    fetchRandomMeals();
  }
});

$(".sidBar #contact").on("click", function () {
  $(".area").css("display", "none");
  $(".details").css("display", "none");
  $(".search").css("display", "none");
  $(".meals").css("display", "none");
  $(".ingredients").css("display", "none");
  $(".contact").css("display", "flex");
  $(".sideBarControl .openIcon").css("display", "block");
  $(".sideBarControl .closeIcon").css("display", "none");
  $("aside .sidBar").css("left", "-270px");
  $(".sideBarControl").css("left", "0px");
});


$(document).ready(function() {
  // Attach event listeners to each input field
  $("#uname, #uemail, #upass, #urpass, #uphone, #uage").on('input', function() {
    checkFormValidity();
  })
  });

// function for regex for each input field
function validation(ele) {
  var Regex = {
    uname: /^[a-zA-Z0-9-]{5,}$/,
    uemail: /^[a-zA-Z0-9-]+\@[a-zA-Z]{2,}\.[a-zA-Z]{2,}$/,
    upass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    uphone: /^01[0125][0-9]{8}$/,
    uage: /^([1-9][0-9]?)$/,
    urpass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  };

  if (Regex[ele.id].test(ele.value)) {
    ele.classList.add("is-valid");
    ele.classList.remove("is-invalid");
    ele.nextElementSibling.classList.replace("d-block", "d-none");
    return true;
  } else {
    ele.classList.add("is-invalid");
    ele.classList.remove("is-valid");
    ele.nextElementSibling.classList.replace("d-none", "d-block");
    return false;
  }
}
// function to remove disabled attribute
function checkFormValidity() {
  var isValid =
    validation($("#uname")[0]) &&
    validation($("#uemail")[0]) &&
    validation($("#upass")[0]) &&
    validation($("#uage")[0]) &&
    validation($("#uphone")[0]) &&
    ($("#upass").val() === $("#urpass").val());

  if (isValid) {
    $("#registrationForm .btn").removeAttr('disabled');
  } else {
    $("#registrationForm .btn").attr("disabled", true);
  }
}
