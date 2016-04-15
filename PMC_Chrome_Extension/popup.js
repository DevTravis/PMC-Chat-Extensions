
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        var msg = request.greeting;
        if(msg.length > 1){
            if(msg[0] == '*'){
                //Getting what value the other script wants
                var length = msg.length;

                var _key = mag.substring(1,length-1);

                sendMsg("*" + _key + "-" + getVal(_key));
            }
        }
    }
);



document.addEventListener('DOMContentLoaded', function(){
    baseValCheck();
    document.getElementById("toggleTheme").checked = getCurrentThemeToggleData_str();
    document.getElementById("toggleTheme").addEventListener('change', toggleTheme);
    document.getElementById("toggleEmotes").checked = getCurrentEmotesToggleData_str();
    document.getElementById("toggleEmotes").addEventListener('change', toggleEmotes);

    //document.getElementById("textColorDiv").addEventListener('click', toggleTextColorDiv);
    document.getElementById("goToColors").addEventListener('click', toggleTextColorDiv);
    document.getElementById("backButton").addEventListener('click', toggleTextColorDiv);

    setCurrVersion();
});

var isOnScreen = false;

function toggleTextColorDiv(){
        isOnScreen = !isOnScreen;
    var div = document.getElementById("textColorDiv");
    if(isOnScreen)
        $("#textColorDiv").animate({left:'0%',}, 500);
    else
        $("#textColorDiv").animate({left:'100%',}, 500);


}

function setCurrVersion(){
    var manifest = chrome.runtime.getManifest();
    document.getElementById("currVersion").innerHTML = manifest.version;
}

function baseValCheck(){
    //Essentially seeing if this is the first time we're running it.
    if(getCurrentThemeToggleData() == undefined || getCurrentThemeToggleData() == null){
        //console.log("undefined > baseValCheck");
        setCurrentThemeToggleData('on');
    }

    sendVal('themeToggleData');
}

function toggleTheme(){
    //Getting the current theme data
    var currData = $.jStorage.get('themeToggleData');

    //Let's see if it's on or off, or null D:
    if(currData == null)
        setVal('themeToggleData', 'on');

    if(currData == "on"){
        sendMsg("clearTheme");
        setVal('themeToggleData', 'off');
        document.getElementById("toggleTheme").checked = getCurrentThemeToggleData_str();
        //console.log("set toggleTheme to " + getCurrentThemeToggleData_str());
    }else if(currData == "off"){
        sendMsg("doTheme");
        setVal('themeToggleData', 'on');
        document.getElementById("toggleTheme").checked = getCurrentThemeToggleData_str();
        //console.log("set toggleTheme to " + getCurrentThemeToggleData_str());
    }
}

function toggleEmotes(){
    //Getting the current data
    var currData = getVal('emotesToggleData');
    //If it's null/undefined, define it as "no" for now.
    if(currData == null || currData == undefined || !currData){
        setVal('emotesToggleData', "off");
        sendVal('emotesToggleData');    //Send this to our index.js as well.
    }

    if(currData == "on"){
        setVal('emotesToggleData', "off");
        sendVal('emotesToggleData');
        document.getElementById("toggleEmotes").checked = getCurrentEmotesToggleData_str();
    }else if(currData == "off"){
        setVal('emotesToggleData', "on");
        sendVal('emotesToggleData');
        document.getElementById("toggleEmotes").checked = getCurrentEmotesToggleData_str();
    }
}

function getVal(key){
    return $.jStorage.get(key);
}

function setVal(key, val){
    doPreSetMsg(key,val);
    $.jStorage.set(key, val);
    doPostSetMsg(key,val);
    sendVal(key, val);
}

function sendVal(key){
    sendMsg("*" + key + "-" + getVal(key));
}

function getCurrentEmotesToggleData_str(){return (getVal('emotesToggleData') == "on");}

function getCurrentThemeToggleData(){
    return getVal('themeToggleData');
}
function getCurrentThemeToggleData_str(){return (getCurrentThemeToggleData() == "on");}
function setCurrentThemeToggleData(val){
    setVal('themeToggleData', val);
}

function doPreSetMsg(key,val){console.log("[SET-PRE](" + key + ") " + getVal(key) + " > " + val);}
function doPostSetMsg(key, val){console.log("[SET-POST](" + key + ")" + "Attempted to set to: " + val + ", actually set to " + getVal(key));}

function clearTheme(){
    sendMsg("clearTheme");
}

function doTheme(){
    sendMsg("doTheme");
}

function sendMsg(txt){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: txt}, function(response) {

        });
    });
}
