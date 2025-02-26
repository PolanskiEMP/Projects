// ==UserScript==
// @name         EMP Public Requests URL Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds VPN check integration for EMP public requests page, now with more colors!
// @author       Polanski
// @match        https://www.empornium.is/manage/requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  setTimeout(replaceUrl, 1500);
})();

function replaceUrl() {
  const URL = "https://awebanalysis.com/en/ip-lookup/";
  // const URL = "https://db-ip.com/";

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
    newLastIPElement.setAttribute("href", URL + oldIP);
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
    newElement.setAttribute("href", URL + newIP);
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
