import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULT_PER_PAGE } from './config.js';
// import { getJson, sendJson } from './helper.js';
import { AJAX } from './helper.js';
import uniqid from 'uniqid';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  items: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
//Only change the state obj
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err} !!!!`);
    // alert(err);
    throw err;
  }
};
/**
 *
 * @param {String} query -the recipe string we search for
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //Add the full data about the recipes, so we can use it in sortResults method
    const fullRecipes = await Promise.all(
      data.data.recipes.map(async rec => {
        const fullData = await AJAX(`${API_URL}${rec.id}?key=${KEY}`);
        return createRecipeObject(fullData);
      })
    );
    state.search.results = fullRecipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        cookingTime: rec.cookingTime,
        image: rec.image,
        ingredients: rec.ingredients,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} !!!!`);

    throw err;
  }
};

/**
 *
 * @param {Number} page -the page you are on
 * @returns {Array}- Array of recipes obj on this page
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = {};
    Object.entries(newRecipe).forEach(([key, value]) => {
      if (key.startsWith('ingredient-')) {
        const parts = key.split('-');
        const id = parts[1];
        const type = parts[2];

        if (!ingredients[id]) ingredients[id] = {};
        ingredients[id][type] = value;
      }
    });
    const formattedIngredients = Object.values(ingredients)
      .filter(ingredient => ingredient.description)
      .map(ing => ({
        quantity: ing.quantity ? Number(ing.quantity) : null,
        unit: ing.unit ? ing.unit : null,
        description: ing.description,
      }));

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: Number(newRecipe.servings),
      cooking_time: Number(newRecipe.cookingTime),
      ingredients: formattedIngredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 *
 * @param {String} sortType -Property of recipe you want to sort by
 */
export const sortResults = function (sortType) {
  try {
    switch (sortType) {
      case 'ingredients':
        state.search.results.sort(
          (a, b) => a.ingredients.length - b.ingredients.length
        );
        break;
      case 'duration':
        // console.log('SortByTime');
        state.search.results.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      default:
        throw new Error('Invalid sort type: ' + sortType);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addItemToShoppingList = function (quantity, unit, ingredient) {
  const item = {
    id: uniqid(),
    quantity,
    unit,
    ingredient,
  };
  state.items.push(item);
};

export const deleteItemFromShoppingList = function (id) {
  const index = state.items.findIndex(item => item.id === id);
  state.items.splice(index, 1);
};

export const updateItemCount = function (id, count) {
  state.items.find(item => (item.id = id)).quantity = quantity;
};
