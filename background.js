chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "getAuthToken") {
      chrome.identity.launchWebAuthFlow({url: request.twitchOAuthUrl, interactive: true, abortOnLoadForNonInteractive: false}, 
        (e) => sendResponse(e))
      return true;
    }
    return false
});
