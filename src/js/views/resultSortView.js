import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultSortView extends View {
  _parentElement = document.querySelector('.search-results__sort');
  _errorMessage = 'No recipes founded for your query.Please try again!';
  _successMessage = '';

  addHandlerSortSearches(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.sort-btn');
      if (!btn) return;
      const sortType = btn.classList.contains('sort-btn--ingredients')
        ? 'ingredients'
        : 'duration';
      handler(sortType);
    });
  }
  _generateMarkup() {
    return ` <button class="sort-btn sort-btn--ingredients">
          <svg  class="sort-btn__icon" viewBox="0 0 24 24">
           
            <use xlink:href="${icons}#icon-ingredients"></use>
          </svg>
        </button>

        <button class="sort-btn sort-btn--duration">
          <svg  class="sort-btn__icon" viewBox="0 0 24 24">
            <use xlink:href="${icons}#icon-clock"></use>
          </svg>
        </button>`;
  }
}
export default new ResultSortView();
