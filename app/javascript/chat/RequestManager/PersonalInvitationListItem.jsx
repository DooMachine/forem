import { h } from 'preact';
import PropTypes from 'prop-types';

import { Button } from '@crayons';

const RequestListItem = ({ request, updateMembership }) => (
  <div className="crayons-card mb-6">
    <div className="crayons-card__body channel-request-card">
      <div className="request-message d-flex flex-wrap">
        <b>{request.chat_channel_name}</b> kanalına davet edildiniz.
      </div>
      <div className="request-actions">
        <Button
          className="m-2"
          size="s"
          variant="danger"
          onClick={updateMembership}
          data-channel-id={request.chat_channel_id}
          data-membership-id={request.membership_id}
          data-channel-slug={request.channel_modified_slug}
          data-user-action="reject"
        >
          {' '}
          Reddet
        </Button>
        <Button
          className="m-2"
          size="s"
          onClick={updateMembership}
          data-channel-id={request.chat_channel_id}
          data-membership-id={request.membership_id}
          data-channel-slug={request.channel_modified_slug}
          data-user-action="accept"
        >
          {' '}
          Kabul et
        </Button>
      </div>
    </div>
  </div>
);

RequestListItem.propTypes = {
  request: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      membership_id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      role: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      chat_channel_name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateMembership: PropTypes.func.isRequired,
};

export default RequestListItem;
