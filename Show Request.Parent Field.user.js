// ==UserScript==
// @name         Show Request.Parent Field
// @version      0.1
// @author       rc
// @match        https://chanelasia.service-now.com/sc_request.do*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var div = document.getElementById("element.sc_request.parent");
    div.show()
})();