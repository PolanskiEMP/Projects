// ==UserScript==
// @name         EMP Dupe Report Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds functionality to System Dupe Reports
// @author       Polanski
// @match        https://www.empornium.is/staffpm.php?action=viewconv&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @downloadURL  https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20Dupe%20Report%20Enhancer/EMP%20Dupe%20Report%20Enhancer.js
// @updateURL    https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20Dupe%20Report%20Enhancer/EMP%20Dupe%20Report%20Enhancer.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Minimum number of seeds for a torrent to be considered seeded
  const minSeeds = 3;

  // Detect if the staffPM is a system dupe report
  const reportTitle = document.getElementsByTagName("h2")[0];
  if (
    !reportTitle ||
    !reportTitle.innerText.includes("Staff PM - Possible dupe was uploaded:")
  ) {
    console.log("This is not a dupe report!");
    return false;
  }
  console.log("Dupe report detected!");

  const torrents = document.querySelectorAll("span[id^='url_']");
  const buttons = document.querySelectorAll("input");
  const resolveButton = buttons[buttons.length - 1];

  // Create floating header
  const contentDiv = document.querySelector("div[class='post_content']");
  const dupeTotals = document.querySelectorAll("table")[1];
  const floatingDiv = document.createElement("div");
  const checkTable = document.createElement("table");
  const checkTableBody = document.createElement("tbody");
  const newRow = checkTableBody.insertRow(-1);
  const checkAllCell = newRow.insertCell(0);
  const checkUnseededCell = newRow.insertCell(1);
  const checkMismatchedCell = newRow.insertCell(2);
  const newDiv = document.createElement("div");
  const newResolveButton = resolveButton.cloneNode(true);

  // Move all required elements to the floating header
  let elements = [];
  for (let i = 0; i < 12; i++) {
    elements.push(contentDiv.childNodes[i]);
  }
  contentDiv.insertBefore(floatingDiv, contentDiv.firstChild);
  for (const element of elements) {
    floatingDiv.appendChild(element);
  }
  dupeTotals.after(checkTable);
  checkTable.appendChild(checkTableBody);
  newDiv.appendChild(newResolveButton);
  floatingDiv.insertBefore(newDiv, checkTable.nextElementSibling.nextElementSibling);

  // CSS
  document.querySelector("div[id='content']").style =
    "overflow: unset !important";
  floatingDiv.className = "box";
  floatingDiv.id = "floating_header";
  floatingDiv.style = "position: sticky; top: 0; border: 0px";
  newDiv.style = "display: flex";
  newResolveButton.style = "margin: auto";
  newResolveButton.setAttribute("form", "messageform");
  checkTable.className = "bbcode";
  checkTable.id = "check_table";
  checkAllCell.className = "bbcode";
  checkAllCell.style = "width:33%";
  checkAllCell.innerHTML =
    "<div style='text-align:center ;margin-right: auto; margin-left: auto;'><span class='size3'>Check all  </span><input type='checkbox' id='check_all' name='check_all' checked></div>";
  checkUnseededCell.className = "bbcode";
  checkUnseededCell.style = "width:33%";
  checkMismatchedCell.className = "bbcode";
  checkMismatchedCell.style = "width:33%";

  if (detectUnseeded()) {
    checkUnseededCell.innerHTML =
      "<div style='text-align:center;margin-right: auto; margin-left: auto;'><span class='size3'>Check low-seeded  </span><input type='checkbox' id='check_unseeded' name='check_unseeded' checked></div>";
  } else {
    checkUnseededCell.innerHTML =
      "<div style='text-align:center;margin-right: auto; margin-left: auto;'><span class='size3'>No low-seeded torrents <img class='bbcode smiley' src='static/common/smileys/tick.gif' alt=':gjob:'> </span><input type='checkbox' id='check_unseeded' name='check_unseeded' hidden></div>";
  }
  if (detectMismatched()) {
    checkMismatchedCell.innerHTML =
      "<div style='text-align:center;margin-right: auto; margin-left: auto;'><span class='size3'>Check mismatched  </span><input type='checkbox' id='check_mismatched' name='check_mismatched' checked></div>";
  } else {
    checkMismatchedCell.innerHTML =
      "<div style='text-align:center;margin-right: auto; margin-left: auto;'><span class='size3'>No mismatched files <img class='bbcode smiley' src='static/common/smileys/tick.gif' alt=':gjob:'> </span><input type='checkbox' id='check_mismatched' name='check_mismatched' hidden></div>";
  }

  // Insert new "check all files" boxes in each multi-file torrent table
  const tables = document.querySelectorAll("table[class='bbcode']");
  for (let i = 1; i < tables.length; i++) {
    // Skip torrents with only one file
    if (tables[i].rows.length < 3) continue;

    let newTorrentRow = tables[i].insertRow(1);
    let newCell1 = newTorrentRow.insertCell(0);
    let newCell2 = newTorrentRow.insertCell(1);
    let newCell3 = newTorrentRow.insertCell(2);

    newCell3.className = "bbcode";
    newCell1.style = "width:45%";
    newCell2.style = "width:45%";
    newCell3.style = "width:10%";
    newCell3.innerHTML =
      "<div style='text-align:left;margin-right: auto; margin-left: auto;'><span>Check all  </span><input type='checkbox' id='check_all_files' name='check_all_files' checked style='float:right'></div>";
  }

  // Add event listeners for all boxes
  const checkAllBox = document.getElementById("check_all");
  const checkUnseededBox = document.getElementById("check_unseeded");
  const checkMismatchedBox = document.getElementById("check_mismatched");
  const filecheckBoxes = document.querySelectorAll("input[name^=filecheck_]");
  const checkAllFilesBoxes = document.querySelectorAll(
    "input[id=check_all_files]"
  );
  const allBoxes = document.querySelectorAll("input[type=checkbox]");

  checkAllBox.addEventListener("click", checkAll);
  checkUnseededBox.addEventListener("click", checkUnseeded);
  checkMismatchedBox.addEventListener("click", checkMismatched);

  for (const box of filecheckBoxes) {
    box.addEventListener("click", function () {
      boxClicked(this);
    });
  }

  for (const box of checkAllFilesBoxes) {
    box.addEventListener("click", function () {
      boxClicked(this);
    });
  }

  function checkAll() {
    // Match all files boxes to the "Check all" box
    for (const box of allBoxes) {
      box.checked = checkAllBox.checked;
    }
    RecalculateSize();
  }

  function boxClicked(box) {
    // Select all files within the clicked box torrent
    var dupeChildren = box
      .closest("tbody")
      .querySelectorAll("input[name^=filecheck_]");

    // Select the "Check all" box for the torrent
    var dupeParent = box
      .closest("tbody")
      .querySelector("input[name=check_all_files]");

    // Unticks the "Check all" box if the box was unticked
    if (!box.checked) {
      checkAllBox.checked = box.checked;
    }

    // Clicking a "Check all files" box matches state of all files in the torrent
    if (box.id == "check_all_files") {
      for (let i = 0; i < dupeChildren.length; i++) {
        dupeChildren[i].checked = box.checked;
      }
    }

    // Unticks the "Check all files" box for a torrent if any of its files is unticked
    if (box.name.includes("filecheck_") && dupeParent !== null) {
      if (!box.checked) {
        dupeParent.checked = false;
      }
    }

    // Ticks the "Check all" box if all the torrent files are ticked
    for (let i = 0; i < dupeChildren.length; i++) {
      if (dupeParent !== null) {
        if (!dupeChildren[i].checked) {
          dupeParent.checked = false;
          break;
        }
        dupeParent.checked = true;
      }
    }

    // Unticks the "Check unseeded" box and the torrent's "Check all files" box if any unseeded torrent files is unticked
    if (isUnseeded(box)) {
      if (!box.checked) {
        checkUnseededBox.checked = box.checked;
        if (dupeParent !== null) {
          dupeParent.checked = box.checked;
        }
      }
    }

    isEverythingTicked();
    isEverythingMatched();
    RecalculateSize();
  }

  function checkUnseeded() {
    // Unticks the "Check all" box when unchecking the "Check unseeded" box
    if (!checkUnseededBox.checked) {
      checkAllBox.checked = false;
    }

    for (const torrent of torrents) {
      // Get the number of seeders
      var text = torrent.closest(".size2").nextSibling.textContent; // " (15 Seeders)"
      var seeds = parseInt(text.match(/\d+/g)); // "15"

      // Get all files in the torrent
      var files = torrent
        .closest(".size2")
        .nextElementSibling.nextElementSibling.querySelectorAll("input");

      // If the torrent is unseeded, match the current "Check unseeded" box state
      if (seeds < minSeeds) {
        for (let j = 0; j < files.length; j++) {
          files[j].checked = checkUnseededBox.checked;
        }
      }
    }

    isEverythingTicked();
    isEverythingMatched();
    RecalculateSize();
  }

  function checkMismatched() {
    const fileExtensions = getFileExtensions();
    const oldFiles = document.querySelectorAll("span[id^=oldfile_]");

    for (let i = 0; i < oldFiles.length; i++) {
      let thisFileBox = oldFiles[i].closest("tr").querySelector("input");
      let thisCheckAllFilesBox = oldFiles[i]
        .closest("table")
        .querySelector("input[name=check_all_files]");

      // If any files are mismatched set the file boxes states to match the current "Check mismatched" box state
      if (fileExtensions.old[i] != fileExtensions.new[i]) {
        thisFileBox.checked = checkMismatchedBox.checked;

        // If the torrent has several files match the "Check all files" as well
        if (thisCheckAllFilesBox !== null) {
          thisCheckAllFilesBox.checked = checkMismatchedBox.checked;
        }

        // If the "Check mismatched" box is unticked, untick the "Check all" box
        if (!checkMismatchedBox.checked) {
          checkAllBox.checked = checkMismatchedBox.checked;

          // If the file is also unseeded, untick the "Check unseeded" box
          if (isUnseeded(thisFileBox)) {
            checkUnseededBox.checked = checkMismatchedBox.checked;
          }
        }
      }
    }

    isEverythingTicked();
    RecalculateSize();
  }

  function isUnseeded(box) {
    // refactor this
    // navigate to the torrent above and check if it is unseeded
    var text =
      box.closest("table").previousElementSibling.previousSibling.textContent; // " (15 Seeders)"
    var seeds = parseInt(text.match(/\d+/g)); // "15"
    if (seeds < minSeeds) {
      return true;
    }
    return false;
  }

  // If all files are ticked, tick the summary boxes
  function isEverythingTicked() {
    for (const box of filecheckBoxes) {
      if (!box.checked) return false;
    }
    checkAllBox.checked = true;
    checkUnseededBox.checked = true;
    checkMismatchedBox.checked = true;
    return true;
  }

  // Check if all mismatched files are ticked
  function isEverythingMatched(box) {
    const fileExtensions = getFileExtensions();
    const oldFiles = document.querySelectorAll("span[id^=oldfile_]");

    for (let i = 0; i < oldFiles.length; i++) {
      let thisFileBox = oldFiles[i].closest("tr").querySelector("input");
      if (fileExtensions.old[i] != fileExtensions.new[i]) {
        // If the file is mismatched and unticked, untick the "Check mismatched" box
        if (!thisFileBox.checked) {
          checkMismatchedBox.checked = thisFileBox.checked;
          return false;
        }
      }
    }
    checkMismatchedBox.checked = true;
  }

  function getFileExtensions() {
    var oldFileExtensions = [];
    var newFileExtensions = [];

    // Get all filenames
    const oldFiles = document.querySelectorAll("span[id^=oldfile_]");
    const newFiles = document.querySelectorAll("span[id^=newfile_]");

    for (let i = 0; i < oldFiles.length; i++) {
      let oldFilename = oldFiles[i].textContent;
      let newFilename = newFiles[i].textContent;

      // Strip the file extensions: "folder/file.MP4" => "mp4"
      let oldFileExt = oldFilename
        .substring(oldFilename.lastIndexOf(".") + 1)
        .toLowerCase();
      let newFileExt = newFilename
        .substring(newFilename.lastIndexOf(".") + 1)
        .toLowerCase();

      oldFileExtensions.push(oldFileExt);
      newFileExtensions.push(newFileExt);
    }

    return {
      old: oldFileExtensions,
      new: newFileExtensions,
    };
  }

  function detectUnseeded() {
    for (const torrent of torrents) {
      // Get the number of seeders: " (15 Seeders)" => "15"
      var text = torrent.closest(".size2").nextSibling.textContent;
      var seeds = parseInt(text.match(/\d+/g));

      if (seeds < minSeeds) return true;
    }
    return false;
  }

  function detectMismatched() {
    const fileExtensions = getFileExtensions();

    for (let i = 0; i < fileExtensions.old.length; i++) {
      if (fileExtensions.old[i] != fileExtensions.new[i]) {
        return true;
      }
    }
    return false;
  }
})();
