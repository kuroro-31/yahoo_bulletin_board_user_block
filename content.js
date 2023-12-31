// ページがロードされたときにブロックリストを確認して投稿を非表示にする関数
function hideBlockedUsers() {
  let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  blockedUsers.forEach((username) => {
    let posts = document.querySelectorAll(
      `p.comWriter a[data-user="${username}"]`
    );
    posts.forEach((post) => {
      let parentLi = post.closest("li");
      if (parentLi) {
        parentLi.remove();
      }
    });
  });
}

// ブロックボタンをクリックしたときの動作
function blockUser(event) {
  console.log("Block button clicked!"); // この行を追加
  let username = event.target.getAttribute("data-block-user");
  console.log("Username to block:", username); // この行を追加

  let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  if (!blockedUsers.includes(username)) {
    blockedUsers.push(username);
    localStorage.setItem("blockedUsers", JSON.stringify(blockedUsers));
    hideBlockedUsers();
  }
}

// 各投稿にブロックボタンを追加する関数
function addBlockButtons() {
  let posts = document.querySelectorAll(
    "p.comWriter a[data-user]:not([data-block-button-added])"
  );
  posts.forEach((post) => {
    let username = post.getAttribute("data-user");
    if (!username) return; // data-userがない場合はスキップ
    let blockButton = document.createElement("button");
    blockButton.textContent = "ブロック";
    blockButton.setAttribute("data-block-user", username);
    blockButton.classList.add("block-btn"); // block-btnクラスを追加
    blockButton.addEventListener("click", blockUser);
    post.parentNode.insertBefore(blockButton, post.nextSibling);
    post.setAttribute("data-block-button-added", "true");
  });
}

function triggerScrollEvent() {
  window.dispatchEvent(new Event("scroll"));
}

// MutationObserverのコールバック関数
function observeMutations(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      addBlockButtons(); // ブロックボタンを新しい投稿に追加
      hideBlockedUsers(); // 新しい投稿に対してブロックユーザーを非表示にする
    }
  }
}

// MutationObserverの初期化
function initialize() {
  // 初期化
  hideBlockedUsers();
  addBlockButtons();

  // ここでtriggerScrollEventを呼び出す
  // スクロールで新しい投稿が読み込まれない不具合の修正
  setInterval(triggerScrollEvent, 1000);

  // MutationObserverの初期化
  let targetNode = document.body; // ページ全体を監視対象とする
  let config = { attributes: false, childList: true, subtree: true }; // subtreeをtrueに変更
  let observer = new MutationObserver(observeMutations);
  observer.observe(targetNode, config);
}

window.onload = function () {
  initialize();
};
