import * as model from './model.js';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
//Api to fetch : https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.replace('#', '');

    if (!id) return;
    recipeView.renderSpinner();
    //Load recipe
    await model.loadRecipe(id);

    //Rendering the recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    console.log(err);
  }
};

controlRecipes(
  'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886'
);

// const renderRecipe = function (data) {};

//Listen for hash change event, and load the page with the url event,
//Instead having a lot of events we have one arr, of the evens, and we loop for that event and cal the same func
['hashchange', 'load'].forEach(event => {
  window.addEventListener(event, controlRecipes);
});
