window.onload = function(){
    
    document.getElementById("theme").onchange = function(){
        doTheme();  
    };
    
    doTheme();
};

function doTheme(){
    //Making the settings readable
    var subLabels = document.getElementsByTagName("label");
    for(var i = 0; i < subLabels.length; i++){
        subLabels[i].style.color = "rgb(255,255,255);";
    }
    var sel = document.getElementById("theme");
    var opt = sel.selectedIndex;
    var isClassic = (sel.selectedIndex == 1);
    if(isClassic){
        injectStyles('.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: rgb(236, 240, 241);}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}');
        console.log("isClassic = true");
    }else{
        injectStyles('.chat_context #chatBottom > textarea {    background-image: none;    background-color: rgb(44, 62, 80);    color: rgb(236, 240, 241);}.site_btn {    background-image: none;    background-color: #2980b9;}#container {    background-image: none;    background-color: #0F161C;}body {    color: rgb(0,0,0);}.context-menu-item {    color: rgb(0,0,0);}.progresstext {    color: rgb(0,0,0);}#level_panel {    color: rgb(0,0,0);}.userSpan.listName:not(.member_moderator):not(.bold){color:rgb(255,255,255)}.time{color:rgb(255,255,255)}');
        console.log("isClassic = false");
    }
}

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");    
}

function beginsWith(needle, haystack){
    return (haystack.substr(0, needle.length) == needle);
}