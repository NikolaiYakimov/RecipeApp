import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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
    console.log(model.state.recipe);

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
//Implement publisher-subscribe pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearches(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
