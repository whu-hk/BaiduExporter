!function(){"use strict";var e=function(){this._listeners={}};e.prototype.on=function(e,t){(this._listeners[e]=this._listeners[e]||[]).push(t)},e.prototype.trigger=function(e,t){(this._listeners[e]||[]).forEach((function(e){return e(t)}))},e.prototype.off=function(e){delete this._listeners[e]};var t=new(function(e){function t(){e.call(this),this.defaultRPC=[{name:"ARIA2 RPC",url:"http://localhost:6800/jsonrpc"}],this.defaultUserAgent="netdisk;6.0.0.12;PC;PC-Windows;10.0.16299;WindowsBaiduYunGuanJia",this.defaultReferer="https://pan.baidu.com/disk/home",this.defaultAppId=250528,this.defaultConfigData={rpcList:this.defaultRPC,configSync:!1,md5Check:!1,fold:0,interval:300,downloadPath:"",userAgent:this.defaultUserAgent,referer:this.defaultReferer,appId:this.defaultAppId,headers:""},this.configData={},this.on("initConfigData",this.init.bind(this)),this.on("setConfigData",this.set.bind(this)),this.on("clearConfigData",this.clear.bind(this))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.init=function(){var e=this;chrome.storage.sync.get(null,(function(e){var t=function(t){chrome.storage.local.set({key:e[t]},(function(){console.log("chrome first local set: %s, %s",t,e[t])}))};for(var n in e)t(n)})),chrome.storage.local.get(null,(function(t){e.configData=Object.assign({},e.defaultConfigData,t),e.trigger("updateView",e.configData)}))},t.prototype.getConfigData=function(e){return void 0===e&&(e=null),e?this.configData[e]:this.configData},t.prototype.set=function(e){this.configData=e,this.save(e),this.trigger("updateView",e)},t.prototype.save=function(e){var t,n,s=function(s){chrome.storage.local.set(((t={})[s]=e[s],t),(function(){console.log("chrome local set: %s, %s",s,e[s])})),!0===e.configSync&&chrome.storage.sync.set(((n={})[s]=e[s],n),(function(){console.log("chrome sync set: %s, %s",s,e[s])}))};for(var a in e)s(a)},t.prototype.clear=function(){chrome.storage.sync.clear(),chrome.storage.local.clear(),this.configData=this.defaultConfigData,this.trigger("updateView",this.configData)},t}(e)),n=function(){this.cookies={}};n.prototype.httpSend=function(e,t,n){var s=e.url,a=e.options;fetch(s,a).then((function(e){e.ok?e.json().then((function(e){t(e)})):n(e)})).catch((function(e){n(e)}))},n.prototype.getConfigData=function(e){return void 0===e&&(e=null),t.getConfigData(e)},n.prototype.objectToQueryString=function(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},n.prototype.sendToBackground=function(e,t,n){chrome.runtime.sendMessage({method:e,data:t},n)},n.prototype.showToast=function(e,t){window.postMessage({type:"showToast",data:{message:e,type:t}},location.origin)},n.prototype.getHashParameter=function(e){var t=window.location.hash.substr(1);return new URLSearchParams(t).get(e)},n.prototype.formatCookies=function(){var e=[];for(var t in this.cookies)e.push(t+"="+this.cookies[t]);return e.join("; ")},n.prototype.getHeader=function(e){void 0===e&&(e="RPC");var t=[];t.push("User-Agent: "+this.getConfigData("userAgent")),t.push("Referer: "+this.getConfigData("referer")),Object.keys(this.cookies).length>0&&t.push("Cookie: "+this.formatCookies());var n=this.getConfigData("headers");return n&&n.split("\n").forEach((function(e){t.push(e)})),"RPC"===e?t:"aria2Cmd"===e?t.map((function(e){return"--header "+JSON.stringify(e)})).join(" "):"aria2c"===e?t.map((function(e){return" header="+e})).join("\n"):"idm"===e?t.map((function(e){var t=e.split(": ");return t[0].toLowerCase()+": "+t[1]})).join("\r\n"):void 0},n.prototype.parseURL=function(e){var t=new URL(e),n=t.username?t.username+":"+decodeURI(t.password):null;n&&(n.includes("token:")||(n="Basic "+btoa(n)));var s=t.hash.substr(1),a={},i=new URLSearchParams(s);for(var o of i)a[o[0]]=2===o.length?o[1]:"enabled";return{authStr:n,path:t.origin+t.pathname,options:a}},n.prototype.generateParameter=function(e,t,n){e&&e.startsWith("token")&&n.params.unshift(e);var s={url:t,options:{method:"POST",headers:{"Content-type":"application/x-www-form-urlencoded; charset=UTF-8"},body:JSON.stringify(n)}};return e&&e.startsWith("Basic")&&(s.options.headers.Authorization=e),s},n.prototype.getVersion=function(e,t){var n=this.parseURL(e),s=n.authStr,a=n.path;this.sendToBackground("rpcVersion",this.generateParameter(s,a,{jsonrpc:"2.0",method:"aria2.getVersion",id:1,params:[]}),(function(e){t.innerText=e?"Aria2版本为: "+e:"错误,请查看是否开启Aria2"}))},n.prototype.copyText=function(e){var t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.focus(),t.select();var n=document.execCommand("copy");t.remove(),n?this.showToast("拷贝成功~","success"):this.showToast("拷贝失败 QAQ","failure")},n.prototype.requestCookies=function(e){var t=this;this.sendToBackground("getCookies",e,(function(e){t.cookies=e}))},n.prototype.aria2RPCMode=function(e,t){var n=this,s=this.parseURL(e),a=s.authStr,i=s.path,o=s.options;t.forEach((function(e){var t={jsonrpc:"2.0",method:"aria2.addUri",id:(new Date).getTime(),params:[[e.link],{out:e.name,header:n.getHeader()}]},s=n.getConfigData("md5Check"),r=t.params[1],c=n.getConfigData("downloadPath");if(c&&(r.dir=c),s&&(r.checksum="md5="+e.md5),o)for(var l in o)r[l]=o[l];n.sendToBackground("rpcData",n.generateParameter(a,i,t),(function(e){e?n.showToast("下载成功!赶紧去看看吧~","success"):n.showToast("下载失败!是不是没有开启Aria2?","failure")}))}))},n.prototype.aria2TXTMode=function(e){var t=this,n=[],s=[],a=[],i=[],o="data:text/plain;charset=utf-8,";e.forEach((function(e){var o="aria2c -c -s10 -k1M -x16 --enable-rpc=false -o "+JSON.stringify(e.name)+" "+t.getHeader("aria2Cmd")+" "+JSON.stringify(e.link),r=[e.link,t.getHeader("aria2c")," out="+e.name].join("\n");t.getConfigData("md5Check")&&(o+=" --checksum=md5="+e.md5,r+="\n checksum=md5="+e.md5),n.push(o),s.push(r);var c=["<",e.link,t.getHeader("idm"),">"].join("\r\n");a.push(c),i.push(e.link)})),document.querySelector("#aria2CmdTxt").value=""+n.join("\n"),document.querySelector("#aria2Txt").href=""+o+encodeURIComponent(s.join("\n")),document.querySelector("#idmTxt").href=""+o+encodeURIComponent(a.join("\r\n")+"\r\n"),document.querySelector("#downloadLinkTxt").href=""+o+encodeURIComponent(i.join("\n")),document.querySelector("#copyDownloadLinkTxt").dataset.link=i.join("\n")};var s=new n,a=function(){var e=this;this.version="1.0.4",this.updateDate="2019/11/18",t.on("updateView",(function(t){e.updateSetting(t),e.updateMenu(t)}))};a.prototype.init=function(){this.addSettingUI(),this.addTextExport(),t.trigger("initConfigData")},a.prototype.addMenu=function(e,t){e.insertAdjacentHTML(t,'\n      <div id="exportMenu" class="g-dropdown-button">\n        <a class="g-button">\n          <span class="g-button-right">\n            <em class="icon icon-download"></em>\n            <span class="text">导出下载</span>\n          </span>\n        </a>\n        <div id="aria2List" class="menu" style="z-index:50;">\n          <a class="g-button-menu" id="aria2Text" href="javascript:void(0);">文本导出</a>\n          <a class="g-button-menu" id="settingButton" href="javascript:void(0);">设置</a>\n        </div>\n      </div>');var n=document.querySelector("#exportMenu");n.addEventListener("mouseenter",(function(){n.classList.add("button-open")})),n.addEventListener("mouseleave",(function(){n.classList.remove("button-open")}));var s=document.querySelector("#settingButton"),a=document.querySelector("#settingMenu");s.addEventListener("click",(function(){a.classList.add("open-o")}))},a.prototype.resetMenu=function(){Array.from(document.querySelectorAll(".rpc-button")).forEach((function(e){e.remove()}))},a.prototype.updateMenu=function(e){this.resetMenu();var t=e.rpcList,n="";t.forEach((function(e){var t='<a class="g-button-menu rpc-button" href="javascript:void(0);" data-url='+e.url+">"+e.name+"</a>";n+=t})),document.querySelector("#aria2List").insertAdjacentHTML("afterbegin",n)},a.prototype.addTextExport=function(){var e=this;document.body.insertAdjacentHTML("beforeend",'\n      <div id="textMenu" class="modal export-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">文本导出</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="export-menu-row">\n              <a class="export-menu-button" href="javascript:void(0);" id="aria2Txt" download="aria2c.down">存为Aria2文件</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="idmTxt" download="idm.ef2">存为IDM文件</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="downloadLinkTxt" download="link.txt">保存下载链接</a>\n              <a class="export-menu-button" href="javascript:void(0);" id="copyDownloadLinkTxt">拷贝下载链接</a>\n            </div>\n            <div class="export-menu-row">\n              <textarea class="export-menu-textarea" type="textarea" wrap="off" spellcheck="false" id="aria2CmdTxt"></textarea>\n            </div>\n          </div>\n        </div>\n      </div>');var t=document.querySelector("#textMenu"),n=t.querySelector(".modal-close"),a=t.querySelector("#copyDownloadLinkTxt");a.addEventListener("click",(function(){s.copyText(a.dataset.link)})),n.addEventListener("click",(function(){t.classList.remove("open-o"),e.resetTextExport()}))},a.prototype.resetTextExport=function(){var e=document.querySelector("#textMenu");e.querySelector("#aria2Txt").href="",e.querySelector("#idmTxt").href="",e.querySelector("#downloadLinkTxt").href="",e.querySelector("#aria2CmdTxt").value="",e.querySelector("#copyDownloadLinkTxt").dataset.link=""},a.prototype.addSettingUI=function(){var e=this,n='\n      <div id="settingMenu" class="modal setting-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">导出设置</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="setting-menu-message">\n              <label class="setting-menu-label orange-o" id="message"></label>\n            </div>\n            <div class="setting-menu-row rpc-s">\n              <div class="setting-menu-name">\n                <input class="setting-menu-input name-s" spellcheck="false">\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input url-s" spellcheck="false">\n                <a class="setting-menu-button" id="addRPC" href="javascript:void(0);">添加RPC地址</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">配置同步</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox configSync-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">MD5校验</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox md5Check-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n               <div class="setting-menu-name">\n                 <label class="setting-menu-label">文件夹层数</label>\n               </div>\n               <div class="setting-menu-value">\n                 <input class="setting-menu-input small-o fold-s" type="number" spellcheck="false">\n                 <label class="setting-menu-label">(默认0表示不保留,-1表示保留完整路径)</label>\n               </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">递归下载间隔</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input small-o interval-s" type="number" spellcheck="false">\n                <label class="setting-menu-label">(单位:毫秒)</label>\n                <a class="setting-menu-button version-s" id="testAria2" href="javascript:void(0);">测试连接，成功显示版本号</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">下载路径</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input downloadPath-s" placeholder="只能设置为绝对路径" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">User-Agent</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input userAgent-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Referer</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input referer-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">AppId</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input app_id-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Headers</label>\n              </div>\n              <div class="setting-menu-value">\n                <textarea class="setting-menu-input textarea-o headers-s" type="textarea" spellcheck="false"></textarea>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n          </div>\x3c!-- /.setting-menu-body --\x3e\n          <div class="modal-footer">\n            <div class="setting-menu-copyright">\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">&copy; Copyright</label>\n                <a class="setting-menu-link" href="https://github.com/acgotaku/BaiduExporter" target="_blank">雪月秋水</a>\n              </div>\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">Version: '+this.version+'</label>\n                <label class="setting-menu-label">Update date: '+this.updateDate+'</label>\n              </div>\n            </div>\x3c!-- /.setting-menu-copyright --\x3e\n            <div class="setting-menu-operate">\n              <a class="setting-menu-button large-o blue-o" id="apply" href="javascript:void(0);">应用</a>\n              <a class="setting-menu-button large-o" id="reset" href="javascript:void(0);">重置</a>\n            </div>\n          </div>\n        </div>\n      </div>';document.body.insertAdjacentHTML("beforeend",n);var a=document.querySelector("#settingMenu");a.querySelector(".modal-close").addEventListener("click",(function(){a.classList.remove("open-o"),e.resetSetting()})),document.querySelector("#addRPC").addEventListener("click",(function(){var e=document.querySelectorAll(".rpc-s");Array.from(e).pop().insertAdjacentHTML("afterend",'\n        <div class="setting-menu-row rpc-s">\n          <div class="setting-menu-name">\n            <input class="setting-menu-input name-s" spellcheck="false">\n          </div>\n          <div class="setting-menu-value">\n            <input class="setting-menu-input url-s" spellcheck="false">\n          </div>\n        </div>\x3c!-- /.setting-menu-row --\x3e')}));var i=document.querySelector("#apply"),o=document.querySelector("#message");i.addEventListener("click",(function(){e.saveSetting(),o.innerText="设置已保存"})),document.querySelector("#reset").addEventListener("click",(function(){t.trigger("clearConfigData"),o.innerText="设置已重置"}));var r=document.querySelector("#testAria2");r.addEventListener("click",(function(){s.getVersion(t.getConfigData("rpcList")[0].url,r)}))},a.prototype.resetSetting=function(){document.querySelector("#message").innerText="",document.querySelector("#testAria2").innerText="测试连接，成功显示版本号"},a.prototype.updateSetting=function(e){var t=e.rpcList,n=e.configSync,s=e.md5Check,a=e.fold,i=e.interval,o=e.downloadPath,r=e.userAgent,c=e.referer,l=e.appId,u=e.headers;Array.from(document.querySelectorAll(".rpc-s")).forEach((function(e,t){0!==t&&e.remove()})),t.forEach((function(e,t){var n=document.querySelectorAll(".rpc-s");if(0===t)n[t].querySelector(".name-s").value=e.name,n[t].querySelector(".url-s").value=e.url;else{var s='\n          <div class="setting-menu-row rpc-s">\n            <div class="setting-menu-name">\n              <input class="setting-menu-input name-s" value="'+e.name+'" spellcheck="false">\n            </div>\n            <div class="setting-menu-value">\n              <input class="setting-menu-input url-s" value="'+e.url+'" spellcheck="false">\n            </div>\n          </div>\x3c!-- /.setting-menu-row --\x3e';Array.from(n).pop().insertAdjacentHTML("afterend",s)}})),document.querySelector(".configSync-s").checked=n,document.querySelector(".md5Check-s").checked=s,document.querySelector(".fold-s").value=a,document.querySelector(".interval-s").value=i,document.querySelector(".downloadPath-s").value=o,document.querySelector(".userAgent-s").value=r,document.querySelector(".referer-s").value=c,document.querySelector(".app_id-s").value=l,document.querySelector(".headers-s").value=u},a.prototype.saveSetting=function(){var e=document.querySelectorAll(".rpc-s"),n={rpcList:Array.from(e).map((function(e){var t=e.querySelector(".name-s").value,n=e.querySelector(".url-s").value;if(t&&n)return{name:t,url:n}})).filter((function(e){return e})),configSync:document.querySelector(".configSync-s").checked,md5Check:document.querySelector(".md5Check-s").checked,fold:Number.parseInt(document.querySelector(".fold-s").value),interval:document.querySelector(".interval-s").value,downloadPath:document.querySelector(".downloadPath-s").value,userAgent:document.querySelector(".userAgent-s").value,referer:document.querySelector(".referer-s").value,appId:document.querySelector(".app_id-s").value,headers:document.querySelector(".headers-s").value};t.trigger("setConfigData",n)};var i=new a,o=function(e){this.listParameter=e,this.fileDownloadInfo=[],this.currentTaskId=0,this.completedCount=0,this.folders=[],this.files={}};o.prototype.start=function(e,t){void 0===e&&(e=300),this.interval=e,this.done=t,this.currentTaskId=(new Date).getTime(),this.getNextFile(this.currentTaskId)},o.prototype.reset=function(){this.fileDownloadInfo=[],this.currentTaskId=0,this.folders=[],this.files={},this.completedCount=0},o.prototype.addFolder=function(e){this.folders.push(e)},o.prototype.addFile=function(e){this.files[e.fs_id]=e},o.prototype.getNextFile=function(e){var t=this;if(e===this.currentTaskId)if(0!==this.folders.length){this.completedCount++,s.showToast("正在获取文件列表... "+this.completedCount+"/"+(this.completedCount+this.folders.length-1),"success");var n=this.folders.pop();this.listParameter.search.dir=n,fetch(""+window.location.origin+this.listParameter.url+s.objectToQueryString(this.listParameter.search),this.listParameter.options).then((function(n){n.ok?n.json().then((function(n){if(setTimeout((function(){return t.getNextFile(e)}),t.interval),0!==n.errno)return s.showToast("未知错误","failure"),void console.log(n);n.list.forEach((function(e){e.isdir?t.folders.push(e.path):t.files[e.fs_id]=e}))})):console.log(n)})).catch((function(n){s.showToast("网络请求失败","failure"),console.log(n),setTimeout((function(){return t.getNextFile(e)}),t.interval)}))}else 0!==this.files.length?(s.showToast("正在获取下载地址...","success"),this.getFiles(this.files).then((function(){t.done(t.fileDownloadInfo)}))):(s.showToast("一个文件都没有哦...","caution"),this.reset())},o.prototype.getFiles=function(e){throw new Error("subclass should implement this method!")},(new(function(e){function t(){var t={search:{dir:"",channel:"chunlei",clienttype:0,web:1},url:"/api/list?",options:{credentials:"include",method:"GET"}};e.call(this,t),i.init(),i.addMenu(document.querySelectorAll(".g-dropdown-button")[3],"afterend"),s.requestCookies([{url:"https://pan.baidu.com/",name:"BDUSS"},{url:"https://pcs.baidu.com/",name:"pcsett"}]),s.showToast("初始化成功!","success"),this.mode="RPC",this.rpcURL="http://localhost:6800/jsonrpc"}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.startListen=function(){var e=this;window.addEventListener("message",(function(t){if(t.source===window&&t.data.type&&"selected"===t.data.type){e.reset();var n=t.data.data;if(0===n.length)return void s.showToast("请选择一下你要保存的文件哦","failure");n.forEach((function(t){t.isdir?e.addFolder(t.path):e.addFile(t)})),e.start(s.getConfigData("interval"),(function(t){"RPC"===e.mode&&s.aria2RPCMode(e.rpcURL,t),"TXT"===e.mode&&(s.aria2TXTMode(t),document.querySelector("#textMenu").classList.add("open-o"))}))}})),document.querySelector("#aria2List").addEventListener("click",(function(t){var n=t.target.dataset.url;n&&(e.rpcURL=n,e.getSelected(),e.mode="RPC"),"aria2Text"===t.target.id&&(e.getSelected(),e.mode="TXT")}))},t.prototype.getSelected=function(){window.postMessage({type:"getSelected"},location.origin)},t.prototype.getPrefixLength=function(){var e=s.getHashParameter("/all?path")||s.getHashParameter("path"),t=s.getConfigData("fold");if(-1===t||"/"===e)return 1;if(s.getHashParameter("/search?key"))return 1;for(var n=e.split("/"),a=0,i=0;i<n.length-t;i++)a=a+n[i].length+1;return a},t.prototype.getFiles=function(e){var t=this.getPrefixLength(),n=s.getConfigData("appId");for(var a in e)this.fileDownloadInfo.push({name:e[a].path.substr(t),link:location.protocol+"//pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id="+n+"&path="+encodeURIComponent(e[a].path),md5:e[a].md5});return Promise.resolve()},t}(o))).startListen()}();