var pm_ui_html = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <div id="pm-container">
      <div class="sidebar">
        <div class="container">
          <button class="sidebar-button" id="move-btn"><i class="fas fa-map-marker"></i></button>
          <div class="container-bg">
            <div class="popup-panel">
              <div class="panel-header">Location & Coordinates</div>
              <ul class="icon-list">
                <li class="btn"><i class="fas fa-paper-plane"></i>Go to Coords<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-link"></i>Create Coords Link<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-forward"></i>Warp to Page<i class="fas fa-check hidden"></i></li>
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
                <li class="btn"><i class="fas fa-border-style"></i>Region Select Area<i class="hidden fas fa-check"></i></li>
                <li class="btn"><i class="fas fa-lock"></i>Protect Area<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-eraser"></i>Erase Area<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-clone"></i>Quick Copy Area<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-palette"></i>Change Area Color<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-paint-roller"></i>Change Area BG<i class="fas fa-check hidden"></i></li>
              </ul>
            </div>
          </div>
        </div>


        <div class="container">
          <button class="sidebar-button" id="paint-btn"><i class="fas fa-pen"></i></button>
          <div class="container-bg">
            <div class="popup-panel">
              <div class="panel-header">Draw Tool</div>
              <ul class="icon-list">
                <li class="btn"><i class="fas fa-border-none"></i>Sub Cell Draw<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-star"></i>Custom Cell Draw<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-adjust"></i>Opacity Cell Draw<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-ruler-combined"></i>Line Draw<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-table"></i>Unicode Table<i class="fas fa-toggle-off"></i></li>
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
                <li class="btn"><i class="fas fa-expand-alt"></i>Large Font<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-rainbow"></i>Rainbow Text<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-italic"></i>Show Font Styles<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-heading"></i>Change Font<i class="fas fa-check hidden"></i></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="hairline"></div>
        <div class="container">
          <button class="sidebar-button" id="foreground-btn"><i class="fas fa-square"></i></button>
          <div class="container-bg">
            <div class="popup-panel">
              <div class="panel-header">Foreground Color</div>
              <ul class="icon-list">
                <li class="btn"><i class="fas fa-palette"></i>Pick Custom Color<i class="fas fa-check hidden"></i></li>
                <li class="btn"><i class="fas fa-eye-dropper"></i>Use Eyedropper<i class="fas fa-check hidden"></i></li>
                <li class="color-list"><i style="color: black" class="fas fa-square"></i><i style="color: white" class="fas fa-square"></i><i style="color: red" class="fas fa-square"></i><i style="color: orange" class="fas fa-square"></i><i style="color: yellow" class="fas fa-square"></i><i style="color: green" class="fas fa-square"></i><i style="color: blue" class="fas fa-square"></i><i style="color: purple" class="fas fa-square"></i></li>

              </ul>
            </div>
          </div>
        </div>
        <div class="container">
          <button class="sidebar-button" id="switch-btn"><i class="fas fa-random"></i></button>
          <div class="container-bg">
            <div class="popup-panel">
              <div class="btn panel-header">Switch Colors</div>
            </div>
          </div>
        </div>

        <div class=" dropdown">
          <div class="container">
            <button class="sidebar-button" id="background-btn"><i class="fas fa-square"></i></button>
            <div class="container-bg">
              <div class="popup-panel">
                <div class="panel-header">Background Color</div>
                <ul class="icon-list">
                  <li class="btn"><i class="fas fa-palette"></i>Pick Custom Color<i class="fas fa-check hidden"></i></li>
                  <li class="btn"><i class="fas fa-eye-dropper"></i>Use Eyedropper<i class="fas fa-check hidden"></i></li>
                  <li class="color-list"><i style="color: black" class="fas fa-square"></i><i style="color: white" class="fas fa-square"></i><i style="color: red" class="fas fa-square"></i><i style="color: orange" class="fas fa-square"></i><i style="color: yellow" class="fas fa-square"></i><i style="color: green" class="fas fa-square"></i><i style="color: blue" class="fas fa-square"></i><i style="color: purple" class="fas fa-square"></i></li>

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
                <li class="btn"><i class="fas fa-list-ul"></i>Show Cell Data<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-th-large"></i>Show Grid<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-th"></i>Show Subgrid<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-map"></i>Show Page Coords<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-mouse-pointer"></i>Show Mouse Coords<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-border-all"></i>Show Grid Coords<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-keyboard"></i>Show Shortcuts<i class="fas fa-toggle-off"></i></li>
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
                <li class="btn"><i class="fas fa-check"></i>Paste Preview<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-link"></i>URL Paste<i class="fas fa-toggle-off"></i></li>
                <li><input placeholder="Enter URL"></li>
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
                <li class="btn"><i class="fas fa-comment-alt"></i>Show Chat<i class="fas fa-toggle-off"></i></li>
                <li class="btn"><i class="fas fa-low-vision"></i>Hide Canvas<i class="fas fa-toggle-off"></i></li>
              </ul>
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
            <button><i class="fas fa-file"></i> Unload</button>
          </div>
        </div>
        <div class="options-container">
          <!-- Add your options here -->
        </div>
        <div>
          <button class="header-button"><i class="fas fa-book-open"></i> Wiki</button>
          <button class="header-button"><i class="fas fa-user"></i></button>
          <div>
          </div>


          <script src="script.js"></script>
        </div>
      </div>
    </div>
`

var pm_ui_css = 
`
 @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

 #pm-container {
   font-family: 'Quicksand', sans-serif;
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

 i.hidden {
   color: transparent;
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

`

var pm_stylesheet = document.createElement("style");
var pm_html = document.createElement("div");
pm_stylesheet.innerHTML = pm_ui_css;
pm_html.innerHTML = pm_ui_html;
document.head.appendChild(pm_stylesheet);
document.body.appendChild(pm_html);
w.hideChat();
