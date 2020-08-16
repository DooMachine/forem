import { h } from 'preact';
import PropTypes from 'prop-types';
import { Button } from '@crayons';

const PersonalSettings = ({
  handlePersonChannelSetting,
  showGlobalBadgeNotification,
  updateCurrentMembershipNotificationSettings,
}) => {
  return (
    <div className="crayons-card p-4 grid gap-2 mb-4 personl-settings">
      <h3>Kişisel ayarlar</h3>
      <h4>Bildirimler</h4>
      <div className="crayons-field crayons-field--checkbox">
        <input
          type="checkbox"
          id="c3"
          className="crayons-checkbox"
          checked={showGlobalBadgeNotification}
          onChange={handlePersonChannelSetting}
        />
        <label htmlFor="c3" className="crayons-field__label">
          Yeni Mesajlar için Bildirimler Alın
        </label>
      </div>
      <div>
        <Button
          type="submit"
          onClick={updateCurrentMembershipNotificationSettings}
        >
          Gönder
        </Button>
      </div>
    </div>
  );
};

PersonalSettings.propTypes = {
  updateCurrentMembershipNotificationSettings: PropTypes.func.isRequired,
  showGlobalBadgeNotification: PropTypes.bool.isRequired,
  handlePersonChannelSetting: PropTypes.func.isRequired,
};

export default PersonalSettings;
