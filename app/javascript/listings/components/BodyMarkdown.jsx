import { h } from 'preact';
import PropTypes from 'prop-types';

const BodyMarkdown = ({ onChange, defaultValue }) => (
  <div className="field">
    <label className="listingform__label" htmlFor="body_markdown">
      İçerik (Markdown)
      <textarea
        className="listingform__input listingform__bodymarkdown"
        id="body_markdown"
        name="listing[body_markdown]"
        maxLength="400"
        placeholder="En fazla 400 karakter, en fazla 12 satır sonu, resimlere izin verilmez, * markdown önerilir*"
        value={defaultValue}
        onInput={onChange}
      />
    </label>
  </div>
);

BodyMarkdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default BodyMarkdown;
