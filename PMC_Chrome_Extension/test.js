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
            if(element.className == "messageHolder"){
            var _msgDiv = element.firstChild;
            var target = _msgDiv.getElementsByClassName("text")[0];
            //Getting the actual message
            var _msgRaw = target;

            console.log(_msgRaw.innerHTML);
            if(_msgRaw != undefined){
                //Formatting said text.
                //console.log(_msgRaw.innerHTML);
                _msgRaw.innerHTML = text2Emote(_msgRaw.innerHTML);
            }
            }else{
                //It's an appended message.
                var _msgDiv = element;
                            var target = _msgDiv.getElementsByClassName("text")[0];
            //Getting the actual message
            var _msgRaw = target;

            console.log(_msgRaw.innerHTML);
            if(_msgRaw != undefined){
                //Formatting said text.
                //console.log(_msgRaw.innerHTML);
                _msgRaw.innerHTML = text2Emote(_msgRaw.innerHTML);
            }
            }
        }
    });
};

var rawEmotes;
var newEmotes;

function loadEmoteDictionary(){
    rawEmotes =[":)",
                ":(",
                ":o",
                ":O",
                "-_-",
                "<3",
                ":D",
                ":'(",
                ":I",
                "B)",
                ";)",
                ";-)",
                ";^)",
                "xD",
                "XD",
                "D:",
                "8=)"
                ];
    newEmotes =[getLink(getEmoji("smile")),
                getLink(getEmoji("worried")),
                getLink(getEmoji("open_mouth")),
                getLink(getEmoji("open_mouth")),
                getLink(getEmoji("expressionless")),
                getLink(getEmoji("heart")),
                getLink(getEmoji("smiley")),
                getLink(getEmoji("cry")),
                getLink(getEmoji("neutral_face")),
                getLink(getEmoji("sunglasses")),
                getLink(getEmoji("wink")),
                getLink(getEmoji("wink")),
                getLink(getEmoji("wink")),
                getLink(getEmoji("laughing")),
                getLink(getEmoji("laughing")),
                getLink(getEmoji("anguished")),
                getLink(getEmoji("skull"))
                ];
}

function getEmoji(id){
    return "http://www.emoji-cheat-sheet.com/graphics/emojis/" + id + ".png";
}
function getLink(lnk){
    return "<img style=\"position:relative;width:14px;top:2px;\" src=\"" + lnk + "\">";
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
    applyCSSViaTheme(darkTheme, isClassic);
    /*if(isClassic){
        applyCSS("dark_classic");
        console.log("isClassic = true");
    }else{
        applyCSS("dark_modern");
        console.log("isClassic = false");
    }*/
}

/* THEME CLASSING */
var Theme = function(textColor, inputColor, backgroundColor, dialogColor, modern_messageBackground, modern_OwnMessageBackground, rightClickMenuColor){
    this.textColor = textColor;
    this.inputColor = inputColor;
    this.backgroundColor = backgroundColor;
    this.dialogColor = dialogColor;
    this.modern_MessageBackground = modern_messageBackground;
    this.modern_OwnMessageBackground = modern_OwnMessageBackground;
    this.rightClickMenuColor = rightClickMenuColor;
}

var darkTheme = new Theme("#FFFFFF", "#2c3e50", "#0F161C", "#FFFFFF", "#090E17", "#172131", "#000000");
var customTheme = new Theme("#FFFFFF", "#2c3e50", "#0F161C", "#FFFFFF", "#090E17", "#172131", "#000000");

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

function applyCSSViaTheme(theme, isClassic){
    //Loading the custom css file
    var loadStr = "";
    if(isClassic)
        loadStr = chrome.extension.getURL('themes/custom_classic.css');
    else
        loadStr = chrome.extension.getURL('themes/custom_modern.css');
    
    //Loading the custom css
    var xhr = new XMLHttpRequest();
    xhr.open('GET', loadStr, true);
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {
            var _css = xhr.responseText.replace(/(\r\n|\n|\r)/gm,"");
            
            //Replacing stuff and things.
            _css = _css.replaceAll('[TextColor]', theme.textColor);
            _css = _css.replaceAll('[InputColor]', theme.inputColor);
            _css = _css.replaceAll('[BackgroundColor]', theme.backgroundColor);
            _css = _css.replaceAll('[DialogColor]', theme.dialogColor);
            _css = _css.replaceAll('[Modern_MessageBackground]', theme.modern_MessageBackground);
            _css = _css.replaceAll('[Modern_OwnMessageBackground]', theme.modern_OwnMessageBackground);
            _css = _css.replaceAll('[RightClickMenuColor]', theme.rightClickMenuColor);
            
            console.log("injecting css of : " + _css);
            
            injectStyles(_css);
        }
    };
    xhr.send();
}

function _doreplace(from, to, str){
    
}

function applyCSS(name){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('themes/' + name + '.css'), true);
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {
            var m_text = xhr.responseText.replace(/(\r\n|\n|\r)/gm,"");
            injectStyles(m_text);
        }
    };
    xhr.send();
}

function loadFile(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {
            return xhr.responseText;
        }
    };
    xhr.send();
}