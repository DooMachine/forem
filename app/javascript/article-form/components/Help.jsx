import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import { Modal } from '@crayons';

export class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liquidHelpHTML:
        document.getElementById('editor-liquid-help') &&
        document.getElementById('editor-liquid-help').innerHTML,
      markdownHelpHTML:
        document.getElementById('editor-markdown-help') &&
        document.getElementById('editor-markdown-help').innerHTML,
      frontmatterHelpHTML:
        document.getElementById('editor-frontmatter-help') &&
        document.getElementById('editor-frontmatter-help').innerHTML,
    };
  }

  setCommonProps = ({
    liquidShowing = false,
    markdownShowing = false,
    frontmatterShowing = false,
  }) => {
    return {
      liquidShowing,
      markdownShowing,
      frontmatterShowing,
    };
  };

  toggleModal = (varShowing) => (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...this.setCommonProps({
        [varShowing]: !prevState[varShowing],
      }),
    }));
  };

  renderArticleFormTitleHelp = () => {
    return (
      <div
        data-testid="title-help"
        className="crayons-article-form__help crayons-article-form__help--title"
      >
        <h4 className="mb-2 fs-l">Buraya güzel bir başlık yaz!</h4>
        <ul className="list-disc pl-6 color-base-70">
          <li>
            Gönderi başlığınızı kısa (ama ikna edici!) bir açıklama,
            tek bir kısa metin ile bütün gönderiye kuşbakışı olaracak 
            şekilde yazın.
          </li>
          <li>
            İnsanların arama ile bulabilecekleri kelimeleri kullanmaya dikkat edin.
          </li>
        </ul>
      </div>
    );
  };

  renderTagInputHelp = () => {
    return (
      <div
        data-testid="basic-tag-input-help"
        className="crayons-article-form__help crayons-article-form__help--tags"
      >
        <h4 className="mb-2 fs-l">Etiketleme rehberi</h4>
        <ul className="list-disc pl-6 color-base-70">
          <li>Etiketler, kullanıcıların gönderinizi bulmasına yardımcı olur.</li>
          <li>
            Etiketleri, gönderinizi en iyi tanımlayan konular veya kategoriler olarak düşünün.            
          </li>
          <li>
            Gönderi başına dörde kadar etiket ekleyin. Uygun alt topluluklara ulaşmak için etiketleri birleştirin.
          </li>
          <li>Mümkün olduğunda mevcut etiketleri kullanın.</li>
          <li>
            "Yardım" veya "sağlık davası" gibi bazı etiketlerin özel gönderme yöntemleri vardır.
          </li>
        </ul>
      </div>
    );
  };

  renderBasicEditorHelp = () => {
    return (
      <div
        data-testid="basic-editor-help"
        className="crayons-card crayons-card--secondary p-4 mb-6"
      >
        Şu anda kullanan temel markdown düzenleyicisini kullanıyorsunuz{' '}
        <a href="#frontmatter" onClick={this.toggleModal('frontmatterShowing')}>
          Jekyll front matter
        </a>
        .Ayrıca{' '} 
        <a href="/settings/ux">
          UX ayarlarında
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="crayons-icon"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="c038a36b2512ed25db907e179ab45cfc"
          >
            <title id="c038a36b2512ed25db907e179ab45cfc">
              UX ayarlarını aç
            </title>
            <path d="M10.667 8v1.333H7.333v7.334h7.334v-3.334H16v4a.666.666 0 01-.667.667H6.667A.666.666 0 016 17.333V8.667A.667.667 0 016.667 8h4zM18 6v5.333h-1.333V8.275l-5.196 5.196-.942-.942 5.194-5.196h-3.056V6H18z" />
          </svg>
        </a> bulabileceğiniz <em> zengin + markdown </em> düzenleyicisini de kullanabilirsiniz.
        
        .
      </div>
    );
  };

  renderFormatHelp = () => {
    return (
      <div
        data-testid="format-help"
        className="crayons-article-form__help crayons-article-form__help--body"
      >
        <h4 className="mb-2 fs-l">Editor Temelleri</h4>
        <ul className="list-disc pl-6 color-base-70">
          <li>
            <a href="#markdown" onClick={this.toggleModal('markdownShowing')}>
              Markdown
            </a>{' '}
            ile gönderilerinizi yazarak formatlayabilirsiniz.
            <details className="fs-s my-1">
              <summary class="cursor-pointer">Yaygın olarak kullanılan sözdizimleri</summary>
              <table className="crayons-card crayons-card--secondary crayons-table crayons-table--compact w-100 mt-2 mb-4 lh-tight">
                <tbody>
                  <tr>
                    <td className="ff-accent">
                      # Header
                      <br />
                      ...
                      <br />
                      ###### Header
                    </td>
                    <td>
                      H1 Header
                      <br />
                      ...
                      <br />
                      H6 Header
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">*italics* or _italics_</td>
                    <td>
                      <em>italics</em>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">**bold**</td>
                    <td>
                      <strong>bold</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">[Link](https://...)</td>
                    <td>
                      <a href="https://forem.com">Link</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">
                      * item 1<br />* item 2
                    </td>
                    <td>
                      <ul class="list-disc ml-5">
                        <li>item 1</li>
                        <li>item 2</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">
                      1. item 1<br />
                      2. item 2
                    </td>
                    <td>
                      <ul class="list-decimal ml-5">
                        <li>item 1</li>
                        <li>item 2</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">&gt; quoted text</td>
                    <td>
                      <span className="pl-2 border-0 border-solid border-l-4 border-base-50">
                        quoted text
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">`inline code`</td>
                    <td>
                      <code>inline code</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="ff-accent">
                      <span class="fs-xs">```</span>
                      <br />
                      code block
                      <br />
                      <span class="fs-xs">```</span>
                    </td>
                    <td>
                      <div class="highlight p-2 overflow-hidden">
                        <code>code block</code>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </details>
          </li>
          <li>
            <a href="#liquid" onClick={this.toggleModal('liquidShowing')}>
              Liquid tagları
            </a>{' '}
            kullanarak Tweet, Youtube videosu vb. ekleyebilirsiniz.
          </li>
        </ul>
      </div>
    );
  };

  renderModal = (onClose, title, helpHtml) => {
    return (
      <Modal onClose={onClose} title={title}>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: helpHtml }}
        />
      </Modal>
    );
  };

  render() {
    const { previewShowing, helpFor, helpPosition, version } = this.props;

    const {
      liquidHelpHTML,
      markdownHelpHTML,
      frontmatterHelpHTML,
      liquidShowing,
      markdownShowing,
      frontmatterShowing,
    } = this.state;

    return (
      <div className="crayons-article-form__aside">
        {!previewShowing && (
          <div
            data-testid="article-form__help-section"
            className="sticky"
            style={{ top: version === 'v1' ? '56px' : helpPosition }}
          >
            {helpFor === 'article-form-title' &&
              this.renderArticleFormTitleHelp()}
            {helpFor === 'tag-input' && this.renderTagInputHelp()}
            {version === 'v1' && this.renderBasicEditorHelp()}
            {(helpFor === 'article_body_markdown' || version === 'v1') &&
              this.renderFormatHelp()}
          </div>
        )}

        {liquidShowing &&
          this.renderModal(
            this.toggleModal('liquidShowing'),
            '🌊 Liquid Tagları',
            liquidHelpHTML,
          )}

        {markdownShowing &&
          this.renderModal(
            this.toggleModal('markdownShowing'),
            '✍️ Markdown',
            markdownHelpHTML,
          )}

        {frontmatterShowing &&
          this.renderModal(
            this.toggleModal('frontmatterShowing'),
            'Jekyll Front Matter',
            frontmatterHelpHTML,
          )}
      </div>
    );
  }
}

Help.propTypes = {
  previewShowing: PropTypes.bool.isRequired,
  helpFor: PropTypes.string.isRequired,
  helpPosition: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

Help.displayName = 'Yardım';
