// ページがロードされたときにブロックリストを確認して投稿を非表示にする関数
function hideBlockedUsers() {
  let blockedUsers = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  blockedUsers.forEach((username) => {
    let posts = document.querySelectorAll(
      `p.comWriter a[data-user="${username}"]`
    );
    posts.forEach((post) => {
      post.closest("li").style.display = "none";
    });
  });
}

// ブロックボタンをクリックしたときの動作
function blockUser(event) {
  let username = event.target.getAttribute("data-block-user");
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
    "p.comWriter a:not([data-block-button-added])"
  );
  posts.forEach((post) => {
    let username = post.getAttribute("data-user");
    let blockButton = document.createElement("button");
    blockButton.textContent = "ブロック";
    blockButton.setAttribute("data-block-user", username);
    blockButton.addEventListener("click", blockUser);
    post.parentNode.insertBefore(blockButton, post.nextSibling);
    post.setAttribute("data-block-button-added", "true");
  });
}

// MutationObserverのコールバック関数
function observeMutations(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (let addedNode of mutation.addedNodes) {
        if (addedNode.nodeName === "LI") {
          addBlockButtons();
        }
      }
    }
  }
}

// MutationObserverの初期化
let targetNode = document.querySelector("#cmtlst ul");
let config = { attributes: false, childList: true, subtree: false };
let observer = new MutationObserver(observeMutations);
observer.observe(targetNode, config);

// 初期化
hideBlockedUsers();
addBlockButtons();
