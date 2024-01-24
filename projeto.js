// Listar cocktail ingredients usando a API "https://rapidapi.com/Bmbus/api/cocktails3"
function getRecipesAndIngredients(category) {
  if (
    category &&
    document.body.contains(document.getElementById("recipesList"))
  ) {
    const recipesListElement = document.getElementById("recipesList");
    recipesListElement.innerHTML =
      '<div class="text-center">Loading recipes...</div>';
  }

  fetch("https://cocktails3.p.rapidapi.com/random", {
    method: "GET",
    credentials: "same-origin",
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    headers: {
      "X-RapidAPI-Key": "8e80d5c2cfmsh44f29f809078203p14392ejsnf2adcda9a73b",
      "X-RapidAPI-Host": "cocktails3.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (document.body.contains(document.getElementById("recipesList"))) {
        getRecipesAndPopulate(data.body, category);
      }

      if (document.body.contains(document.getElementById("recipesList2"))) {
        getRecipesAndPopulatePage2(data.body, category);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Listar receitas usando a API "https://rapidapi.com/apidojo/api/tasty/"
function getRecipesAndPopulate(ingredients, category = null) {
  const url = category
    ? `https://tasty.p.rapidapi.com/recipes/list?from=0&size=12&q=${category}`
    : "https://tasty.p.rapidapi.com/recipes/list?from=0&size=12";

  fetch(url, {
    method: "GET",
    credentials: "same-origin",
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "8e80d5c2cfmsh44f29f809078203p14392ejsnf2adcda9a73b",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      populateRecipesList(data.results, "recipesList", ingredients);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function getRecipesAndPopulatePage2(ingredients, category = null) {
  const url = category
    ? `https://tasty.p.rapidapi.com/recipes/list?from=13&size=12&q=${category}`
    : "https://tasty.p.rapidapi.com/recipes/list?from=13&size=12";

  fetch(url, {
    method: "GET",
    credentials: "same-origin",
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "8e80d5c2cfmsh44f29f809078203p14392ejsnf2adcda9a73b",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      populateRecipesList(data.results, "recipesList2", ingredients);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function populateRecipesList(recipes, recipesList, ingredients) {
  const recipesListElement = document.getElementById(recipesList);
  const cocktailInformationEl = document.getElementById("cocktailInformation");

  recipesListElement.innerHTML = "";
  cocktailInformationEl.innerHTML = "";

  const cocktailInfo = ingredients.map((item) => {
    const ingredients = item.ingredients.map((item) => {
      return `<li>${item}</li>`;
    });
    const ingredientsList = ingredients.join("");

    const cocktailElement = `<div>
      <strong class="text-capitalize">${item.name}</strong>
      <ul>${ingredientsList}</ul>
    </div>`;

    return cocktailElement;
  });

  recipes.forEach((item) => {
    const recipeInfo = item.sections
      .map((section) => {
        const componentsEl = section.components.map((item) => {
          return `<li class="text-capitalize">${item.raw_text}</li>`;
        });
        const componentsList = componentsEl.join("");

        return componentsList;
      })
      .join("");

    const recipeElement = `<div class="card card-recipe" style="width: 18rem" id="${item.id}">
      <figure>
        <img
        src="${item.thumbnail_url}"
        class="card-img-top"
        alt="Food"
      />
      </figure>
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">
          Preparation Time: ${item.prep_time_minutes} minutes
          <br />
          Servings: ${item.num_servings} people
        </p>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${item.id}">
          Read More
        </button>
      </div>

      <div class="modal fade" id="modal-${item.id}" tabindex="-1" aria-labelledby="modal-${item.id}" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title fs-5" id="exampleModalLabel">${item.name}</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <figure class="modal-recipe-img">
                <img
                src="${item.thumbnail_url}"
                class="card-img-top"
                alt="Food"
              />
              </figure>
              <p class="card-text">
                Preparation Time: ${item.prep_time_minutes} minutes
                <br />
                Servings: ${item.num_servings} people
              </p>

              <h5>Recipe:</h5>
              <ul>${recipeInfo}</ul>

              <h5>Pair with a cocktail:</h5>
              <div>${cocktailInfo}</div>

              <h5>Learn More:</h5>
              <p>${item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    const itemColumn = document.createElement("div");
    itemColumn.classList.add("col-lg-3");
    itemColumn.classList.add("col-lg-3");
    itemColumn.classList.add("col-md-4");
    itemColumn.innerHTML = recipeElement;
    recipesListElement.appendChild(itemColumn);
  });
}

function filterRecipes(category) {
  getRecipesAndIngredients(category);
}

getRecipesAndIngredients();

function searchRecipes() {
  const searchInput = document.getElementById("searchInput").value;
  filterRecipes(searchInput);
}

function filterRecipes(category) {
  getRecipesAndIngredients(category);
}

