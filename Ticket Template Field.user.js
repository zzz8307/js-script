// ==UserScript==
// @name         SN Tool
// @version      0.11.0
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
var tpl_title = new Object();

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

tpl_name["req_icoco"] = "Request - iCoco account";
tpl_title["req_icoco"] = "Create/Deactivate/Modify iCoco Account for {BTQ Name} - {Employee ID}";
req_tpl["req_icoco"] = "- Last name: \n\
- First name: \n\
- Email: \n\
- AD/LDAP Username: \n\
- Employee ID: \n\
- Staff code: \n\
- Country/Location: CN \n\
- Job Title: \n\
- Date of employment/Cessation Date: 入职日期/离职日期 \n\
- Status: 入职/离职/转店 \n\
- Store Name: \n\
- Request Access: iCoco(Chanel CN Sales) \n\
- Active: True/False";

tpl_name["req_fuji"] = "Request - Fuji Xerox printer supplies";
tpl_title["req_fuji"] = "香奈儿耗材订购 - {BTQ Name} - {Date}";
req_tpl["req_fuji"] = "Ticket Number: \n\
Store Name: \n\
Store Address: \n\
Caller: \n\
Contact number: \n\
Date and Time of Request: \n\
Device(SN): \n\
Device IP: \n\
Request Content: \n\
Screenshots and attachments: Please refer to the screenshot as below and the attachment named: \n\
Remark: 如配送已完成，麻烦请将签收单回复此邮件，以便RSD联系用户确认，谢谢";


(function() {
    console.log(`[SNTool] Start`);
    window.ticket_type = "";
    window.url_type = "normal";

    let inc_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/incident\.do\?/i;
    let req_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_request\.do\?/i;
    let task_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_task\.do\?/i;
    let sc_chechout_match = /^(http|https):\/\/([\w]+)\.service-now\.com\/servicecatalog_checkout_one_v2\.do\?/i;

    let e;
    let u = window.location.href;
    console.log(`[SNTool] URL: ${u}`);

    if (u.match(inc_match)) {
        console.log(`[SNTool] setAttribute for resolve button`);
        ticket_type = "inc";
        try {
            let r = document.getElementById('resolve_incident');
            let rb = document.getElementById('resolve_incident_bottom');
            r.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
            rb.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
        } catch (err) {
            console.error(err)
            console.error(`[SNTool] Resolve button not found, moving on`)
        }
    } else if (u.match(req_match)) {
        ticket_type = "req";
        console.log(`[SNTool] Set 'element.sc_request.parent' to visible`);
        let div = document.getElementById("element.sc_request.parent");
        div.show();
        addSaveButton();
    } else if (u.match(task_match)) {
        ticket_type = "task";
        addSaveButton();
    } else if (u.match(sc_chechout_match)) {
        ticket_type = "req";
        url_type = "sc_checkout";
    }

    console.log(`[SNTool] ticket_type: ${ticket_type}`);
    console.log(`[SNTool] url_type: ${url_type}`);

    // add template element to 'e'
    if (url_type == "sc_checkout") {
        e = document.getElementsByClassName('container').item(2);
    } else {
        e = document.getElementsByClassName('vsplit col-sm-6').item(0);
    }
    se = addTemplateField(e, url_type);  // 'select' element
    addTicketTemplate(se, ticket_type);

    console.log(`[SNTool] End`);
})();


function addTemplateField(parentElement, uType) {
    console.log(`[SNTool] addTemplateField()| Start`);
    console.log(`[SNTool] addTemplateField()| uType: ${uType}`);

    if (uType == "normal") {
        let ph = document.createElement('div');
        ph.id = "placeholder";
        ph.className = "form-group ";
        ph.style = "visibility: hidden";
        ph.innerHTML = '<div class="" data-type="label" choice="1" type="choice" nowrap="true"><label class=" col-xs-12 col-md-3 col-lg-4 control-label"><span title="" class="label-text" data-html="false" data-original-title="">Placeholder</span></label></div><div class="col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls"><select name="placeholder" style="; " class="form-control"></select></div><div class="col-xs-2 col-sm-3 col-lg-2 form-field-addons"></div>';
        parentElement.append(ph);
        console.log(`[SNTool] addTemplateField()| Placeholder appended`);
    }

    if (uType == "normal") {
        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div'`);
        let tpl_div = document.createElement('div');
        tpl_div.id = "element.template";
        tpl_div.className = "form-group ";
        tpl_div.style = "";

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div_label'`);
        let tpl_div_label = document.createElement('div');
        tpl_div_label.id = "label.template";
        tpl_div_label.className = "";
        tpl_div_label.setAttribute("type", "choice");
        tpl_div_label.setAttribute("data-type", "label");
        tpl_div_label.setAttribute("choice", "1");
        tpl_div_label.setAttribute("nowarp", "true");

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_label'`);
        let tpl_label = document.createElement('label');
        tpl_label.className = " col-xs-12 col-md-3 col-lg-4 control-label";
        tpl_label.setAttribute("onclick", "return labelClicked(this);");
        tpl_label.setAttribute("for", "template");
        tpl_label.setAttribute("dir", "ltr");

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_span'`);
        let tpl_span = document.createElement('span');
        tpl_span.title = "";
        tpl_span.className = "label-text";
        tpl_span.innerText = "Template";
        tpl_span.setAttribute("data-html", "false");
        tpl_span.setAttribute("data-original-title", "Select a ticket template");

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div_select'`);
        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls";

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_select'`);
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
        console.log(`[SNTool] addTemplateField()| All things appended`);
        return tpl_select;

    } else if (uType == "sc_checkout") {
        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div1'`);
        let tpl_div1 = document.createElement('div');
        tpl_div1.className = "container";

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div2'`);
        let tpl_div2 = document.createElement('div');
        tpl_div2.className = "row col-xs-12 sc_cv_info_row";

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div_label'`);
        let tpl_div_label = document.createElement('div');
        tpl_div_label.className = "col-xs-2 sc_requested_label";
        tpl_div_label.innerText = "Template"

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_div_select'`);
        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-8";

        console.log(`[SNTool] addTemplateField()| Creating 'tpl_select'`);
        let tpl_select = document.createElement('select');
        tpl_select.name = tpl_select.id = "template";
        tpl_select.className = "form-control";
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticket_type, url_type);");

        parentElement.parentNode.insertBefore(tpl_div1, parentElement);
        tpl_div1.append(tpl_div2);
        tpl_div2.append(tpl_div_label);
        tpl_div2.append(tpl_div_select);
        tpl_div_select.append(tpl_select);

        console.log(`[SNTool] addTemplateField()| All things appended`);
        return tpl_select;
    }
}


function addTicketTemplate(s, tType) {
    console.log(`[SNTool] addTicketTemplate()| Start`);

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
            console.log(`[SNTool] addTicketTemplate()| ${key} added`);
        }
    } else if (tType == "req" || tType == "task") {
        for (let key in req_tpl) {
            let t = document.createElement('option');
            t.value = key;
            t.innerText = tpl_name[key];
            t.setAttribute("role", "option");
            s.append(t);
            console.log(`[SNTool] addTicketTemplate()| ${key} added`);
        }
    }
}


function addSaveButton() {
    let btnHeader = document.querySelectorAll('.navbar_ui_actions').item(0);
    let saveBtn = document.createElement('button');

    saveBtn.innerHTML = "Save";
    saveBtn.setAttribute("class", "form_action_button header  action_context btn btn-default")
    saveBtn.setAttribute("style", "white-space: nowrap")
    saveBtn.setAttribute("type", "submit")
    saveBtn.setAttribute("onclick", "gsftSubmit(gel('sysverb_update_and_stay'))")
    btnHeader.insertBefore(saveBtn, btnHeader.children[4])
    console.log(`[SNTool] addSaveButton()| Added`);
}


window.onSelect = function(key, tType, uType) {
    console.log(`[SNTool] onSelect()| tType: ${tType}`);
    console.log(`[SNTool] onSelect()| key: ${key}`);

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
    fillinTitle(key, title);
    if (key.endsWith("bf")) {
        bfTitlePrefix(title);
    }
}


function fillinDesc(key, d, tType) {
    console.log(`[SNTool] fillinDesc()| ${d}`);
    if (tType == "inc" && inc_tpl[key] !== undefined) {
        document.getElementById(d).style.height = '1px';
        document.getElementById(d).value = inc_tpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + 'px';
    } else if ((tType == "req" || tType == "task") && req_tpl[key] !== undefined) {
        document.getElementById(d).style.height = '1px';
        document.getElementById(d).value = req_tpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + 'px';
    }
}


function fillinTitle(key, t) {
    console.log(`[SNTool] fillinTitle()| ${t}`);
    if (tpl_title[key] !== undefined) {
        document.getElementById(t).value = tpl_title[key];
    }
}


function bfTitlePrefix(t) {
    if (!document.getElementById(t).value.startsWith("(Back-fill)")) {
        console.log(`[SNTool] bfTitlePrefix()| Add prefix to ${t}`);
        document.getElementById(t).value = "(Back-fill)" + document.getElementById(t).value;
    }
}


window.onResolve = function() {
    let inc_close_notes = "Root Cause: \nResolution/Workaround: ";
    let enq_close_notes = "Answer: ";

    let u_type = document.getElementById('incident.u_type').value;
    console.log(`[SNTool] onResolve()| u_type: ${u_type}`);

    if (document.getElementById('incident.close_notes').value == "") {
        if (u_type == "incident") {
            document.getElementById('incident.close_notes').value = inc_close_notes;
        } else if (u_type == "enquiry") {
            document.getElementById('incident.close_notes').value = enq_close_notes;
        }
    }
}
