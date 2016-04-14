
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("clearThemeButton").addEventListener("click", clearTheme);
    document.getElementById("addThemeButton").addEventListener("click", doTheme);
});

function clearTheme(){
    sendMsg("clearTheme");
}

function doTheme(){
    sendMsg("doTheme");
}

function sendMsg(txt){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: txt}, function(response) {
            console.log("response.farewell");
        });
    });
}