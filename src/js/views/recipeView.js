import icons from '../../img/icons.svg';
import View from './View.js';
//import the fracy package
import fracty from 'fracty';
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _successMessage = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event => {
      window.addEventListener(event, handler);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--update-servings');
      //check if the clicked target is not the button, and return nothing if is like that
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (Number(updateTo) > 0) handler(Number(updateTo));
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  addHandlerAddToShoppingList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe__btn--add');
      if (!btn) return;
      // console.log('AAAAAAAAAAA');
      handler();
    });
  }
  _generateMarkup() {
    return `  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
   <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use xlink:href="${icons}#icon-clock"></use>
          </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use xlink:href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings - 1
        }">
          <svg>
            <use xlink:href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to=${
          this._data.servings + 1
        }>
          <svg>
            <use xlink:href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
        
      </div>
    </div>

     
      <div class="recipe__info">
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.totalCalories
        }</span>
      <span class="recipe__info-text">Calories
</span>
       </div>
  
   

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
      <svg>
        <use xlink:href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use xlink:href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
    
    </ul>
    <button class="btn--small recipe__btn recipe__btn--add">
      <svg class="search__icon">
        <use xlink:href="${icons}#icon-shopping-cart"></use>
      </svg>
      <span>Add to shopping list</span>
      </button>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use xlink:href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  }
  _generateMarkupIngredient(ingredient) {
    return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use xlink:href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ingredient.quantity === null ? '' : fracty(ingredient.quantity)
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit}</span>
          ${ingredient.description} (${ingredient.calories} cal.)
        </div>
      </li>`;
  }
}

export default new RecipeView();
