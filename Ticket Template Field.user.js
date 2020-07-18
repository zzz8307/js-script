// ==UserScript==
// @name         Ticket Template Field
// @version      0.1
// @author       rc
// @match        https://chanelasia.service-now.com/incident.do*
// @match        https://chanelasia.service-now.com/sc_request.do*
// @match        https://chanelasia.service-now.com/sc_task.do*
// @grant        none
// @updateURL    https://github.com/zzz8307/js-script/raw/master/Ticket%20Template%20Field.user.js
// @downloadURL  https://github.com/zzz8307/js-script/raw/master/Ticket%20Template%20Field.user.js
// ==/UserScript==

var inc_tpl = new Object();
var req_tpl = new Object();
var tpl_name = new Object();

tpl_name["inc_fcr"] = "Incident - FCR ticket template";
inc_tpl["inc_fcr"] = "(Location/Store Name)\n\
Caller: \n\
Contact number: \n\
Issue symptom: \n\
Device(SN): ";

tpl_name["inc_bf"] = "Incident - Back-fill ticket template";
inc_tpl["inc_bf"] = "(Location/Store Name)\n\
Requestor: \n\
Contact number: \n\
Issue symptom: ";

tpl_name["inc_non_fcr"] = "Incident - Non-FCR ticket template";
inc_tpl["inc_non_fcr"] = "(Location/Store Name)\n\
Caller: \n\
Contact number: \n\
Date and Time of issue: \n\
Device(SN): \n\
Market / Country: \n\
Page URL / App: \n\
Steps to reproduce: \n\
1/ \n\
2/ \n\
n/ \n\
Actual behavior: \n\
Expected behavior: \n\
Issue symptom: \n\
Action Taken by RSD: \n\
Screenshots and attachments: Please refer to the screenshot(s) named: \n\
Special remark: ";

tpl_name["enq_tpl"] = "Enquiry - Ticket template";
inc_tpl["enq_tpl"] = "(Location/Store Name)\n\
Caller: \n\
Contact number: \n\
End-user would like to wonder: ";

tpl_name["enq_bf"] = "Enquiry - Back-fill ticket template";
inc_tpl["enq_bf"] = "(Location/Store Name)\n\
Caller: \n\
Contact number: \n\
End-user would like to wonder: ";

tpl_name["od_sw"] = "On-demand Dispatching (Software)";
inc_tpl["od_sw"] = "Ticket Number: \n\
Priority: \n\
Store Name: \n\
Store Address: \n\
Caller: \n\
Contact number: \n\
Date and Time of issue: \n\
Device(SN): \n\
Page URL / App: \n\
Steps to reproduce: \n\
1/ \n\
2/ \n\
n/ \n\
Actual behavior: \n\
Expected behavior: \n\
Action Taken by RSD: \n\
Screenshots and attachments: Please refer to the screenshot(s) named: \n\
Approved By: ";

tpl_name["od_hwn"] = "On-demand Dispatching (Hardware/Network)";
inc_tpl["od_hwn"] = "Ticket Number: \n\
Priority: \n\
Store Name: \n\
Store Address: \n\
Caller: \n\
Contact number: \n\
Date and Time of issue: \n\
Device(SN): \n\
Issue symptom: \n\
Action Taken by RSD: \n\
Screenshots and attachments: Please refer to the screenshot(s) named: \n\
Approved By: ";

tpl_name["req_fcr"] = "Request - Fulfilled by RSD";
req_tpl["req_fcr"] = "(Location/Store Name)\n\
Caller: \n\
Contact number: \n\
Request Content: ";

tpl_name["req_bf"] = "Request - Back-fill ticket template";
req_tpl["req_bf"] = "(Location/Store Name)\n\
Requestor: \n\
Contact number: \n\
Request Content: \n\
Device (SN): ";

tpl_name["req_tpl"] = "Request - Ticket template";
req_tpl["req_tpl"] = "(Location/Store Name)\n\
Last name: \n\
First name: \n\
AD Username: \n\
Contact number: \n\
Country: \n\
Position / Job Title: \n\
Name of the user manager: \n\
Application Type: Access Right / Software / Hardware / Loan / Other\n\
Application Content: \n\
Business Justification: \n\
Approved by: ";

(function () {
    window.ticket_type = "";

    let inc_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/incident\.do\?/i;
    let req_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_request\.do\?/i;
    let task_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_task\.do\?/i;

    let u = window.location.href;

    if (u.match(inc_match)) {
        let r = document.getElementById('resolve_incident');
        let rb = document.getElementById('resolve_incident_bottom');
        r.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;")
        rb.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;")
        ticket_type = "inc";
    } else if (u.match(req_match)) {
        ticket_type = "req";
    } else if (u.match(task_match)) {
        ticket_type = "task";
    }
    var e = document.getElementsByClassName("vsplit col-sm-6").item(0);
    addTemplateField(ticket_type);

    function addTemplateField(tType) {
        let ph = document.createElement('div');
        ph.id = "placeholder";
        ph.className = "form-group ";
        ph.style = "visibility: hidden";
        ph.innerHTML = '<div class="" data-type="label" choice="1" type="choice" nowrap="true"><label class=" col-xs-12 col-md-3 col-lg-4 control-label"><span title="" class="label-text" data-html="false" data-original-title="">Placeholder</span></label></div><div class="col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls"><select name="placeholder" style="; " class="form-control"></select></div><div class="col-xs-2 col-sm-3 col-lg-2 form-field-addons"></div>';
        e.append(ph);

        let tpl_div = document.createElement('div');
        tpl_div.id = "element.template";
        tpl_div.className = "form-group ";
        tpl_div.style = "";

        let tpl_div_label = document.createElement('div');
        tpl_div_label.id = "label.template";
        tpl_div_label.className = "";
        tpl_div_label.setAttribute("type", "choice");
        tpl_div_label.setAttribute("data-type", "label");
        tpl_div_label.setAttribute("choice", "1");
        tpl_div_label.setAttribute("nowarp", "true");

        let tpl_label = document.createElement('label');
        tpl_label.className = " col-xs-12 col-md-3 col-lg-4 control-label";
        tpl_label.setAttribute("onclick", "return labelClicked(this);");
        tpl_label.setAttribute("for", "template");
        tpl_label.setAttribute("dir", "ltr");

        let tpl_span = document.createElement('span');
        tpl_span.title = "";
        tpl_span.className = "label-text";
        tpl_span.innerText = "Template";
        tpl_span.setAttribute("data-html", "false");
        tpl_span.setAttribute("data-original-title", "Select a ticket template");

        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls";

        let tpl_select = document.createElement('select');
        tpl_select.name = tpl_select.id = "template";
        tpl_select.className = "form-control";
        tpl_select.setAttribute("aria-labelledby", "label.template");
        tpl_select.setAttribute("ng-non-bindable", "true");
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticket_type);");

        e.append(tpl_div);
        tpl_div.append(tpl_div_label);
        tpl_div_label.append(tpl_label);
        tpl_label.append(tpl_span);
        tpl_div.append(tpl_div_select);
        tpl_div_select.append(tpl_select);

        addTicketTemplate(tpl_select, tType);
    }

    function addTicketTemplate(s, tType) {
        let op = document.createElement('option');
        op.value = "";
        op.innerText = "-- None --"
        op.setAttribute("role", "option");
        op.setAttribute("selected", "SELECTED");
        s.append(op);
        if (tType == "inc") {
            for (let key in inc_tpl) {
                let t = document.createElement('option');
                t.value = key;
                t.innerText = tpl_name[key];
                t.setAttribute("role", "option");
                s.append(t);
            }
        } else if (tType == "req" || tType == "task") {
            for (let key in req_tpl) {
                let t = document.createElement('option');
                t.value = key;
                t.innerText = tpl_name[key];
                t.setAttribute("role", "option");
                s.append(t);
            }
        }
    }
})();

window.onSelect = function (v, tType) {
    if (tType == "inc") {
        document.getElementById('incident.description').style.height = '1px';
        document.getElementById('incident.description').value = inc_tpl[v];
        document.getElementById('incident.description').style.height = document.getElementById('incident.description').scrollHeight + 'px';
    } else if (tType == "req") {
        document.getElementById('sc_request.special_instructions').style.height = '1px';
        document.getElementById('sc_request.special_instructions').value = req_tpl[v];
        document.getElementById('sc_request.special_instructions').style.height = document.getElementById('sc_request.special_instructions').scrollHeight + 'px';
    } else if (tType == "task") {
        document.getElementById('sc_task.description').style.height = '1px';
        document.getElementById('sc_task.description').value = req_tpl[v];
        document.getElementById('sc_task.description').style.height = document.getElementById('sc_task.description').scrollHeight + 'px';
    }
}

window.onResolve = function () {
    let inc_close_notes = "Root Cause: \nResolution/Workaround: ";
    let enq_close_notes = "Answer: ";
    if (document.getElementById('incident.u_type').value == "incident") {
        document.getElementById('incident.close_notes').value = inc_close_notes;
    } else if (document.getElementById('incident.u_type').value == "enquiry") {
        document.getElementById('incident.close_notes').value = enq_close_notes;
    }
}

/*
// Script Injection
let tpl_m = tplMain.toString();
tpl_m = tpl_m.slice(tpl_m.indexOf('{') + 1, -1);
exec(tpl_m);

function exec(fn) {
    let script = document.createElement('script');
    script.id = "tplScript";
    script.setAttribute('type', 'application/javascript');
    script.textContent = fn;
    document.body.appendChild(script);
    //document.body.removeChild(script);
}
*/