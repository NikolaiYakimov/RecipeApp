import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAddIngredient = document.querySelector('.btn--add-ingredient');
  _columnIngredient = document.querySelector('.ingredients-container');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow = function () {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  };

  _addHandlerHideWindow = function () {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  };

  addHandlerAddIngredient() {
    this._btnAddIngredient.addEventListener('click', () => {
      const ingredientGroups = document.querySelectorAll('.ingredient-group');
      const nextNumber = ingredientGroups.length + 1;
      const markup = ` 
      <div class="ingredient-group">
          <label>Ingredient ${nextNumber}</label>
          <div class="ingredient-fields">
            <input type="number" placeholder="Qty" name="ingredient-${nextNumber}-quantity" />
            <input type="text" placeholder="Unit" name="ingredient-${nextNumber}-unit" />
            <input type="text" placeholder="Desc" name="ingredient-${nextNumber}-description" />
          </div>
        </div>`;
      this._columnIngredient.insertAdjacentHTML('beforeend', markup);
      console.log('AAAAAAAAAAAAAAA');
    });
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
