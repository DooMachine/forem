import 'preact/devtools';
import PropTypes from 'prop-types';
import { h } from 'preact';

export const SearchForm = ({
  searchTerm,
  onSearch,
  onSubmitSearch,
  searchBoxId,
}) => (
  <form
    action="/search"
    acceptCharset="UTF-8"
    method="get"
    onSubmit={onSubmitSearch}
  >
    <input name="utf8" type="hidden" value="✓" />
    <input
      className="top-bar--search-input crayons-textfield"
      type="text"
      name="q"
      id={searchBoxId}
      placeholder="Ara..."
      autoComplete="off"
      aria-label="ara"
      onKeyDown={onSearch}
      value={searchTerm}
    />
  </form>
);

SearchForm.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  searchBoxId: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
};
