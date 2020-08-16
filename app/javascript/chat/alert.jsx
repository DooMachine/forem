import { h } from 'preact';
import PropTypes from 'prop-types';

const Alert = ({ showAlert }) => {
  const otherClassname = showAlert ? '' : 'chatalert__default--hidden';

  return (
    <div
      role="alert"
      aria-hidden={!showAlert}
      className={`chatalert__default ${otherClassname}`}
    >
      Aşağıda daha fazla yeni mesaj var
    </div>
  );
};

Alert.propTypes = {
  showAlert: PropTypes.bool.isRequired,
};

export default Alert;
