import { h } from 'preact';
import '../../../storybook-utilities/designSystem.scss';
import notes from './main-navigation.md';

export default {
  title: '3_Components/Navigation/Main Navigation/HTML',
  parameters: { notes },
};

export const Default = () => (
  <div className="p-6 bg-smoke-10">
    <a href="/" className="crayons-nav-block crayons-nav-block--current">
      <span className="crayons-icon" role="img" aria-label="Anasayfa">
        🏡
      </span>
      Anasayfa
    </a>
    <a href="/" className="crayons-nav-block">
      <span className="crayons-icon" role="img" aria-label="Podcastler">
        📻
      </span>
      Podcastler
    </a>
    <a href="/" className="crayons-nav-block">
      <span className="crayons-icon" role="img" aria-label="Etiketler">
        🏷
      </span>
      Etiketler
    </a>
    <a href="/" className="crayons-nav-block">
      <span className="crayons-icon" role="img" aria-label="İlanlar">
        📑
      </span>
      İlanlar
      <span className="crayons-indicator">3</span>
    </a>
    <a href="/" className="crayons-nav-block">
      <span className="crayons-icon" role="img" aria-label="Davranış kuralları">
        👍
      </span>
      Davranış kuralları
    </a>
    <a href="/" className="crayons-nav-block crayons-nav-block--indented">
      Daha...
    </a>
  </div>
);

Default.story = {
  name: 'default',
};
