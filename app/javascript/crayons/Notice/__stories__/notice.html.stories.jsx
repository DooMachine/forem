import { h } from 'preact';
import '../../storybook-utilities/designSystem.scss';
import notes from './notices.md';

export default {
  title: '3_Components/Notices/HTML',
  parameters: { notes },
};

export const Default = () => (
  <div className="crayons-notice">Bu, Varsayılan Bildirim içeriğidir.</div>
);

Default.story = {
  name: 'default',
};

export const Danger = () => (
  <div className="crayons-notice crayons-notice--danger">
    Bu, Varsayılan Bildirim içeriğidir.
  </div>
);

Danger.story = {
  name: 'danger',
};

export const Warning = () => (
  <div className="crayons-notice crayons-notice--warning">
    Bu, Uyarı Bildirimi içeriğidir.
  </div>
);

Warning.story = {
  name: 'warning',
};

export const Success = () => (
  <div className="crayons-notice crayons-notice--success">
    Bu, Başarı Bildirimi içeriğidir.
  </div>
);

Success.story = {
  name: 'success',
};

export const Info = () => (
  <div className="crayons-notice crayons-notice--info">
    Bu Bilgi Bildirimi içeriğidir.
  </div>
);

Info.story = {
  name: 'info',
};
