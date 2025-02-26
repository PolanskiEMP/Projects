// ==UserScript==
// @name         EMP MFD Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a total unchecked torrents count
// @author       Polanski
// @match        https://www.empornium.is/tools.php?action=marked_for_deletion&viewstatus=unmarked*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Finds all unchecked torrents in the page
    const count = document.evaluate("//a[@href[contains(.,'/torrents.php?id=')]]", document, null, 7, null).snapshotLength;

    // Appends the new count to the "Torrents Awaiting Review" header
    document.evaluate('//*[contains(text(), "Torrents Awating Review")]', document, null, 7, null).snapshotItem(0).textContent += ` (${count})`
    return true;
})();