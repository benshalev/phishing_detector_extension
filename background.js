console.log("Background script is running.");
chrome.runtime.onInstalled.addListener(() => {
  console.log("Phishing Detector extension installed!");
});