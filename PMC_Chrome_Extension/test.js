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
    
    loadEmoteDictionary();
    
    if(getVal('themeToggleData') == "on")
        doTheme();
    else
        console.log("deemed themeToggleData incorrect for applying the theme, value was:" + getVal('themeToggleData'));
    document.getElementById("theme").onchange = function(){
        doTheme();  
    };
    
    insertionQ('.messageList div').every(function(element){
        if(getVal('emotesToggleData') == "on"){
            var _msgDiv = element.firstChild;
            var target = _msgDiv.getElementsByClassName("text")[0];
            //Getting the actual message
            var _msgRaw = target;
        
            if(_msgRaw != undefined){
                //Formatting said text.
                //console.log(_msgRaw.innerHTML);
                _msgRaw.innerHTML = text2Emote(_msgRaw.innerHTML);
            }
        }
    });
};

var rawEmotes;
var newEmotes;

function loadEmoteDictionary(){
    rawEmotes =[":)",
                ":("
                ];
    newEmotes =[getLink("https://raw.githubusercontent.com/DeathGameDev/PMC-Chat-Extensions/master/PMC_Chrome_Extension/emotes/smile.png"),
                getLink("https://raw.githubusercontent.com/DeathGameDev/PMC-Chat-Extensions/master/PMC_Chrome_Extension/emotes/frown.png")
                ];
}

function getLink(lnk){
    return "<img style=\"position:relative;width:10px;top:2px;\" src=\"" + lnk + "\">";
}

function text2Emote(txt){
    var old = txt;
    for(var i = 0; i < rawEmotes.length; i++){
        var _new = old.replaceAll(rawEmotes[i], newEmotes[i]);
        old = _new;
    }
    var end = old;
    return end;
}

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
        injectStyles('.active_stat{color:#FFFFFF;}.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: rgb(236, 240, 241);}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}#findDialog{color:rgb(0,0,0);}#blacklistDialog{color:rgb(0,0,0);}.description{color:rgb(0,0,0);}#reportsDialog{color:rgb(0,0,0);}.channel{color:rgb(255,255,255);}#rule_dialog{color:rgb(0,0,0);}#prefooter{background-image:none; background-color:#0F161C;}');
        console.log("isClassic = true");
    }else{
        injectStyles('.active_stat{color:#FFFFFF;}.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: #FFFFFF;}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}.userSpan.listName:not(.member_moderator):not(.bold){color:rgb(255,255,255)}.time{color:rgb(255,255,255)}#findDialog{color:rgb(0,0,0);}#blacklistDialog{color:rgb(0,0,0);}#reportsDialog{color:rgb(0,0,0);}label{color:rgb(255,255,255);}.channel{color:rgb(255,255,255);}#rule_dialog{color:rgb(0,0,0);}#prefooter{background-image:none; background-color:#0F161C;}.chat_context[data-theme="modern"] .messageList > .messageHolder > .message > .textContainer {background-image:none; background-color:#090E17; border:1px solid #000;}.chat_context[data-theme="modern"] .messageList > .messageHolder > .own-message {color:#FFFFFF;}.chat_context[data-theme="modern"] .messageList > .messageHolder > .message.own-message > .textContainer{background-color: #172131;}#urlHijackDialog{color:rgb(0,0,0);}#infractionsDialog{color:rgb(0,0,0);}.pmc_dialog{background-image:none;background-color:#172131}.pmc_dialog .pmc_dialog_content{background-image:none; background-color:rgb(44, 62, 80);}input{background-image:none; background-color:#090E17; color:rgb(255,255,255);}.pmc_dialog .pmc_dialog_buttons{background-image:none;background-color:#172131;}h1{color:#FFFFFF;}');
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

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

//Loads the iframe, gets the txt.
function LoadFile() {
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    alert("File " + oFrame.src + " has " + arrLines.length + " lines");
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        alert("Line #" + (i + 1) + " is: '" + curLine + "'");
    }
}