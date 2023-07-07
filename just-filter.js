var doFilter = false;
var chatOpened = (chatOpen == true) ? "fa-toggle-on" : "fa-toggle-off";


function resetChat() {
  while (page_chatfield.firstChild) {
    page_chatfield.firstChild.remove();
  }
  network.chathistory();
}


function shouldFilter(message, type, hasTagDom, nickname, id, realUsername) {
  const filterAnons = filter_anon_toggle.classList.contains("fa-toggle-on");
  if (hasTagDom) {
    return false //members and above arent filtered
  }
  if (filterAnons && type == "anon") {
    return true // filter anons if set to true
  }

  function checklist(message, list) {
    const lowercaseMessage = message.toLowerCase();
    const lowercaselist = list.map(item => item.toLowerCase());

    const words = lowercaseMessage.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (word === "") {
        continue; // Ignore empty strings in the message
      }

      if (lowercaselist.includes(word)) {
        return true; // Found a full word match in the blacklist
      }

      if (lowercaselist.some(item => item !== "" && word.includes(item))) {
        return true; // Found a partial match in the blacklist
      }
    }

    return false; // No match found in the blacklist
  }


  var blacklist = [];
  var whitelist = [];
  for (filterInput of document.getElementsByClassName("bl_filter")) {
    blacklist.push(filterInput.value);
  }
  for (filterInput of document.getElementsByClassName("wl_filter")) {
    whitelist.push(filterInput.value);
  }
  var shouldFilter = checklist(message, blacklist) || checklist(nickname, blacklist) || checklist(id.toString(), blacklist) || checklist(realUsername, blacklist);
  if (shouldFilter) {
    shouldFilter = !(checklist(message, whitelist) || checklist(nickname, whitelist) || checklist(id.toString(), whitelist) || checklist(realUsername, whitelist));
  }


  return shouldFilter; // dont filter
}

var e;
(e = document.createElement("script")).src = "//cdn.jsdelivr.net/npm/sweetalert2@11", document.head.appendChild(e);



var pm_ui_css =
  `
 .toggle-filter, .toggle-anon {
   background: none;
   border: none;
   cursor: pointer;
   font-size: 16px;
   color: #ccc;
 }

 .toggle-filter i, .toggle-anon i {
   margin-right: 5px;
 }

#chat-popup {
    left: 100%;
    top: 0;
    position: absolute;
    height: 100%;
    width: max-content;
    display: flex;
    background: #1d1d1d;
    color: white;
    padding: 1em;
    border-left: 4px solid #1d1d1d;
    border-radius: 0 6px 0 0;
    overflow-x: auto;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: stretch;
    min-width: 17em;
}
#chat-popup button, #chat-popup input, #chat-popup label {
    pointer-events: all;
}
.fltr-filter-input button {
    background: transparent;
    color: white;
    border: none;
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6em;
    border-radius: 3px;
    float: right;
margin:5px;
}
.fltr-column input[type="text"] {
    flex-grow: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    margin-bottom: 10px;
}
.fltr-anon-section{
width:100%
}
button#filter-anon {
    width: 100%;
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.5em;
    margin-bottom: 0.5em;
    border-radius: 5px;
    align-items: center;
}
.clipboard-container,.cell-data-container {
  display: flex;
  flex-direction: column;
  font-size: small;
  background:#3e3e3e;
  padding:1em;
  border-radius: 5px 0 0 0;
  color: white;
}
.cell-data-container {
  margin-bottom: 1em;
  border-radius: 5px 0 0 5px;
}

.clipboard-row {
    display: flex;
    justify-content: space-between;
    font-size: small;
    padding: 0.5em;
}
.clipboard-row h3 {
margin:0px
}
.clipboard-text {
  margin-right: 1em;
}

.clipboard-button {
  background: none;
  border: none;
  cursor: pointer;
}
i.fa-clipboard {
    color: white;
}

.shortcuts-container {
  display: flex;
  flex-direction: column;
  font-size: small;
  background:#3e3e3e;
  padding:1em;
  border-radius: 0 0 0 5px;
  color: white;
  height:100%;
  padding-top:3em;
  margin-bottom:1em;
  overflow-x: auto
}

.shortcut-row {
    display: flex;
    justify-content: space-between;
    font-size: small;
    padding: 0.5em;
}
.shortcut-row h3 {
margin:0px
}
.shortcut-text {
  margin-right: 1em;
}

.shortcut-button {
  background: none;
  border: none;
  cursor: pointer;
}
#info-bar {
    display: flex;
    position: fixed;
    top: 0;
    right: 0px;
    width: 300px;
    height: 100%;
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: stretch;
    z-index: 1500;
}
.hidden{
display: none!important;
}
.fa-toggle-on {
    color: #2cff00;
}
.hidden-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}


.options-container .close-button {
right: unset;
position: relative;
background: #d63333;
border-radius: 5px;
padding:0.5em;
font-size:small;
}

.tool-options{
margin-left: 0.2em;
margin-right: 0.2em;
color: white;
font-size:small;
}
.tool-options label{
padding:0.5em;
cursor:pointer;
border-radius:5px;

}
.tool-options label:hover{
background-color: #555;
}
.tool-options input[type="radio"]:checked + label {
  background-color: #1d1d1d;
  color: white;
}
.options-container {
    display: flex;
}
.swal2-container {
    font-family: 'Quicksand', sans-serif;
}
#west_gui {
    position: absolute;
    top: 42px;
    left: 40px;
}
.shortcut-container{
    width: 24em;
    top: 1em;
    right: 1em;
    padding: 1em;
    position: fixed;
    background: rgb(229, 229, 255);
    font-family: monospace;
    overflow-y: scroll;
    overflow-x: auto;
}

.shortcuts-container  dl > li {
list-style: none;
font-weight: bolder;
}

.shortcuts-container dl dl > li {
    list-style: disc;
    font-size: small;
    font-weight: 500;
}
#url-paste-input{
border-radius:5px;
border:none;
padding:0.5em;
}


#close-chatbox {
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: larger;
}
#filter-toggle {
    background: none;
    border: none;
    color: #000;
cursor:pointer
}
#filter-toggle:hover {
    
}
#ppc{
    display: block;
    position: fixed;
    z-index: 1000;
    outline: 1px dashed black;
    pointer-events: none;
    }
#ppc-header{

}	
#chat_upper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
`

var pm_stylesheet = document.createElement("style");
var pm_html = document.createElement("div");
pm_stylesheet.innerHTML = pm_ui_css;
document.head.appendChild(pm_stylesheet);
document.body.appendChild(pm_html);

const chat_upper = document.getElementById("chat_upper");
var flterWnd = document.createElement("div");
flterWnd.id = "chat-popup";
flterWnd.class = "chat-popup";
flterWnd.classList.add("hidden");
flterWnd.innerHTML = `
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <div id="filter-popup-content">

          <div class="fltr-column">
            <h3>Blacklist</h3>
            <div class="fltr-anon-section">
              <button class="toggle-anon btn" id="filter-anon">Blacklist Anons<div id="ba_blank"></div><i class="fas fa-toggle-off"></i></button>
            </div>
            <div id="fltr-blacklist-filters">
              <div class="fltr-filter-input">
                <input class = "bl_filter" type="text" placeholder="Enter a filter" onInput = "resetChat();">
                <button class="btn fltr-add-filter" id="add-blacklist-btn"><i class="fas fa-plus-square"></i></button>
              </div>
            </div>
          </div>
          <div class="fltr-column">
            <h3>Whitelist</h3>
            <div id="fltr-whitelist-filters">
              <div class="fltr-filter-input">
                <input class = "wl_filter" type="text" placeholder="Enter a filter" onInput = "resetChat();">
                <button class="btn fltr-add-filter" id="add-whitelist-btn"><i class="fas fa-plus-square"></i></button>
              </div>
            </div>
          </div>
</div>
        `;
elm.chat_window.appendChild(flterWnd)

const fltr_tgl = document.createElement("button");
fltr_tgl.class = "toggle-filter btn";
fltr_tgl.id = "filter-toggle";
fltr_tgl.innerHTML = `<i class="fas fa-filter"></i> Filter <i class="fas fa-toggle-off"></i>`

fltr_tgl.classList.add("btn");

chat_upper.appendChild(fltr_tgl);

const chat_lower = document.getElementById("chat_lower");
// Get the elements
var isErasing = false;

const thisPage = document.getElementById('this-page');
const globalPage = document.getElementById('global-page');
const content = document.querySelector('.content');
const filter_popup_content = document.getElementById('filter-popup-content')
const fltr_btn = document.getElementById("filter-toggle");
const fltr_btn_toggle = fltr_btn.children[1];
const fltr_popup = document.getElementById("chat-popup");
const filter_anon = document.getElementById("filter-anon");
const filter_anon_toggle = filter_anon.children[1];
const ba_blank = document.getElementById("ba_blank");
const blacklist_btn = document.getElementById("add-blacklist-btn");
const fltr_blacklist_filters = document.getElementById("fltr-blacklist-filters");
const whitelist_btn = document.getElementById("add-whitelist-btn");
const fltr_whitelist_filters = document.getElementById("fltr-whitelist-filters");

function toggle(element, force) {
  if (typeof force === "boolean") {
    element.classList.toggle("hidden", force);
  } else {
    element.classList.toggle("hidden");
  }
}

function toggleIconBool(targetElement, val) {
  const toggleOnClass = "fa-toggle-on";
  const toggleOffClass = "fa-toggle-off";
  if (val == true) {
    targetElement.classList.remove(toggleOffClass);
    targetElement.classList.add(toggleOnClass);
  } else {
    targetElement.classList.remove(toggleOnClass);
    targetElement.classList.add(toggleOffClass);
  }
}

function toggleIcon(targetElement, sourceElement, reverse) {
  const toggleOnClass = "fa-toggle-on";
  const toggleOffClass = "fa-toggle-off";
  if (typeof reverse === "boolean" && reverse) {
    if (!sourceElement.classList.contains("hidden")) {
      targetElement.classList.remove(toggleOnClass);
      targetElement.classList.add(toggleOffClass);
    } else {
      targetElement.classList.remove(toggleOffClass);
      targetElement.classList.add(toggleOnClass);
    }
  } else {
    if (sourceElement.classList.contains("hidden")) {
      targetElement.classList.remove(toggleOnClass);
      targetElement.classList.add(toggleOffClass);
    } else {
      targetElement.classList.remove(toggleOffClass);
      targetElement.classList.add(toggleOnClass);
    }
  }
}

function togglePopup() {
  const hide = (filter_popup_content.classList.contains("hidden") == false);
  fltr_popup.classList.toggle("hidden", !hide)
}

fltr_btn.addEventListener('click', () => {
  doFilter = !doFilter;
  toggle(filter_popup_content);
  toggleIcon(fltr_btn_toggle, filter_popup_content);
  togglePopup();
  resetChat();
})

toggle(filter_popup_content);
function addList(ele) {
  var newdiv = document.createElement("div")
  newdiv.innerHTML = ele.parentElement.outerHTML;
  ele.parentElement.parentElement.appendChild(newdiv)
  newdiv.children[0].children[1].addEventListener('click', () => {
    addList(ele)
  })
}

filter_anon.addEventListener('click', () => {
  toggle(ba_blank);
  toggleIcon(filter_anon_toggle, ba_blank, true);
  resetChat();
})

blacklist_btn.addEventListener('click', () => {
  addList(blacklist_btn)
})

whitelist_btn.addEventListener('click', () => {
  addList(whitelist_btn)
})

chat_close.outerHTML = "<div></div>"


function addChat(chatfield, id, type, nickname, message, realUsername, op, admin, staff, color, date, dataObj) {

  var chatGroup = document.createElement("div");
  var nameContainer = document.createElement("span");

  if (!dataObj) dataObj = {};
  if (!message) message = "";
  if (!realUsername) realUsername = "";
  if (!nickname) nickname = realUsername;
  if (!color) color = assignColor(nickname);
  var dateStr = "";
  if (date) dateStr = convertToDate(date);
  var field = evaluateChatfield(chatfield);
  var pm = dataObj.privateMessage;
  var isGreen = false;

  if (chatGreentext && message[0] == ">" && !(":;_-".includes(message[1]))) { // exception to some emoticons
    message = message.substr(1);
    isGreen = true;
  }

  if (chatLimitCombChars) {
    message = filterChatMessage(message);
    nickname = filterChatMessage(nickname);
  }

  if (!op) {
    message = html_tag_esc(message);
    nickname = html_tag_esc(nickname);
  }

  // do not give the tag to [ Server ]
  var hasTagDom = (op || admin || staff || dataObj.rankName) && !(!id && op);
  var tagDom;
  var nickTitle = [];
  var usernameHasSpecialChars = false;

  for (var i = 0; i < realUsername.length; i++) {
    if (realUsername.charCodeAt(i) > 256) {
      usernameHasSpecialChars = true;
      break;
    }
  }

  if (type == "user" || type == "user_nick") {
    nickTitle.push("ID " + id);
  }

  if (hasTagDom) {
    tagDom = document.createElement("span");
    if (dataObj.rankName) {
      tagDom.innerHTML = "(" + dataObj.rankName + ")";
      tagDom.style.fontWeight = "bold";
      nickTitle.push(dataObj.rankName);
      nameContainer.style.outline = `4px solid ${dataObj.rankColor}`;
    } else if (op) {
      tagDom.innerHTML = "(OP)";
      tagDom.style.fontWeight = "bold";
      nickTitle.push("Operator");
      nameContainer.style.outline = "4px solid #0033cc";
    } else if (admin) {
      tagDom.innerHTML = "(A)";
      tagDom.style.fontWeight = "bold";
      nickTitle.push("Administrator");
      nameContainer.style.outline = "4px solid #FF0000";
    } else if (staff) {
      tagDom.innerHTML = "(M)";
      tagDom.style.fontWeight = "bold";
      nickTitle.push("Staff");
      nameContainer.style.outline = "4px solid #009933";
    }
    tagDom.style.color = "white";
    tagDom.innerHTML += "&nbsp;";
  }

  var idTag = "";

  var nickDom = document.createElement("a");
  nickDom.style.textDecoration = "none";

  nameContainer.style.background = color;

  nameContainer.style.padding = "0.3em 1em";
  nameContainer.style.borderRadius = "1em";
  nameContainer.style.margin = "0em 1em";
  nickDom.style.color = "white";
  nameContainer.style.textShadow = "0px 0px 2px black";
  if (type == "user") {


    if (!usernameHasSpecialChars) {
      nickDom.style.fontWeight = "bold";
    }
    nickDom.style.pointerEvents = "default";
    if (state.userModel.is_operator) idTag = "[" + id + "]";
  }
  if (type == "anon_nick") {
    idTag = "*" + id;
  }
  if (type == "anon") {
    idTag = id + "";
  }
  if (type == "user_nick") {
    nickDom.style.color = "white";
    var impersonationWarning = "";
    if (usernameHasSpecialChars) {
      impersonationWarning = " (Special chars)";
    }
    nickTitle.push("Username \"" + realUsername + "\"" + impersonationWarning);
    if (state.userModel.is_operator) idTag = "[*" + id + "]";
  }

  if (state.userModel.is_operator) {
    idTag = "<span style=\"color: black; font-weight: normal;\">" + idTag + "</span>"
  }

  if (idTag && type != "anon") idTag += "&nbsp;"; // space between id and name

  if (id == 0) {
    idTag = "";
    nickname = "<span style=\"background-color: #e2e2e2;\">" + nickname + "</span>";
  }

  nickname = idTag + nickname;

  if (dateStr) nickTitle.push("(" + dateStr + ")");

  nickDom.innerHTML = nickname + (pm == "to_me" ? "" : "");
  if (nickTitle.length) nickDom.title = nickTitle.join("; ");

  var pmDom = null;
  if (pm) {
    pmDom = document.createElement("div");
    pmDom.style.display = "inline";
    if (pm == "to_me") {
      pmDom.innerText = " -> Me:";
    } else if (pm == "from_me") {
      pmDom.innerText = "Me -> ";
    }
  }

  if (isGreen) {
    message = "<span style=\"color: #789922\">&gt;" + message + "</span>";
  }

  // parse emoticons
  if (chatEmotes) {
    var emoteMessage = "";
    var emoteBuffer = "";
    var emoteMode = false;
    var emoteCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    // emotes are case sensitive
    for (var i = 0; i < message.length; i++) {
      var chr = message[i];
      if (chr == ":") {
        if (emoteBuffer == ":" && emoteMode) { // special case: two consecutive colons
          emoteMessage += emoteBuffer;
          continue;
        }
        emoteBuffer += chr;
        if (emoteMode) {
          var emoteName = emoteBuffer.slice(1, -1);
          if (emoteList.hasOwnProperty(emoteName)) {
            var position = emoteList[emoteName];
            emoteMessage += "<div title=':" + emoteName +
              ":' class='chat_emote' style='background-position-x:-" + position[0] +
              "px;width:" + position[1] + "px'></div>";
          } else {
            emoteMessage += emoteBuffer;
          }
          emoteMode = false;
          emoteBuffer = "";
        } else {
          emoteMode = true;
        }
      } else if (emoteMode) {
        emoteBuffer += chr;
        if (!emoteCharset.includes(chr)) {
          emoteMode = false;
          emoteMessage += emoteBuffer;
          emoteBuffer = "";
          continue;
        }
      } else {
        emoteMessage += chr;
      }
    }
    if (emoteBuffer) { // leftovers
      emoteMessage += emoteBuffer;
    }
    message = emoteMessage;
  }

  var msgDom = document.createElement("span");
  msgDom.innerHTML = "&nbsp;" + message;

  var maxScroll = field.scrollHeight - field.clientHeight;
  var scroll = field.scrollTop;
  var doScrollBottom = false;
  if (maxScroll - scroll < 20) { // if scrolled at least 20 pixels above bottom
    doScrollBottom = true;
  }

  if (doFilter) {
    if (shouldFilter(message, type, hasTagDom, nickname, id, realUsername))
      return
  }


  chatGroup.appendChild(nameContainer);
  if (!pm && hasTagDom) nameContainer.appendChild(tagDom);
  if (pmDom) {
    if (pm == "to_me") {
      if (hasTagDom) nameContainer.appendChild(tagDom);
      nameContainer.appendChild(nickDom);
      nameContainer.appendChild(pmDom);
    } else if (pm == "from_me") {
      nameContainer.appendChild(pmDom);
      if (hasTagDom) nameContainer.appendChild(tagDom);
      nameContainer.appendChild(nickDom);
    }
  } else {
    nameContainer.appendChild(nickDom);
  }
  chatGroup.appendChild(msgDom);

  field.appendChild(chatGroup);

  maxScroll = field.scrollHeight - field.clientHeight;
  if (doScrollBottom) {
    field.scrollTop = maxScroll;
  }

  var chatRec = {
    id: id,
    date: date,
    field: field,
    element: chatGroup
  };
  if (field == elm.page_chatfield) {
    chatRecordsPage.push(chatRec);
  } else if (field == elm.global_chatfield) {
    chatRecordsGlobal.push(chatRec);
  }
  if (chatRecordsPage.length > chatHistoryLimit) { // overflow on current page
    var rec = chatRecordsPage.shift();
    rec.element.remove();
  }
  if (chatRecordsGlobal.length > chatHistoryLimit) { // overflow on global
    var rec = chatRecordsGlobal.shift();
    rec.element.remove();
  }
}
resetChat();
var canResizeChat = true;
flterWnd.addEventListener("mouseover", function(e) {
  canResizeChat = false;
})
flterWnd.addEventListener("mouseout", function(e) {
  canResizeChat = true
})
var eventType = "mousemove";



