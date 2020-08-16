import { h } from 'preact';
import PropsType from 'prop-types';
import { Button } from '@crayons';

const LeaveMembershipSection = ({
  handleleaveChannelMembership,
  currentMembershipRole,
}) => {
  if (currentMembershipRole === 'mod') {
    return null;
  }

  return (
    <div className="crayons-card p-4 grid gap-2 mb-4 leave_membership_section">
      <h3>Tehlikeli bölge</h3>
      <div>
        <Button
          className="leave_button"
          variant="danger"
          type="submit"
          onClick={handleleaveChannelMembership}
        >
          Kanaldan Ayrıl
        </Button>
      </div>
    </div>
  );
};

LeaveMembershipSection.propTypes = {
  handleleaveChannelMembership: PropsType.func.isRequired,
};

export default LeaveMembershipSection;
