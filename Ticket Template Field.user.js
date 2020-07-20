// ==UserScript==
// @name         Ticket Template Field
// @version      0.9.1
// @author       rc
// @match        https://chanelasia.service-now.com/incident.do*
// @match        https://chanelasia.service-now.com/sc_request.do*
// @match        https://chanelasia.service-now.com/sc_task.do*
// @match        https://chanelasia.service-now.com/servicecatalog_checkout_one_v2.do*
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


(function() {
    console.log(`[TplScript] Start`);
    window.ticket_type = "";
    window.url_type = "normal";

    let inc_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/incident\.do\?/i;
    let req_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_request\.do\?/i;
    let task_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_task\.do\?/i;
    let sc_chechout_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/servicecatalog_checkout_one_v2\.do\?/i;

    let e;
    let u = window.location.href;
    console.log(`[TplScript] URL: ${u}`);

    if (u.match(inc_match)) {
        console.log(`[TplScript] setAttribute for resolve button`);
        ticket_type = "inc";
        try {
            let r = document.getElementById('resolve_incident');
            let rb = document.getElementById('resolve_incident_bottom');
            r.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
            rb.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
        } catch (err) {
            console.error(err)
            console.error(`[TplScript] Resolve button not found, moving on`)
        }
    } else if (u.match(req_match)) {
        ticket_type = "req";
    } else if (u.match(task_match)) {
        ticket_type = "task";
    } else if (u.match(sc_chechout_match)) {
        ticket_type = "req";
        url_type = "sc_checkout";
    }

    console.log(`[TplScript] ticket_type: ${ticket_type}`);
    console.log(`[TplScript] url_type: ${url_type}`);
    console.log(`[TplScript] Getting 'e'`);

    // add template element to 'e'
    if (url_type == "sc_checkout") {
        e = document.getElementsByClassName('container').item(2);
    } else {
        e = document.getElementsByClassName('vsplit col-sm-6').item(0);
    }
    se = addTemplateField(e, url_type);  // 'select' element
    addTicketTemplate(se, ticket_type);

    console.log(`[TplScript] End`);
})();


function addTemplateField(parentElement, uType) {
    console.log(`[TplScript] addTemplateField()| Start`);
    console.log(`[TplScript] addTemplateField()| uType: ${uType}`);

    let ph = document.createElement('div');
    ph.id = "placeholder";
    ph.className = "form-group ";
    ph.style = "visibility: hidden";
    ph.innerHTML = '<div class="" data-type="label" choice="1" type="choice" nowrap="true"><label class=" col-xs-12 col-md-3 col-lg-4 control-label"><span title="" class="label-text" data-html="false" data-original-title="">Placeholder</span></label></div><div class="col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls"><select name="placeholder" style="; " class="form-control"></select></div><div class="col-xs-2 col-sm-3 col-lg-2 form-field-addons"></div>';
    if (uType == "normal") {
        parentElement.append(ph);
        console.log(`[TplScript] addTemplateField()| Placeholder appended`);
    } else if (uType == "sc_checkout") {
        console.log(`[TplScript] addTemplateField()| Placeholder did not append`);
    }

    if (uType == "normal") {
        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div'`);
        let tpl_div = document.createElement('div');
        tpl_div.id = "element.template";
        tpl_div.className = "form-group ";
        tpl_div.style = "";

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div_label'`);
        let tpl_div_label = document.createElement('div');
        tpl_div_label.id = "label.template";
        tpl_div_label.className = "";
        tpl_div_label.setAttribute("type", "choice");
        tpl_div_label.setAttribute("data-type", "label");
        tpl_div_label.setAttribute("choice", "1");
        tpl_div_label.setAttribute("nowarp", "true");

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_label'`);
        let tpl_label = document.createElement('label');
        tpl_label.className = " col-xs-12 col-md-3 col-lg-4 control-label";
        tpl_label.setAttribute("onclick", "return labelClicked(this);");
        tpl_label.setAttribute("for", "template");
        tpl_label.setAttribute("dir", "ltr");

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_span'`);
        let tpl_span = document.createElement('span');
        tpl_span.title = "";
        tpl_span.className = "label-text";
        tpl_span.innerText = "Template";
        tpl_span.setAttribute("data-html", "false");
        tpl_span.setAttribute("data-original-title", "Select a ticket template");

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div_select'`);
        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls";

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_select'`);
        let tpl_select = document.createElement('select');
        tpl_select.name = tpl_select.id = "template";
        tpl_select.className = "form-control";
        tpl_select.setAttribute("aria-labelledby", "label.template");
        tpl_select.setAttribute("ng-non-bindable", "true");
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticket_type, url_type);");

        parentElement.append(tpl_div);
        tpl_div.append(tpl_div_label);
        tpl_div_label.append(tpl_label);
        tpl_label.append(tpl_span);
        tpl_div.append(tpl_div_select);
        tpl_div_select.append(tpl_select);
        console.log(`[TplScript] addTemplateField()| All things appended`);
        return tpl_select;

    } else if (uType == "sc_checkout") {
        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div1'`);
        let tpl_div1 = document.createElement('div');
        tpl_div1.className = "container";

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div2'`);
        let tpl_div2 = document.createElement('div');
        tpl_div2.className = "row col-xs-12 sc_cv_info_row";

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div_label'`);
        let tpl_div_label = document.createElement('div');
        tpl_div_label.className = "col-xs-2 sc_requested_label";
        tpl_div_label.innerText = "Template"

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_div_select'`);
        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-8";

        console.log(`[TplScript] addTemplateField()| Creating 'tpl_select'`);
        let tpl_select = document.createElement('select');
        tpl_select.name = tpl_select.id = "template";
        tpl_select.className = "form-control";
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticket_type, url_type);");

        parentElement.parentNode.insertBefore(tpl_div1, parentElement);
        tpl_div1.append(tpl_div2);
        tpl_div2.append(tpl_div_label);
        tpl_div2.append(tpl_div_select);
        tpl_div_select.append(tpl_select);

        console.log(`[TplScript] addTemplateField()| All things appended`);
        return tpl_select;
    }
}


function addTicketTemplate(s, tType) {
    console.log(`[TplScript] addTicketTemplate()| Start`);

    let op = document.createElement('option');
    op.value = "";
    op.innerText = "-- None --";
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
            console.log(`[TplScript] addTicketTemplate()| ${key} added`);
        }
    } else if (tType == "req" || tType == "task") {
        for (let key in req_tpl) {
            let t = document.createElement('option');
            t.value = key;
            t.innerText = tpl_name[key];
            t.setAttribute("role", "option");
            s.append(t);
            console.log(`[TplScript] addTicketTemplate()| ${key} added`);
        }
    }
}


window.onSelect = function(key, tType, uType) {
    console.log(`[TplScript] onSelect()| Start`);
    console.log(`[TplScript] onSelect()| tType: ${tType}`);
    console.log(`[TplScript] onSelect()| key: ${key}`);

    let desc;
    let title;

    if (tType == "inc") {
        desc = "incident.description";
        title = "incident.short_description";
    } else if (tType == "req") {
        if (uType == "normal") {
            desc = "sc_request.special_instructions";
            title = "sc_request.short_description";
        } else if (uType == "sc_checkout") {
            desc = "special_instructions";
            title = "title";
        }
    } else if (tType == "task") {
        desc = "sc_task.description";
        title = "sc_task.short_description";
    }

    fillinDesc(key, desc, tType);
    if (key.endsWith("bf")) {
        bfTitlePrefix(title);
    }

    console.log(`[TplScript] onSelect()| End`);
}


function fillinDesc(key, d, tType) {
    console.log(`[TplScript] fillinDesc()| ${d}`);
    if (tType == "inc") {
        document.getElementById(d).style.height = '1px';
        document.getElementById(d).value = inc_tpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + 'px';
    } else if (tType == "req" || tType == "task") {
        document.getElementById(d).style.height = '1px';
        document.getElementById(d).value = req_tpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + 'px';
    }
}


function bfTitlePrefix(t) {
    if (!document.getElementById(t).value.startsWith("(Back-fill)")) {
        console.log(`[TplScript] bfTitlePrefix()| Add prefix to ${t}`);
        document.getElementById(t).value = "(Back-fill)" + document.getElementById(t).value;
    }
}


window.onResolve = function() {
    console.log(`[TplScript] onResolve()| Start`);

    let inc_close_notes = "Root Cause: \nResolution/Workaround: ";
    let enq_close_notes = "Answer: ";

    let u_type = document.getElementById('incident.u_type').value;
    console.log(`[TplScript] onResolve()| u_type: ${u_type}`);

    if (document.getElementById('incident.close_notes').value == "") {
        if (u_type == "incident") {
            document.getElementById('incident.close_notes').value = inc_close_notes;
        } else if (u_type == "enquiry") {
            document.getElementById('incident.close_notes').value = enq_close_notes;
        }
    }

    console.log(`[TplScript] onResolve()| End`);
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
