import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import resultSortView from './views/resultSortView.js';
import shoppingListView from './views/shoppingListView.js';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
//Api to fetch : https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.replace('#', '');

    if (!id) return;
    recipeView.renderSpinner();

    //Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Load recipe
    await model.loadRecipe(id);

    //Rendering the recipe

    recipeView.render(model.state.recipe);

    //Updating bookmarks view

    //Render initial pagination buttons
  } catch (err) {
    recipeView.renderError();
    console.error(err);
    // alert(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //Get search value
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);

    //Render search results
    resultSortView.renderSort();
    resultView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    // resultView.renderError();
  }
};
const controlPagination = function (goToPage) {
  //Render new Results
  resultView.render(model.getSearchResultsPage(goToPage));
  //Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //Update the recipe view
  recipeView.update(model.state.recipe);
  //Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe
    await model.uploadRecipe(newRecipe);

    //Render the recipe
    recipeView.render(model.state.recipe);
    //Display success message

    addRecipeView.renderMessage();
    //Render the bookmark after upload
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, null, `#${model.state.recipe.id}`);

    //Close window after a certain time
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const controlResultsSorts = function (sortType) {
  try {
    //Sort results
    model.sortResults(sortType);

    resultView.render(model.getSearchResultsPage());
  } catch (err) {
    resultSortView.renderError(err.message);
  }
};

const controlShoppingList = function () {
  //Create a new list If there is none yet

  model.state.recipe.ingredients.forEach(ing => {
    model.addItemToShoppingList(ing.quantity, ing.unit, ing.description);
  });
  console.log(model.state.items);
  shoppingListView.render(model.state.items);
  // model.addItemToShoppingList(1, 'kg', 'tomato');
  // model.addItemToShoppingList(2, 'kg', 'potato');
};
// console.log(model.state.recipe.ingredients);
// controlShoppingList();
// console.log(model.state.recipe);
//Implement publisher-subscribe pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddToShoppingList(controlShoppingList);
  searchView.addHandlerSearches(controlSearchResults);
  resultSortView.addHandlerSortSearches(controlResultsSorts);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addHandlerAddIngredient();
  // setTimeout(function () {
  //   controlShoppingList();
  // }, 3000);
};

init();
