chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        var msg = request.greeting;
        if(msg == "doTheme")
            doTheme();
        else if(msg == "clearTheme")
            clearTheme();
        console.log("received msg in test.js, text = " + msg);
        
        if(msg.length > 1){
            if(msg[0] == '*'){
                //Example input:
                //*KEY-VALUE
                
                //Getting the Key.
                var _key = "";
                for(var i = 1; i < msg.length; i++){
                    if(msg[i] != '*' && msg[i] != '-')
                        _key += msg[i];
                    else if(msg[i] == '-')
                        break;
                }
                
                //Getting the Value.
                var startingPos = 2 + _key.length;
                var _value = msg.substring(startingPos, msg.length);
                
                //Setting the local variable
                setVal(_key, _value);
                //console.log("setting " + _key + " to " + _value);
            }
        }
    }
);
window.onload = function(){
    if(getVal('themeToggleData') == "on")
        doTheme();
    else
        console.log("deemed themeToggleData incorrect for applying the theme, value was:" + getVal('themeToggleData'));
    document.getElementById("theme").onchange = function(){
        doTheme();  
    };
};

function doTheme(){
    console.log("doing theme");
    //Making the settings readable
    var subLabels = document.getElementsByTagName("label");
    for(var i = 0; i < subLabels.length; i++){
        subLabels[i].style.color = "rgb(255,255,255);";
    }
    var sel = document.getElementById("theme");
    var opt = sel.selectedIndex;
    var isClassic = (sel.selectedIndex == 1);
    if(isClassic){
        injectStyles('.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: rgb(236, 240, 241);}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}#findDialog{color:rgb(0,0,0);}#blacklistDialog{color:rgb(0,0,0);}.description{color:rgb(0,0,0);}#reportsDialog{color:rgb(0,0,0);}.channel{color:rgb(255,255,255);}#rule_dialog{color:rgb(0,0,0);}');
        console.log("isClassic = true");
    }else{
        injectStyles('.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: rgb(0,0,0);}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}.userSpan.listName:not(.member_moderator):not(.bold){color:rgb(255,255,255)}.time{color:rgb(255,255,255)}#findDialog{color:rgb(0,0,0);}#blacklistDialog{color:rgb(0,0,0);}#reportsDialog{color:rgb(0,0,0);}label{color:rgb(255,255,255);}.channel{color:rgb(255,255,255);}#rule_dialog{color:rgb(0,0,0);}');
        console.log("isClassic = false");
    }
}

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  })
  div.appendTo("body");
}

function beginsWith(needle, haystack){
    return (haystack.substr(0, needle.length) == needle);
}


function clearTheme(){
    $("div:contains(­)").remove();
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function getVal(key){
    return $.jStorage.get(key);
}

function setVal(key, val){
    //doPreSetMsg(key,val);
    $.jStorage.set(key, val);
    //doPostSetMsg(key,val);
}

function doPreSetMsg(key,val){console.log("[SET-PRE](" + key + ") " + getVal(key) + " > " + val);}
function doPostSetMsg(key, val){console.log("[SET-POST](" + key + ")" + "Attempted to set to: " + val + ", actually set to " + getVal(key));}


function sendMsg(txt){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: txt}, function(response) {
            
        });
    });
}