var doFilter = false;
var chatOpened = (chatOpen == true) ? "fa-toggle-on" : "fa-toggle-off";
var showPastePreview = false;
var previewText = "";
var demoCanv = document.createElement("canvas");

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

var pm_ui_html = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" type="text/css" href="styles.css">
<div id="pm-container">
  <div class="sidebar">
    <div class="container">
      <button class="sidebar-button" id="move-btn"><i class="fas fa-map-marker"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Location & Coordinates</div>
          <ul class="icon-list">
            <li class="btn" id="goto-coords-btn"><i class="fas fa-paper-plane"></i>Go to Coords<i class="fas fa-check invisible"></i></li>
            <li class="btn" id="coords-link-btn"><i class="fas fa-link"></i>Create Coords Link<i class="fas fa-check invisible"></i></li>
            <li class="btn" id="warp-btn"><i class="fas fa-forward"></i>Warp to Page<i class="fas fa-check invisible"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <button class="sidebar-button" id="region-btn"><i class="fas fa-vector-square"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Area Selection</div>
          <ul class="icon-list">
            <li class="btn" id="region-select-btn"><i class="fas fa-border-style"></i>Region Select Area<i class="invisible fas fa-check"></i></li>
            <li class="btn" id="protect-btn"><i class="fas fa-lock"></i>Protect Area<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="erase-btn"><i class="fas fa-eraser"></i>Erase Area<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="area-copy-btn"><i class="fas fa-clone"></i>Quick Copy Area<i class="fas fa-check invisible"></i></li>
            <li class="btn hidden" id="area-color--btn"><i class="fas fa-palette"></i>Change Area Color<i class="fas fa-toggle-off"></i></li>
            <li class="btn hidden" id="area-bg-btn"><i class="fas fa-paint-roller"></i>Change Area BG<i class="fas fa-toggle-off"></i></li>
          </ul>
        </div>
      </div>
    </div>


    <div class="container">
      <button class="sidebar-button hidden" id="paint-btn"><i class="fas fa-pen"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Draw Tool</div>
          <ul class="icon-list">
            <li class="btn" id="draw-ss-btn"><i class="fas fa-border-none"></i>Sub Cell Draw<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="draw-cs-btn"><i class="fas fa-star"></i>Custom Cell Draw<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="draw-oc-btn"><i class="fas fa-adjust"></i>Opacity Cell Draw<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="draw-ld-btn"><i class="fas fa-ruler-combined"></i>Line Draw<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="draw-unicode-btn"><i class="fas fa-table"></i>Unicode Table<i class="fas fa-toggle-off"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <button class="sidebar-button" id="text-btn"><i class="fas fa-font"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Text Tool</div>
          <ul class="icon-list">
            <li class="btn hidden" id="font-large-btn"><i class="fas fa-expand-alt"></i>Large Font<i class="fas fa-toggle-off"></i></li>
            <li class="btn hidden" id="font-rainbow-btn"><i class="fas fa-rainbow"></i>Rainbow Text<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="font-style-btn"><i class="fas fa-italic"></i>Show Font Styles<i class="fas fa-toggle-off"></i></li>
            <li class="btn hidden" id="font-change-btn"><i class="fas fa-heading"></i>Change Font<i class="fas fa-check invisible"></i></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="hairline"></div>
    <div class="container">
      <input type="color" value="#000" class="sidebar-button" id="foreground-btn">
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Foreground Color</div>
          <ul class="icon-list">
            <li class="btn" id="color-forground-btn"><i class="fas fa-palette"></i>Pick Custom Color<i class="fas fa-check invisible"></i></li>
            <li class="btn hidden" id="color-forground-dropper-btn"><i class="fas fa-eye-dropper"></i>Use Eyedropper<i class="fas fa-check invisible"></i></li>
            <li class="color-list hidden"><i style="color: black" class="fas fa-square"></i><i style="color: white" class="fas fa-square"></i><i style="color: red" class="fas fa-square"></i><i style="color: orange" class="fas fa-square"></i><i style="color: yellow" class="fas fa-square"></i><i style="color: green" class="fas fa-square"></i><i style="color: blue" class="fas fa-square"></i><i style="color: purple" class="fas fa-square"></i></li>

          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <button class="sidebar-button" id="switch-btn"><i class="fas fa-random"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="btn panel-header" id="color-switch-btn">Switch Colors</div>
        </div>
      </div>
    </div>

    <div class=" dropdown">
      <div class="container">
       <input type="color" value="#ffffff" class="sidebar-button" id="background-btn">
        <div class="container-bg">
          <div class="popup-panel">
            <div class="panel-header">Background Color</div>
            <ul class="icon-list">
              <li class="btn" id="color-background-btn"><i class="fas fa-palette"></i>Pick Custom Color<i class="fas fa-check invisible"></i></li>
              <li class="btn hidden" id="color-background-dropper-btn"><i class="fas fa-eye-dropper"></i>Use Eyedropper<i class="fas fa-check invisible"></i></li>
              <li class="color-list hidden"><i style="color: black" class="fas fa-square"></i><i style="color: white" class="fas fa-square"></i><i style="color: red" class="fas fa-square"></i><i style="color: orange" class="fas fa-square"></i><i style="color: yellow" class="fas fa-square"></i><i style="color: green" class="fas fa-square"></i><i style="color: blue" class="fas fa-square"></i><i style="color: purple" class="fas fa-square"></i></li>

            </ul>
          </div>
        </div>
      </div>

    </div>
    <div class="hairline"></div>

    <div class="container">
      <button class="sidebar-button" id="eyedropper-btn"><i class="fas fa-search"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Get Information</div>
          <ul class="icon-list">
            <li class="btn" id="cell-data-btn"><i class="fas fa-list-ul"></i>Show Cell Data<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="grid-btn"><i class="fas fa-th-large"></i>Show Grid<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="subgrid-btn"><i class="fas fa-th"></i>Show Subgrid<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="page-coords-btn"><i class="fas fa-map"></i>Show Page Coords<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="cursor-coords-btn"><i class="fas fa-mouse-pointer"></i>Show Cursor Coords<i class="fas fa-toggle-off"></i></li>
            <li class="btn hidden" id="grid-coords-btn"><i class="fas fa-border-all"></i>Show Grid Coords<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="shortcuts-btn"><i class="fas fa-keyboard"></i>Show Shortcuts<i class="fas fa-toggle-off"></i></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="container">
      <button class="sidebar-button" id="drag-btn"> <i class="fas fa-clipboard"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Clipboard Settings</div>
          <ul class="icon-list">
            <li class="btn" id="paste-preview-btn"><i class="fas fa-check"></i>Paste Preview<i class="fas fa-toggle-off"></i></li>
            <li class="btn" id="url-paste-btn"><i class="fas fa-link"></i>URL Writer<i class="fas fa-toggle-off"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <button class="sidebar-button" id="chat-btn"> <i class="fas fa-comments"></i></button>
      <div class="container-bg">
        <div class="popup-panel">
          <div class="panel-header">Chat Settings</div>
          <ul class="icon-list">
            <li class="btn" id="show-chat-btn"><i class="fas fa-comment-alt"></i>Show Chat<i class="fas ${chatOpened}"></i></li>
            <li class="btn" id="hide-canvas-btn"><i class="fas fa-low-vision"></i>Hide Canvas<i class="fas fa-toggle-off"></i></li>
          </ul>
        </div>
      </div>
    </div>

   
     





    </div>


  </div>
  <div class="header">
    <div class="menu">

      <div id="menu-button-container">
        <button class="menu-button"><i class="fas fa-bars"></i></button>
      </div>
      <div class="menu-content">
        <a href= "https://www.ourworldoftext.com/" id="unload-pm"><i class="fas fa-file"></i> Unload</a>
      </div>
    </div>
    <div class="options-container">
    <div class = "tool-options hidden" id ="area-protect-options"> <button class="close-button" id="close-button-protect"><i class="fas fa-times"> </i> Cancel Protection</button>
<input type="radio" id="owner-only" name="access-level" value="owner-only" class="hidden-radio">
<label for="owner-only"><i class="fas fa-user-shield"></i> Owner-only</label>

<input type="radio" id="member" name="access-level" value="member" class="hidden-radio">
<label for="member"><i class="fas fa-user"></i> Member</label>

<input type="radio" id="public" name="access-level" value="public" class="hidden-radio">
<label for="public"><i class="fas fa-globe"></i> Public</label>

<input type="radio" id="default" name="access-level" value="default" class="hidden-radio">
<label for="default"><i class="fas fa-undo"></i> Default</label>
</div>
    <div class = "tool-options hidden" id ="area-erase-options"> <button class="close-button" id="close-button-erase"><i class="fas fa-times"> </i> Cancel Erase</button>
</div>
<div class = "tool-options hidden" id ="paste-preview-options"> <button class="close-button" id="close-button-paste-preview"><i class="fas fa-times"> </i> Cancel Preview</button>
</div>
    <div class = "tool-options hidden" id ="url-paste-options"> <button class="close-button" id="close-url-paste"><i class="fas fa-times"> </i> Cancel URL Writer</button>
 <input id = "url-paste-input" placeholder="Enter URL">
</div>
    </div>
    <div>
      <a href = "http://wiki.ourworldoftext.com/wiki/Main_Page" target = "_blank" class="header-button" id="wiki-btn"><i class="fas fa-book-open"></i> Wiki</a>
      <a href = "https://www.ourworldoftext.com/home"  target = "_blank" class="header-button" id="user-btn"><i class="fas fa-user"></i></a>
      <div>
      </div>


      <script src="script.js"></script>
    </div>
  </div>
  <div id="info-bar">
    <div class="clipboard-container hidden">
      <div class="clipboard-row">
        <h3>Coords</h3>
      </div><button class="close-button" id="close-button3"><i class="fas fa-times"></i></button>
      <div class="clipboard-row hidden" id="page-coords-container">
        <span class="clipboard-text">Page:</span>
        <span class="clipboard-text">100, 100, 10, 10</span>
        <button class="clipboard-button" id="page-coords-copy-btn">
          <i class="btn far fa-clipboard"></i>
        </button>
      </div>

      <div class="clipboard-row hidden" id="cursor-coords-container">
        <span class="clipboard-text">Cursor:</span>
        <span class="clipboard-text">100, 100, 10, 10</span>
        <button class="clipboard-button" id="cursor-coords-copy-btn">
          <i class="btn  far fa-clipboard"></i>
        </button>
      </div>
    </div>
    <div class="cell-data-container hidden">
      <div class="clipboard-row">
        <h3>Cell Data</h3>
      </div><button class="close-button" id="close-button4"><i class="fas fa-times"></i></button>
      <div class="clipboard-row">
        <span class="clipboard-text">Char:</span>
        <span class="clipboard-text">x</span>
        <button class="clipboard-button" id="cd-char-copy-btn">
          <i class="btn far fa-clipboard"></i>
        </button>
      </div>
      <div class="clipboard-row">
        <span class="clipboard-text">Color:</span>
        <span class="clipboard-text">123456789</span>
        <button class="clipboard-button" id="cd-color-copy-btn">
          <i class="btn far fa-clipboard"></i>
        </button>
      </div>
      <div class="clipboard-row">
        <span class="clipboard-text">Background:</span>
        <span class="clipboard-text">123456789</span>
        <button class="clipboard-button" id="cd-bg-copy-btn">
          <i class="btn far fa-clipboard"></i>
        </button>
      </div>
      <div class="clipboard-row">
        <span class="clipboard-text">Protection:</span>
        <span class="clipboard-text">owner</span>
        <button class="clipboard-button hidden" id="cd-bg-copy-btn">
          <i class="btn far fa-clipboard"></i>
        </button>
      </div>
    </div>
    <div class="shortcuts-container hidden">
      <div class="shortcuts-row">
        <h3>Shortcuts</h3>
      </div><button class="close-button" id="close-button2"><i class="fas fa-times"></i></button>
 
    <dl>
        <li>Copy A Character</li>
        <dl>
            <li>Ctrl + C <small>Where your text cursor is</small></li>
            <li>Ctrl + M <small>Where your mouse cursor is</small></li>
        </dl>
                <li>Copy a cell's color</li>
        <dl>
            <li>Alt + C <small>where your mouse cursor is</small></li>
        </dl>
                       <li>Select & copy a region of text</li>
        <dl>
            <li>Ctrl + A <small>or Alt + G</small></li>
        </dl>
                <li>Set text decoration</li>
        <dl>
            <li>Alt + Q</li>
            <li>Ctrl + Q <small>Not recommended</small></li>
            <li>Ctrl + Shift + F</li>
        </dl>
                        <li>Paste text</li>
        <dl>
            <li>Ctrl + V</li>
        </dl>
                       <li>Undo text</li>
        <dl>
            <li>Ctrl + Z</li>
        </dl>
                       <li>Redo text</li>
        <dl>
            <li>Ctrl + Y</li>
            <li>Ctrl + Shift + Z</li>
        </dl>
                               <li>Go to next line</li>
        <dl>
            <li>Enter</li>
        </dl>
            <li>Go to center (0, 0)</li>
        <dl>
            <li>Home <small>button is typically to the right of keyboard</small></li>
        </dl>
            <li>Quickly add links or protections</li>
        <dl>
            <li>Hold Ctrl to select cells/tiles</li>
            <li>Hold Shift to unselect cells/tiles</li>
            <li>Ctrl + S or Alt + S to save the links/protections to the page</li>
        </dl>
                    <li>Cancel UI <small>cursor, modals, linking, region selection, protection selection</small></li>
        <dl>
            <li>Esc</li>
        </dl>
           <li>Move around freely</li>
        <dl>
            <li>Esc <small>then use one of the four arrow keys</small></li>
        </dl>
           <li>Tab 4 spaces</li>
        <dl>
            <li>Tab</li>
        </dl>
           <li>Zoom</li>
        <dl>
            <li>Ctrl + Mouse wheel</li>
        </dl>
           <li>Scroll left/right</li>
        <dl>
            <li>Ctrl + Mouse wheel</li>
        </dl>
                   <li>Erase</li>
        <dl>
            <li>Backspace</li>
        </dl>
                           <li>Erase in-place</li>
        <dl>
            <li>Delete</li>
        </dl>
                           <li>Move text cursor</li>
        <dl>
            <li>Arrow keys</li>
        </dl>
    </dl>
    
    
      </div>
    </div>



</div>
`

var pm_ui_css =
  `
 @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

 #pm-container {
   font-family: 'Quicksand', sans-serif;
   max-height: 100%;
 }
body{
font-family: 'Quicksand';
}
 .header {
   background-color: #333;
   display: flex;
   align-items: center;
   height: 2em;
   position: fixed;
   top: 0px;
   left: 0px;
   width: 100vw;
   z-index: 2000;
   border-bottom: 4px solid #1d1d1d;
   justify-content: space-between;
 }

 .menu {
   position: relative;
 }

 .menu-button {
   background: none;
   border: none;
   color: #fff;
   cursor: pointer;
 }

 .menu-content {
   display: none;
   position: absolute;
   background-color: #f9f9f9;
   min-width: 160px;
   box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
   z-index: 1;
   padding: 5px;
 }

 .menu-content button {
   display: block;
   background: none;
   border: none;
   color: #333;
   padding: 5px 10px;
   cursor: pointer;
   transition: background-color 0.3s;
 }

 .dropdown-content button {
   display: block;
   background: none;
   border: none;
   color: #333;
   padding: 5px 10px;
   cursor: pointer;
   transition: background-color 0.3s;
 }

 .tabs button {
   height: 100%;
   border-radius: 4px;
   padding: 0.1em
 }

 .menu-content button:hover {
   background-color: #ddd;
 }

 .menu:hover .menu-content {
   display: block;
 }

 #menu-button-container {
   display: flex;
   width: 2em;
   flex-direction: column;
   align-items: center;
   justify-content: top;
   z-index: 1000;
 }

 .header-button {
   background: none;
   border: none;
   color: #fff;
   cursor: pointer;
   margin-left: 1em;
   margin-right: 1em;
 }

 .sidebar {
   position: fixed;
   top: 0px;
   left: 0;
   height: 100vh;
   width: 2em;
   background-color: #333;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: top;
   padding-top: 3em;
   z-index: 1000;
 }

 .sidebar-button {
   background: none;
   border: none;
   color: #fff;
   cursor: pointer;
   margin-bottom: 10px;
   transition: opacity 0.3s;
   width: 1.7em;
   height: 1.7em;
   border-radius: 0.3em;
   display: flex;
   justify-content: center;
   align-items: center;
 }

 .sidebar-button:hover {
   background: #444;
 }

 .dropdown {
   position: relative;
   display: inline-block;
 }

 .dropdown-content {
   display: none;
   position: absolute;
   background-color: #f9f9f9;
   min-width: 160px;
   box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
   z-index: 1;
   padding: 5px;
 }



 .dropdown-content button:hover {
   background-color: #ddd;
 }

 .chat-box button:hover {
   background-color: #555;

 }

 .dropdown:hover .dropdown-content {
   display: block;
 }

 .hairline {
   border-top: 2px solid #545454;
   display: block;
   width: 100%;
   margin: 0.2em;
 }

 .container {
   position: relative;
   display: inline-block;
 }

 .popup-panel {
   position: absolute;
   top: 0;
   left: 100%;
   width: 15em;
   background-color: #1d1d1d;
   border: 1px solid #ccc;
   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
   display: none;
   border-radius: 8px;
   color: white;
   font-size: small;
 }

 .panel-header {
   padding: 10px;
   color: #fff;
   font-weight: bold;
   border-radius: 8px;
 }

 .icon-list {
   list-style: none;
   padding: 0;
   margin: 0;
 }

 .icon-list li {
   padding: 10px;
   border-bottom: 1px solid #ccc;
   display: flex;
   align-items: center;
   cursor: pointer;
   flex-direction: row;
   align-content: stretch;
   justify-content: space-between;
   flex-wrap: wrap;
 }

 .color-list i {
   outline: auto;
 }

 .icon-list li i {
   margin-right: 10px;
 }

 .color-list i:hover {
   opacity: 0.5;
 }



 .container:hover .popup-panel {
   display: block;
 }

.invisible {
   color: transparent!important;
 }


 .container-bg {
   width: 1em;
   display: block;
   height: 100%;
   position: absolute;
   top: 0px;
   left: 100%;
 }



 .btn:hover {
   background: #333333;
   cursor: pointer;
 }

 .chat-box {
   position: absolute;
   bottom: 3em;
   left: 100%;
   background-color: #333;
   color: #fff;
   padding: 20px;
   width: 500px;
   max-width: 600px;
   display: flex;
   flex-direction: column;
   flex-wrap: nowrap;
   height: 80%;
   font-size: small;
   border-left: 4px solid #1d1d1d;
   z-index: -1;
 }

 .light-theme {
   background-color: #fff;
   color: #333;
 }

 #theme-toggle-button {
   background: none;
   border: none;
   cursor: pointer;
   position: absolute;
   right: 2em;
   color: #ccc;
   font-size: 16px;
 }

 #theme-toggle-button:hover {
   color: #fff;
 }

 .close-button {
   background: none;
   border: none;
   cursor: pointer;
   position: absolute;
   right: 10px;
   color: #ccc;
   font-size: 16px;
 }

 .close-button:hover {
   color: #fff;
 }

 .tabs {
   margin-bottom: 10px;
 }

 .tabs .tab {
   background: none;
   border: none;
   cursor: pointer;
   font-size: 16px;
   padding: 10px 20px;
   color: #ccc;
   position: relative;
 }

 .tab.active {
   background-color: #555;
   color: #fff;
 }

 .content {
   padding: 10px;
   border: 1px solid #555;
   overflow-y: scroll;
   height: inherit;
 }

 .page {
   display: none;
 }

 .page.active {
   display: block;
 }

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

 .chat-input {
   display: flex;
   align-items: center;
   margin-top: 0.3em;
 }

 .chat-input input[type="text"] {
   flex-grow: 1;
   padding: 8px;
   border: none;
   border-radius: 4px;
 }

 .chat-input button {
   background: none;
   border: none;
   cursor: pointer;
   padding: 8px;
   background-color: #555;
   color: #fff;
   border-radius: 4px;
   margin-left: 10px;
 }

 .chat-input button:hover {
   background-color: #777;
 }

 .chat-entry {
   margin-top: 1em;
 }

 .chat-entry a {
   background: black;
   color: white;
   border-radius: 5px;
   padding: 0.2em;
 }

 .light-theme .chat-entry a {
   background: #0000000f;
   color: black;
   border-radius: 5px;
   padding: 0.2em;
 }

 #fltr-popup {
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

#chat_window {
    position: absolute;
    background-color: #333333;
    border: solid 1px black;
    display: flex;
    flex-flow: column;
    padding: 0.5em;
    border-radius: 5px;
}

#chat_window.dark {
    background-color: #333333;
    border: solid 1px black;
    color: white;
}
.chatfield {

    font-family: 'Quicksand';
    font-size: small;
}
.dark .chatfield {
    border: solid 1px black;
    background-color: #292929;

}
.chatfield a {
    padding: 0.2em;
    border-radius: 5px;
    margin-right: 1em;
    min-width: 10em;
}
.dark .chatfield a {
    color: white!important;
}

.chatfield > div {
    padding: 0.3em;
    border-bottom: 4px solid #efefef;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    font-weight: bold;
}

.dark .chatfield > div {
border-bottom: 4px solid #333333

}
.chatfield > div {
    padding: 0.3em;
    border-bottom: 4px solid #e2e2e2
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
#chat_upper {
    color: white;
    font-family: 'Quicksand';
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
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
    color: #ccc;
}
#filter-toggle:hover {
    color: white;
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
#wiki-btn,#user-btn {
    color: #ddd;
    font-family: 'Quicksand';
}	
#wiki-btn:hover,#user-btn:hover {
    color: #fff;
}	
#unload-pm{
font-family: 'Quicksand';
}
`

var pm_stylesheet = document.createElement("style");
var pm_html = document.createElement("div");
pm_stylesheet.innerHTML = pm_ui_css;
pm_html.innerHTML = pm_ui_html;
document.head.appendChild(pm_stylesheet);
document.body.appendChild(pm_html);

const chat_upper = document.getElementById("chat_upper");
const darkb = document.createElement("button");
var flterWnd = document.createElement("button");
flterWnd.id = "fltr-popup";
flterWnd.class = "fltr-popup";
flterWnd.classList.add("hidden");
flterWnd.innerHTML = `
        <div class="fltr-popup-content">
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
        `;
elm.chat_window.appendChild(flterWnd)

darkb.class = "theme-toggle-button";
darkb.id = "theme-toggle-button";
darkb.innerHTML = `<i class="fas fa-adjust"></i>`

const closeCB = document.createElement("button");
closeCB.class = "close-button btn";
closeCB.id = "close-chatbox";
closeCB.innerHTML = `<i class="fas fa-times"></i>`

const fltr_tgl = document.createElement("button");
fltr_tgl.class = "toggle-filter btn";
fltr_tgl.id = "filter-toggle";
fltr_tgl.innerHTML = `<i class="fas fa-filter"></i> Filter <i class="fas fa-toggle-off"></i>`

fltr_tgl.classList.add("btn");

chat_upper.appendChild(fltr_tgl);
chat_upper.appendChild(darkb)
chat_upper.appendChild(closeCB);


// Get the elements
var isErasing = false;
const thisPage = document.getElementById('this-page');
const globalPage = document.getElementById('global-page');
const filterToggle = document.getElementById('filter-toggle');
const themeToggleButton = document.getElementById('theme-toggle-button');
const content = document.querySelector('.content');
const show_chat_btn = document.getElementById("show-chat-btn");
const chatbox_container = document.getElementsByClassName("chat-box")[0]
const chatbox_toggle = show_chat_btn.children[1];
const hide_canvas_btn = document.getElementById("hide-canvas-btn");
const hide_canvas_toggle = hide_canvas_btn.children[1];
const fltr_btn = document.getElementById("filter-toggle");
const fltr_btn_toggle = fltr_btn.children[1];
const fltr_popup = document.getElementById("fltr-popup");
const filter_anon = document.getElementById("filter-anon");
const filter_anon_toggle = filter_anon.children[1];
const ba_blank = document.getElementById("ba_blank");
const blacklist_btn = document.getElementById("add-blacklist-btn");
const fltr_blacklist_filters = document.getElementById("fltr-blacklist-filters");
const whitelist_btn = document.getElementById("add-whitelist-btn");
const fltr_whitelist_filters = document.getElementById("fltr-whitelist-filters");
const cursor_coords_btn = document.getElementById("cursor-coords-btn");
const cursor_coords_toggle = cursor_coords_btn.children[1];
const cursor_coords_container = document.getElementById("cursor-coords-container")
const page_coords_btn = document.getElementById("page-coords-btn");
const page_coords_toggle = page_coords_btn.children[1];
const page_coords_container = document.getElementById("page-coords-container");
const info_bar = document.getElementById("info-bar");
const chat_close_button = document.getElementById("close-button");
const clipboard_container = document.getElementsByClassName("clipboard-container")[0];
const shortcuts_container = document.getElementsByClassName("shortcuts-container")[0];
const shortcuts_btn = document.getElementById("shortcuts-btn");
const shortcuts_toggle = shortcuts_btn.children[1];
const grid_btn = document.getElementById("grid-btn");
const grid_toggle = grid_btn.children[1];
const sub_grid_btn = document.getElementById("subgrid-btn");
const sub_grid_toggle = sub_grid_btn.children[1];
const cell_data_btn = document.getElementById("cell-data-btn");
const cell_data_toggle = cell_data_btn.children[1];
const cell_data_container = document.getElementsByClassName("cell-data-container")[0];
const goto_coords_btn = document.getElementById("goto-coords-btn");
const coord_link_btn = document.getElementById("coords-link-btn");
const warp_btn = document.getElementById("warp-btn");
const region_select_btn = document.getElementById("region-select-btn");
const protect_btn = document.getElementById("protect-btn");
const protect_btn_toggle = protect_btn.children[1];
const area_protect_options = document.getElementById("area-protect-options");
const close_button_protect = document.getElementById("close-button-protect");
const owner_only = document.getElementById("owner-only");
const member = document.getElementById("member");
const public = document.getElementById("public");
const default_protect = document.getElementById("default");
const erase_btn = document.getElementById("erase-btn");
const erase_btn_toggle = erase_btn.children[1];
const area_erase_options = document.getElementById("area-erase-options");
const close_button_erase = document.getElementById("close-button-erase");
const area_copy_btn = document.getElementById("area-copy-btn");
const url_paste_btn = document.getElementById("url-paste-btn");
const url_paste_toggle = url_paste_btn.children[1];
const url_paste_input = document.getElementById("url-paste-input");
const close_url_paste = document.getElementById("close-url-paste");
const url_paste_options = document.getElementById("url-paste-options")
const paste_preview = document.getElementById("paste-preview-btn");
const paste_preview_toggle = paste_preview.children[1];
const pastePreviewHeader = document.getElementById("paste-preview-options");
const close_button_paste_preview = document.getElementById("close-button-paste-preview");
// Toggle filter
filterToggle.addEventListener('click', () => {
  doFilter = (flterWnd.classList.contains("hidden"));
  resetChat();
});

// Get the elements


// Toggle between light and dark themes
themeToggleButton.addEventListener('click', () => {
  elm.chat_window.classList.toggle('dark');
});

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

function addList(ele) {
  var newdiv = document.createElement("div")
  newdiv.innerHTML = ele.parentElement.outerHTML;
  ele.parentElement.parentElement.appendChild(newdiv)
  newdiv.children[0].children[1].addEventListener('click', () => {
    addList(ele)
  })
}

function setCoordsVisibility() {
  const setHidden_Coords = !(cursor_coords_container.classList.contains("hidden") == false || page_coords_container.classList.contains("hidden") == false)
  clipboard_container.classList.toggle("hidden", setHidden_Coords);
}


url_paste_btn.addEventListener('click', () => {
  toggle(url_paste_options);
  toggleIcon(url_paste_toggle, url_paste_options)
})
close_url_paste.addEventListener('click', () => {
  url_paste_btn.click();
})
show_chat_btn.addEventListener('click', () => {
  toggle(elm.chat_window);
  toggleIcon(chatbox_toggle, elm.chat_window);

})
paste_preview.addEventListener('click', () => {
  toggle(pastePreviewHeader);
  toggleIcon(paste_preview_toggle, pastePreviewHeader)
  showPastePreview = !showPastePreview;
  demoCanv.classList.toggle("hidden", !showPastePreview)
})
close_button_paste_preview.addEventListener('click', () => {
  paste_preview.click();
})
closeCB.addEventListener('click', () => {
  toggle(elm.chat_window);
  toggleIcon(chatbox_toggle, elm.chat_window)
})

hide_canvas_btn.addEventListener('click', () => {
  toggle(owot);
  toggleIcon(hide_canvas_toggle, owot, true)
})

fltr_btn.addEventListener('click', () => {
  toggle(fltr_popup);
  toggleIcon(fltr_btn_toggle, fltr_popup)
})

filter_anon.addEventListener('click', () => {
  toggle(ba_blank);
  toggleIcon(filter_anon_toggle, ba_blank, true);
  resetChat();
})

cursor_coords_btn.addEventListener('click', () => {
  toggle(cursor_coords_container);
  toggleIcon(cursor_coords_toggle, cursor_coords_container);
  setCoordsVisibility();
})

page_coords_btn.addEventListener('click', () => {
  toggle(page_coords_container);
  toggleIcon(page_coords_toggle, page_coords_container);
  setCoordsVisibility();
})

shortcuts_btn.addEventListener('click', () => {
  toggle(shortcuts_container);
  toggleIcon(shortcuts_toggle, shortcuts_container);
})

blacklist_btn.addEventListener('click', () => {
  addList(blacklist_btn)
})

whitelist_btn.addEventListener('click', () => {
  addList(whitelist_btn)
})

grid_btn.addEventListener('click', () => {
  gridEnabled = grid_toggle.classList.contains("fa-toggle-off");
  w.redraw(true);
  toggleIconBool(grid_toggle, gridEnabled);
})
sub_grid_btn.addEventListener('click', () => {
  subgridEnabled = sub_grid_toggle.classList.contains("fa-toggle-off");
  if (subgridEnabled) {
    gridEnabled = true;
    toggleIconBool(grid_toggle, true);
  }
  w.redraw(true);
  toggleIconBool(sub_grid_toggle, subgridEnabled);

})
cell_data_btn.addEventListener('click', () => {
  toggle(cell_data_container);
  toggleIcon(cell_data_toggle, cell_data_container);
  setCoordsVisibility();
})
warp_btn.addEventListener('click', () => {
  w.ui.warpModal.open();
})
region_select_btn.addEventListener('click', () => {
  w.regionSelect.startSelection();
})
goto_coords_btn.addEventListener('click', () => {
  w.goToCoord()
})
coord_link_btn.addEventListener('click', () => {
  w.coordLink()
})

protect_btn.addEventListener('click', () => {
  toggle(area_protect_options);
  toggleIcon(protect_btn_toggle, area_protect_options)
})
close_button_protect.addEventListener('click', () => {
  toggle(area_protect_options);
  toggleIcon(protect_btn_toggle, area_protect_options);
  stopTileUI();
  removeTileProtectHighlight();
})

function makeWarpModal() {
  var modal = new Modal();
  modal.createForm();
  modal.setFormTitle("Enter the page you would like to warp to");
  var loc = modal.addEntry("https://ourworldoftext.com/", "text", "text").input;
  modal.setMaximumSize(360, 300);
  modal.onSubmit(function() {
    api_chat_send(`/warp ${loc.value}`)
  });
  w.ui.warpModal = modal;
}
document.addEventListener('mousemove', () => {
  if (isErasing) {
    w.eraseSelect.startSelection();
  }
})
makeWarpModal();
owner_only.addEventListener('click', () => {
  w.doProtect("owner-only");
})
member.addEventListener('click', () => {
  w.doProtect("member-only");
})
public.addEventListener('click', () => {
  w.doProtect("public");
})
default_protect.addEventListener('click', () => {
  w.doProtect("public", true);
})


let eraseEvent;
w.eraseSelect = new RegionSelection();

owot.addEventListener("mousedown", (e) => {
  eraseEvent = e;
});


function CellToPixelCoords(tileX, tileY, charX, charY) {
  if (Array.isArray(tileX)) {
    // If the first argument is an array, destructure the values
    [tileX, tileY, charX, charY] = tileX;
  }
tileX /=2;
tileY /=2;   
  // calculate in-tile cell position
  var charXInTile = tileX * tileC + charX;
  var charYInTile = tileY * tileR + charY;

  // calculate global cell position
  var charXGlobal = Math.floor(tileX * tileC * cellW + charXInTile * cellW + positionX + Math.trunc(owotWidth / 2));
  var charYGlobal = Math.floor(tileY * tileR * cellH + charYInTile * cellH + positionY + Math.trunc(owotHeight / 2));

  return [charXGlobal, charYGlobal];
}

function eraseSelectionStart(start, end, width, height) {
  renderCursor(start)
  w.eraseSelect.stopSelectionUI(true)
  let [pageX, pageY] = CellToPixelCoords(start)
  
  eraseEvent.pageX = pageX;
  eraseEvent.pageY = pageY;
  event_mouseup(eraseEvent, pageX, pageY);
  let pasteString = "";
  let [X, Y, x, y] = start; //topleft
  let [a, b, c, d] = end; //bottom right
  let topRight = [a, Y, c, y]; //top right
  let bottomLeft = [X, b, x, d] // bottom left

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      pasteString += " ";
    }
    if (h !== height - 1) {
      pasteString += "\n";
    }
  }
  paste(pasteString);

}
const paste = (pasteString) => {

  elm.textInput.value = pasteString;

};

function erasetSelectionCancel() {
  elm.erase_selection.style.color = "";
}

function eraseSelection() {
  if (w.eraseSelect.isSelecting) {
    elm.erase_selection.style.color = "";
    w.eraseSelect.stopSelectionUI();
  } else {
    elm.erase_selection.style.color = "#F3DB65";
    w.eraseSelect.startSelection();
  }
}
w.eraseSelect.onselection(eraseSelectionStart);

erase_btn.addEventListener('click', () => {
  isErasing = !erase_btn_toggle.classList.contains("fa-toggle-on");
  toggleIconBool(erase_btn_toggle, isErasing);
  toggle(area_erase_options);



  if (!isErasing) {
    w.eraseSelect.deselect();
    w.eraseSelect.stopSelectionUI()
  }
})

close_button_erase.addEventListener('click', () => {
  isErasing = !erase_btn_toggle.classList.contains("fa-toggle-on");
  toggleIconBool(erase_btn_toggle, isErasing);
  toggle(area_erase_options);



  if (!isErasing) {
    w.eraseSelect.deselect();
    w.eraseSelect.stopSelectionUI()
  }
})


w.regionCopy = new RegionSelection();
w.regionCopy.onselection(handleRegionSelectionCopy);

function handleRegionSelectionCopy(coordA, coordB, regWidth, regHeight) {
  handleRegionSelection(coordA, coordB, regWidth, regHeight);
  w.ui.selectionModal.cbList[0].cbElm.checked = false;
  w.ui.selectionModal.cbList[0].elm.click()
  w.ui.selectionModal.cbList[1].cbElm.checked = false;
  w.ui.selectionModal.cbList[1].elm.click()
  w.ui.selectionModal.cbList[2].cbElm.checked = false;
  w.ui.selectionModal.cbList[2].elm.click()
  w.ui.selectionModal.cbList[3].cbElm.checked = false;
  w.ui.selectionModal.cbList[3].elm.click()
  w.ui.selectionModal.client.children[0].children[0].click();
  w.ui.selectionModal.close();
  Swal.fire({
    title: 'copied',
    backdrop: false,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 1000,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    }
  })
  w.regionCopy.deselect();
  w.regionCopy.stopSelectionUI()
}
area_copy_btn.addEventListener('click', () => {
  w.regionCopy.startSelection();
})

const foregroundColorPickerBtn = document.getElementById("color-forground-btn");
const foregroundColorPicker = document.getElementById("foreground-btn");
const backgroundColorPickerBtn = document.getElementById("color-background-btn");
const backgroundColorPicker = document.getElementById("background-btn");
foregroundColorPickerBtn.addEventListener("click", function() {
  foregroundColorPicker.click();
});

foregroundColorPicker.addEventListener("input", function() {
  const selectedColor = foregroundColorPicker.value;
  const rgbColor = hexToRgb(selectedColor);
  YourWorld.Color = rgbColor;
});

// Function to convert hexadecimal color to RGB format
function hexToRgb(hex) {
  const hexValue = hex.replace("#", "");
  const red = parseInt(hexValue.substring(0, 2), 16);
  const green = parseInt(hexValue.substring(2, 4), 16);
  const blue = parseInt(hexValue.substring(4, 6), 16);
  const colorInt = rgb_to_int(red, green, blue);
  return colorInt;
}

backgroundColorPickerBtn.addEventListener("click", function() {
  backgroundColorPicker.click();
});

backgroundColorPicker.addEventListener("input", function() {
  const selectedColor = backgroundColorPicker.value;
  const rgbColor = hexToRgb(selectedColor);
  YourWorld.BgColor = rgbColor;
});

const switch_btn = document.getElementById("switch-btn");
const color_switch_btn = document.getElementById("color-switch-btn");
color_switch_btn.addEventListener("click", function() {
  switch_btn.click();
});

switch_btn.addEventListener('click', () => {
  const bg = backgroundColorPicker.value;
  const fg = foregroundColorPicker.value;
  backgroundColorPicker.value = fg;
  foregroundColorPicker.value = bg;

  YourWorld.BgColor = hexToRgb(fg);
  YourWorld.Color = hexToRgb(bg);
})
w.on("cursorMove", function() {
  document.getElementById("cursor-coords-container").children[1].innerText = JSON.stringify(cursorCoords)
  updateCoordDisplay_pm();
  updateCellDataDisplay();
})

document.getElementById("cursor-coords-container").children[1].innerText = JSON.stringify(cursorCoords);

function updateCellDataDisplay() {
  if (cursorCoords !== null) {
    const {
      bgColor,
      char,
      color,
      protection
    } = getCharInfo();

    var types = ["public", "member-only", "owner-only"];
    cd_char = cell_data_container.children[2].children[1].innerText = `"${char}"`;
    cd_color = cell_data_container.children[3].children[1].innerText = color;
    cd_bg = cell_data_container.children[4].children[1].innerText = bgColor;


    cd_protection = cell_data_container.children[5].children[1].innerText = types[protection];


  }

}

function updateCoordDisplay_pm() {
  var tileCoordX = -positionX / tileW;
  var tileCoordY = -positionY / tileH;
  var centerY = -Math.floor(tileCoordY / coordSizeY);
  var centerX = Math.floor(tileCoordX / coordSizeX);
  document.getElementById("page-coords-container").children[1].innerText = `X:${centerX} Y:${centerY}`

}
w.on("cursorHide", updateCoordDisplay_pm);


w.ui.coordGotoModal.onClose(function() {
  w.emit("cursorHide");

})
updateCoordDisplay_pm();

const copy_cursor_coords_btn = document.getElementById("cursor-coords-copy-btn");
copy_cursor_coords_btn.addEventListener("click", function() {
  const textToCopy = JSON.stringify(cursorCoords)
  navigator.clipboard.writeText(textToCopy)
    .then(function() {
      console.log("Text copied to clipboard:", textToCopy);
    })
    .catch(function(error) {
      console.error("Unable to copy text to clipboard:", error);
    });
});

const copy_page_coords_btn = document.getElementById("page-coords-copy-btn");
copy_page_coords_btn.addEventListener("click", function() {
  var tileCoordX = -positionX / tileW;
  var tileCoordY = -positionY / tileH;
  var centerY = -Math.floor(tileCoordY / coordSizeY);
  var centerX = Math.floor(tileCoordX / coordSizeX);


  const textToCopy = `X:${centerX} Y:${centerY}`;
  w.clipboard.copy(textToCopy);
});
const font_style_btn = document.getElementById("font-style-btn");
const font_style_toggle = font_style_btn.children[1];
font_style_btn.addEventListener("click", function() {
  toggleTextDecoBar();
})

function toggleTextDecoBar() {
  if (elm.text_decorations.style.display == "") {
    elm.text_decorations.style.display = "none";
  } else {
    elm.text_decorations.style.display = "";
  }
  toggleIconBool(font_style_toggle, elm.text_decorations.style.display == "")
}
Permissions.can_edit_tile = function() {
  return true
}
const cd_char_clip = cell_data_container.children[2].children[2];
const cd_color_clip = cell_data_container.children[3].children[2];
const cd_bg_clip = cell_data_container.children[4].children[2];
cd_char_clip.addEventListener("click", function() {
  w.clipboard.copy(cell_data_container.children[2].children[1].innerText)
})
cd_color_clip.addEventListener("click", function() {
  w.clipboard.copy(cell_data_container.children[3].children[1].innerText)
})

cd_bg_clip.addEventListener("click", function() {
  w.clipboard.copy(cell_data_container.children[4].children[1].innerText)
})


const shortcuts_close_btn = document.getElementById("close-button2");
shortcuts_close_btn.addEventListener('click', () => {
  shortcuts_btn.click();
})
var pasteURL = false;


function urlPaste() {
  //$u"www.poop.com"c
}

function textcode_parser(value, coords, defaultColor, defaultBgColor) {


  if (url_paste_options.classList.contains("hidden") == false) {
    const mainArray = ['\x1B', '$', 'u', '"', '"'];
    const insertArray = url_paste_input.value.split("");
    const newArray = [...mainArray];
    newArray.splice(newArray.length - 1, 0, ...insertArray);
    value = value.flatMap(item => [...newArray, item]);
  }

  if (typeof value == "string") value = w.split(value);
  var hex = "ABCDEF";
  var pasteColor = defaultColor;
  if (!pasteColor) pasteColor = 0;
  var pasteBgColor = defaultBgColor;
  if (pasteBgColor == void 0) pasteBgColor = -1;
  var index = 0;
  var off = {
    tileX: 0,
    tileY: 0,
    charX: 0,
    charY: 0
  };
  if (coords) {
    off.tileX = coords.tileX;
    off.tileY = coords.tileY;
    off.charX = coords.charX;
    off.charY = coords.charY;
  }
  var pos = {
    tileX: 0,
    tileY: 0,
    charX: 0,
    charY: 0
  };




  var next = function() {

    if (index >= value.length) return -1;
    var chr = value[index];

    var doWriteChar = true;
    var newline = true;
    if (chr == "\x1b") {
      doWriteChar = false;
      var hCode = value[index + 1];
      if (hCode == "$") { // contains links
        index += 2;
        var lType = value[index];
        index++;
        if (lType == "c") { // coord
          var strPoint = index;
          var buf = "";
          var mode = 0;
          while (true) {
            if (value[strPoint] == "[" && mode == 0) {
              mode = 1;
              if (++strPoint >= value.length) break;
              continue;
            }
            if (value[strPoint] == "]" && mode == 1) {
              strPoint++;
              break;
            }
            if (mode == 1) {
              buf += value[strPoint];
              if (++strPoint >= value.length) break;
              continue;
            }
            if (++strPoint >= value.length) break;
          }
          index = strPoint;
          buf = buf.split(",");
          var coordTileX = parseFloat(buf[0].trim());
          var coordTileY = parseFloat(buf[1].trim());
          var charPos = coordinateAdd(pos.tileX, pos.tileY, pos.charX, pos.charY,
            off.tileX, off.tileY, off.charX, off.charY);
          return {
            type: "link",
            linkType: "coord",
            tileX: charPos[0],
            tileY: charPos[1],
            charX: charPos[2],
            charY: charPos[3],
            coord_tileX: coordTileX,
            coord_tileY: coordTileY
          };
        } else if (lType == "u") { // urllink
          var strPoint = index;
          var buf = "";
          var quotMode = 0;
          while (true) {
            if (value[strPoint] == "\"" && quotMode == 0) {
              quotMode = 1;
              if (++strPoint >= value.length) break;
              continue;
            }
            if (value[strPoint] == "\"" && quotMode == 1) {
              strPoint++;
              break;
            }
            if (quotMode == 1) {
              if (value[strPoint] == "\\") {
                quotMode = 2;
                if (++strPoint >= value.length) break;
                continue;
              }
              buf += value[strPoint];
            }
            if (quotMode == 2) {
              buf += value[strPoint];
              quotMode = 1;
              if (++strPoint >= value.length) break;
              continue;
            }
            if (++strPoint >= value.length) break;
          }
          index = strPoint;
          var charPos = coordinateAdd(pos.tileX, pos.tileY, pos.charX, pos.charY,
            off.tileX, off.tileY, off.charX, off.charY);
          return {
            type: "link",
            linkType: "url",
            tileX: charPos[0],
            tileY: charPos[1],
            charX: charPos[2],
            charY: charPos[3],
            url: buf
          };
        }
      } else if (hCode == "P") { // contains area protections
        index += 2;
        var protType = parseInt(value[index]);
        index++;
        if (isNaN(protType)) protType = 0;
        if (!(protType >= 0 && protType <= 2)) protType = 0;
        var charPos = coordinateAdd(pos.tileX, pos.tileY, pos.charX, pos.charY,
          off.tileX, off.tileY, off.charX, off.charY);
        return {
          type: "protect",
          protType: protType,
          tileX: charPos[0],
          tileY: charPos[1],
          charX: charPos[2],
          charY: charPos[3]
        };
      } else if (hCode == "*") { // skip character
        index++;
        chr = "";
        doWriteChar = true;
      } else if (hCode == "x" || (hCode >= "A" && hCode <= "F")) { // colored paste
        var cCol = "";
        if (hCode == "x") {
          cCol = "000000";
          pasteBgColor = -1;
          index += 2;
        } else { // we use 'F' now, which indicates a length of 6.
          var code = hex.indexOf(hCode);
          if (code > -1) {
            cCol = value.slice(index + 2, index + 2 + code + 1).join("");
            index += code + 1; // index 5 plus one.
          }
          index += 2;
        }
        pasteColor = parseInt(cCol, 16);
        return {
          type: "yield"
        };
      } else if (hCode == "b") { // background cell color
        var bCol = value.slice(index + 2, index + 2 + 6).join("");
        index += 6 + 2;
        pasteBgColor = parseInt(bCol, 16);
        if (isNaN(pasteBgColor)) pasteBgColor = -1;
        return {
          type: "yield"
        };
      } else {
        index += 2;
        doWriteChar = true;
        if (hCode == "\n") { // paste newline character itself
          chr = "\n";
          newline = false;
        } else if (hCode == "\r") { // paste carriage return character itself
          chr = "\r";
          newline = false;
        } else if (hCode == "\x1b") { // paste ESC character itself
          chr = "\x1b";
        } else {
          chr = hCode;
        }
      }
    } else if (chr.codePointAt(0) >= 0x1F1E6 && chr.codePointAt(0) <= 0x1F1FF) { // flag emojis
      index++;
      while (true) { // TODO: refactor
        if (index >= value.length) break;
        var f2 = value[index];
        if (!(f2.codePointAt(0) >= 0x1F1E6 && f2.codePointAt(0) <= 0x1F1FF)) {
          //index--;
          break;
        }
        var alpha1 = chr.codePointAt(0) - 0x1F1E6;
        var alpha2 = f2.codePointAt(0) - 0x1F1E6;
        var residue = f2.slice(2); // combining characters / formatting
        chr = String.fromCodePoint(0xFF000 + (alpha1 * 26) + alpha2) + residue; // private use area
        index++;
        break;
      }
    } else {
      index++;
    }
    var charPos = coordinateAdd(pos.tileX, pos.tileY, pos.charX, pos.charY,
      off.tileX, off.tileY, off.charX, off.charY);
    propagatePosition(pos, chr, false, true);
    return {
      type: "char",
      char: chr,
      color: pasteColor,
      bgColor: pasteBgColor,
      writable: doWriteChar,
      newline: newline, // if false, interpret newline characters as characters
      tileX: charPos[0],
      tileY: charPos[1],
      charX: charPos[2],
      charY: charPos[3]
    };
  }
  return {
    next: next,
    nextItem: function() {
      while (true) {
        var item = next();
        if (item == -1) return -1;
        if (item.type == "yield") continue;
        return item;
      }
    }
  };
}

function rgbToHex(rgbArray) {
  const [r, g, b] = rgbArray;
  const hexValue = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return `#${hexValue}`;
}
document.getElementById("foreground-btn").value = rgbToHex(int_to_rgb(YourWorld.Color));
document.getElementById("background-btn").value = rgbToHex(int_to_rgb(YourWorld.BgColor));
clearInterval(char_input_check)
var char_input_check = setInterval(function() {
  if (Modal.isOpen) return;
  if (write_busy) return;
  if (state.worldModel.char_rate[0] == 0 && !state.userModel.is_member) {
    elm.textInput.value = "";
    return;
  }
  var value = elm.textInput.value;
  var hasErased = getDate() - previousErase < 1000;
  if (!value) {
    if (hasErased) {
      elm.textInput.value = "\x7F";
    }
    return;
  }
  if (value == "\x7F") {
    if (!hasErased) {
      elm.textInput.value = "";
    }
    return;
  }
  stabilizeTextInput();
  value = w.split(value.replace(/\r\n/g, "\n").replace(/\x7F/g, ""));
  if (value.length == 1 && url_paste_options.classList.contains("hidden") == true) {
    writeChar(value[0]);
    elm.textInput.value = "";
    return;
  }
  clearInterval(pasteInterval);
  var pastePerm = Permissions.can_paste(state.userModel, state.worldModel);
  var requestNextItem = true;
  if (!cursorCoords) {
    elm.textInput.value = "";
    return;
  }
  var parser = textcode_parser(value, {
    tileX: cursorCoords[0],
    tileY: cursorCoords[1],
    charX: cursorCoords[2],
    charY: cursorCoords[3]
  }, YourWorld.Color, YourWorld.BgColor);
  elm.textInput.value = "";
  var item;
  var charCount = 0;
  var pasteFunc = function() {
    if (requestNextItem) {
      item = parser.nextItem();
    } else {
      requestNextItem = true;
    }
    if (item == -1) {
      return -1;
    }
    if (item.type == "char") {
      if (item.writable) {
        if (item.char == "\x7F") {
          return true;
        }
        var res = writeChar(item.char, false, item.color, !item.newline, 0, item.bgColor);
        if (res === null) {
          // pause until tile loads
          requestNextItem = false;
          return false;
        }
        charCount++;
      }
    } else if (item.type == "link") {
      var undoTop = undoBuffer.top();
      if (item.linkType == "url" && Permissions.can_urllink(state.userModel, state.worldModel)) {
        linkQueue.push(["url", item.tileX, item.tileY, item.charX, item.charY, item.url]);
      } else if (item.linkType == "coord" && Permissions.can_coordlink(state.userModel, state.worldModel)) {
        linkQueue.push(["coord", item.tileX, item.tileY, item.charX, item.charY, item.coord_tileX, item.coord_tileY]);
      }
      // a link was potentially put over a character that was changed to an identical character,
      // meaning it did not get added to the undo buffer.
      if (!isCharLatestInUndoBuffer(item.tileX, item.tileY, item.charX, item.charY)) {
        markCharacterAsUndoable(item.tileX, item.tileY, item.charX, item.charY);
      }
    } else if (item.type == "protect") {
      var protType = item.protType;
      var canProtect = true;
      if (protType <= 1) { // public, member
        if (!Permissions.can_protect_tiles(state.userModel, state.worldModel)) canProtect = false;
      }
      if (protType == 2) { // owner
        if (!Permissions.can_admin(state.userModel, state.worldModel)) protType = 1; // member
      }
      if (canProtect) {
        network.protect({
          tileY: item.tileY,
          tileX: item.tileX,
          charY: item.charY,
          charX: item.charX
        }, ["public", "member-only", "owner-only"][protType]);
      }
    }
    return true;
  };
  if (!pastePerm) {
    while (true) {
      var res = pasteFunc();
      if (!res || res == -1 || charCount >= 4) break;
    }
    elm.textInput.value = "";
    return;
  }
  write_busy = true;
  var rate = state.worldModel.char_rate;
  var base = rate[1];
  if (base > 60 * 1000) base = 60 * 1000;
  var speed = Math.floor(1000 / base * rate[0]) - 1;
  if (speed < 1) speed = 1;
  if (speed > 280) speed = 280;
  if (state.userModel.is_member || state.userModel.is_owner) speed = 280;
  pasteInterval = setInterval(function() {
    var res = pasteFunc();
    if (res == -1) {
      clearInterval(pasteInterval);
      write_busy = false;
      elm.textInput.value = "";
    }
  }, Math.floor(1000 / speed));
}, 10);

elm.chat_window.style.display = ""
if (chatOpen !== true) {
  elm.chat_window.classList.add("hidden");
}
chat_open.classList.add("hidden");
chat_window.style.left = "2.1em";
resizeChat(600);
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
/* var eventListeners = getEventListeners(chat_window);

  eventType = "mousedown"
  if (eventListeners[eventType]) {
    eventListeners[eventType].forEach(listener => {
      chat_window.removeEventListener(eventType, listener.listener);
    });
  }
*/

function resizable_chat() {

  var state = 0;
  var isDown = false;
  var downX = 0;
  var downY = 0;
  var elmX = 0;
  var elmY = 0;
  var chatWidth = 0;
  var chatHeight = 0;
  chat_window.addEventListener("mousemove", function(e) {
    if (isDown) return;
    var posX = e.pageX - chat_window.offsetLeft;
    var posY = e.pageY - chat_window.offsetTop;
    var top = (posY) <= 4;
    var left = (posX) <= 3;
    var right = (chat_window.offsetWidth - posX) <= 4;
    var bottom = (chat_window.offsetHeight - posY) <= 5;
    var cursor = "";
    if (left || right) cursor = "ew-resize";
    if (top || bottom) cursor = "ns-resize";
    if ((top && left) || (right && bottom)) cursor = "nwse-resize";
    if ((bottom && left) || (top && right)) cursor = "nesw-resize";
    chat_window.style.cursor = cursor;
    state = bottom << 3 | right << 2 | left << 1 | top;
  });
  chat_window.addEventListener("mousedown", function(e) {
    if (!canResizeChat) return;
    downX = e.pageX;
    downY = e.pageY;
    if (state) {
      // subtract 2 for the borders
      chatWidth = chat_window.offsetWidth - 16;
      chatHeight = chat_window.offsetHeight - 16;
      elmX = chat_window.offsetLeft;
      elmY = chat_window.offsetTop;
      isDown = true;
      chatResizing = true;
      console.log("RESIZE")
    }
  });
  document.addEventListener("mouseup", function() {
    isDown = false;
    chatResizing = false;
  });
  document.addEventListener("mousemove", function(e) {

    if (!isDown) return;

    var offX = e.pageX - downX;
    var offY = e.pageY - downY;
    var resize_bottom = state >> 3 & 1;
    var resize_right = state >> 2 & 1;
    var resize_left = state >> 1 & 1;
    var resize_top = state & 1;

    var width_delta = 0;
    var height_delta = 0;
    var abs_top = chat_window.offsetTop;
    var abs_left = chat_window.offsetLeft;
    var snap_bottom = chat_window.style.bottom == "0px";
    var snap_right = chat_window.style.right == "0px";

    if (resize_top) {
      height_delta = -offY;
    } else if (resize_bottom) {
      height_delta = offY;
    }
    if (resize_left) {
      width_delta = -offX;
    } else if (resize_right) {
      width_delta = offX;
    }
    var res = resizeChat(chatWidth + width_delta, chatHeight + height_delta);
    if (resize_top && !snap_bottom) {
      chat_window.style.top = (elmY + (chatHeight - res[1])) + "px";
    }
    if (resize_bottom && snap_bottom) {
      chat_window.style.bottom = "";
      chat_window.style.top = abs_top + "px";
    }
    if (resize_right && snap_right) {
      chat_window.style.right = "";
      chat_window.style.left = abs_left + "px";
    }
    if (resize_left && !snap_right) {
      chat_window.style.left = (elmX + (chatWidth - res[0])) + "px";
    }
  });
}
resizable_chat();
draggable_element(elm.chat_window, null, [
  elm.chatbar, elm.chatsend, elm.chat_close, elm.chat_page_tab, elm.chat_global_tab, elm.page_chatfield, elm.global_chatfield, flterWnd
], function() {
  if (chatResizing) {
    return -1;
  }
});

function resizeChat(width, height) {
  width -= 16;
  height -= 16
  // default: 400 x 300
  if (width < 350) width = 350;
  if (height < 57) height = 57;
  elm.chat_window.style.width = width + "px";
  elm.chat_window.style.height = height + "px";
  return [width, height];
}

//4 = regular after = fp


var demoCtx = demoCanv.getContext("2d");
var ppc_css = document.createElement("style");
var ppc_style =
  `#ppc{
    display: block;
    position: fixed;
    z-index: 1000;
    outline: 1px dashed black;
    pointer-events: none;
    }
`
demoCanv.classList.add("hidden");
demoCanv.id = "ppc"
ppc_css.innerHTML = ppc_style;
document.head.appendChild(ppc_css);
elm.main_view.appendChild(demoCanv);



// Whenever the cursor moves, move the preview location
w.on("cursorMove", function(e) {
  const X = e.tileX;
  const Y = e.tileY;
  const x = e.charX;
  const y = e.charY;
  const [cpX, cpY] = CellToPixelCoords(X, Y, x, y);
console.log(cpX, cpY)
  demoCanv.style.left = cpX/zoomRatio + "px";
  demoCanv.style.top = cpY/zoomRatio + "px";

  if (showPastePreview) {
    PasteClipboardPreview();
  }
})

// Try to copy the clipboard data and then run renderString on that data.
function PasteClipboardPreview() {
  navigator.permissions.query({
    name: 'clipboard-read'
  }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.readText()
        .then(text => {
          renderString(text.replace(/\r\n/g, "\n"));

        })
        .catch(err => {
          console.error('Failed to read clipboard contents:', err);
        });
    } else {
      console.error('Permission to read clipboard denied.');
    }
  });
}


function renderPreviewChar(textRender, posX, posY, char, color, link, writability) {
  var textYOffset = cellH - (5 * zoom);

  var fontX = posX * cellW;
  var fontY = posY * cellH;

  var deco = getCharTextDecorations(char);
  char = clearCharTextDecorations(char);
  char = resolveCharEmojiCombinations(char);

  var cCode = char.codePointAt(0);

  // initialize link color to default text color in case there's no link to color
  var linkColor = styles.text;
  if (textColorOverride) {
    if (writability == 0 && textColorOverride & 4) linkColor = styles.public_text;
    if (writability == 1 && textColorOverride & 2) linkColor = styles.member_text;
    if (writability == 2 && textColorOverride & 1) linkColor = styles.owner_text;
  }

  var isLink = false;
  if (link) {
    isLink = true;
    if (link.linkType == "url") {
      linkColor = defaultURLLinkColor;
    } else if (link.linkType == "coord") {
      linkColor = defaultCoordLinkColor;
    }
  }

  // if text has no color, use default text color. otherwise, colorize it
  if (color == 0 || !colorsEnabled || (isLink && !colorizeLinks)) {
    textRender.fillStyle = linkColor;
  } else {
    textRender.fillStyle = `rgb(${color >> 16 & 255},${color >> 8 & 255},${color & 255})`;
  }

  // x padding of text if the char width is > 10
  var XPadding = cellWidthPad * zoom;

  // underline link
  if (isLink) {
    textRender.fillRect(fontX, fontY + textYOffset + zoom, cellW, zoom);
  }

  if (deco) {
    if (deco.under) {
      textRender.fillRect(fontX, fontY + textYOffset + zoom, cellW, zoom);
    }
    if (deco.strike) {
      textRender.fillRect(fontX, fontY + Math.floor((16 * zoom) / 2), cellW, zoom);
    }
  }

  // don't render whitespaces
  if (char == "\u0020" || char == "\u00A0") return;

  var isBold = deco && deco.bold;
  var isItalic = deco && deco.italic;
  var checkIdx = 1;
  if (char.codePointAt(0) > 65535) checkIdx = 2;
  var isSpecial = char.codePointAt(checkIdx) != void 0;
  isSpecial = isSpecial || (cCode >= 0x2500 && cCode <= 0x257F);

  if (isValidSpecialSymbol(cCode)) {
    drawBlockChar(cCode, textRender, posX, posY, tileW, tileH);
    return;
  }

  var tempFont = null;
  var prevFont = null;
  if (isSpecial || deco) {
    prevFont = textRender.font;
    tempFont = textRender.font;
    if (isSpecial) tempFont = specialCharFont;
    if (isBold) tempFont = "bold " + tempFont;
    if (isItalic) tempFont = "italic " + tempFont;
    textRender.font = tempFont;
  }
textRender.font = fontTemplate.replace("$", normFontSize(16 * zoom));
  textRender.fillText(char, Math.round(fontX + XPadding), Math.round(fontY + textYOffset));
  if (prevFont) {
    textRender.font = prevFont;
  }
}

function renderString(str) {
  var parser = textcode_parser(str, {
    tileX: 0,
    tileY: 0,
    charX: 0,
    charY: 0
  }, YourWorld.Color, YourWorld.BgColor);

  var renderChars = [];
  var lastProt = null;
  var lastLink = null;

  var maxX = 0;
  var maxY = 0;

  while (true) {
    var data = parser.nextItem();
    if (data == -1) break;

    if (data.type == "char") {
      if (!data.writable) continue;
      var char = data.char;
      var color = data.color;
      var bgColor = data.bgColor;

      if (char == "\n" || char == "\r") continue;

      var posX = data.tileX * 16 + data.charX;
      var posY = data.tileY * 8 + data.charY;
      if (posX > maxX) maxX = posX;
      if (posY > maxY) maxY = posY;

      renderChars.push([posX, posY, char, color, bgColor, lastProt, lastLink]);
      lastProt = null;
      lastLink = null;
    } else if (data.type == "protect") {
      lastProt = data.protType;
    } else if (data.type == "link") {
      lastLink = data;
    }
  }

  var newWidth = Math.ceil((maxX + 1) * cellW);
  var newHeight = Math.ceil((maxY + 1) * cellH);

  if (newWidth > 2000) newWidth = 2000;
  if (newHeight > 2000) newHeight = 2000;

  demoCanv.width = newWidth;
  demoCanv.height = newHeight;
  demoCtx.font = font;

  // pass 1: background colors
  for (var i = 0; i < renderChars.length; i++) {
    var cell = renderChars[i];

    var posX = cell[0];
    var posY = cell[1];
    var bgColor = cell[4];
    var prot = cell[5];

    if (prot == null) prot = state.worldModel.writability;

    if (bgColor > -1) {
      demoCtx.fillStyle = `rgb(${bgColor >> 16 & 255},${bgColor >> 8 & 255},${bgColor & 255})`;
    } else {
      if (prot == 0) demoCtx.fillStyle = styles.public;
      if (prot == 1) demoCtx.fillStyle = styles.member;
      if (prot == 2) demoCtx.fillStyle = styles.owner;
    }
    demoCtx.fillRect(posX * cellW, posY * cellH, cellW, cellH);
  }

  // pass 2: text data
  for (var i = 0; i < renderChars.length; i++) {
    var cell = renderChars[i];

    var posX = cell[0];
    var posY = cell[1];
    var char = cell[2];
    var color = cell[3];
    var bgColor = cell[4];
    var prot = cell[5];
    var link = cell[6];

    if (prot == null) prot = state.worldModel.writability;

    renderPreviewChar(demoCtx, posX, posY, char, color, link, prot);
  }
}
