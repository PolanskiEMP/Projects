// ==UserScript==
// @name         EMP StaffPM URL Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds VPN check integration for EMP staff related pages (staffPM, user history, public request)
// @author       Polanski
// @match        https://www.empornium.is/staffpm.php*
// @match        https://www.empornium.is/userhistory.php?*action=*ips*
// @match        https://www.empornium.is/manage/requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @downloadURL
// @updateURL
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  setTimeout(replaceLinks, 1500);
})();

const checker = "https://awebanalysis.com/en/ip-lookup/";
const url = window.location.href;

function replaceLinks() {
  url.includes("staffpm.php")
    ? replaceStaffPM()
    : url.includes("/requests/")
    ? replaceRequest()
    : replaceHistory();
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

  if (title.textContent == "Staff PM - Possible hack attempt or dupe accounts") {
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
    result.childNodes[1].insertBefore(doubleBracket, result.childNodes[1].childNodes[7]);
    result.childNodes[1].insertBefore(newElement, rightBracket);

    newElement.setAttribute("href", checker + IP);
    newElement.setAttribute("target", "_blank");
    newElement.setAttribute("title", "Check VPN");
    newElement.textContent = "VPN";

  }
  return true;
}
