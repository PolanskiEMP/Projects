// ==UserScript==
// @name         EMP User IP History URL Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  VPN check integration for EMP user IP history page
// @author       Polanski
// @match        https://www.empornium.is/userhistory.php?*action=*ips*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @downloadURL  https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20User%20IP%20History%20URL%20Enhancer/EMP%20User%20IP%20History%20URL%20Enhancer.js
// @updateURL    https://raw.githubusercontent.com/PolanskiEMP/Projects/refs/heads/main/EMP/EMP%20User%20IP%20History%20URL%20Enhancer/EMP%20User%20IP%20History%20URL%20Enhancer.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(replaceUrl, 1500);
})();

function replaceUrl() {

    // Replace URL with online checker of choice
    const URL = "https://awebanalysis.com/en/ip-lookup/";
    
    let results = document.evaluate("//tr[@class='rowa']", document, null, 7, null);
    for (let i = 0; i < results.snapshotLength; i++) {
        let IP = results.snapshotItem(i).childNodes[1].firstChild.textContent.trim();
        let element = results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[4];
        let doubleBracket = results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[5];
        let rightBracket = results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[7];

        results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[4].textContent = "IP";
        results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[4].setAttribute("target", "_blank");
        results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[6].textContent = "TR";
        results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[6].setAttribute("target", "_blank");

        let newElement = results.snapshotItem(i).childNodes[0].nextElementSibling.insertBefore(element.cloneNode(true), results.snapshotItem(i).childNodes[0].nextElementSibling.childNodes[7]);
        let newBracket = results.snapshotItem(i).childNodes[0].nextElementSibling.insertBefore(doubleBracket.cloneNode(true), newElement);

        newElement.setAttribute("href", URL + IP);
        newElement.setAttribute("target", "_blank");
        newElement.setAttribute("title", "Check VPN");
        newElement.textContent = "VPN";
        
    }
    return true;
};