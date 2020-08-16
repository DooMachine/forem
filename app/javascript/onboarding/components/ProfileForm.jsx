import { h, Component } from 'preact';
import PropTypes from 'prop-types';

import { userData, getContentOfToken, updateOnboarding } from '../utilities';
import Navigation from './Navigation';

/* eslint-disable camelcase */
class ProfileForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.user = userData();

    this.state = {
      formValues: {
        summary: '',
        location: '',
        employment_title: '',
        employer_name: '',
      },
      last_onboarding_page: 'v2: personal info form',
      canSkip: true,
    };
  }

  componentDidMount() {
    updateOnboarding('v2: personal info form');
  }

  onSubmit() {
    const csrfToken = getContentOfToken('csrf-token');
    const { formValues, last_onboarding_page } = this.state;
    fetch('/onboarding_update', {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { ...formValues, last_onboarding_page } }),
      credentials: 'same-origin',
    }).then((response) => {
      if (response.ok) {
        const { next } = this.props;
        next();
      }
    });
  }

  handleChange(e) {
    const { formValues } = { ...this.state };
    const currentFormState = formValues;
    const { name, value } = e.target;

    currentFormState[name] = value;

    // Once we've derived the new form values, check if the form is empty
    // and use that value to set the `canSkip` property on the state.
    const formIsEmpty =
      Object.values(currentFormState).filter((v) => v.length > 0).length === 0;

    this.setState({ formValues: currentFormState, canSkip: formIsEmpty });
  }

  render() {
    const {
      prev,
      slidesCount,
      currentSlideIndex,
      communityConfig,
    } = this.props;
    const { profile_image_90, username, name } = this.user;
    const { canSkip } = this.state;

    return (
      <div
        data-testid="onboarding-profile-form"
        className="onboarding-main crayons-modal"
      >
        <div className="crayons-modal__box">
          <Navigation
            prev={prev}
            next={this.onSubmit}
            canSkip={canSkip}
            slidesCount={slidesCount}
            currentSlideIndex={currentSlideIndex}
          />
          <div className="onboarding-content about">
            <header className="onboarding-content-header">
              <h1 className="title">Profilinizi oluşturun</h1>
              <h2
                data-testid="onboarding-profile-subtitle"
                className="subtitle"
              >
                Bize biraz kendinden bahset — {communityConfig.communityName} 
                kullanıcıları seni böyle görecek. Bunu daha sonra
                her zaman ayarlarınızdan düzenleyebileceksiniz.
                
              </h2>
            </header>
            <div className="current-user-info">
              <figure className="current-user-avatar-container">
                <img
                  className="current-user-avatar"
                  alt="profile"
                  src={profile_image_90}
                />
              </figure>
              <h3>{name}</h3>
              <p>{username}</p>
            </div>
            <form>
              <label htmlFor="summary">
                Bio
                <textarea
                  name="summary"
                  id="summary"
                  placeholder="Tell us about yourself"
                  onChange={this.handleChange}
                  maxLength="120"
                />
              </label>
              <label htmlFor="location">
                Bulunduğun yer neresi?
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g. New York, NY"
                  onChange={this.handleChange}
                  maxLength="60"
                />
              </label>
              <label htmlFor="employment_title">
                Mesleğin?
                <input
                  type="text"
                  name="employment_title"
                  id="employment_title"
                  placeholder="e.g. Software Engineer"
                  onChange={this.handleChange}
                  maxLength="60"
                />
              </label>
              <label htmlFor="employer_name">
                Nerede çalışıyorsun?
                <input
                  type="text"
                  name="employer_name"
                  id="employer_name"
                  placeholder="e.g. Şirket ismi, serbest çalışan, girişimci, etc."
                  onChange={this.handleChange}
                  maxLength="60"
                  className="onboarding-form-input--last"
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  slidesCount: PropTypes.number.isRequired,
  currentSlideIndex: PropTypes.func.isRequired,
  communityConfig: PropTypes.shape({
    communityName: PropTypes.string.isRequired,
    communityDescription: PropTypes.string.isRequired,
  }),
};

export default ProfileForm;

/* eslint-enable camelcase */
