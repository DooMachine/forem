/* eslint-disable no-alert */

export default function initBlock() {
  const blockButton = document.getElementById(
    'user-profile-dropdownmenu-block-button',
  );
  if (!blockButton) {
    // button not always present when this is called
    return;
  }
  const { profileUserId } = blockButton.dataset;

  function unblock() {
    fetch(`/user_blocks/${profileUserId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_block: {
          blocked_id: profileUserId,
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result === 'unblocked') {
          blockButton.innerText = 'Block';
          /* eslint-disable-next-line no-use-before-define */
          blockButton.addEventListener('click', block, { once: true });
        } else if (response.status === 422) {
          window.alert(
            `Bir şeyler ters gitti: ${response.error} -- Tekrar denemek için lütfen sayfayı yenileyin.`,
          );
        }
      })
      .catch((e) => {
        window.alert(
          `Bir şeyler ters gitti: ${e}. -- Tekrar denemek için lütfen sayfayı yenileyin.`,
        );
      });
  }

  function block() {
    const confirmBlock = window.confirm(
      `Bu kişiyi engellemek istediğinize emin misiniz? Bu şekilde:
      - gönderilerinize yorum yapmaların engellencek
      - gelen tüm bildirimleri engellenecek
      - sana mesaj göndermesini engellenecek`,
    );
    if (confirmBlock) {
      fetch(`/user_blocks`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token': window.csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_block: {
            blocked_id: profileUserId,
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.result === 'blocked') {
            blockButton.innerText = 'Unblock';
            blockButton.addEventListener('click', unblock, { once: true });
          } else if (response.status === 422) {
            window.alert(
              `Bir şeyler ters gitti: ${response.error}. -- Tekrar denemek için lütfen sayfayı yenileyin.`,
            );
          }
        })
        .catch((e) => {
          window.alert(
            `Bir şeyler ters gitti: ${e}. -- Tekrar denemek için lütfen sayfayı yenileyin.`,
          );
        });
    } else {
      blockButton.addEventListener('click', block, { once: true });
    }
  }

  // userData() is a global function
  /* eslint-disable-next-line no-undef */
  const user = userData();
  if (!user) {
    return;
  }

  if (user.id === parseInt(profileUserId, 10)) {
    blockButton.style.display = 'none';
  } else {
    fetch(`/user_blocks/${profileUserId}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.result === 'blocking') {
          blockButton.innerText = 'Unblock';
          blockButton.addEventListener('click', unblock, { once: true });
        } else {
          blockButton.addEventListener('click', block, { once: true });
        }
      });
  }
}

/* eslint-enable no-alert */
