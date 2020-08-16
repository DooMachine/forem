import { h } from 'preact';
import PropTypes from 'prop-types';

const ContactViaConnect = ({ onChange, checked }) => (
  <div className="field">
    <label
      id="label-contact-via-connect"
      className="listingform__label"
      htmlFor="contact_via_connect"
    >
      Kullanıcıların Uygulama İçi Sohbet Yoluyla Bana Mesaj Göndermesine İzin Ver
    </label>
    <input
      type="checkbox"
      className="listingform__input listingform__contact_via_connect"
      id="contact_via_connect"
      name="listing[contact_via_connect]"
      onInput={onChange}
      checked={checked}
    />
  </div>
);

ContactViaConnect.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default ContactViaConnect;
