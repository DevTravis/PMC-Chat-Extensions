
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
});

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