import { h } from 'preact';
import PropTypes from 'prop-types';
import { Button } from '@crayons';

const MessageModal = ({
  currentUserId,
  message,
  listing,
  onSubmit,
  onChangeDraftingMessage,
}) => {
  const isCurrentUserOnListing = listing.user_id === currentUserId;

  return (
    <form
      data-testid="listings-message-modal"
      id="listings-message-form"
      onSubmit={onSubmit}
    >
      <header className="mb-4">
        <h2 className="fs-xl fw-bold lh-tight">İlgileniyor musun?</h2>
        {isCurrentUserOnListing ? (
          <p className="color-base-70">
            Bu sizin aktif listenizdir. Herhangi bir üye sizinle bu form aracılığıyla iletişime
            geçebilir.
          </p>
        ) : (
          <p className="color-base-70">{` ${listing.author.name} `} isimli kullanıcıya mesaj at</p>
        )}
      </header>
      <textarea
        value={message}
        onChange={onChangeDraftingMessage}
        data-testid="listing-new-message"
        id="new-message"
        className="crayons-textfield mb-0"
        placeholder="Enter your message here..."
      />
      <p
        className="mb-4 fs-s color-base-60"
      >
        {isCurrentUserOnListing &&
          'Message must be relevant and on-topic with the listing.'}
        Tüm özel etkileşimler <b>mutlaka</b>{' '}
        <a href="/code-of-conduct" className="crayons-link crayons-link--brand">
          Davranış kurallari
        </a>na{' '} uymalidir
        .
      </p>
      <div className="flex">
        <Button
          variant="primary"
          className="mr-2"
          tagName="button"
          type="submit"
        >
          Gönder
        </Button>
      </div>
    </form>
  );
};

MessageModal.propTypes = {
  currentUserId: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  listing: PropTypes.shape({
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChangeDraftingMessage: PropTypes.func.isRequired,
};

export default MessageModal;
