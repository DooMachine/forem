import { h } from 'preact';
import '../../../storybook-utilities/designSystem.scss';
import notes from './navigation-tab.md';

export default {
  title: '3_Components/Navigation/Tabs/HTML',
  parameters: { notes },
};

export const Default = () => (
  <div className="crayons-tabs">
    <a href="/" className="crayons-tabs__item crayons-tabs__item--current">
      Feed
    </a>
    <a href="/" className="crayons-tabs__item">
      Popüler
    </a>
    <a href="/" className="crayons-tabs__item">
      En son
    </a>
  </div>
);

Default.story = {
  name: 'default',
};
