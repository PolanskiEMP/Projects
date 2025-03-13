// ==UserScript==
// @name         EMP Comment Mod Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Assists with comment/post moderation
// @author       Polanski
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @match        https://www.empornium.is/collage/*
// @match        https://www.empornium.is/forum/thread/*
// @match        https://www.empornium.is/requests.php*
// @match        https://www.empornium.is/torrents.php*
// @match        https://emp.beta.pervwerks.de/collage/*
// @match        https://emp.beta.pervwerks.de/forum/thread/*
// @match        https://emp.beta.pervwerks.de/requests.php*
// @match        https://emp.beta.pervwerks.de/torrents.php?id=*
// @downloadURL  https://raw.githubusercontent.com/PolanskiEMP/EMP%20Comment%20Mod%20Helper/EMP%20Comment%20Mod%20Helper.js
// @updateURL    https://raw.githubusercontent.com/PolanskiEMP/EMP%20Comment%20Mod%20Helper/EMP%20Comment%20Mod%20Helper.js
// @grant        GM_getResourceText
// @resource     modHelperHtml https://raw.githubusercontent.com/PolanskiEMP/FLS-checker-for-EMP/dev/main-menu/main-menu-html.html
// @resource     staffPMHtml https://raw.githubusercontent.com/PolanskiEMP/FLS-checker-for-EMP/dev/sandbox/sandbox-html.html
// @require      https://raw.githubusercontent.com/PolanskiEMP/FLS-checker-for-EMP/dev/main.js
// ==/UserScript==

const section = GetSection().name;
const editButtons =
  section == "requests"
    ? document.querySelectorAll("a[onclick^='Edit_Form']")
    : document.querySelectorAll("button[title='edit this post']");

for (const editButton of editButtons) {
  const post = editButton.closest("table");
  editButton.addEventListener("click", function () {
    modHelper(post);
  });
}

function modHelper(post) {
  setTimeout(function () {
    insertHelper(post);
  }, 750);
}

function insertHelper(post) {
  var replies = [];
  const url = post.querySelector("a[class='post_id']").href;
  const modHelper = document.createElement("div");
  let modHelperHtml = GM_getResourceText("modHelperHtml");
  modHelper.innerHTML = modHelperHtml;

  const staffPM = document.createElement("div");
  let staffPMHtml = GM_getResourceText("staffPMHtml");
  staffPM.innerHTML = staffPMHtml;

  const postEditor = post.querySelector("div[id^='editcont']");
  postEditor.insertBefore(modHelper, postEditor.firstChild);
  postEditor.appendChild(staffPM);

  const editBox = post.querySelector("textarea[id^='editbox']");
  const userPost = editBox.value;
  const staffPMBox = post.querySelector("textarea[id='staffPMbox']");
  staffPMBox.value = userPost;

  const boxes = post.querySelectorAll("input[type='checkbox']");
  for (const box of boxes) {
    box.addEventListener("click", () => setMessage(box));
  }

  const lines = post.querySelector("a[id='lines']");
  lines.addEventListener("click", () => commonAnswers(post));

  function setMessage(box) {
    const reason = modReasons.find((reason) => reason.id == box.id);

    if (box.checked && reason != undefined) {
      replies.push(reason);
    } else {
      replies = replies.filter((reply) => reply.id != box.id);
    }
    populateTextbox(box);
  }

  function populateTextbox(box) {
    const updatedUserPost = userPost + "\n\n";
    const recidivist = post.querySelector("input[id='recidivist']");
    const editpost = post.querySelector("input[id='editpost']");
    editBox.value = updatedUserPost;

    generateStaffPM(userPost);

    for (const reply of replies) {
      editBox.value += reply.text;
      editBox.value += "\n\n";
      staffPMBox.value += reply.staffPM;
      staffPMBox.value += "\n\n";
    }

    if (box.id == "sendstaffPM") {
      showStaffPM(post);
    }

    if (recidivist.checked) {
      staffPMBox.value += "[b]You have been told this before.[/b]";
    } else {
      const checkboxes = modHelper
        .querySelector("div[id^=checkboxes]")
        .querySelectorAll("input[type=checkbox]");

      for (const checkbox of checkboxes) {
        if (checkbox.checked) {
          staffPMBox.value += "Thank you.";
          break;
        }
      }
    }

    if (editpost.checked) {
      editBox.value = editBox.value.replace(updatedUserPost, "");
    }

    editBox.style.height = "auto";
    editBox.style.height = `${editBox.scrollHeight}px`;
    staffPMBox.style.height = "auto";
    staffPMBox.style.height = `${staffPMBox.scrollHeight}px`;
  }

  function showStaffPM() {
    const staffPM = post.querySelector("div[id='staffPM']");
    const sendstaffPM = post.querySelector("input[id='sendstaffPM']");

    sendstaffPM.checked
      ? (staffPM.style.display = "block")
      : (staffPM.style.display = "none");
  }

  function generateStaffPM(userPost) {
    const user = post.querySelector("a[href^='/user.php']").innerText.trim();
    const type = section.slice(0, 1);
    const sectionIDregex = /\b\d+\b/;
    const postIDregex = /#post\s*(\d+)/;
    const sectionID = url.match(sectionIDregex);
    const commentID = url.match(postIDregex)[1];

    const quote = `${url}\n\n[quote=${user},${type}${sectionID},${commentID}]${userPost}[/quote]\n\n`;
    staffPMBox.value = quote;
    generateStaffPMTitle(section);
  }

  function generateStaffPMTitle() {
    var title = "";
    const reasons = replies.map((reply) => reply.title).join(", ");
    const staffPMTitleBox = post.querySelector("[id='staffPMTitleBox']");

    reasons.length > 0
      ? (title = "Your recent " + titleType(section) + ` (${reasons})`)
      : (title = "Your recent " + titleType(section));

    staffPMTitleBox.value = title;
  }

  function titleType(section) {
    switch (section) {
      case "collage":
        return "collage comment";
      case "forum":
        return "forum post";
      case "requests":
        return "request comment";
      case "torrents":
        return "torrent comment";
      default:
        return "comment";
    }
  }
}

function commonAnswers(post) {
  const answers = post.querySelector("div[id='comments']");
  const lines = post.querySelector("a[id='lines'");

  if (answers.style.display == "none") {
      answers.style = "display: flex; justify-content: space-around";
      lines.innerText = "Hide common replies";
  } else {
      answers.style = "display: none; margin-top: 10px";
      lines.innerText = "Show common replies";
  }
}

/* TODO:
  1. Include a common lines section to be inserted at the cursor position
  2. Add staffPM POST capability
  3. Fix design
  4. Find how to insert the Helper without resorting to setTimeouts
  5. Add tooltips to the checkboxes
  6. All replies should share a single mcom
  7. Change resource links once uploaded to the hub
*/