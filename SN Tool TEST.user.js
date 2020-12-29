// ==UserScript==
// @name         SN Tool TEST
// @version      0.15.5
// @author       rc
// @match        https://chanelasia.service-now.com/incident.do*
// @match        https://chanelasia.service-now.com/sc_request.do*
// @match        https://chanelasia.service-now.com/sc_task.do*
// @match        https://chanelasia.service-now.com/servicecatalog_checkout_one_v2.do*
// @grant        none
// @updateURL    https://github.com/zzz8307/js-script/raw/master/SN%20Tool%20TEST.user.js
// @downloadURL  https://github.com/zzz8307/js-script/raw/master/SN%20Tool%20TEST.user.js
// ==/UserScript==

var incTpl = new Object();
var reqTpl = new Object();
var wnTpl = new Object();
var tplName = new Object();
var tplTitle = new Object();

var loc = "(Location/Store Name)";
var tplVisible = false;

tplName["inc_fcr"] = "Incident - FCR ticket template";
tplName["inc_bf"] = "Incident - Back-fill ticket template";
tplName["inc_non_fcr"] = "Incident - Non-FCR ticket template";
tplName["enq_tpl"] = "Enquiry - Ticket template";
tplName["enq_bf"] = "Enquiry - Back-fill ticket template";
tplName["od_sw"] = "On-demand Dispatching (Software)";
tplName["od_hwn"] = "On-demand Dispatching (Hardware/Network)";
tplName["req_fcr"] = "Request - Fulfilled by RSD";
tplName["req_bf"] = "Request - Back-fill ticket template";
tplName["req_tpl"] = "Request - Ticket template";
tplName["req_icoco"] = "Request - iCoco account";
tplName["req_fuji"] = "Request - Fuji Xerox printer supplies";
tplName["wn_follow_up"] = "Ticket following up by support team";
tplName["wn_chase_spt"] = "Email for update - to support team";
tplName["wn_chase_user"] = "Email for update - to user";
tplName["wn_confirm"] = "Email for confirmation - to user";
tplName["wn_confirm_3"] = "Email for confirmation - to user 3 times";

incTpl["inc_fcr"] = ``;
incTpl["inc_bf"] = ``;
incTpl["inc_non_fcr"] = ``;
incTpl["enq_tpl"] = ``;
incTpl["enq_bf"] = ``;
incTpl["od_sw"] = ``;
incTpl["od_hwn"] = ``;

reqTpl["req_fcr"] = ``;
reqTpl["req_bf"] = ``;
reqTpl["req_tpl"] = ``;
reqTpl["req_icoco"] = ``;
reqTpl["req_fuji"] = ``;

wnTpl["wn_follow_up"] = ``;
wnTpl["wn_chase_spt"] = ``;
wnTpl["wn_chase_user"] = ``;
wnTpl["wn_confirm"] = ``;
wnTpl["wn_confirm_3"] = ``;


(function () {
    SNToolLogger(`Start`);
    window.ticketType = "";
    window.urlType = "normal";

    let incMatch = /^(http|https):\/\/([\w]+)\.service-now\.com\/incident\.do\?/i;
    let reqMatch = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_request\.do\?/i;
    let taskMatch = /^(http|https):\/\/([\w]+)\.service-now\.com\/sc_task\.do\?/i;
    let scChechoutMatch = /^(http|https):\/\/([\w]+)\.service-now\.com\/servicecatalog_checkout_one_v2\.do\?/i;

    let e;
    let u = window.location.href;
    SNToolLogger(`URL: ${u}`);

    if (u.match(incMatch)) {
        SNToolLogger(`setAttribute for resolve button`);
        ticketType = "inc";
        try {
            let r = document.getElementById("resolve_incident");
            let rb = document.getElementById("resolve_incident_bottom");
            r.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
            rb.setAttribute("onclick", "var resolve_incident=window.resolve_incident;resolveIncident();onResolve();return false;");
        } catch (err) {
            console.error(err);
            SNToolLogger(`Resolve button not found, moving on`);
        }
        addAssignToMeButton();
    } else if (u.match(reqMatch)) {
        ticketType = "req";
        addSaveButton();
    } else if (u.match(taskMatch)) {
        ticketType = "task";
        addSaveButton();
        addAssignToMeButton();
        addCopyFromRequestButton();
    } else if (u.match(scChechoutMatch)) {
        ticketType = "req";
        urlType = "sc_checkout";
    }

    SNToolLogger(`ticketType: ${ticketType}`);
    SNToolLogger(`urlType: ${urlType}`);

    if (urlType == "sc_checkout") {
        e = document.getElementsByClassName("container").item(2);
    } else {
        e = document.getElementsByClassName("vsplit col-sm-6").item(0);
        let wne = getWnParentElement(ticketType);
        let wnse = addWnTemplateField(wne);
        addWnTemplate(wnse);
    }

    se = addTemplateField(e, urlType);  // "select" element of Templete field
    addTicketTemplate(se, ticketType);
    hideAndSeek(ticketType, urlType);

    SNToolLogger(`End`);
})();


function addSaveButton() {
    let btnHeader = document.querySelectorAll(".navbar_ui_actions").item(0);
    let saveBtn = document.createElement('button');

    saveBtn.innerHTML = "Save";
    saveBtn.setAttribute("class", "form_action_button header  action_context btn btn-default");
    saveBtn.setAttribute("style", "white-space: nowrap");
    saveBtn.setAttribute("type", "submit");
    saveBtn.setAttribute("onclick", "gsftSubmit(gel('sysverb_update_and_stay'))");
    btnHeader.insertBefore(saveBtn, btnHeader.children[4]);
    SNToolLogger(`Added`);
}


function addCopyFromRequestButton() {
    let btnHeader = document.querySelectorAll(".navbar_ui_actions").item(0);
    let copyBtn = document.createElement('button');

    copyBtn.innerHTML = "Copy from Request";
    copyBtn.setAttribute("class", "form_action_button header  action_context btn btn-default");
    copyBtn.setAttribute("style", "white-space: nowrap");
    copyBtn.setAttribute("onclick", "getReqRef();");
    btnHeader.insertBefore(copyBtn, btnHeader.children[0]);
    SNToolLogger(`Added`);
}


function addAssignToMeButton() {
    let btnHeader = document.querySelectorAll(".navbar_ui_actions").item(0);
    let assignBtn = document.createElement('button');

    assignBtn.innerHTML = "Assign to Me";
    assignBtn.setAttribute("class", "form_action_button header  action_context btn btn-default");
    assignBtn.setAttribute("style", "white-space: nowrap");
    assignBtn.setAttribute("onclick", "assignToMe(ticketType);");
    btnHeader.insertBefore(assignBtn, btnHeader.children[0]);
    SNToolLogger(`Added`);
}


function addTemplateField(parentElement, uType) {
    if (uType == "normal") {
        let ph = document.createElement('div');
        ph.id = "placeholder";
        ph.className = "form-group ";
        ph.style = "visibility: hidden";
        ph.innerHTML = '<div class="" data-type="label" choice="1" type="choice" nowrap="true"><label class=" col-xs-12 col-md-3 col-lg-4 control-label"><span title="" class="label-text" data-html="false" data-original-title="">Placeholder</span></label></div><div class="col-xs-10 col-sm-9 col-md-6 col-lg-5 form-field input_controls"><select name="placeholder" style="; " class="form-control"></select></div><div class="col-xs-2 col-sm-3 col-lg-2 form-field-addons"></div>';
        parentElement.append(ph);

        let tpl_div = document.createElement('div');
        tpl_div.id = "element.template";
        tpl_div.className = "form-group ";
        tpl_div.style = "display: none;";

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
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticketType, urlType);");

        parentElement.append(tpl_div);
        tpl_div.append(tpl_div_label);
        tpl_div_label.append(tpl_label);
        tpl_label.append(tpl_span);
        tpl_div.append(tpl_div_select);
        tpl_div_select.append(tpl_select);
        SNToolLogger(`Elements appended`);
        return tpl_select;

    } else if (uType == "sc_checkout") {
        let tpl_div1 = document.createElement('div');
        tpl_div1.className = "container";
        tpl_div1.style = "display: none;";

        let tpl_div2 = document.createElement('div');
        tpl_div2.className = "row col-xs-12 sc_cv_info_row";

        let tpl_div_label = document.createElement('div');
        tpl_div_label.className = "col-xs-2 sc_requested_label";
        tpl_div_label.innerText = "Template"

        let tpl_div_select = document.createElement('div');
        tpl_div_select.className = "col-xs-8";

        let tpl_select = document.createElement('select');
        tpl_select.name = tpl_select.id = "template";
        tpl_select.className = "form-control";
        tpl_select.setAttribute("onchange", "onSelect(this.value, ticketType, urlType);");

        parentElement.parentNode.insertBefore(tpl_div1, parentElement);
        tpl_div1.append(tpl_div2);
        tpl_div2.append(tpl_div_label);
        tpl_div2.append(tpl_div_select);
        tpl_div_select.append(tpl_select);

        SNToolLogger(`Elements appended`);
        return tpl_select;
    }
}


function addTicketTemplate(s, tType) {
    let op = document.createElement('option');
    op.value = "";
    op.innerText = "-- None --";
    op.setAttribute("role", "option");
    op.setAttribute("selected", "SELECTED");
    s.append(op);

    if (tType == "inc") {
        for (let key in incTpl) {
            let t = document.createElement('option');
            t.value = key;
            t.innerText = tplName[key];
            t.setAttribute("role", "option");
            s.append(t);
        }
    } else if (tType == "req" || tType == "task") {
        for (let key in reqTpl) {
            let t = document.createElement('option');
            t.value = key;
            t.innerText = tplName[key];
            t.setAttribute("role", "option");
            s.append(t);
        }
    }
}


function addWnTemplateField(parentElement) {
    let wn_tpl_div = document.createElement('div');
    wn_tpl_div.id = "element.wn_template";
    wn_tpl_div.className = "form-group ";
    wn_tpl_div.style = "display: none;";

    let wn_tpl_div_label = document.createElement('div');
    wn_tpl_div_label.id = "label.wn_template";
    wn_tpl_div_label.className = "label_left label_spacing";
    wn_tpl_div_label.setAttribute("type", "journal_input");
    wn_tpl_div_label.setAttribute("choice", "0");

    let wn_tpl_label = document.createElement('label');
    wn_tpl_label.className = " col-xs-12 col-md-1_5 col-lg-2 control-label";
    wn_tpl_label.setAttribute("onclick", "return labelClicked(this);");
    wn_tpl_label.setAttribute("for", "wn_template");
    wn_tpl_label.setAttribute("dir", "ltr");

    let wn_tpl_span1 = document.createElement('span');
    wn_tpl_span1.id = "status.wn_template";
    wn_tpl_span1.className = " label_description";
    wn_tpl_span1.setAttribute("aria-label", "");
    wn_tpl_span1.setAttribute("data-dynamic-title", "");
    wn_tpl_span1.setAttribute("mandatory", "false");
    wn_tpl_span1.setAttribute("oclass", "");

    let wn_tpl_span2 = document.createElement('span');
    wn_tpl_span2.title = "";
    wn_tpl_span2.className = "label-text";
    wn_tpl_span2.innerText = "Work notes template";
    wn_tpl_span2.setAttribute("data-html", "false");
    wn_tpl_span2.setAttribute("data-original-title", "Select a work notes template");

    let wn_tpl_div_select = document.createElement('div');
    wn_tpl_div_select.className = "col-xs-10 col-md-9 col-lg-8 form-field input_controls";

    let wn_tpl_select = document.createElement('select');
    wn_tpl_select.name = wn_tpl_select.id = "wn_template";
    wn_tpl_select.className = "form-control";
    wn_tpl_select.setAttribute("aria-labelledby", "label.wn_template");
    wn_tpl_select.setAttribute("ng-non-bindable", "true");
    wn_tpl_select.setAttribute("onchange", "onWnSelect(this.value, ticketType);");

    parentElement.parentNode.insertBefore(wn_tpl_div, parentElement);
    wn_tpl_div.append(wn_tpl_div_label);
    wn_tpl_div_label.append(wn_tpl_label);
    wn_tpl_label.append(wn_tpl_span1);
    wn_tpl_label.append(wn_tpl_span2);
    wn_tpl_div.append(wn_tpl_div_select);
    wn_tpl_div_select.append(wn_tpl_select);

    SNToolLogger(`Elements appended`);
    return wn_tpl_select;
}


function addWnTemplate(s) {
    let op = document.createElement('option');
    op.value = "";
    op.innerText = "-- None --";
    op.setAttribute("role", "option");
    op.setAttribute("selected", "SELECTED");
    s.append(op);

    for (let key in wnTpl) {
        let t = document.createElement('option');
        t.value = key;
        t.innerText = tplName[key];
        t.setAttribute("role", "option");
        s.append(t);
    }
}


function addTitlePrefix(key, t, l) {
    let titleMatch;
    let locMatch;

    if (l != "(Location/Store Name)") {
        if (key.endsWith("bf")) {
            titleMatch = "[BACKLOG]" + loc;
        } else {
            titleMatch = loc;
        }
        locMatch = loc;

        titleMatch = new RegExp("^" + escapeRegExp(titleMatch));
        locMatch = new RegExp(escapeRegExp(locMatch));

        if (!document.getElementById(t).value.match(titleMatch)) {
            if (l != "(Location/Store Name)" && !document.getElementById(t).value.match(locMatch)) {
                SNToolLogger(`Add location prefix to ${t}`);
                document.getElementById(t).value = l + " " + document.getElementById(t).value;
            }
            if (key.endsWith("bf") && !document.getElementById(t).value.startsWith("[BACKLOG]")) {
                SNToolLogger(`Add back-fill prefix to ${t}`);
                document.getElementById(t).value = "[BACKLOG]" + document.getElementById(t).value;
            }
        }
    } else if (l == "(Location/Store Name)" && key.endsWith("bf")) {
        if (!document.getElementById(t).value.startsWith("[BACKLOG]")) {
            SNToolLogger(`Add back-fill prefix to ${t}`);
            document.getElementById(t).value = "[BACKLOG]" + document.getElementById(t).value;
        }
    }
}


function getWnParentElement(tType) {
    let e;

    if (tType == "inc") {
        e = "element.incident.work_notes";
    } else if (tType == "req") {
        e = "element.sc_request.work_notes";
    } else if (tType == "task") {
        e = "element.sc_task.work_notes";
    }

    return document.getElementById(e);
}


function fillinDesc(key, d, tType) {
    SNToolLogger(`${d}`);
    if (tType == "inc" && incTpl[key] !== undefined) {
        document.getElementById(d).style.height = "1px";
        document.getElementById(d).value = incTpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + "px";
    } else if ((tType == "req" || tType == "task") && reqTpl[key] !== undefined) {
        document.getElementById(d).style.height = "1px";
        document.getElementById(d).value = reqTpl[key];
        document.getElementById(d).style.height = document.getElementById(d).scrollHeight + "px";
    }
}


function fillinTitle(key, t, l) {
    SNToolLogger(`${t}`);
    SNToolLogger(`${l}`);
    if (tplTitle[key] !== undefined) {
        document.getElementById(t).value = tplTitle[key];
    } else {
        addTitlePrefix(key, t, l);
    }
}


function fillinWn(key, wn, ag, a) {
    if (wnTpl[key] !== undefined) {
        if (key == "wn_follow_up") {
            if (ag !== undefined || a !== undefined) {
                let av = document.getElementById(a).value;
                let agv = document.getElementById(ag).value;
                SNToolLogger(`av: ${av}`);
                SNToolLogger(`agv: ${agv}`);

                if (agv != "" && av != "") {
                    document.getElementById(wn).value = `${av} from ${agv} ${wnTpl[key]}`;
                } else if (agv != "" && av == "") {
                    document.getElementById(wn).value = `${agv} ${wnTpl[key]}`;
                }

            }
        } else {
            document.getElementById(wn).value = wnTpl[key];
        }
    }
}


function escapeRegExp(s) {
    return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}


function getLocation() {
    let userID = g_form.getValue("requested_for")
    let gr_user = new GlideRecord("sys_user");
    gr_user.get(userID);

    let locID = gr_user.location;
    let gr_loc = new GlideRecord("cmn_location");
    gr_loc.get(locID);

    let locName = gr_loc.name;
    if (locName == undefined) {
        return "";
    }
    return locName;
}


function hideAndSeek(tType, uType) {
    let titleID;
    let worknotesID;
    let titleElement;
    let worknotesElement;

    if (tType == "inc") {
        titleID = "status.incident.short_description";
        worknotesID = "status.incident.work_notes";
        titleElement = document.getElementById(titleID).nextElementSibling;
        worknotesElement = document.getElementById(worknotesID).nextElementSibling;
    } else if (tType == "req") {
        if (uType == "normal") {
            titleID = "status.sc_request.short_description";
            worknotesID = "status.sc_request.work_notes";
            titleElement = document.getElementById(titleID).nextElementSibling;
            worknotesElement = document.getElementById(worknotesID).nextElementSibling;
        } else if (uType == "sc_checkout") {
            titleElement = document.getElementsByClassName("col-xs-2 sc_requested_label").item(4);
        }
    } else if (tType == "task") {
        titleID = "status.sc_task.short_description";
        worknotesID = "status.sc_task.work_notes";
        titleElement = document.getElementById(titleID).nextElementSibling;
        worknotesElement = document.getElementById(worknotesID).nextElementSibling;
    }

    try {
        titleElement.setAttribute("onclick", "showTemplate(urlType);");
        worknotesElement.setAttribute("onclick", "showTemplate(urlType);");
    } catch (err) {
        console.error(err)
    }

    SNToolLogger("We are assassins");
}


function SNToolLogger(msg, funcName = SNToolLogger.caller.name) {
    console.log(`[SNTool] ${funcName}()| ${msg}`);
}


window.assignToMe = function (tType) {
    let oID;
    let uID = g_user.userID;
    if (tType == "inc") {
        oID = g_form.getValue("u_owner_group");
        g_form.setValue("assignment_group", oID);
        SNToolLogger(`Group ID: ${oID}`, "assignToMe");
    } else if (tType == "task") {
        g_form.getReference("request", copyOwnerGroupFromReq);
    }
    g_form.setValue("assigned_to", uID);
    SNToolLogger(`User ID: ${uID}`, "assignToMe");
}


window.copyOwnerGroupFromReq = function (caller) {
    g_form.setValue("assignment_group", caller.u_owner_group)
    SNToolLogger(`Group ID: ${caller.u_owner_group}`, "copyOwnerGroupFromReq");
}


window.getReqRef = function () {
    document.getElementById("sc_task.short_description").value = "Loading...";
    document.getElementById("sc_task.description").value = "Loading...";
    g_form.getReference("request", copyReqRef);
}


window.copyReqRef = function (caller) {
    document.getElementById("sc_task.short_description").value = caller.short_description;
    document.getElementById("sc_task.description").value = caller.special_instructions;
    document.getElementById("sc_task.description").style.height = document.getElementById("sc_task.description").scrollHeight + "px";
    SNToolLogger(`Done`, "copyReqRef");
}


window.showTemplate = function (uType) {
    if (uType == "normal") {
        if (tplVisible == false) {
            if (ticketType == "req") {
                div = document.getElementById("element.sc_request.parent").show();
            }
            document.getElementById("element.template").show();
            document.getElementById("element.wn_template").show();
            tplVisible = true;
            SNToolLogger(`We serve the light`, "showTemplate");
        } else if (tplVisible == true) {
            if (ticketType == "req") {
                div = document.getElementById("element.sc_request.parent").hide();
            }
            document.getElementById("element.template").hide();
            document.getElementById("element.wn_template").hide();
            tplVisible = false;
            SNToolLogger(`We work in the dark`, "showTemplate");
        }
    } else if (uType == "sc_checkout") {
        if (tplVisible == false) {
            document.getElementsByClassName("container").item(2).show();
            tplVisible = true;
            SNToolLogger(`We serve the light`, "showTemplate");
        } else if (tplVisible == true) {
            document.getElementsByClassName("container").item(2).hide();
            tplVisible = false;
            SNToolLogger(`We work in the dark`, "showTemplate");
        }
    }
}


window.onSelect = function (key, tType, uType) {
    SNToolLogger(`tType: ${tType}`, "onSelect");
    SNToolLogger(`key: ${key}`, "onSelect");

    let l;
    let desc;
    let title;

    if (tType == "inc") {
        desc = "incident.description";
        title = "incident.short_description";
        l = document.getElementById("sys_display.incident.u_requested_for.location").value;
    } else if (tType == "req") {
        if (uType == "normal") {
            desc = "sc_request.special_instructions";
            title = "sc_request.short_description";
            l = document.getElementById("sys_display.sc_request.requested_for.location").value;
        } else if (uType == "sc_checkout") {
            desc = "special_instructions";
            title = "title";
            l = getLocation();
            document.getElementById("special_instructions").click();
        }
    } else if (tType == "task") {
        desc = "sc_task.description";
        title = "sc_task.short_description";
        document.getElementById("sc_task.description").click();
    }

    if (l != "" && l != "TEMP123") {
        loc = l;
    }

    init();
    fillinDesc(key, desc, tType);
    fillinTitle(key, title, loc);
}


window.onWnSelect = function (key, tType) {
    SNToolLogger(`tType: ${tType}`, "onWnSelect");
    SNToolLogger(`key: ${key}`, "onWnSelect");

    let wnTextarea;
    let assignmentGroup;
    let assignee;

    if (tType == "inc") {
        wnTextarea = "incident.work_notes";
        assignmentGroup = "sys_display.incident.assignment_group";
        assignee = "sys_display.incident.assigned_to";
    } else if (tType == "req") {
        wnTextarea = "sc_request.work_notes";
    } else if (tType == "task") {
        wnTextarea = "sc_task.work_notes";
        assignmentGroup = "sys_display.sc_task.assignment_group";
        assignee = "sys_display.sc_task.assigned_to";
    }

    SNToolLogger(`wnTextarea: ${wnTextarea}`, "onWnSelect");
    SNToolLogger(`assignmentGroup: ${assignmentGroup}`, "onWnSelect");
    SNToolLogger(`assignee: ${assignee}`, "onWnSelect");

    init();
    fillinWn(key, wnTextarea, assignmentGroup, assignee);
}


window.onResolve = function () {
    let incCloseNotes = "Root Cause: \nResolution/Workaround: ";
    let enqCloseNotes = "Answer: ";

    let u_type = document.getElementById("incident.u_type").value;
    SNToolLogger(`u_type: ${u_type}`, "onResolve");

    if (document.getElementById("incident.close_notes").value == "") {
        if (u_type == "incident") {
            document.getElementById("incident.close_notes").value = incCloseNotes;
        } else if (u_type == "enquiry") {
            document.getElementById("incident.close_notes").value = enqCloseNotes;
        }
    }
}


function init() {
    incTpl["inc_fcr"] = `${loc}
Caller: 
Contact number: 
Issue symptom: 
Device(SN): `;

    incTpl["inc_bf"] = `${loc}
Requestor: 
Contact number: 
Issue symptom: `;

    incTpl["inc_non_fcr"] = `${loc}
Caller: 
Contact number: 
Date and Time of issue: 
Device(SN): 
Market / Country: 
Page URL / App: 
Steps to reproduce: 
1/ 
2/ 
n/ 
Actual behavior: 
Expected behavior: 
Issue symptom: 
Action Taken by RSD: 
Screenshots and attachments: Please refer to the screenshot(s) named: 
Special remark: `;

    incTpl["enq_tpl"] = `${loc}
Caller: 
Contact number: 
End-user would like to wonder: `;

    incTpl["enq_bf"] = `${loc}
Caller: 
Contact number: 
End-user would like to wonder: `;

    incTpl["od_sw"] = `Ticket Number: 
Priority: 
Store Name: ${loc}
Store Address: 
Caller: 
Contact number: 
Date and Time of issue: 
Device(SN): 
Page URL / App: 
Steps to reproduce: 
1/ 
2/ 
n/ 
Actual behavior: 
Expected behavior: 
Action Taken by RSD: 
Screenshots and attachments: Please refer to the screenshot(s) named: 
Approved By: `;

    incTpl["od_hwn"] = `Ticket Number: 
Priority: 
Store Name: ${loc}
Store Address: 
Caller: 
Contact number: 
Date and Time of issue: 
Device(SN): 
Issue symptom: 
Action Taken by RSD: 
Screenshots and attachments: Please refer to the screenshot(s) named: 
Approved By: `;

    reqTpl["req_fcr"] = `${loc}
Caller: 
Contact number: 
Request Content: `;

    reqTpl["req_bf"] = `${loc}
Requestor: 
Contact number: 
Request Content: 
Device (SN): `;

    reqTpl["req_tpl"] = `${loc}
Last name: 
First name: 
AD Username: 
Contact number: 
Country: 
Position / Job Title: 
Name of the user manager: 
Application Type: Access Right / Software / Hardware / Loan / Other
Application Content: 
Business Justification: 
Approved by: `;

    tplTitle["req_icoco"] = "Create/Deactivate/Modify iCoco Account for {BTQ Name} - {Employee ID}";
    reqTpl["req_icoco"] = `- Last name: 
- First name: 
- Email: 
- AD/LDAP Username: 
- Employee ID: 
- Staff code: 
- Country/Location: CN 
- Job Title: 
- Date of employment/Cessation Date: 入职日期/离职日期 
- Status: 入职/离职/转店 
- Store Name: ${loc}
- Request Access: iCoco(Chanel CN Sales) 
- Active: True/False`;

    tplTitle["req_fuji"] = "香奈儿耗材订购 - {BTQ Name} - {Date}";
    reqTpl["req_fuji"] = `Ticket Number: 
Store Name: ${loc}
Store Address: 
Caller: 
Contact number: 
Date and Time of Request: 
Device(SN): 
Device IP: 
Request Content: 
Screenshots and attachments: Please refer to the screenshot as below and the attachment named: 
Remark: 如配送已完成，麻烦请将签收单回复此邮件，以便RSD联系用户确认，谢谢`;

    wnTpl["wn_follow_up"] = `is following up the ticket. Pending for reply.`;
    wnTpl["wn_chase_spt"] = `RSD has sent an email to support team for update. Pending for reply.`;
    wnTpl["wn_chase_user"] = `RSD has sent an email to user for update. Pending for reply.`;
    wnTpl["wn_confirm"] = `RSD has sent an email to the user for confirmation. Pending for reply.`;
    wnTpl["wn_confirm_3"] = `RSD has sent confirmation emails to user three times. The ticket will be closed after seven days if no response from the user.`;
}
