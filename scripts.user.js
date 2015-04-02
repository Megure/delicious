// ==UserScript==
// @name AnimeBytes delicious user scripts
// @author aldy, potatoe, alpha, Megure
// @version 1.91
// @downloadURL https://aldy.nope.bz/scripts.user.js
// @updateURL https://aldy.nope.bz/scripts.user.js
// @description Variety of userscripts to fully utilise the site and stylesheet.
// @include *animebytes.tv/*
// @match https://*.animebytes.tv/*
// @icon http://animebytes.tv/favicon.ico
// ==/UserScript==


// Super duper important functions
// Do not delete or something might break and stuff!! :(
HTMLCollection.prototype.each = function (f) { for (var i=0, e=null; e=this[i]; i++) f.call(e, e); return this; };
HTMLElement.prototype.clone = function (o) { var n = this.cloneNode(); n.innerHTML = this.innerHTML; if (o!==undefined) for (var e in o) n[e] = o[e]; return n; };
// Thank firefox for this ugly shit. Holy shit firefox get your fucking shit together >:(
function forEach (arr, fun) { return HTMLCollection.prototype.each.call(arr, fun); }
function clone (ele, obj) { return HTMLElement.prototype.clone.call(ele, obj); }

function injectScript (content, id) {
	var script = document.createElement('script');
	if (id) script.setAttribute('id', id);
	script.textContent = content.toString();
	document.body.appendChild(script);
	return script;
}
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
	this.GM_getValue=function (key,def) { return localStorage[key] || def; };
	this.GM_setValue=function (key,value) { return localStorage[key]=value; };
	this.GM_deleteValue=function (key) { return delete localStorage[key]; };
}
function initGM(gm, def, json, overwrite) {
	if (typeof def === "undefined") throw "shit";
	if (typeof overwrite !== "boolean") overwrite = true;
	if (typeof json !== "boolean") json = true;
	var that = GM_getValue(gm);
	if (that != null) {
		var err = null;
		try { that = ((json)?JSON.parse(that):that); }
		catch (e) { if (e.message.match(/Unexpected token .*/)) err = e; }
		if (!err && Object.prototype.toString.call(that) === Object.prototype.toString.call(def)) { return that; }
		else if (overwrite) {
			GM_setValue(gm, ((json)?JSON.stringify(def):def));
			return def;
		} else { if (err) { throw err; } else { return that; } }
	} else {
		GM_setValue(gm, ((json)?JSON.stringify(def):def));
		return def;
	}
}
function createSettingsPage() {
	function addCheckbox(title, description, varName, onValue, offValue) {
		if (typeof onValue !== "string" || typeof offValue !== "string" || onValue === offValue) onValue='true', offValue='false';
		var newLi = document.createElement('li');
		this[varName] = initGM(varName, onValue, false);
		newLi.innerHTML = "<span class='ue_left strong'>"+title+"</span>\n<span class='ue_right'><input type='checkbox' onvalue='"+onValue+"' offvalue='"+offValue+"' name='"+varName+"' id='"+varName+"'"+((this[varName]===onValue)?" checked='checked'":" ")+">\n<label for='"+varName+"'>"+description+"</label></span>";
		newLi.addEventListener('click', function(e){var t=e.target;if(typeof t.checked==="boolean"){if(t.checked){GM_setValue(t.id,t.getAttribute('onvalue'));}else{GM_setValue(t.id,t.getAttribute('offvalue'));}}});
		var poselistNode = document.getElementById('pose_list');
		poselistNode.appendChild(newLi);
		return newLi;
	}
	function addDropdown(title, description, varName, list, def) {
		var newLi = document.createElement('li'), innerHTML = '';
		this[varName] = initGM(varName, def, false);
		innerHTML += "<span class='ue_left strong'>"+title+"</span>\n<span class='ue_right'><select name='"+varName+"' id='"+varName+"'>";
		for (var i = 0; i < list.length; i++) {
			var el = list[i], selected = '';
			if (el[1] === GM_getValue(varName)) selected = " selected='selected'";
			innerHTML += "<option value='"+el[1]+"'"+selected+">"+el[0]+"</option>";
		}
		innerHTML += "</select><label for='"+varName+"'>"+description+"</label></span>";
		newLi.innerHTML = innerHTML;
		newLi.addEventListener('change', function(e) { GM_setValue(varName, e.target.value); });
		var poseList = document.getElementById('pose_list');
		poseList.appendChild(newLi);
		return newLi;
	}
	function relink(){$j(function(){var stuff=$j('#tabs > div');$j('ul.ue_tabs a').click(function(){stuff.hide().filter(this.hash).show();$j('ul.ue_tabs a').removeClass('selected');$j(this).addClass('selected');return false;}).filter(':first,a[href="'+window.location.hash+'"]').slice(-1)[0].click();});}
	var pose = document.createElement('div');
	pose.id = "potatoes_settings";
	pose.innerHTML = '<div class="head colhead_dark strong">User Script Settings</div><ul id="pose_list" class="nobullet ue_list"></ul>';
	var poseanc = document.createElement('li');
	poseanc.innerHTML = '&bull;<a href="#potatoes_settings">User Script Settings</a>';
	var tabsNode = document.getElementById('tabs');
	var linksNode = document.getElementsByClassName('ue_tabs')[0];
	if (document.getElementById('potatoes_settings') == null) { tabsNode.insertBefore(pose, tabsNode.childNodes[tabsNode.childNodes.length-2]); linksNode.appendChild(poseanc); document.body.removeChild(injectScript('('+relink.toString()+')();', 'settings_relink')); }
	addCheckbox("Delicious Hover Smileys", "Enable/Disable delicious smileys that appear on hover.", 'delicioussmileys');
	addCheckbox("Delicious BBCode", "Enable/Disable delicious [hide] button and modify [url] and [quote] buttons.", 'deliciousbbcode');
	addCheckbox("Delicious Better Quote", "Enable/Disable delicious better <span style='color: green; font-family: Courier New;'>&gt;quoting</span>", 'deliciousquote');
	addCheckbox("Delicious HYPER Quote", "Enable/Disable experimental HYPER quoting: select text and press CTRL+V to instant-quote. [EXPERIMENTAL]", 'delicioushyperquote');
	addCheckbox("Delicious Title Flip", "Enable/Disable delicious flipping of Forum title tags.", 'delicioustitleflip');
	addCheckbox("Disgusting Treats", "Hide/Unhide those hideous treats!", 'delicioustreats');
	addCheckbox("Disgusting Poster Info", "Hide/Unhide those despicable poster infos!", 'disgustingposterinfo');
	addCheckbox("Delicious Keyboard Shortcuts", "Enable/Disable delicious keyboard shortcuts for easier access to Bold/Italics/Underline/Spoiler/Hide and aligning.", 'deliciouskeyboard');
	addCheckbox("Delicious Title Notifications", "Display number of notifications in title.", 'delicioustitlenotifications');
	addCheckbox("Delicious Stylesheet Preview", "Allows you to easily preview and select delicious stylesheets.", 'deliciousstylesheetpreview');
	addCheckbox("Delicious Yen per X", "Shows how much yen you receive per X, and as upload equivalent. Also adds raw download, raw upload and raw ratio.", 'deliciousyenperx');
	addCheckbox("Delicious Freeleech Pool", "Shows current freeleech pool progress in the navbar and on user pages (updated once an hour or when freeleech pool site is visited).", 'deliciousfreeleechpool');
	addDropdown("FL Pool Navbar Position", "Select position of freeleech pool progress in the navbar or disable it.", 'deliciousflpoolposition', [['Before user info', 'before #userinfo_minor'], ['After user info', 'after #userinfo_minor'], ['Before menu', 'before .main-menu.nobullet'], ['After menu', 'after .main-menu.nobullet'], ['Don\'t display', 'none']], 'after #userinfo_minor');
	addCheckbox("Delicious Freeleech Pie Chart", "Adds a dropdown with pie-chart to the freeleech pool progress in the navbar. (Doesn't look too good with most stylesheets.)", 'delicousnavbarpiechart');
}

if (/\/user\.php\?.*action=edit/i.test(document.URL)) createSettingsPage();


// A couple GM variables that need initializing
var gm_delicioussmileys = initGM('delicioussmileys', 'true', false);
var gm_deliciousbbcode = initGM('deliciousbbcode', 'true', false);
var gm_deliciousquote = initGM('deliciousquote', 'true', false);
var gm_delicioushyperquote = initGM('delicioushyperquote', 'true', false);
var gm_delicioustitleflip = initGM('delicioustitleflip', 'true', false);
var gm_delicioustreats = initGM('delicioustreats', 'true', false);
var gm_disgustingposterinfo = initGM('disgustingposterinfo', 'true', false);
var gm_deliciouskeyboard = initGM('deliciouskeyboard', 'true', false);
var gm_delicioustitlenotifications = initGM('delicioustitlenotifications', 'true', false);
var gm_deliciousstylesheetpreview = initGM('deliciousstylesheetpreview', 'true', false);
var gm_deliciousyenperx = initGM('deliciousyenperx', 'true', false);
var gm_deliciousfreeleechpool = initGM('deliciousfreeleechpool', 'true', false);
var gm_delicousnavbarpiechart = initGM('delicousnavbarpiechart', 'false', false);


// Add delicious stylesheets to stylesheet dropdown menu including preview by Megure
// LINKS ARE HARDCODED TO aldy.nope.bz AND /static/styles/, CHANGE IF NECESSARY!
if (GM_getValue('deliciousstylesheetpreview', 'true') === 'true' && /\/user\.php\?.*action=edit/i.test(document.URL)) {
	var source = 'https://aldy.nope.bz/',
	    ABSource = '/static/styles/',
	    deliciousStylesheets = ['Milky Way', 'Toblerone', 'Dream', 'Tentaclebytes', 'Coaltastic'],
	    stylesheet = document.getElementById('stylesheet'),
	    currentLink = document.querySelector('link[rel=stylesheet]'),
	    originalNoSS = stylesheet.children.length,
	    styleurl = document.getElementById('styleurl'),
	    input = document.createElement('input');
	input.type = 'text';
	input.name = stylesheet.name;
	input.value = stylesheet.value;
	input.style.display = 'none';
	stylesheet.parentNode.insertBefore(input, stylesheet);
	stylesheet.removeAttribute('name');
	stylesheet.removeAttribute('onchange');
	// Store the source for all current children into attribute src
	for (var i = 0, len = stylesheet.children.length; i < len; i++) {
		var elem = stylesheet.children[i];
		elem.setAttribute('src', ABSource + elem.textContent.trim().toLowerCase() + '.css');
	}
	// Add delicious stylesheets and store source in src
	for (var i = 0, len = deliciousStylesheets.length; i < len; i++) {
		var sheet = deliciousStylesheets[i],
		    option = document.createElement('option'),
		    src = source + sheet.replace(/\s/g, '').toLowerCase() + '.css';
		option.textContent = 'Delicious ' + sheet;
		option.setAttribute('src', src);
		option.value = stylesheet.children.length + 1;
		stylesheet.appendChild(option);
		if (styleurl.value === src)
			stylesheet.value = option.value;
	}
	// Pre-load the stylesheets on focus of dropdown
	stylesheet.addEventListener('focus', function(event) {
		for (var i = 0, len = stylesheet.children.length; i < len; i++) {
			var elem = stylesheet.children[i],
			    src = elem.getAttribute('src');
			if (currentLink.href !== src) {
				var newLink = document.createElement('link');
				newLink.href = src;
				newLink.media = 'screen';
				newLink.rel = 'alternate stylesheet';
				newLink.title = elem.textContent;
				newLink.type = 'text/css';
				currentLink.parentNode.insertBefore(newLink, currentLink);
				newLink.disabled = true;
			}
		}
	});
	stylesheet.addEventListener('change', function(event) {
		var id = stylesheet.value,
		    src = stylesheet.children[parseInt(id, 10) - 1].getAttribute('src'),
		    activeLink = document.querySelector('link[href="' + src + '"]');
		if (activeLink !== null) {
			var allLinks = document.querySelectorAll('link[title][rel~="stylesheet"]');
			for (var i = 0, len = allLinks.length; i < len; i++)
				allLinks[i].disabled = true;
			activeLink.disabled = false;
		}
		if (src.indexOf(source) !== -1)
			styleurl.value = src;
		else
			styleurl.value = '';
	});
}


// Hover smileys by Potatoe, ported by aldy
// Hides smileys behind one button that shows them all on hover.
// Depends on HTMLElement.clone and HTMLCollection.each
if (GM_getValue('delicioussmileys') === 'true' && document.getElementById('smileys')) {
	var smileys = document.getElementById('smileys'), r = '';
	forEach(smileys.getElementsByTagName('*'), function (n) {
		var c = n.getAttribute('onclick');
		n.removeAttribute('onclick');
		n.setAttribute('style',((n.width>33)?'margin-left:'+(33-n.width)/2+'px;':'')+'margin-top:'+(33-n.height)/2+'px;');
		r += '<div class="smileyscell" onclick="'+c+'">'+n.outerHTML+'</div>';
	});
	smileys.innerHTML = r;
	smileys.setAttribute('style', 'display: none; width: 330px !important; position: absolute; top: 0; left: 0; background:rgba(0,0,0,0.75);');
	smileys.setAttribute('id', 'hoversmileys');
	document.getElementById('bbcode').innerHTML += '<span style="display:inline-block;max-width:20px;height:20px;z-index:1;position:relative;" id="smileysholdster"><style>.smileyscell{display:inline-block;overflow:hidden;width:33px;max-width:33px;height:33px;float:left}#smileysbutton img[src="/static/common/smileys/Smile.png"]{margin-top:0px!important}#smileysbutton{width:20px;height:20px}</style></div>'
	var smileysholdster = document.getElementById('smileysholdster'), smileysbutton = clone(smileys.firstElementChild, {'id':'smileysbutton'});
	smileysholdster.appendChild(smileysbutton);
	smileysholdster.appendChild(smileys);
	smileys.style.top = smileysbutton.offsetTop + 'px';
	smileys.style.left = smileysbutton.offsetLeft + 'px';
	smileysholdster.addEventListener('mouseenter', function(){ var hs = document.getElementById('hoversmileys'), sb = document.getElementById('smileysbutton'); hs.style.top = sb.offsetTop+'px'; hs.style.left = sb.offsetLeft+'px'; hs.style.display = 'block'; });
	smileysholdster.addEventListener('mouseleave', function(){ document.getElementById('hoversmileys').style.display = 'none'; });
}


// [hide] button by Potatoe
// Adds a button that inserts the [hide] BBCode into the text field.
if (GM_getValue('deliciousbbcode') === 'true') {
	var spoilersnode = document.evaluate("//img[@title='Spoilers']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (spoilersnode) {
		// [url] and [quote] buttons by aldy
		// Edits the [url] and [quote] BBCode buttons.
		document.evaluate("//img[@title='URL']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('onclick', "insert_text('[url]', '[/url]')");
		document.evaluate("//img[@title='Quote']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('onclick', "insert_text('[quote]', '[/quote]')");

		var hideimg = document.createElement('img');
		hideimg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAotJREFUeNpiYWBgaGCgImDBJaHqp6co76CmLaAkosjGw84PEvv15efHD/fe3H908PbVWxsv3semjxHdhZLGciKm+U7evDICCvhc8vnJhwenJ+7b+vzsozfI4sxA7ADjqHjryFtXeSRwCHIJE/IaOx+HgLyjmsGP998ev7v96iOGl0EuM8l1iGRiZWYD8b+9+vz83Z3X95ANYeVi4xDRlNBmZmfhAPFBakF6vr74NAfmUrCBjIyMDOYlLv7MbCzsMM1XV5zZc2vDxXvoLuOW4Ntj1+DjK6QmpgX2IlAPSO/GqPlz////D/GyWoC+koKzhi2yxv9//39RcFJX0ou3sFYPNNBX9tBWZ2Jh+vHizKPXz888vKcRbGgDUwuMNL4fH78/fnvj5XuwC+XtVbXRXSJjpWSNLsYvL6QEdHUn0Is/QEHCJcYrCZMDmQHyERNYoaKIIsnpjZOVA8UyqBksMCcTMuDT4/f3Hu67eRbEFtWVEmTj5RBEloeZwQIJr39/GZmYmdENeXLs3tGDNZv2oIubZDu44M0pv77+/MwhgDvtAWOWQ9pCUQqYZCSBtDG660Dg99efn+AGfnn28Sk+A0GGmeY5xhIIksfgtAkiHu6/dQmbIlBCBiUpkMsIhfGDfTcvwV14c92Fuxohhk+4xflkkBUJKosocQpzC7Kws3DiM+zry09Pbq2/eBfuQlAKP9mzZ+PfX39+Iit8dfnZtc3xCxeDcg0uw0B6Tvbt3QgyA24gCIDy4pnJB5b/+/33F7FpEaQWpOf56Ydv8BZfoLyJ7n1s3gT5Cr34YsRWYoMKC7VAfWU5WxUtUAHLys3O///fv7+gAvbTw3ePHh2+cw0UZjBvEjSQEgAQYABZyQWIL1ugrwAAAABJRU5ErkJggg==";
		hideimg.title = hideimg.alt="Hide";
		hideimg.setAttribute('onclick', "insert_text('[hide]', '[/hide]')");
		spoilersnode.parentNode.insertBefore(hideimg, spoilersnode.nextSibling);
		spoilersnode.insertAdjacentHTML('afterend', '\n');
	}
}


// Better quote by Potatoe, multi-quote by Megure
// Makes the quoting feature on AnimeBytes better by including links back to posts and the posted date.
// Depends on injectScript
if (GM_getValue('deliciousquote') === 'true') {
	var quotes = document.querySelectorAll('a[onclick^="Quote"]');
	for (var i = 0, len = quotes.length; i < len; i++) {
		var elem = quotes[i],
		    args = elem.getAttribute('onClick').match(/Quote\s*\((?:\s*'([^']*)'\s*)?(?:,\s*'([^']*)'\s*)?(?:,\s*'([^']*)'\s*)?\)/i),
		    cb = document.createElement('input');
		cb.type = 'checkbox';
		cb.className = 'com-quote-multiquoteCB';
		if (args[1] === undefined) args[1] = '';
		if (args[2] === undefined) args[2] = '';
		if (args[3] === undefined) args[3] = '';
		cb.setAttribute('postid', args[1]);
		cb.setAttribute('username', args[2]);
		cb.setAttribute('surround', args[3]);
		// Hide it if usercomment
		if (/usercomment/i.test(elem.className))
			cb.style.display = 'none';
		elem.parentNode.insertBefore(cb, elem);
	}
	function Quote(postid, username, surround) {
		var result = [],
		    results = 0,
		    multiQuote,
		    temp = document.querySelector('input.com-quote-multiquoteCB[postid="' + postid + '"]');
		if (temp !== null)
			temp.checked = true;
		multiQuote = document.querySelectorAll('.com-quote-multiquoteCB:checked');
		if (multiQuote.length > 0) {
			for (var i = 0, len = multiQuote.length; i < len; i++) {
				var elem = multiQuote[i],
						postid = elem.getAttribute('postid'),
						username = elem.getAttribute('username'),
						surround = elem.getAttribute('surround');
				retrievePost(postid, username, surround, i);
			}
		} else {
			multiQuote = [document.createElement('input')];
			retrievePost(postid, username, surround, 0);
		}
		function checkResult() {
			if (multiQuote.length === ++results) {
				insert_text(result.join('\n\n\n'), '');
				for (var i = 0, len = multiQuote.length; i < len; i++)
					multiQuote[i].checked = false;
			}
		}
		function retrievePost(postid, username, surround, index) {
			$j.ajax({
				url: window.location.pathname,
				data: {
					action: 'get_post',
					post: postid
				},
				success: function (response) {
					function replaceImg(text){if(text.match(/^([^]*)(\[img\][^\[]+\[\/img\])([^]*)$/mi)!=null){return text.replace(/^([^]*)(\[img\][^\[]+\[\/img\])([^]*)$/mi,function(full,$1,$2,$3){var tmp="BQTMPBQ"+new Date().getTime()+"BQTMPBQ",ssm=$1.match(/\[hide(=[^\]]*)?\]/mgi),sem=$1.match(/\[\/hide\]/mgi),esm=$3.match(/\[hide(=[^\]]*)?\]/mgi),eem=$3.match(/\[\/hide\]/mgi),ssm=(ssm!=null)?ssm.length:0,sem=(sem!=null)?sem.length:0,esm=(esm!=null)?esm.length:0,eem=(eem!=null)?eem.length:0,hsm=ssm-sem,hem=esm-eem,tmptxt=replaceImg($1+tmp+$3);$1=tmptxt.substring(0,tmptxt.search(tmp));$3=tmptxt.substring(tmptxt.search(tmp)+tmp.length,tmptxt.length);if(hsm>=hem&&hsm>0)return $1+$2+$3;return $1+'[hide=Image]'+$2+'[/hide]'+$3})}return text}
					function replaceYouTube(text){if(text.match(/^([^]*)(\[youtube\][^\[]+\[\/youtube\])([^]*)$/mi)!=null){return text.replace(/^([^]*)(\[youtube\][^\[]+\[\/youtube\])([^]*)$/mi,function(full,$1,$2,$3){var tmp="BQTMPBQ"+new Date().getTime()+"BQTMPBQ",ssm=$1.match(/\[hide(=[^\]]*)?\]/mgi),sem=$1.match(/\[\/hide\]/mgi),esm=$3.match(/\[hide(=[^\]]*)?\]/mgi),eem=$3.match(/\[\/hide\]/mgi),ssm=(ssm!=null)?ssm.length:0,sem=(sem!=null)?sem.length:0,esm=(esm!=null)?esm.length:0,eem=(eem!=null)?eem.length:0,hsm=ssm-sem,hem=esm-eem,tmptxt=replaceYouTube($1+tmp+$3);$1=tmptxt.substring(0,tmptxt.search(tmp));$3=tmptxt.substring(tmptxt.search(tmp)+tmp.length,tmptxt.length);if(hsm>=hem&&hsm>0)return $1+$2+$3;return $1+'[hide=YouTube Video]'+$2+'[/hide]'+$3})}return text}
					response = replaceYouTube(replaceImg(response));
					if (window.location.pathname === '/forums.php') var type = '#';
					if (window.location.pathname === '/user.php') var type = '*';
					if (window.location.pathname === '/torrents.php') var type = '-1';
					if (window.location.pathname === '/torrents2.php') var type = '-2';
					if (typeof type === 'undefined')
						var quoteText = '[quote=' + username + ']' + response + '[/quote]';
					else
						var quoteText = '[quote=' + type + postid + ']' + response + '[/quote]';
					if (surround && surround.length > 0) quoteText = '[' + surround + ']' + quoteText + '[/' + surround + ']';
					result[index] = quoteText;
					checkResult();
				},
				error: function () {
					result[index] = 'error retrieving post #' + postid;
					checkResult();
				},
				dataType: 'html'
			});
		}
	}
	injectScript(Quote, 'BetterQuote');
}


// HYPER QUOTE by Megure
// Select text and press CTRL+V to quote
if (GM_getValue('delicioushyperquote') === 'true' && document.getElementById('quickpost') !== null) {
	function formattedUTCString(date, timezone) {
		var creation = new Date(date);
		if (isNaN(creation.getTime()))
			return date;
		else {
			creation = creation.toUTCString().split(' ');
			return creation[1] + ' ' + creation[2] + ' ' + creation[3] + ', ' + creation[4].substring(0, 5) + (timezone !== false ? ' ' + creation[5] : '');
		}
	}

	function QUOTEALL() {
		var sel = window.getSelection();
		for(var i = 0; i < sel.rangeCount; i++)
			QUOTEMANY(sel.getRangeAt(i));
	}

	function QUOTEMANY(range) {
		function removeChildren(node, prev) {
			if (node === null || node.parentNode === null) return;
			if (prev === true)
				while (node.parentNode.firstChild !== node)
					node.parentNode.removeChild(node.parentNode.firstChild);
			else
				while (node.parentNode.lastChild !== node)
					node.parentNode.removeChild(node.parentNode.lastChild);
			removeChildren(node.parentNode, prev);
		}
		function inArray(arr, elem) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === elem)
					return i;
			}
			return -1;
		}

		if (range.collapsed === true) return;

		var html1, html2, copy, res, start = [], end = [], startNode, endNode;
		html1 = range.startContainer;
		while (html1.parentNode !== null) {
			start.push(inArray(html1.parentNode.childNodes, html1));
			html1 = html1.parentNode;
		}
		html2 = range.endContainer;
		while (html2.parentNode !== null) {
			end.push(inArray(html2.parentNode.childNodes, html2));
			html2 = html2.parentNode;
		}
		if (html1 !== html2 || html1 === null) return;
		copy = html1.cloneNode(true);

		startNode = copy;
		for (var i = start.length - 1; i >= 0; i--) {
			if (start[i] === -1) return;
			startNode = startNode.childNodes[start[i]];
		}
		endNode = copy;
		for (var i = end.length - 1; i >= 0; i--) {
			if (end[i] === -1) return;
			endNode = endNode.childNodes[end[i]];
		}

		if (endNode.nodeType === 3)
			endNode.data = endNode.data.substr(0, range.endOffset);
		else if (endNode.nodeType === 1)
			for (var i = endNode.childNodes.length; i > range.endOffset; i--)
				endNode.removeChild(endNode.lastChild);
		if (range.startOffset > 0) {
			if (startNode.nodeType === 3)
				startNode.data = startNode.data.substr(range.startOffset);
			else if (startNode.nodeType === 1)
				for (var i = 0; i < range.startOffset; i++)
					startNode.removeChild(startNode.firstChild);
		}

		removeChildren(startNode, true);
		removeChildren(endNode, false);

		var posts = copy.querySelectorAll('div[id^="post"],div[id^="msg"]');
		for (var i = 0; i < posts.length; i++)
			QUOTEONE(posts[i]);
	}


	function QUOTEONE(post) {
		function HTMLtoBB(str) {
			// Order is somewhat relevant
			var ret = str.replace(/<br.*?>/ig, '').
					replace(/<strong><a.*?>.*?<\/a><\/strong> <a.*?href="(.*?)#(?:msg|post)(.*?)".*?>wrote(?: on )?(.*?)<\/a>:?\s*<blockquote class="blockquote">([\s\S]*?)<\/blockquote>/ig, function(html, href, id, dateString, quote) {
						var type = '';
						if (/\/forums\.php/i.test(href)) type = '#';
						if (/\/user\.php/i.test(href)) type = '*';
						if (/\/torrents\.php/i.test(href)) type = '-1';
						if (/\/torrents2\.php/i.test(href)) type = '-2';
						if (type !== '')
							return '[quote=' + type + id + ']' + quote + '[/quote]';
						else
							return html.replace(dateString, formattedUTCString(dateString));
					}).
					replace(/<strong>Added on (.*?):?<\/strong>/ig, function(html,dateString) {
						return html.replace(dateString, formattedUTCString(dateString));
					}).
					replace(/<span class="smiley-.+?" title="(.+?)"><\/span>/ig, function(html, smiley) {
						var smileyNode = document.querySelector('img[alt="' + smiley + '"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/-/g, '_') + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/-/g, '_').toLowerCase() + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/face/g, '~_~') + '.png"]');
						if (smileyNode !== null && smileyNode.parentNode !== null) {
							smileyNode = smileyNode.parentNode.getAttribute('onclick').match(/'(.+?)'/i);
							if (smileyNode !== null)
								return smileyNode[1];
						}
						return ':' + smiley + ':';
					}).
					replace(/<iframe.*?src="([^?"]*).*?".*?><\/iframe>/ig, '[youtube]$1[/youtube]').
					replace(/<([^\s>\/]+)[^>]*>\s*<\/([^>]+)>/ig, function(html, match1, match2) {
						if (match1 === match2)
							return '';
						return html;
					}).
					replace(/<ul><li>(.+?)<\/li><\/ul>/ig, '[*]$1').
					replace(/<a.*?href="torrents\.php\?.*?torrentid=([0-9]*?)".*?>([\s\S]*?)<\/a>/ig, '[torrent=$1]$2[/torrent]').
					replace(/<a.*?href="(.*?)".*?>([\s\S]*?)<\/a>/ig, function(html, match1, match2) {
						if (match1.indexOf('://') === -1 && match1.length > 0 && match1[0] !== '/')
							return '[url=/' + match1 + ']' + match2 + '[/url]'
						else
							return '[url=' + match1 + ']' + match2 + '[/url]'
					}).
					replace(/<strong>([\s\S]*?)<\/strong>/ig, '[b]$1[/b]').
					replace(/<em>([\s\S]*?)<\/em>/ig, '[i]$1[/i]').
					replace(/<u>([\s\S]*?)<\/u>/ig, '[u]$1[/u]').
					replace(/<s>([\s\S]*?)<\/s>/ig, '[s]$1[/s]').
					replace(/<div style="text-align: center;">([\s\S]*?)<\/div>/ig, '[align=center]$1[/align]').
					replace(/<div style="text-align: left;">([\s\S]*?)<\/div>/ig, '[align=left]$1[/align]').
					replace(/<div style="text-align: right;">([\s\S]*?)<\/div>/ig, '[align=right]$1[/align]').
					replace(/<span style="color:\s*(.*?);?">([\s\S]*?)<\/span>/ig, '[color=$1]$2[/color]').
					replace(/<span class="size(.*?)">([\s\S]*?)<\/span>/ig, '[size=$1]$2[/size]').
					replace(/<blockquote class="blockquote">([\s\S]*?)<\/blockquote>/ig, '[quote]$1[/quote]').
					replace(/<div.*?class=".*?spoilerContainer.*?hideContainer.*?".*?><input.*?value="(?:Show\s*|Hide\s*)(.*?)".*?><div.*?class=".*?spoiler.*?".*?>([\s\S]*?)<\/div><\/div>/ig, function(html, button, content) {
						if (button !== '')
							return '[hide=' + button + ']' + content + '[/hide]';
						else
							return '[hide]' + content + '[/hide]';
					}).
					replace(/<div.*?class=".*?spoilerContainer.*?".*?><input.*?><div.*?class=".*?spoiler.*?".*?>([\s\S]*?)<\/div><\/div>/ig, '[spoiler]$1[/spoiler]').
					replace(/<img.*?src="(.*?)".*?>/ig, '[img]$1[/img]').
					replace(/<span class="last-edited">[\s\S]*$/ig, '');
			if (ret !== str) return HTMLtoBB(ret);
			else {
				// Decode HTML
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = ret;
				return tempDiv.textContent.trim();
			}
		}

		var res = HTMLtoBB(post.querySelector('div.post,div.body').innerHTML),
		    author, creation, postid, type = '';
		if (res === '') return;

		postid = post.id.match(/(?:msg|post)(\d+)/i);
		if (postid === null)
			return;

		if (window.location.pathname === '/forums.php') type = '#';
		if (window.location.pathname === '/user.php') type = '*';
		if (window.location.pathname === '/torrents.php') type = '-1';
		if (window.location.pathname === '/torrents2.php') type = '-2';
		if (type !== '')
			res = '[quote=' + type + postid[1] + ']' + res + '[/quote]';
		else {
			author = post.className.match(/user_(\d+)/i);
			if (author !== null)
				author = '[b][user]' + author[1] + '[/user][/b] ';
			else {
				author = document.querySelector('#' + postid[0] + ' a[href^="/user.php?"]');
				if (author !== null) {
					author = author.href.match(/id=(\d+)/i);
					author = (author !== null ? '[b][user]' + author[1] + '[/user][/b] ' : '');
				}
				else
					author = '';
			}

			creation = document.querySelector('div#' + postid[0] + ' > div > div > p.posted_info > span');
			if (creation === null)
				creation = document.querySelector('div#' + postid[0] + ' > div > span > span.usercomment_posttime');
			if (creation !== null)
				creation = ' on ' + formattedUTCString(creation.title.replace(/-/g,'/'));
			else
				creation = '';

			res = author + '[url=' + window.location.pathname + window.location.search + '#' + postid[0] + ']wrote' + creation + '[/url]:\n[quote]' + res + '[/quote]\n\n';
		}

		document.getElementById('quickpost').value += res;

		sel = document.getElementById('quickpost');
		if (sel !== null)
			sel.scrollIntoView();
	}

	document.addEventListener('keydown', function (e) {
		if((e.ctrlKey || e.metaKey) && e.keyCode === 'V'.charCodeAt(0))
			QUOTEALL();
	});
}


// Forums title inverter by Potatoe
// Inverts the forums titles.
if (GM_getValue('delicioustitleflip') === 'true' && document.title.indexOf(' > ') > -1) document.title = document.title.split(" :: ")[0].split(" > ").reverse().join(" < ") + " :: AnimeBytes";


// Hide/Show forum poster info by Megure
// Hide/Show #posts, join date, icons
if (GM_getValue('disgustingposterinfo') !== 'true') {
	var info = document.querySelectorAll('.user_fields.nobullet');
	for (var _i = 0, _len = info.length; _i < _len; _i++)
		info[_i].style.display = 'inherit';
}


// Hide treats by Alpha
// Hide treats on profile.
if (GM_getValue('delicioustreats') === 'true') {
	var treatsnode = document.evaluate('//*[@id="user_leftcol"]/div[@class="box" and div[@class="head" and .="Treats"]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (treatsnode) treatsnode.style.display = "none";
}


// Keyboard shortcuts by Alpha, mod by Megure
// Enables keyboard shortcuts for forum (new post and edit) and PM
if (GM_getValue('deliciouskeyboard') === 'true' && document.querySelector('textarea') !== null) {
	function custom_insert_text(open, close) {
		var elem = document.activeElement;
		if (elem.selectionStart || elem.selectionStart == '0') {
			var startPos = elem.selectionStart;
			var endPos = elem.selectionEnd;
			elem.value = elem.value.substring(0, startPos) + open + elem.value.substring(startPos, endPos) + close + elem.value.substring(endPos, elem.value.length);
			elem.selectionStart = elem.selectionEnd = endPos + open.length + close.length;
			elem.focus();
			if (close.length == 0)
				elem.setSelectionRange(startPos + open.length, startPos + open.length);
			else
				elem.setSelectionRange(startPos + open.length, endPos + open.length);
		} else if (document.selection && document.selection.createRange) {
			elem.focus();
			sel = document.selection.createRange();
			sel.text = open + sel.text + close;
			if (close.length != 0) {
				sel.move("character", -close.length);
				sel.select();
			}
			elem.focus();
		} else {
			elem.value += open;
			elem.focus();
			elem.value += close;
		}
	}
	function ctrl(key, callback, args) {
		document.addEventListener('keydown', function (e) {
			if((e.ctrlKey || e.metaKey) && e.keyCode === key.charCodeAt(0) && document.activeElement.tagName.toLowerCase() === 'textarea') {
				e.preventDefault();
				callback.apply(this, args);
				return false;
			}
		});
	}
	/**
	* All keyboard shortcuts based on MS Word
	**/

	var img, ctrlorcmd = (navigator.appVersion.indexOf('Mac') != -1) ? '⌘' : 'CTRL';
	// Bold
	ctrl('B', custom_insert_text, ['[b]', '[/b]']);
	img = document.querySelector('#bbcode img[title="Bold"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+B)';
	// Italics
	ctrl('I', custom_insert_text, ['[i]', '[/i]']);
	img = document.querySelector('#bbcode img[title="Italics"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+I)';
	// Underline
	ctrl('U', custom_insert_text, ['[u]', '[/u]']);
	img = document.querySelector('#bbcode img[title="Underline"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+U)';
	// Align right
	ctrl('R', custom_insert_text, ['[align=right]', '[/align]']);
	// Align left
	ctrl('L', custom_insert_text, ['[align=left]', '[/align]']);
	// Align center
	ctrl('E', custom_insert_text, ['[align=center]', '[/align]']);
	// Spoiler
	ctrl('S', custom_insert_text, ['[spoiler]', '[/spoiler]']);
	img = document.querySelector('#bbcode img[title="Spoilers"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+S)';
	// Hide
	ctrl('H', custom_insert_text, ['[hide]', '[/hide]']);
	img = document.querySelector('#bbcode img[title="Hide"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+H)';
}


// Title Notifications by Megure
// Will prepend the number of notifications to the title
if(GM_getValue('delicioustitlenotifications') === 'true') {
	var new_count = 0, _i, cnt, notifications = document.querySelectorAll('#alerts .new_count'), _len = notifications.length;
	for(_i = 0; _i < _len; _i++) {
		cnt = parseInt(notifications[_i].textContent, 10);
		if (!isNaN(cnt))
			new_count += cnt;
	}
	if (new_count > 0)
		document.title = '(' + new_count + ') ' + document.title;
}


// Freeleech Pool Status by Megure, inspired by Lemma, Alpha, NSC
// Shows current freeleech pool status in navbar with a pie-chart
// Updates only once every hour or when pool site is visited, showing a pie-chart on pool site
if (GM_getValue('deliciousfreeleechpool', 'true') === 'true') {
	function niceNumber(num) {
		var res = '';
		while (num >= 1000) {
			res = ',' + ('00' + (num % 1000)).slice(-3) + res;
			num = Math.floor(num / 1000);
		}
		return num + res;
	}
	function getFLInfo() {
		function parseFLInfo(elem) {
			var boxes = elem.querySelectorAll('#content .box.pad');
			if (boxes.length < 3) return;

			// The first box holds the current amount, the max amount and the user's individual all-time contribution
			var match = boxes[0].textContent.match(/have ([0-9,]+) \/ ([0-9,]+) yen/i),
					max = parseInt(GM_getValue('FLPoolMax', '50000000'), 10),
					current = parseInt(GM_getValue('FLPoolCurrent', '0'), 10);
			if (match == null) {
				match = boxes[0].textContent.match(/Our donation box is already full/i);
				if (match != null) current = max;
			}
			else {
				current = parseInt(match[1].replace(/,/g, ''), 10);
				max = parseInt(match[2].replace(/,/g, ''), 10);
			}
			if (match != null) {
				GM_setValue('FLPoolCurrent', current);
				GM_setValue('FLPoolMax', max);
			}
			// Check first box for user's individual all-time contribution
			match = boxes[0].textContent.match(/you've donated ([0-9,]+) yen/i);
			if (match != null)
				GM_setValue('FLPoolContribution', parseInt(match[1].replace(/,/g, ''), 10));

			// The third box holds the top 10 donators for the current box
			var box = boxes[2],
					firstP = box.querySelector('p'),
					tr = box.querySelector('table').querySelectorAll('tbody > tr');

			var titles = [], hrefs = [], amounts = [], colors = [], sum = 0;
			for (var i = 0; i < tr.length; i++) {
				var el = tr[i],
						td = el.querySelectorAll('td');

				titles[i] = td[0].textContent;
				hrefs[i] = td[0].querySelector('a').href;
				amounts[i] = parseInt(td[1].textContent.replace(/,/g, ''), 10);
				colors[i] = 'red';
				sum += amounts[i];
			}

			// Also add others and missing to the arrays
			titles[tr.length] = 'Other';
			hrefs[tr.length] = 'https://animebytes.tv/konbini.php?action=pool';
			amounts[tr.length] = current - sum;
			colors[tr.length] = 'lightgrey';
			titles[tr.length + 1] = 'Missing';
			hrefs[tr.length + 1] = 'https://animebytes.tv/konbini.php?action=pool';
			amounts[tr.length + 1] = max - current;
			colors[tr.length + 1] = 'black';

			GM_setValue('FLPoolLastUpdate', Date.now());
			GM_setValue('FLPoolTitles', JSON.stringify(titles));
			GM_setValue('FLPoolHrefs', JSON.stringify(hrefs));
			GM_setValue('FLPoolAmounts', JSON.stringify(amounts));
			GM_setValue('FLPoolColors', JSON.stringify(colors));
		}

		// Either parse document or retrieve freeleech pool site 60*60*1000 ms after last retrieval
		if (/konbini\.php\?action=pool$/i.test(document.URL))
			parseFLInfo(document);
		else if (Date.now() - parseInt(GM_getValue('FLPoolLastUpdate', '0'), 10) > 3600000) {
			var xhr = new XMLHttpRequest(), parser = new DOMParser();
			xhr.open('GET', "https://animebytes.tv/konbini.php?action=pool", true);
			xhr.send();
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					parseFLInfo(parser.parseFromString(xhr.responseText, 'text/html'));
					updatePieChart();
				}
			};
		}
	}

	function getPieChart() {
		function circlePart(diff, title, href, color) {
			if (diff == 0) return '';
			var x = Math.sin(phi), y = Math.cos(phi);
			phi -= 2 * Math.PI * diff / max;
			var v = Math.sin(phi), w = Math.cos(phi);
			var z = 0;
			if (2 * diff > max)
				z = 1; // use long arc
			var perc = (100 * diff / max).toFixed(1) + '%\n' + niceNumber(diff) + ' ¥';
			return '<a xlink:href="' + href + '" xlink:title="' + title + '\n' + perc + '"><path title="' + title + '\n' + perc + '" stroke-width="0.01" stroke="grey" fill="' + color + '" d="M0,0 L' + v + ',' + w + ' A1,1 0 ' + z + ',0 ' + x + ',' + y + 'z">\n' +
				'<animate begin="mouseover" attributeName="d" to="M0,0 L' + 1.1 * v + ',' + 1.1 * w + ' A1.1,1.1 0 ' + z + ',0 ' + 1.1 * x + ',' + 1.1 * y + 'z" dur="0.3s" fill="freeze" />\n' +
				'<animate begin="mouseout"  attributeName="d" to="M0,0 L' + v + ',' + w + ' A1,1 0 ' + z + ',0 ' + x + ',' + y + 'z" dur="0.3s" fill="freeze" />\n' +
				'</path></a>\n\n';
		}

		var str = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-1.11 -1.11 2.22 2.22" height="200px" width="100%">' +
				'<title>Most Donated To This Box Pie-Chart</title>';
		try {
			var phi = Math.PI, max = parseInt(GM_getValue('FLPoolMax', '50000000'), 10),
					titles = JSON.parse(GM_getValue('FLPoolTitles', '[]')),
					hrefs = JSON.parse(GM_getValue('FLPoolHrefs', '[]')),
					amounts = JSON.parse(GM_getValue('FLPoolAmounts', '[]')),
					colors = JSON.parse(GM_getValue('FLPoolColors', '[]'));
			for (var i = 0; i < titles.length; i++) {
				str += circlePart(amounts[i], titles[i], hrefs[i], colors[i]);
			}
		} catch (e) {}
		return str + '</svg>';
	}

	function updatePieChart() {
		var pieChart = getPieChart();
		p.innerHTML = pieChart;
		p3.innerHTML = pieChart;
		if (GM_getValue('delicousnavbarpiechart', 'false') === 'true') {
			li.innerHTML = pieChart;
		}
		p2.innerHTML = 'There currently are ' + niceNumber(parseInt(GM_getValue('FLPoolCurrent', '0'), 10)) + ' / ' + niceNumber(parseInt(GM_getValue('FLPoolMax', '50000000'), 10)) + ' yen in the donation box.<br/>';
		p2.innerHTML += '(That means it is ' + niceNumber(parseInt(GM_getValue('FLPoolMax', '50000000'), 10) - parseInt(GM_getValue('FLPoolCurrent', '0'), 10)) + ' yen away from getting sitewide freeleech!)<br/>';
		p2.innerHTML += 'In total, you\'ve donated ' + niceNumber(parseInt(GM_getValue('FLPoolContribution', '0'), 10)) + ' yen to the freeleech pool.<br/>';
		p2.innerHTML += 'Last Update: ' + Math.round((Date.now() - parseInt(GM_getValue('FLPoolLastUpdate', Date.now()), 10)) / 60000) + ' minutes ago.';
		a.textContent = 'FL: ' + (100 * parseInt(GM_getValue('FLPoolCurrent', '0'), 10) / parseInt(GM_getValue('FLPoolMax', '50000000'), 10)).toFixed(1) + '%';
		nav.replaceChild(a, nav.firstChild);
	}
	
	var pos = GM_getValue('deliciousflpoolposition');

	if (pos !== 'none' || /user\.php\?id=/i.test(document.URL) || /konbini\.php\?action=pool/i.test(document.URL)) {
		getFLInfo();
		var p = document.createElement('p'),
				p2 = document.createElement('center'),
				p3 = document.createElement('p'),
				nav = document.createElement('li'),
				a = document.createElement('a'),
				ul = document.createElement('ul'),
				li = document.createElement('li');
		a.href = '/konbini.php?action=pool';
		nav.appendChild(a);
		if (GM_getValue('delicousnavbarpiechart', 'false') === 'true') {
			nav.innerHTML += '<span class="dropit hover clickmenu"><span class="stext">▼</span></span>';
			ul.appendChild(li);
			ul.className = 'subnav nobullet';
			nav.appendChild(ul);
			nav.className = 'navmenu';
		}
		if (pos !== 'none') {
			pos = pos.split(' ');
			var parent = document.querySelector(pos[1]);
			if (pos[0] === 'after')
				parent.appendChild(nav);
			if (pos[0] === 'before')
				parent.insertBefore(nav, parent.firstChild);
		}

		updatePieChart();
		
		if (/user\.php\?id=/i.test(document.URL)) {
			// Only do so on the user's own profile page
			var tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /Yen per day/i.test(node.data); } });
			if (tw.nextNode() != null) {
				var cNode = document.querySelector('.userstatsleft > .userprofile_list');
				var hr = document.createElement('hr');
				hr.style.clear = 'both';
				cNode.appendChild(hr);
				cNode.appendChild(p2);
				cNode.appendChild(p3);
			}
		}

		if (/konbini\.php\?action=pool/i.test(document.URL)) {
			var tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /^\s*Most Donated to This Box\s*$/i.test(node.data); } });
			if (tw.nextNode() !== null) {
				tw.currentNode.parentNode.insertBefore(p, tw.currentNode.nextSibling);
			}
		}
	}
}


// Yen per X, by Megure, Lemma, NSC, et al.
if(GM_getValue('deliciousyenperx', 'true') === 'true' && /user\.php\?id=/i.test(document.URL)) {
	function compoundInterest(years) {
		return (Math.pow(2, years) - 1) / Math.log(2);
	}
	function formatInteger(num) {
		var res = '';
		while (num >= 1000) {
			res = ',' + ('00' + (num % 1000)).slice(-3) + res;
			num = Math.floor(num / 1000);
		}
		return num + res;
	}
	function bytecount(num, unit) {
		switch (unit) {
			case 'B':
				return num * Math.pow(1024, 0);
			case 'KB':
				return num * Math.pow(1024, 1);
			case 'MB':
				return num * Math.pow(1024, 2);
			case 'GB':
				return num * Math.pow(1024, 3);
			case 'TB':
				return num * Math.pow(1024, 4);
			case 'PB':
				return num * Math.pow(1024, 5);
			case 'EB':
				return num * Math.pow(1024, 6);
		}
	}
	function humancount(num) {
		if (num == 0) return '0 B';
		var i = Math.floor(Math.log(Math.abs(num)) / Math.log(1024));
		num = (num / Math.pow(1024, i)).toFixed(2);
		switch (i) {
			case 0:
				return num + ' B';
			case 1:
				return num + ' KB';
			case 2:
				return num + ' MB';
			case 3:
				return num + ' GB';
			case 4:
				return num + ' TB';
			case 5:
				return num + ' PB';
			case 6:
				return num + ' EB';
			default:
				return num + ' * 1024^' + i + ' B';
		}
	}
	function addDefinitionAfter(after, definition, value, cclass) {
		dt = document.createElement('dt');
		dt.appendChild(document.createTextNode(definition));
		dd = document.createElement('dd');
		if (cclass !== undefined) dd.className += cclass;
		dd.appendChild(document.createTextNode(value));
		after.parentNode.insertBefore(dd, after.nextElementSibling.nextSibling);
		after.parentNode.insertBefore(dt, after.nextElementSibling.nextSibling);
		return dt;
	}
	function addDefinitionBefore(before, definition, value, cclass) {
		dt = document.createElement('dt');
		dt.appendChild(document.createTextNode(definition));
		dd = document.createElement('dd');
		if (cclass !== undefined) dd.className += cclass;
		dd.appendChild(document.createTextNode(value));
		before.parentNode.insertBefore(dt, before);
		before.parentNode.insertBefore(dd, before);
		return dt;
	}
	function addRawStats() {
		var tw, regExp;
		// Find comments with stats
		regExp = /Uploaded:\s*(([\d,.]+)\s*([A-Z]+)\s*\(([^)]*)\)).*\s*.*Downloaded:\s*(([\d,.]+)\s*([A-Z]+)\s*\(([^)]*)\))/i;
		tw = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT, { acceptNode: function(node) { return regExp.test(node.textContent); } });
		if (tw.nextNode() == null) return;
		var match = tw.currentNode.textContent.match(regExp);
		tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /^\s*Ratio/i.test(node.data); } });
		if (tw.nextNode() == null) return;
		var ratioNode = tw.currentNode.parentNode;
		tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /^\s*Uploaded/i.test(node.data); } });
		if (tw.nextNode() == null) return;
		var ulNode = tw.currentNode.parentNode;
		tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /^\s*Downloaded/i.test(node.data); } });
		if (tw.nextNode() == null) return;
		var dlNode = tw.currentNode.parentNode;
		regExp = /([\d,.]+)\s*([A-Z]+)\s*\(([^)]*)\)/i;
		var ul = ulNode.nextElementSibling.textContent.match(regExp);
		var dl = dlNode.nextElementSibling.textContent.match(regExp);
		var buff = humancount(bytecount(parseFloat(ul[1].replace(/,/g, '')), ul[2].toUpperCase()) - bytecount(parseFloat(dl[1].replace(/,/g, '')), dl[2].toUpperCase()));
		var realBuff = humancount(bytecount(parseFloat(match[2].replace(/,/g, '')), match[3].toUpperCase()) - bytecount(parseFloat(match[6].replace(/,/g, '')), match[7].toUpperCase()));
		var rawRatio = (bytecount(parseFloat(match[2].replace(/,/g, '')), match[3].toUpperCase()) / bytecount(parseFloat(match[6].replace(/,/g, '')), match[7].toUpperCase())).toFixed(2);

		// Color ratio
		var color = 'r99';
		if (rawRatio < 1)
			color = 'r' + ('0' + Math.ceil(10 * rawRatio)).slice(-2);
		else if (rawRatio < 5)
			color = 'r20';
		else if (rawRatio < 99)
			color = 'r50';

		// Add to user stats after ratio
		var hr = document.createElement('hr');
		hr.style.clear = 'both';
		ratioNode.parentNode.insertBefore(hr, ratioNode.nextElementSibling.nextSibling);
		var rawRatioNode = addDefinitionAfter(ratioNode, 'Raw Ratio:', rawRatio, color);
		addDefinitionAfter(ratioNode, 'Raw Downloaded:', match[5]);
		addDefinitionAfter(ratioNode, 'Raw Uploaded:', match[1]);
		ratioNode.nextElementSibling.title = 'Buffer: ' + buff;
		rawRatioNode.nextElementSibling.title = 'Raw Buffer: ' + realBuff;
	}
	function addYenPerStats() {
		var dpy = 365.256363; // days per year
		var tw = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT, { acceptNode: function(node) { return /Yen per day/i.test(node.data); } });
		if (tw.nextNode() == null) return;
		var ypdNode = tw.currentNode.parentNode;
		var ypy = parseInt(ypdNode.nextElementSibling.textContent, 10) * dpy; // Yen per year
		addDefinitionAfter(ypdNode, 'Yen per year:', formatInteger(Math.round(ypy * compoundInterest(1))));
		addDefinitionAfter(ypdNode, 'Yen per month:', formatInteger(Math.round(ypy * compoundInterest(1 / 12))));
		addDefinitionAfter(ypdNode, 'Yen per week:', formatInteger(Math.round(ypy * compoundInterest(7 / dpy))));
		// 1 Yen = 1 MB = 1024^2 B * yen per year * interest for 1 s
		var hr = document.createElement('hr');
		hr.style.clear = 'both';
		ypdNode.parentNode.insertBefore(hr, ypdNode);
		addDefinitionBefore(ypdNode, 'Yen as upload:', humancount(Math.pow(1024, 2) * ypy * compoundInterest(1 / dpy / 24 / 60 / 60)) + '/s');
		addDefinitionBefore(ypdNode, 'Yen per hour:', (ypy * compoundInterest(1 / dpy / 24)).toFixed(1));
	}
	addRawStats();
	addYenPerStats();
}


// Two more scripts by Megure; the headers are still included
// Search for UserScript or visit https://github.com/tubersan/AnimeBytes-Userscripts/ for details
if((/^http.*:\/\/animebytes\.tv/i.test(document.URL))){
// ==UserScript==
// @name        Enhanced Torrent View
// @namespace   Megure@AnimeBytes.tv
// @description Shows how much yen you would receive if you seeded torrents; shows required seeding time
// @include     http*://animebytes.tv*
// @version     0.83
// @grant       GM_getValue
// @grant       GM_setValue
// @icon        http://animebytes.tv/favicon.ico
// ==/UserScript==

(function() {
    var showYen = GM_getValue('ABTorrentsShowYen', 'true'), // true / false: activate / deactivate display of yen production per hour
        reqTime = GM_getValue('ABTorrentsReqTime', 'true'), // true / false: activate / deactivate display of required seeding time
        timeFrame = parseInt(GM_getValue('ABTorrentsYenTimeFrame', '1'), 10),
        fa = 1;

    function unitPrefix (prefix) {
        switch (prefix.toUpperCase()) {
            case '':  return 1 / 1073741824;
            case 'K': return 1 / 1048576;
            case 'M': return 1 / 1024;
            case 'G': return 1;
            case 'T': return 1024;
            case 'P': return 1048576;
            case 'E': return 1073741824;
            default:  return 0;
        }
    }

    function countCols (row) {
        var cells = row.cells, cols = 0, _i = 0, _len = cells.length;
        for (; _i < _len; _i++) {
            cols += cells[_i].colSpan;
        }
        return cols;
    }

    function dur2string (duration) {
        var durationString = '',
            tempH = Math.floor(duration),
            tempM = Math.ceil((duration * 60) % 60);
        if (tempM === 60) {
            tempH += 1;
            tempM = 0;
        }
        durationString += tempH + ' hours';
        if (tempM > 0)
            durationString += ' and ' + tempM + ' minutes';
        durationString += ' (~' + (Math.round(10 * duration / 24) / 10) + ' days)';
        return durationString;
    }

    function yen2string (yen) {
        if (timeFrame >= 100) return Math.round(yen);
        else if (timeFrame >= 10) return yen.toFixed(1);
        else return yen.toFixed(2);
    }

    function fu (myDuration) {
        return Math.pow(2, myDuration / (24 * 365.25));
    }

    function fs (mySize) {
        return Math.max(0.1, Math.sqrt(mySize)) / 4;
    }

    function ft (mySeeders) {
        return Math.min(1.0, 3 / Math.sqrt(mySeeders + 4));
    }

    function f (mySize, mySeeders, myDuration) {
        return fs(mySize) * fu(myDuration) * ft(mySeeders) * fa * timeFrame;
    }

    function createTitle (start, end, mySize, myDuration) {
        start = Math.max(start, 5);
        end   = Math.min(start + 4, Math.max(end, 5));
        var res = '';
        for (var j = start; j <= end; j++) {
            res += '¥' + f(mySize, j, myDuration).toPrecision(6) + '\t';
            if (j === 5)
                res += '≤';
            res += j + '\n';
        }
        return res;
    }

    if (showYen.toString() === 'true' || reqTime.toString() === 'true') {
        var torrents, cells, seeders, leechers, size, sizeIndex, sizeRe, andRe, durationRe, torrentId, newCell, header, newHeader, lastHeaderCell, sum = 0, seedingTime, duration, durMatch;

        function processTorrentTable(torrent_table, deselected, oldBox) {
            var torrents = torrent_table.querySelectorAll('.group_torrent');
            if (torrents.length <= 1) return;
            var values = [];
            for (var i = 0; i < torrents.length; i++) {
                var torrent = torrents[i];
                var text = torrent.children[0].children[1].textContent.replace(/^»\s*/i, '');
                if (text.indexOf('|') >= 0)
                    text = text.split('|');
                else
                    text = text.split('/');
                for (var j = 0; j < text.length; j++) {
                    var val = text[j].trim();
                    if (val !== '') {
                        if (values[j] === undefined)
                            values[j] = {};
                        if (values[j][val] === undefined)
                            values[j][val] = 0;
                        if (torrent.style.visibility !== 'collapse')
                            values[j][val] = 1;
                    }
                }
            }
            if (values.length > 0 || Object.keys(deselected).length > 0) {
                var box = document.createElement('div'), head = document.createElement('div'), body = document.createElement('div'), form = document.createElement('form'), myValues = {};
                for (j = 0; j < values.length; j++) {
                    for (var value in values[j]) {
                        if (myValues[value] === 1) continue;
                        else myValues[value] = 1;
                        if (values[j][value] === 1 || deselected[value] === 1) {
                            var label = document.createElement('label');
                            label.innerHTML += ' <input type="checkbox" ' + (deselected[value] === 1 ? '' : 'checked="checked"') + '> ' + value + ' ';
                            label.querySelector('input').value = value;
                            form.appendChild(label);
                        }
                    }
                    if (j < values.length - 1)
                        form.innerHTML += ' <br/> ';
                }
                form.addEventListener('change', function(e) {
                    var illegal = {};
                    var cbs = form.querySelectorAll('input[type="checkbox"]');
                    for (var j = 0; j < cbs.length; j++) {
                        var cb = cbs[j];
                        if (cb.checked != true)
                            illegal[cb.value] = 1;
                    }
                    for (var j = 0; j < torrents.length; j++) {
                        var torrent = torrents[j];
                        var text = torrent.children[0].children[1].textContent;
                        var ill = false;
                        for (var subText in illegal) {
                            if (text.indexOf(subText) >= 0) {
                                ill = true
                                break;
                            }
                        }
                        if (ill == true)
                            torrent.style.visibility = 'collapse';
                        else
                            torrent.style.visibility = 'visible';
                    }
                    processTorrentTable(torrent_table, illegal, box);
                });
                box.className = 'box';
                head.className = 'head colhead strong';
                body.className = 'body pad';
                body.style.display = 'none';
                body.appendChild(form);
                head.innerHTML = '<a href="#"><span class="triangle-right-md"><span class="stext">+/-</span></span> Filter </a>';
                var headClickEvent = function(e) {
                    if (e !== undefined) e.preventDefault();
                    if(body.style.display !== 'none') {
                        body.style.display = 'none';
                        head.querySelector('span').className = 'triangle-right-md';
                    } else {
                        body.style.display = 'block';
                        head.querySelector('span').className = 'triangle-down-md';
                    }
                }
                head.addEventListener('click', headClickEvent );
                box.appendChild(head);
                box.appendChild(body);
                if (oldBox !== null) {
                    torrent_table.parentNode.replaceChild(box, oldBox);
                    headClickEvent();
                }
                else
                    torrent_table.parentNode.insertBefore(box, torrent_table);
            }
        }

        if (GM_getValue('ABTorrentsFilter', 'false') === 'true' && document.getElementById('collage') == null) {
            var torrent_tables = document.querySelectorAll('.torrent_table');
            for (var i = 0; i < torrent_tables.length; i++) {
                var torrent_table = torrent_tables[i];
                processTorrentTable(torrent_table, {}, null);
            }
        }
        
        torrents = document.querySelectorAll('tr.torrent,tr.group_torrent');
        sizeRe = /^([\d\.,]+)\s([A-Z]?)B$/i;
        andRe = /(and|\s|,)/ig;
        durationRe = /^(?:(\d+)years?)?(?:(\d+)months?)?(?:(\d+)weeks?)?(?:(\d+)days?)?(?:(\d+)hours?)?(?:(\d+)minutes?)?(?:(\d+)seconds?)?$/i;
        
        fa = 2 - 1 / (1 + Math.exp(5 - ((new Date()).getTime() - parseInt(GM_getValue('creation', '0'), 10)) / 1728000000)); // milliseconds per 20 days
        if (isNaN(fa))
            fa = 1;

        for (var i = 0; i < torrents.length; i++) {
            cells = torrents[i].cells;
            size = null;
            if (cells.length === 5) {
                seeders = parseInt(cells[3].textContent, 10);
                leechers = parseInt(cells[4].textContent, 10);
                size = cells[1].textContent.match(sizeRe);
                sizeIndex = 1;
            }
            else if (cells.length === 9) {
                seeders = parseInt(cells[6].textContent, 10);
                leechers = parseInt(cells[7].textContent, 10);
                size = cells[4].textContent.match(sizeRe);
                sizeIndex = 4
            }
            if (size === null || isNaN(seeders) || isNaN(leechers))
                continue;

            if (reqTime.toString() === 'true') {
                size = parseFloat(size[1].replace(/,/g, '')) * unitPrefix(size[2]);
                seedingTime = Math.max(0, size - 10) * 5 + 72;
                cells[sizeIndex].title = 'You need to seed this torrent for at least\n' + dur2string(seedingTime) + '\nor it will become a hit and run!';

                torrentId = torrents[i].querySelector('a[title="Download"]');
                if (torrentId != null) {
                    torrentId = torrentId.href.match(/id=(\d+)/i);
                    if (torrentId != null) {
                        torrentId = document.getElementById('torrent_' + torrentId[1]);
                        if (torrentId != null) {
                            torrentId = torrentId.querySelector('blockquote');
                            if (torrentId != null) {
                                torrentId.appendChild(document.createElement('br'));
                                torrentId.innerHTML += 'You need to seed this torrent for at least <span class="r01">' + dur2string(seedingTime) + '</span> or it will become a hit and run!';
                            }
                        }
                    }
                }
            }

            if (showYen.toString() === 'true') {
                duration = 0;
                if (document.URL.indexOf('type=seeding') >= 0) {
                    durMatch = cells[3].textContent.replace(andRe, '').match(durationRe);
                    if (durMatch != null) {
                        durMatch = (function() {
                            var _i, _len, _results, _num;
                            _results = [];
                            for (_i = 1, _len = durMatch.length; _i < _len; _i++) {
                                _num = durMatch[_i];
                                if (_num != null) {
                                    if (isNaN(parseInt(_num, 10)))
                                        _results.push(0);
                                    else
                                        _results.push(parseInt(_num, 10));
                                } else {
                                    _results.push(0);
                                }
                            }
                            return _results;
                        })();
                        duration = 24 * (durMatch[0] * 365.25 + durMatch[1] * 30.4375 + durMatch[2] * 7 + durMatch[3]) + durMatch[4] + durMatch[5] / 60 + durMatch[6] / 3600;
                    }
                }
                sum += f(size, seeders, duration);

                newCell = document.createElement('td');
                newCell.textContent = '¥' + yen2string(f(size, seeders, duration));
                newCell.title = '¥' + (timeFrame * fs(size)).toPrecision(6)                      + '  \tbase for size';
                if ((100 * (fa           - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n+' + (100 * (fa           - 1)).toFixed(1) + '% \tfor your account\'s age';
                if ((100 * (fu(duration) - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n+' + (100 * (fu(duration) - 1)).toFixed(1) + '% \tfor seeding time';
                if ((100 * (ft(seeders)  - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n'  + (100 * (ft(seeders)  - 1)).toFixed(1) + '% \tfor number of seeders';
                newCell.title += '\n\n¥ per hour \t#seeders\n' + createTitle(seeders - 1, seeders + leechers + 1, size, duration);
                torrents[i].appendChild(newCell);
                header = torrents[i].parentNode.firstChild;
                if (countCols(header) + 1 === countCols(torrents[i])) {
                    var timeFrameStr = "hour";
                    if (timeFrame == 24) timeFrameStr = "day";
                    if (timeFrame == 168) timeFrameStr = "week";
                    newHeader = header.children[1].cloneNode(true);
                    newHeader.title = '¥ per ' + timeFrameStr;
                    if (newHeader.textContent !== '') {
                        if (newHeader.children.length > 0)
                            newHeader.children[0].textContent = '¥/' + timeFrameStr.charAt(0);
                        else
                            newHeader.textContent = '¥/' + timeFrameStr.charAt(0);
                    }
                    header.appendChild(newHeader);
                }
            }
        }

        if (showYen.toString() === 'true') {
            console.log("Sum of Yen per hour for all torrents on this site:", sum);

            torrents = document.querySelectorAll('tr.edition_info,tr.pad,tr[id^="group_"]');
            for (var i = 0; i < torrents.length; i++) {
                lastHeaderCell = torrents[i].cells[torrents[i].cells.length - 1];
                lastHeaderCell.colSpan += 1;
            }
        }

        if (document.URL.indexOf('user.php') >= 0 && document.URL.indexOf('preview=true') >= 0) {
            var _temp = null;
            try {
                _temp = document.getElementById('first_wrapper_outer').getElementsByClassName('userstatsleft')[0].getElementsByTagName('span')[0].title;
            } catch (e) {}
            if (_temp != null)
                GM_setValue('creation', Date.parse(_temp));
        }
    }

}).call(this);

}

if((/^http.*:\/\/animebytes\.tv\/forums\.php/i.test(document.URL)) && !/action=viewthread/i.test(document.URL)){
// Generated by CoffeeScript 1.9.1

/*
// ==UserScript==
// @name        AnimeBytes - Forum Search - Enhancement
// @namespace   Megure@AnimeBytes.tv
// @description Load posts into search results; highlight search terms; filter authors; slide through posts
// @include     http*://animebytes.tv/forums.php*
// @exclude     *action=viewthread*
// @version     0.72
// @grant       GM_getValue
// @icon        http://animebytes.tv/favicon.ico
// ==/UserScript==
 */

(function() {
  var a, allResults, background_color, button, cb, filterPost, forumIds, forumid, getFirstTagParent, hideSubSelection, i, index, input, len, linkbox1, loadPost, loadText, loadThreadPage, loadingText, myCell, myLINK, newCheckbox, newLinkBox, patt, processThreadPage, quickLink, quickLinkSubs, result, sR, searchForums, searchForumsCB, searchForumsNew, showFastSearchLinks, showPost, strong, tP, textReplace, text_color, toggleText, toggleVisibility, user_filter, user_td, user_tr, workInForumSearch, workInRestOfForum;

  background_color = GM_getValue('ABForumSearchHighlightBG', '#FFC000');

  text_color = GM_getValue('ABForumSearchHighlightFG', '#000000');

  toggleText = GM_getValue('ABForumToggleText', '(Toggle)');

  loadText = GM_getValue('ABForumLoadText', '(Load)');

  loadingText = GM_getValue('ABForumLoadingText', '(Loading)');

  hideSubSelection = GM_getValue('ABForumSearchHideSubfor', 'true') === 'true';

  workInForumSearch = GM_getValue('ABForumSearchWorkInFS', 'true') === 'true' && document.URL.indexOf('action=search') >= 0;

  workInRestOfForum = GM_getValue('ABForumEnhWorkInRest', 'false') === 'true' && (document.URL.indexOf('action=viewforum') >= 0 || document.URL.indexOf('?') === -1);

  showFastSearchLinks = GM_getValue('ABForumEnhFastSearch', 'true') === 'true' && document.URL.indexOf('action=viewforum') >= 0;

  user_filter = [];

  sR = [];

  tP = [];

  cb = [];

  getFirstTagParent = function(elem, tag) {
    while (elem !== null && elem.tagName !== 'BODY' && elem.tagName !== tag) {
      elem = elem.parentNode;
    }
    if (elem === null || elem.tagName !== tag) {
      return null;
    } else {
      return elem;
    }
  };

  textReplace = function(elem) {
    var node, regExp, walk;
    if (patt !== '' && (background_color !== 'none' || text_color !== 'none')) {
      walk = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, null, false);
      node = walk.nextNode();
      regExp = new RegExp('(' + patt + ')', 'i');
      while (node != null) {
        node.textContent.replace(regExp, function(term) {
          var args, newSpan, newTextNode, offset;
          args = [].slice.call(arguments);
          offset = args[args.length - 2];
          newTextNode = node.splitText(offset);
          newTextNode.textContent = newTextNode.textContent.substr(term.length);
          newSpan = document.createElement('span');
          if (background_color !== 'none') {
            newSpan.style.backgroundColor = background_color;
          }
          if (text_color !== 'none') {
            newSpan.style.color = text_color;
          }
          newSpan.appendChild(document.createTextNode(term));
          node.parentNode.insertBefore(newSpan, newTextNode);
          return node = walk.nextNode();
        });
        node = walk.nextNode();
      }
    }
  };

  processThreadPage = function(id, threadid, page, parent, link) {
    return function() {
      var _i, cell, i, j, len, len1, linkbox, myColsp, nextPost, pagenums, post, prevPost, ref, ref1, td, threadPage, tr, user_id;
      threadPage = "threadid=" + threadid + "&page=" + page;
      link.textContent = toggleText;
      sR[id] = [];
      sR[id].parent = parent;
      sR[id].index = 0;
      sR[id].page = page;
      sR[id].threadid = threadid;
      ref = tP[threadPage];
      for (_i = i = 0, len = ref.length; i < len; _i = ++i) {
        post = ref[_i];
        if (post.id === id) {
          sR[id].index = _i;
        }
      }
      user_id = tP[threadPage][sR[id].index].className.split('_');
      user_id = user_id[user_id.length - 1];
      sR[id].user = tP[threadPage][sR[id].index].querySelector('a[href="/user.php?id=' + user_id + '"]').textContent;
      linkbox = document.createElement('div');
      pagenums = document.createElement('div');
      linkbox.className = 'linkbox';
      pagenums.className = 'pagenums';
      prevPost = document.createElement('a');
      nextPost = document.createElement('a');
      prevPost.href = '#';
      nextPost.href = '#';
      prevPost.className = 'page-link';
      nextPost.className = 'page-link';
      prevPost.textContent = '← Prev';
      nextPost.textContent = 'Next →';
      pagenums.appendChild(prevPost);
      pagenums.appendChild(nextPost);
      linkbox.appendChild(pagenums);
      prevPost.addEventListener('click', showPost(id, true), true);
      nextPost.addEventListener('click', showPost(id, false), true);
      tr = document.createElement('tr');
      td = document.createElement('td');
      myColsp = 0;
      ref1 = parent.cells;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        cell = ref1[j];
        myColsp += cell.colSpan;
      }
      td.colSpan = myColsp;
      td.appendChild(linkbox);
      td.appendChild(tP[threadPage][sR[id].index]);
      tr.appendChild(td);
      sR[id].td = td;
      sR[id].parent.parentNode.insertBefore(tr, sR[id].parent.nextSibling);
    };
  };

  loadThreadPage = function(threadid, page) {
    var threadPage, xhr;
    threadPage = "threadid=" + threadid + "&page=" + page;
    tP[threadPage] = 'Loading';
    cb[threadPage] = [];
    xhr = new XMLHttpRequest();
    xhr.open('GET', "https://animebytes.tv/forums.php?action=viewthread&" + threadPage, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      var callback, i, j, len, len1, parser, post, ref, ref1;
      if (xhr.readyState === 4) {
        parser = new DOMParser();
        tP[threadPage] = (parser.parseFromString(xhr.responseText, 'text/html')).querySelectorAll('div[id^="post"]');
        ref = tP[threadPage];
        for (i = 0, len = ref.length; i < len; i++) {
          post = ref[i];
          textReplace(post);
        }
        ref1 = cb[threadPage];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          callback = ref1[j];
          callback();
        }
        return delete cb[threadPage];
      }
    };
  };

  loadPost = function(link, index, filtered) {
    return function(event) {
      var cell, id, match, newLink, node, page, threadPage, threadid;
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      newLink = link.previousSibling;
      cell = link.parentNode;
      node = getFirstTagParent(link, 'TR');
      threadid = link.href.match(/threadid=(\d+)/i);
      threadid = threadid != null ? threadid[1] : '0';
      match = link.href.match(/([^#]*)(?:#post(\d+))?/i);
      if (match != null) {
        id = match[2] != null ? 'post' + match[2] : id = index + link.href;
      } else {
        return;
      }
      if (id in sR) {
        if (filtered === true) {
          filterPost(id)();
        } else {
          toggleVisibility(id);
        }
      } else {
        page = link.href.match(/page=(\d+)/i);
        page = page != null ? parseInt(page[1], 10) : 1;
        link.previousSibling.textContent = loadingText;
        threadPage = "threadid=" + threadid + "&page=" + page;
        if (threadPage in tP) {
          if (tP[threadPage] === 'Loading') {
            cb[threadPage].push(processThreadPage(id, threadid, page, node, newLink));
            if (filtered === true) {
              cb[threadPage].push(filterPost(id));
            }
          } else {
            processThreadPage(id, threadid, page, node, newLink)();
            if (filtered === true) {
              filterPost(id)();
            }
          }
        } else {
          loadThreadPage(threadid, page);
          cb[threadPage].push(processThreadPage(id, threadid, page, node, newLink));
          if (filtered === true) {
            cb[threadPage].push(filterPost(id));
          }
        }
      }
    };
  };

  toggleVisibility = function(id) {
    var elem;
    elem = sR[id];
    if (elem.td.parentNode.style.visibility === 'collapse') {
      showPost(id, null)();
      return elem.td.parentNode.style.visibility = 'visible';
    } else {
      return elem.td.parentNode.style.visibility = 'collapse';
    }
  };

  showPost = function(id, prev) {
    return function(event) {
      var elem, nextTP, prevTP, threadPage;
      elem = sR[id];
      threadPage = "threadid=" + elem.threadid + "&page=" + elem.page;
      nextTP = "threadid=" + elem.threadid + "&page=" + (elem.page + 1);
      prevTP = "threadid=" + elem.threadid + "&page=" + (elem.page - 1);
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (prev === true) {
        if (elem.index === 0 && elem.page > 1) {
          if (prevTP in tP) {
            if (tP[prevTP] === 'Loading') {
              cb[prevTP].push(showPost(id, prev));
            } else {
              elem.page = elem.page - 1;
              elem.index = tP[prevTP].length - 1;
              elem.td.replaceChild(tP[prevTP][elem.index], elem.td.lastChild);
            }
          } else {
            loadThreadPage(elem.threadid, elem.page - 1);
            cb[prevTP].push(showPost(id, prev));
          }
        } else {
          elem.index = Math.max(elem.index - 1, 0);
          if (elem.td.children.length === 2) {
            elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
          } else {
            elem.td.appendChild(tP[threadPage][elem.index]);
          }
        }
      } else if (prev === false) {
        if (elem.index === 24) {
          if (nextTP in tP) {
            if (tP[nextTP] === 'Loading') {
              cb[prevTP].push(showPost(id, prev));
            } else {
              if (tP[nextTP].length > 0) {
                elem.page = elem.page + 1;
                elem.index = 0;
                elem.td.replaceChild(tP[nextTP][0], elem.td.lastChild);
              }
            }
          } else {
            loadThreadPage(elem.threadid, elem.page + 1);
            cb[nextTP].push(showPost(id, prev));
          }
        } else {
          elem.index = Math.min(elem.index + 1, tP[threadPage].length - 1);
          if (elem.td.children.length === 2) {
            elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
          } else {
            elem.td.appendChild(tP[threadPage][elem.index]);
          }
        }
      } else {
        if (elem.td.children.length === 2) {
          elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
        } else {
          elem.td.appendChild(tP[threadPage][elem.index]);
        }
      }
    };
  };

  filterPost = function(id) {
    return function() {
      var elem, i, len, toFilter, user_name;
      elem = sR[id];
      toFilter = true;
      for (i = 0, len = user_filter.length; i < len; i++) {
        user_name = user_filter[i];
        if (elem.user.toUpperCase() === user_name.toUpperCase()) {
          toFilter = false;
          break;
        }
      }
      if (toFilter) {
        elem.td.parentNode.style.visibility = 'collapse';
        elem.parent.style.visibility = 'collapse';
      }
    };
  };

  if (workInRestOfForum || workInForumSearch) {
    patt = document.querySelector('form[action=""] input[name="search"]');
    if (patt != null) {
      patt = patt.value.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/\s+/g, '|');
    } else {
      patt = '';
    }
    allResults = document.querySelectorAll('a[href^="/forums.php?action=viewthread"]');
    for (index = i = 0, len = allResults.length; i < len; index = ++i) {
      result = allResults[index];
      textReplace(result);
      a = document.createElement('a');
      a.href = '#';
      a.textContent = loadText;
      a.addEventListener('click', loadPost(result, index, false), true);
      myCell = result.parentNode;
      myCell.insertBefore(a, result);
    }
  }

  if (workInForumSearch) {
    user_tr = document.createElement('tr');
    user_td = [];
    user_td.push(document.createElement('td'));
    user_td.push(document.createElement('td'));
    user_td[0].className = 'label';
    strong = document.createElement('strong');
    strong.textContent = 'Filter author(s):';
    user_td[0].appendChild(strong);
    input = document.createElement('input');
    input.placeholder = 'Comma- or space-separated list of authors';
    input.size = '64';
    button = document.createElement('button');
    button.textContent = 'Filter';
    button.type = 'button';
    user_td[1].appendChild(input);
    user_td[1].appendChild(button);
    user_tr.appendChild(user_td[0]);
    user_tr.appendChild(user_td[1]);
    searchForums = document.querySelector('select[name="forums[]"]').parentNode.parentNode;
    searchForums.parentNode.insertBefore(user_tr, searchForums);
    button.addEventListener('click', function(event) {
      var j, len1, results, userName;
      if (input.value.replace(/[,\s]/g, '') !== '') {
        user_filter = (function() {
          var j, len1, ref, results;
          ref = input.value.trim().replace(/[,\s]+/g, ',').split(',');
          results = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            userName = ref[j];
            results.push(userName.trim());
          }
          return results;
        })();
        button.disabled = 'disabled';
        results = [];
        for (index = j = 0, len1 = allResults.length; j < len1; index = ++j) {
          result = allResults[index];
          results.push(loadPost(result, index, true)());
        }
        return results;
      }
    }, true);
    if (hideSubSelection) {
      searchForumsNew = searchForums.cloneNode(true);
      searchForums.style.visibility = 'collapse';
      searchForumsCB = searchForumsNew.cells[1];
      while (searchForumsCB.hasChildNodes()) {
        searchForumsCB.removeChild(searchForumsCB.lastChild);
      }
      newCheckbox = document.createElement('input');
      newCheckbox.type = 'checkbox';
      searchForumsCB.appendChild(newCheckbox);
      searchForumsCB.appendChild(document.createTextNode(' Show forum selection: select (sub-) forums to search in.'));
      searchForums.parentNode.insertBefore(searchForumsNew, searchForums);
      newCheckbox.addEventListener('change', function(event) {
        searchForums.style.visibility = 'visible';
        return searchForumsNew.style.visibility = 'collapse';
      }, true);
    }
  }

  if (showFastSearchLinks) {
    forumid = document.URL.match(/forumid=(\d+)/i);
    if (forumid != null) {
      forumid = parseInt(forumid[1], 10);
      quickLink = document.createElement('a');
      quickLink.textContent = ' [Search this forum] ';
      quickLink.href = "/forums.php?action=search&forums[]=" + forumid;
      linkbox1 = document.querySelector('div.linkbox');
      newLinkBox = linkbox1.cloneNode(true);
      while (newLinkBox.hasChildNodes()) {
        newLinkBox.removeChild(newLinkBox.lastChild);
      }
      linkbox1.parentNode.insertBefore(newLinkBox, linkbox1);
      newLinkBox.appendChild(quickLink);
      forumIds = document.querySelectorAll('table a[href^="/forums.php?action=viewforum&forumid="]');
      forumIds = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = forumIds.length; j < len1; j++) {
          myLINK = forumIds[j];
          results.push(parseInt((myLINK.href.match(/forumid=(\d*)/i))[1], 10));
        }
        return results;
      })();
      if (forumIds.length > 0) {
        forumIds.push(forumid);
        quickLinkSubs = document.createElement('a');
        quickLinkSubs.textContent = ' [Search this forum and all direct subforums] ';
        quickLinkSubs.href = "/forums.php?action=search&forums[]=" + forumIds.join('&forums[]=');
        newLinkBox.appendChild(quickLinkSubs);
      }
    }
  }

}).call(this);

}
// Add settings
if(/\/user\.php\?.*action=edit/i.test(document.URL)){
    (function(){
    function addBooleanSetting(key, name, description, onValue, offValue, myDefault){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'><input id='Setting_" + key + "' name='Setting_" + key + "' type='checkbox'" + (GM_getValue(key, myDefault).toString() === onValue.toString() ? " checked='checked'" : "") + "> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('change', function(ev){var ch = ev.target.checked; (ch === true ? GM_setValue(key, onValue) : GM_setValue(key, offValue));});
      document.getElementById('pose_list').appendChild(__temp);
    
}

function addSelectSetting(key, name, description, myDefault, values){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'><select id='Setting_" + key + "' name='Setting_" + key + "'>" + 
      ((function(){var res = "";
        for(var i = 0; i < values.length; i++){
          var elem = values[i];
          res += "<option " + (GM_getValue(key, myDefault).toString() === elem[0].toString() ? "selected='selected'" : "") + " value='"+elem[0]+"'>"+elem[1]+"</option>";
        }
        return res;
      }).call(this)) + "</select> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('change', function(e){GM_setValue(key, e.target.value);});
      document.getElementById('pose_list').appendChild(__temp);
    
}

function addColorSetting(key, name, description, myDefault, deactivatable, deactiveDefault){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'>" +
    (deactivatable.toString() === 'true' ? "<input id='ColorCheckBox_" + key + "' type='checkbox' " +
		  (GM_getValue(key, myDefault).toString() !== deactiveDefault.toString() ? "checked='checked'" : "") +
    ">" : "") +
    " <input id='Setting_" + key + "' name='Setting_" + key + "' type='color' value='" + (GM_getValue(key, myDefault).toString() === deactiveDefault.toString() ? (myDefault.toString() === deactiveDefault.toString() ? '#000000' : myDefault) : GM_getValue(key, myDefault)) + "'>" +
    " <button type='button'>Reset</button> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('change', function(e){var a = e.target;
		  if(a.type === "checkbox"){ a.checked === false ? GM_setValue(key, deactiveDefault) : GM_setValue(key, document.getElementById('Setting_' + key).value) }
		  else if(a.type === "color"){ GM_setValue(key, a.value); document.getElementById('ColorCheckBox_' + key).checked = true; }
	});
__temp.addEventListener('click', function(e){var a = e.target;
		if(a.type === "button"){
			GM_deleteValue(key);
			if (myDefault.toString() === deactiveDefault.toString()) {
				document.getElementById('ColorCheckBox_' + key).checked = false;
				document.getElementById('Setting_' + key).value = '#000000';
			}
			else {
				document.getElementById('ColorCheckBox_' + key).checked = true;
				document.getElementById('Setting_' + key).value = myDefault;
			}
		}
	});
      document.getElementById('pose_list').appendChild(__temp);
    
}

function addTextSetting(key, name, description, myDefault, maxLength){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'><input id='Setting_" + key + "' name='Setting_" + key + "' type='text' maxlength='" + maxLength + "' value='" + GM_getValue(key, myDefault) + "'> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('keyup', function(e){var a = e.target;
		  if(a.type === "text"){ GM_setValue(key, a.value); }});
      document.getElementById('pose_list').appendChild(__temp);
    
}

    
	document.getElementById('pose_list').appendChild(document.createElement('hr'));
	addBooleanSetting('ABTorrentsShowYen', 'Show Yen generation', 'Show Yen generation for torrents, with detailed information when hovered.', 'true', 'false', 'true');
	addSelectSetting('ABTorrentsYenTimeFrame', 'Yen generation time frame', 'The amount of generated Yen per selected time frame.', '1', [["1","Hour"],["24","Day"],["168","Week"]]);
	addBooleanSetting('ABTorrentsReqTime', 'Show required seeding time', 'Shows minimal required seeding time for torrents in their description and when size is hovered.', 'true', 'false', 'true');
	addBooleanSetting('ABTorrentsFilter', 'Filter torrents', 'Shows a box above torrent tables, where you can filter the torrents from that table.', 'true', 'false', 'false');
	document.getElementById('pose_list').appendChild(document.createElement('hr'));
	addBooleanSetting('ABForumEnhFastSearch', 'Create links to search forums', 'Add links to search forums (including or excluding direct subforums) at the top of a forums page.', 'true', 'false', 'true');
	addBooleanSetting('ABForumSearchWorkInFS', 'Load posts into search results', 'Allows you to load posts and threads into search results, slide through posts and filter for authors.', 'true', 'false', 'true');
	addBooleanSetting('ABForumSearchHideSubfor', 'Hide subforum selection in search', 'This will hide the subforum selection in the search until a checkbox is clicked.', 'true', 'false', 'true');
	addColorSetting('ABForumSearchHighlightBG', 'Color for search terms', 'Background color for search terms within posts and headers.', '#FFC000', 'true', 'none');
	addColorSetting('ABForumSearchHighlightFG', 'Color for search terms', 'Text color for search terms within posts and headers.', '#000000', 'true', 'none');
	addBooleanSetting('ABForumEnhWorkInRest', 'Load posts into forum view', 'Allows you to load posts and threads into the general forum view.', 'true', 'false', 'false');
	addTextSetting('ABForumLoadText', 'Text for links to be loaded', 'The text to be shown for forum links that have not been loaded yet.', '(Load)', '10');
	addTextSetting('ABForumLoadingText', 'Text for loading links', 'The text to be shown for forum links that are currently being loaded.', '(Loading)', '10');
	addTextSetting('ABForumToggleText', 'Text for loaded links', 'The text to be shown for forum links that have been loaded and can now be toggled.', '(Toggle)', '10');

    }).call(this);
}
