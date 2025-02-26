// ==UserScript==
// @name         EMP User Sessions Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds IP History search and VPN checking
// @author       Polanski
// @match        https://www.empornium.is/user.php?action=sessions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // Replace URL with online checker of choice
  const URL = "https://awebanalysis.com/en/ip-lookup/";

  // Creates a VPN column in the table header
  let header = document.evaluate(
    "//tr[@class='colhead']",
    document,
    null,
    7,
    null
  );
  let headerNewColumn = header
    .snapshotItem(0)
    .firstElementChild.cloneNode(true);
  headerNewColumn.textContent = "VPN";
  header
    .snapshotItem(0)
    .firstElementChild.insertAdjacentElement("afterend", headerNewColumn);

  // Grabs all table rows
  let rowsA = document.evaluate("//tr[@class='rowa']", document, null, 7, null);
  let rowsB = document.evaluate("//tr[@class='rowb']", document, null, 7, null);

  for (let i = 0; i < rowsB.snapshotLength; i++) {
    // Grabs user session IP
    let IPCell = rowsB.snapshotItem(i).firstElementChild;
    let IP = IPCell.textContent;
    // Creates IP search links
    let newCheckIPLinkB = Object.assign(document.createElement("a"), {
      href: `/user.php?action=search&ip_history=on&ip=${IP}&matchtype=fuzzy`,
      target: "_blank",
      title: "Search IP",
      textContent: IP,
    });
    // Removes cell text and appends IP search links
    IPCell.textContent = "";
    IPCell.appendChild(newCheckIPLinkB);
    // Creates VPN check links
    let newVPNLinkB = Object.assign(document.createElement("a"), {
      href: URL + IP,
      target: "_blank",
      title: "Check VPN",
      textContent: "Check",
    });
    // Creates new cell and appends VPN check links
    let newCellB = document.createElement("td");
    newCellB.appendChild(newVPNLinkB);
    rowsB
      .snapshotItem(i)
      .firstElementChild.insertAdjacentElement("afterend", newCellB);
  }

  for (let i = 0; i < rowsA.snapshotLength; i++) {
    // Grabs user session IP
    let IPCell = rowsA.snapshotItem(i).firstElementChild;
    let IP = IPCell.textContent;
    // Creates IP search links
    let newCheckIPLinkA = Object.assign(document.createElement("a"), {
      href: `/user.php?action=search&ip_history=on&ip=${IP}&matchtype=fuzzy`,
      target: "_blank",
      title: "Search IP",
      textContent: IP,
    });
    // Removes cell text and appends IP search links
    IPCell.textContent = "";
    IPCell.appendChild(newCheckIPLinkA);
    // Creates VPN check links
    let newVPNLinkA = Object.assign(document.createElement("a"), {
      href: URL + IP,
      target: "_blank",
      title: "Check VPN",
      textContent: "Check",
    });
    // Creates new cell and appends VPN check links
    let newCellA = document.createElement("td");
    newCellA.appendChild(newVPNLinkA);
    rowsA
      .snapshotItem(i)
      .firstElementChild.insertAdjacentElement("afterend", newCellA);
  }
  return true;
})();
