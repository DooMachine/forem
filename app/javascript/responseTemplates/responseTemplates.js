/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */

function toggleTemplateTypeButton(form, e) {
  const { targetType } = e.target.dataset;
  const activeType = targetType === 'personal' ? 'moderator' : 'personal';
  e.target.classList.toggle('active');
  form
    .querySelector(`.${activeType}-template-button`)
    .classList.toggle('active');
  form
    .querySelector(`.${targetType}-responses-container`)
    .classList.toggle('hidden');
  form
    .querySelector(`.${activeType}-responses-container`)
    .classList.toggle('hidden');
}

const noResponsesHTML = `
<div class="mod-response-wrapper mod-response-wrapper-empty">
  <p>🤔... Görünüşe göre henüz şablonunuz yok.</p>
</div>
`;

function buildHTML(response, typeOf) {
  if (response.length === 0 && typeOf === 'personal_comment') {
    return noResponsesHTML;
  }
  if (typeOf === 'personal_comment') {
    return response
      .map((obj) => {
        return `
          <div class="mod-response-wrapper">
            <span>${obj.title}</span>
            <p>${obj.content}</p>
            <button class="insert-template-button" type="button" data-content="${obj.content}">EKLE</button>
          </div>
        `;
      })
      .join('');
  }
  if (typeOf === 'mod_comment') {
    return response
      .map((obj) => {
        return `
            <div class="mod-response-wrapper">
              <span>${obj.title}</span>
              <p>${obj.content}</p>
              <button class="insert-template-button" type="button" data-content="${obj.content}">EKLE</button>
              <button class="moderator-submit-button" type="submit" data-response-template-id="${obj.id}">MOD OLARAK GÖNDER</button>
            </div>
          `;
      })
      .join('');
  }
  return `Error 😞`;
}

function submitAsModerator(responseTemplateId, parentId) {
  const commentableId = document.querySelector('input#comment_commentable_id')
    .value;

  fetch(`/comments/moderator_create`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': window.csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response_template: {
        id: responseTemplateId,
      },
      comment: {
        body_markdown: '',
        commentable_id: commentableId,
        commentable_type: 'Article',
        parent_id: parentId,
      },
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === 'created') {
        window.location.pathname = response.path;
      } else if (response.status === 'comment already exists') {
        alert('This comment already exists.');
      } else if (response.error === 'error') {
        alert(
          `Bu yorumu gönderirken bir sorun oluştu: ${response.status}`,
        );
      }
    });
}

const confirmMsg = `
Bu yorumu Sloan olarak göndermek istediğinizden emin misiniz??

Hemen gönderilecek ve kullanıcılar bilgilendirilecektir..

Durum için uygun yorum olduğundan emin olun.

Bu eylem geri alınamaz.`;

function addClickListeners(form) {
  const responsesContainer = form.querySelector(
    '.response-templates-container',
  );
  const parentCommentId =
    form.id !== 'new_comment'
      ? form.querySelector('input#comment_parent_id').value
      : null;
  const insertButtons = Array.from(
    responsesContainer.getElementsByClassName('insert-template-button'),
  );
  const moderatorSubmitButtons = Array.from(
    responsesContainer.getElementsByClassName('moderator-submit-button'),
  );

  insertButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { content } = e.target.dataset;
      const textArea = form.querySelector('textarea');
      const textAreaReplaceable =
        textArea.value === null ||
        textArea.value === '' ||
        confirm('Mevcut yorum taslağınızı değiştirmek istediğinizden emin misiniz??');

      if (textAreaReplaceable) {
        textArea.value = content;
        responsesContainer.classList.toggle('hidden');
      }
    });
  });

  moderatorSubmitButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      if (confirm(confirmMsg)) {
        submitAsModerator(e.target.dataset.responseTemplateId, parentCommentId);
      }
    });
  });
}

function fetchResponseTemplates(typeOf, formId) {
  const form = document.getElementById(formId);
  let dataContainer;
  if (typeOf === 'personal_comment') {
    dataContainer = form.querySelector('.personal-responses-container');
  } else if (typeOf === 'mod_comment') {
    dataContainer = form.querySelector('.moderator-responses-container');
  }
  /* eslint-disable-next-line no-undef */
  fetch(`/response_templates?type_of=${typeOf}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': window.csrfToken,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      form.querySelector('img.loading-img').classList.toggle('hidden');
      dataContainer.innerHTML = buildHTML(response, typeOf);
      const topLevelData = document.getElementById('response-templates-data');
      topLevelData.innerHTML = dataContainer.parentElement.innerHTML;
      addClickListeners(form);
    });
}

function prepareHeaderButtons(form) {
  const personalTemplateButton = form.querySelector(
    '.personal-template-button',
  );
  const modTemplateButton = form.querySelector('.moderator-template-button');

  personalTemplateButton.addEventListener('click', (e) => {
    toggleTemplateTypeButton(form, e);
  });
  modTemplateButton.addEventListener('click', (e) => {
    toggleTemplateTypeButton(form, e);
  });
  modTemplateButton.classList.remove('hidden');

  modTemplateButton.addEventListener(
    'click',
    () => {
      const topLevelData = document.getElementById('response-templates-data');
      const modDataNotFetched =
        topLevelData.innerHTML !== ''
          ? topLevelData.querySelector('.moderator-responses-container')
              .childElementCount === 0
          : false;
      if (modDataNotFetched) {
        form.querySelector('img.loading-img').classList.toggle('hidden');
        fetchResponseTemplates('mod_comment', form.id);
      }
    },
    { once: true },
  );
}

function copyData(responsesContainer) {
  responsesContainer.innerHTML = document.getElementById(
    'response-templates-data',
  ).innerHTML;
}

function loadData(form) {
  form.querySelector('img.loading-img').classList.toggle('hidden');
  fetchResponseTemplates('personal_comment', form.id);
}

function openButtonCallback(form) {
  const responsesContainer = form.querySelector(
    '.response-templates-container',
  );
  const dataFetched =
    document.getElementById('response-templates-data').innerHTML !== '';

  responsesContainer.classList.toggle('hidden');

  const containerHidden = responsesContainer.classList.contains('hidden');

  if (dataFetched && !containerHidden) {
    copyData(responsesContainer);
    addClickListeners(form);
  } else if (!dataFetched && !containerHidden) {
    loadData(form)
  }
  /* eslint-disable-next-line no-undef */
  if (userData().moderator_for_tags.length > 0) {
    prepareHeaderButtons(form);
  } else {
    form.querySelector('.personal-template-button').classList.add('hidden');
  }
}

function prepareOpenButton(form) {
  const button = form.querySelector('.response-templates-button');
  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    openButtonCallback(form);
  });

  button.dataset.hasListener = "true";
}

function observeForReplyClick() {
  const config = { childList: true, subtree: true };

  const callback = (mutations) => {
    const form = mutations[0].addedNodes[0];
    if (form.nodeName === 'FORM') {
      prepareOpenButton(form);
    }
  };

  const observer = new MutationObserver(callback);

  const commentTree = document.getElementById('comment-trees-container');
  observer.observe(commentTree, config);

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });

  window.InstantClick.on('change', () => {
    observer.disconnect();
  });
}

function handleLoggedOut() {
  // global method from app/assets/javascripts/utilities/showModal.js
  /* eslint-disable-next-line no-undef */
  document.querySelector('.response-templates-button')?.addEventListener('click', showModal);
}
/* eslint-enable no-alert */
/* eslint-enable no-restricted-globals */

export function loadResponseTemplates() {
  const { userStatus } = document.body.dataset;
  const form = document.getElementById('new_comment');

  if (document.getElementById('response-templates-data')) {
    if (userStatus === 'logged-out') {
      handleLoggedOut();
    }
    if (
      form &&
      form.querySelector('.response-templates-button').dataset.hasListener === 'false'
    ) {
      prepareOpenButton(form);
    }
    observeForReplyClick();
  }
}
