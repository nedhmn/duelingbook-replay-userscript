// ==UserScript==
// @name         download-duelingbook-replay-json
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download Duelingbook replay JSON
// @author       payload
// @match        https://www.duelingbook.com/replay*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Store console logs, limit to 10 entries
  const consoleLogs = [];
  const originalConsoleLog = console.log;
  console.log = function () {
    if (consoleLogs.length < 10) {
      consoleLogs.push(Array.from(arguments));
    }
    originalConsoleLog.apply(console, arguments);
  };

  // Inject CSS for the button
  const style = document.createElement("style");
  style.textContent = `
        #jsonDownloadButton {
            position: relative;
            z-index: 1000;
            margin: 10px;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50; /* Green */
            color: white;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease; /* Only background color transition */
        }
        #jsonDownloadButton:hover {
            background-color: #45a049;
        }
        #jsonDownloadButton:active {
            background-color: #3e8e41;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
    `;
  document.head.appendChild(style);

  // Create and append the download button
  const jsonBtn = document.createElement("button");
  jsonBtn.setAttribute("id", "jsonDownloadButton");
  jsonBtn.innerText = "Download JSON";

  const duelDiv = document.getElementById("duel");
  if (duelDiv) {
    duelDiv.appendChild(jsonBtn);
  }

  // Handle button click
  jsonBtn.onclick = function () {
    if (consoleLogs.length >= 10) {
      const jsonData = consoleLogs.find((o) => o[0]?.length > 1000);
      if (jsonData) {
        const blob = new Blob(jsonData, { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "replay.json";
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release object URL
      } else {
        alert("No large JSON data found in logs.");
      }
    } else {
      alert("JSON not ready yet - try again after rps is shown.");
    }
  };
})();
