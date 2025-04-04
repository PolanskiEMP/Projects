// ==UserScript==
// @name         EMP Staff URL Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds VPN check integration for EMP staff related pages
// @author       Polanski
// @match        https://www.empornium.is/staffpm.php*
// @match        https://www.empornium.is/userhistory.php?*action=*ips*
// @match        https://www.empornium.is/manage/requests/*
// @match        https://www.empornium.is/user.php?action=sessions*
// @match        https://www.empornium.is/tools.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @downloadURL  https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20Staff%20URL%20Enhancer/EMP%20Staff%20URL%20Enhancer.js
// @updateURL    https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20Staff%20URL%20Enhancer/EMP%20Staff%20URL%20Enhancer.js
// @grant        none
// ==/UserScript==

const checker = "https://awebanalysis.com/en/ip-lookup/";
const url = window.location.href;

function addObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.id === "MathJax_Message") {
            console.log("MathJax detected");
            get_section();
          }
        });
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });
}

function get_section() {
  url.includes("staffpm.php")
    ? replaceStaffPM()
    : url.includes("/requests/")
    ? replaceRequest()
    : url.includes("userhistory.php")
    ? replaceHistory()
    : url.includes("action=sessions")
    ? replaceSessions()
    : url.includes("security_logs")
    ? replaceSecurityLogs()
    : url.includes("login_watch")
    ? replaceLoginWatch()
    : () => {
      console.log("No page detected");
      return false;
    }

  return true;
}

function replaceRequest() {
  console.log("Public requests page detected");

  let lastIP = document.evaluate(
    "//td[text()='Last User IP:']",
    document,
    null,
    7,
    null
  );
  let requestIP = document.evaluate(
    "//td[text()='Request IP:']",
    document,
    null,
    7,
    null
  );
  let geoIP = document.evaluate(
    "//td[text()='GeoIP Distance:']",
    document,
    null,
    7,
    null
  );
  let ispMatch = document.evaluate(
    "//td[text()='ISP Match?:']",
    document,
    null,
    7,
    null
  );

  for (let i = 0; i < lastIP.snapshotLength; i++) {
    let oldIP = lastIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[0].textContent.trim();
    let newIP = requestIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[0].textContent.trim();
    let distance = parseInt(
      geoIP
        .snapshotItem(i)
        .nextElementSibling.firstChild.textContent.trim()
        .replace(",", "")
    );
    let match = ispMatch
      .snapshotItem(i)
      .nextElementSibling.childNodes[0].textContent.trim();
    let element = lastIP.snapshotItem(i).nextElementSibling.childNodes[6];
    let doubleBracket = lastIP.snapshotItem(i).nextElementSibling.childNodes[5];
    let rightBracket = lastIP.snapshotItem(i).nextElementSibling.childNodes[7];

    lastIP.snapshotItem(i).nextElementSibling.childNodes[4].textContent = "IP";
    lastIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[4].setAttribute("target", "_blank");
    lastIP.snapshotItem(i).nextElementSibling.childNodes[6].textContent = "TR";
    lastIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[6].setAttribute("target", "_blank");
    lastIP.snapshotItem(i).nextElementSibling.childNodes[7].remove();
    lastIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(doubleBracket.cloneNode(true));
    let newLastIPElement = lastIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(element.cloneNode(true));
    newLastIPElement.setAttribute("href", checker + oldIP);
    newLastIPElement.setAttribute("target", "_blank");
    newLastIPElement.setAttribute("title", "Check VPN");
    newLastIPElement.textContent = "VPN";
    lastIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(rightBracket.cloneNode(true));

    requestIP.snapshotItem(i).nextElementSibling.childNodes[4].textContent =
      "IP";
    requestIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[4].setAttribute("target", "_blank");
    requestIP.snapshotItem(i).nextElementSibling.childNodes[6].textContent =
      "TR";
    requestIP
      .snapshotItem(i)
      .nextElementSibling.childNodes[6].setAttribute("target", "_blank");
    requestIP.snapshotItem(i).nextElementSibling.childNodes[7].remove();
    requestIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(doubleBracket.cloneNode(true));
    let newElement = requestIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(element.cloneNode(true));
    newElement.setAttribute("href", checker + newIP);
    newElement.setAttribute("target", "_blank");
    newElement.setAttribute("title", "Check VPN");
    newElement.textContent = "VPN";
    requestIP
      .snapshotItem(i)
      .nextElementSibling.appendChild(rightBracket.cloneNode(true));

    if (oldIP == newIP) {
      lastIP.snapshotItem(i).style.color = "#33cc33";
      requestIP.snapshotItem(i).style.color = "#33cc33";
    } else {
      lastIP.snapshotItem(i).style.color = "red";
      requestIP.snapshotItem(i).style.color = "red";
    }

    if (match == "Yes") {
      ispMatch.snapshotItem(i).style.color = "#33cc33";
    } else {
      ispMatch.snapshotItem(i).style.color = "red";
    }

    if (distance == 0) {
      geoIP.snapshotItem(i).style.color = "#33cc33";
    } else if (distance <= 100) {
      geoIP.snapshotItem(i).style.color = "#ffff00";
    } else if (distance <= 250) {
      geoIP.snapshotItem(i).style.color = "#ff5e00";
    } else {
      geoIP.snapshotItem(i).style.color = "red";
    }
  }
  return true;
}

function replaceStaffPM() {
  const title = document.querySelector("h2");

  if (
    title.textContent == "Staff PM - Possible hack attempt or dupe accounts"
  ) {
    console.log("StaffPM page detected");

    const post = document.querySelector("div[class='post_content']");

    let IPnode = post.childNodes[24];
    IPnode.textContent = "IP";
    IPnode.setAttribute("target", "_blank");

    let trackerIP = post.childNodes[26];
    trackerIP.textContent = "TR";
    trackerIP.setAttribute("target", "_blank");

    let IP = post.childNodes[20].textContent.replace("IP: ", "").trim();
    let doubleBracket = post.childNodes[25].cloneNode(false);
    let rightBracket = post.childNodes[27];

    const newElement = trackerIP.cloneNode(false);
    post.insertBefore(doubleBracket, rightBracket);
    post.insertBefore(newElement, rightBracket);

    newElement.setAttribute("href", checker + IP);
    newElement.setAttribute("target", "_blank");
    newElement.setAttribute("title", "Check VPN");
    newElement.textContent = "VPN";

    return true;
  }
  return false;
}

function replaceHistory() {
  console.log("User IP history page detected");

  const results = document.querySelectorAll("tr[class='rowa']");

  for (const result of results) {
    let IPnode = result.childNodes[1].childNodes[4];
    IPnode.textContent = "IP";
    IPnode.setAttribute("target", "_blank");

    let trackerIP = result.childNodes[1].childNodes[6];
    trackerIP.textContent = "TR";
    trackerIP.setAttribute("target", "_blank");

    let IP = result.childNodes[1].childNodes[0].textContent.trim();
    let doubleBracket = result.childNodes[1].childNodes[5].cloneNode(false);
    let rightBracket = result.childNodes[1].childNodes[9];

    const newElement = trackerIP.cloneNode(false);
    result.childNodes[1].insertBefore(
      doubleBracket,
      result.childNodes[1].childNodes[7]
    );
    result.childNodes[1].insertBefore(
      newElement,
      result.childNodes[1].childNodes[8]
    );

    newElement.setAttribute("href", checker + IP);
    newElement.setAttribute("target", "_blank");
    newElement.setAttribute("title", "Check VPN");
    newElement.textContent = "VPN";
  }
  return true;
}

function replaceSessions() {
  console.log("User Sessions page detected");

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
      href: checker + IP,
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
      href: checker + IP,
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
}

function replaceSecurityLogs() {
  console.log("Security Logs page detected");

  const firstIP = document.querySelector("input[id='first_ip']");
  const lastIP = document.querySelector("input[id='last_ip']");
  const IPcells = document.querySelectorAll('table.border > tbody > tr:not(:first-child) > td:nth-child(4)');

  var cells = [...IPcells]
  
  if (firstIP.checked || lastIP.checked) {
    const firstIPlist = document.querySelectorAll('table.border > tbody > tr:not(:first-child) > td:nth-child(5)');
    cells = cells.concat([...firstIPlist]);
    if (firstIP.checked && lastIP.checked) {
      const lastIPlist = document.querySelectorAll('table.border > tbody > tr:not(:first-child) > td:nth-child(6)');
      cells = cells.concat([...lastIPlist]);
    }
  }

  
  
  for (const cell of cells) {
    const IP = cell.firstChild.textContent;
    const IPnode = cell.childNodes[4];
    IPnode.textContent = "IP";
    IPnode.setAttribute("target", "_blank");
    const trackerIP = cell.childNodes[6];
    trackerIP.textContent = "TR";
    trackerIP.setAttribute("target", "_blank");
    const doubleBracket = cell.childNodes[5].cloneNode(false);
    let newVPNLink = Object.assign(document.createElement("a"), {
      href: checker + IP,
      target: "_blank",
      title: "Check VPN",
      textContent: "VPN",
    });
    cell.insertBefore(doubleBracket, cell.childNodes[cell.childNodes.length - 1]);
    cell.insertBefore(newVPNLink, cell.childNodes[cell.childNodes.length - 1]);
  }
  return true;
}

function replaceLoginWatch() {
  console.log("Login Watch page detected");

  const firstIP = document.querySelector("input[name='first_ip']");
  const lastIP = document.querySelector("input[name='last_ip']");
  const cells = [];
  const rowA = document.querySelectorAll("tr[class='rowa'");
  const rowB = document.querySelectorAll("tr[class='rowb'");
  const rows = [...rowA].concat([...rowB]);
  for (let i = 0; i < rows.length; i++) {
    let cell = rows[i].childNodes[1];
    cells.push(cell);
    if (firstIP.checked || lastIP.checked) {
      let firstIPtd = rows[i].childNodes[3];
      if (firstIPtd.innerText !== "") {
        cells.push(firstIPtd);
      }
      if (firstIP.checked && lastIP.checked) {
        let lastIPtd = rows[i].childNodes[5];
        if (lastIPtd.innerText !== "") {
          cells.push(lastIPtd);
        }
      }
    }
    
  }
  
  for (const cell of cells) {
    const IP = cell.firstChild.textContent;
    const IPnode = cell.childNodes[4];
    IPnode.textContent = "IP";
    IPnode.setAttribute("target", "_blank");
    const trackerIP = cell.childNodes[6];
    trackerIP.textContent = "TR";
    trackerIP.setAttribute("target", "_blank");
    const doubleBracket = cell.childNodes[5].cloneNode(false);
    let newVPNLink = Object.assign(document.createElement("a"), {
      href: checker + IP,
      target: "_blank",
      title: "Check VPN",
      textContent: "VPN",
    });
    cell.insertBefore(doubleBracket, cell.childNodes[cell.childNodes.length - 1]);
    cell.insertBefore(newVPNLink, cell.childNodes[cell.childNodes.length - 1]);
  }
  return true;
}

addObserver();
