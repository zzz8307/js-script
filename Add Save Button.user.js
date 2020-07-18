// ==UserScript==
// @name         Add Save Button
// @version      0.1
// @author       rc
// @match        https://chanelasia.service-now.com/sc_request.do*
// @match        https://chanelasia.service-now.com/sc_task.do*
// @grant        none
// @updateURL    https://github.com/zzz8307/js-script/raw/master/Add%20Save%20Button.user.js
// @downloadURL  https://github.com/zzz8307/js-script/raw/master/Add%20Save%20Button.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var btnHeader = document.querySelectorAll('.navbar_ui_actions').item(0);
    var saveBtn = document.createElement('button');
    saveBtn.innerHTML = "Save";
    saveBtn.setAttribute("class", "form_action_button header  action_context btn btn-default")
    saveBtn.setAttribute("style", "white-space: nowrap")
    saveBtn.setAttribute("type", "submit")
    saveBtn.setAttribute("onclick", "gsftSubmit(gel('sysverb_update_and_stay'))")
    btnHeader.insertBefore(saveBtn, btnHeader.children[4])
})();