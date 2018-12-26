"use strict";angular.module("foundersMapQuestApp.constants",[]).constant("FMQ_MODULE_SETTINGS",{"foundersMapQuestApp.about":{routes:{about:"root.about"},moduleLocation:"components/about/"},"foundersMapQuestApp.columnSorter":{moduleLocation:"components/column-sorter/"},"foundersMapQuestApp.dashboard":{routes:{dashboard:"root.dashboard"},moduleLocation:"components/dashboard/"},"foundersMapQuestApp.showImage":{routes:{"show-image":"root.dashboard.show-image"},moduleLocation:"components/dashboard/show-image/"},"foundersMapQuestApp.loadData":{routes:{"load-data":"root.dashboard.load-data"},moduleLocation:"components/dashboard/load-data/"},"foundersMapQuestApp.map":{moduleLocation:"components/dashboard/map/"},"foundersMapQuestApp.table":{moduleLocation:"components/dashboard/table/"},"foundersMapQuestApp.visualize":{moduleLocation:"components/dashboard/visualize/"},"foundersMapQuestApp.error":{routes:{"not-found":"not-found"},moduleLocation:"components/error/"},"foundersMapQuestApp.navigation":{moduleLocation:"components/navigation/"}}).constant("FMQ_ROOT_URL","").constant("FMQ_ANIMATE",!0),angular.module("foundersMapQuestApp",["foundersMapQuestApp.constants","foundersMapQuestApp.navigation","foundersMapQuestApp.dashboard","foundersMapQuestApp.about","foundersMapQuestApp.error","ui.router"]).config(["uiGmapGoogleMapApiProvider",function(a){a.configure({libraries:"visualization"})}]).config(["$stateProvider","$urlRouterProvider","FMQ_ROOT_URL",function(a,b,c){b.when(c+"/",c+"/dashboard"),a.state("root",{url:c})}]),angular.module("foundersMapQuestApp.foundersManager",["foundersMapQuestApp.constants","foundersMapQuestApp.columnSorter"]).value("Papa",window.Papa),angular.module("foundersMapQuestApp.foundersManager").factory("ColumnFactory",["Column",function(a){var b={create:function(b){return new a(b)},createFromJson:function(a){return b.create(a.name)}};return b}]).factory("Column",function(){var a=function(a){this.name=a};return a.prototype.toJson=function(){return{name:this.name}},a}),angular.module("foundersMapQuestApp.foundersManager").factory("CsvFactory",["Csv","ColumnFactory",function(a,b){var c={create:function(b,c,d){return new a(b,c,d)},createFromJson:function(a){var d=a.header;return"undefined"!=typeof d&&(d=a.header.map(function(a){return b.createFromJson(a)})),c.create(d,a.items,a.delimiter)},createFromRaw:function(b,d){var e=a.parse(b,d);return c.create(e.header,e.items,e.delimiter)},clone:function(a){return c.createFromJson(JSON.parse(JSON.stringify(a.toJson())))}};return c}]).factory("Csv",["Papa","ColumnFactory",function(a,b){var c=function(a,b,c){this.header=a||[],this.items=b||null,this.delimiter=c||","};return c.prototype.encodeToRaw=function(){var b=this.header.map(function(a){return a.name}),c=a.unparse([b].concat(this.items||[]),{newline:"\n",delimiter:this.delimiter});return c},c.prototype.toJson=function(){var a=this.header.map(function(a){return a.toJson()});return{header:a,items:this.items,delimiter:this.delimiter}},c.parse=function(c,d){d="undefined"!=typeof d?d:"";var e,f=a.parse(c,{header:!0,skipEmptyLines:!0,delimiter:d}),g=f.meta.fields;return e=0===f.errors.length?f.data.map(function(a){return g.map(function(b){return a[b]})}):null,g=g.map(function(a){return b.create(a)}),{header:g,items:e,delimiter:f.meta.delimiter}},c.delimiters=[{delimiter:",",label:"Comma"},{delimiter:";",label:"Colon"},{delimiter:"	",label:"Tab"}],c}]),angular.module("foundersMapQuestApp.foundersManager").factory("FoundersFactory",["Founders","Csv","ColumnFactory",function(a,b,c){var d={create:function(b,c,d,e,f,g){return new a(b,c,d,e,f,g)},createFromJson:function(b){var d=b.header;return"undefined"!=typeof d&&(d=b.header.map(function(a){return c.createFromJson(a)})),new a(d,b.items,b.delimiter,b.latitudeColumn,b.longitudeColumn,b.markerColumn)},createFromRaw:function(a,c,e,f,g){var h=b.parse(a,c);return d.create(h.header,h.items,h.delimiter,e,f,g)},clone:function(a){return d.createFromJson(JSON.parse(JSON.stringify(a.toJson())))}};return d}]).factory("Founders",["Csv",function(a){var b=0,c=function(c,d,e,f,g,h){a.call(this,c,d,e),this.latitudeColumn="undefined"!=typeof f?f:null,this.longitudeColumn="undefined"!=typeof g?g:null,this.markerColumn="undefined"!=typeof h?h:b};c.prototype=Object.create(a.prototype),c.prototype.constructor=c,c.prototype.chooseAsMarker=function(a){this.markerColumn=this.header.indexOf(a)},c.prototype.isMarker=function(a){return this.markerColumn===this.header.indexOf(a)};var d=new RegExp(/https?:\/\/(.+)/),e=new RegExp(/.+\.(jpg|jpeg|png|gif|svg|bmp)$/);c.prototype.detectType=function(a,b){var c=null,f=this.header.indexOf(b);return f===this.latitudeColumn?c="latitude":f===this.longitudeColumn?c="longitude":d.test(a)&&(c=e.test(a)?"image":"link"),c},c.prototype.getMarkerContentType=function(a){return this.detectType(a[this.markerColumn],this.header[this.markerColumn])},c.prototype.setDefaultMarkerColumn=function(){this.markerColumn=b};var f={latitude:new RegExp(/latitude|\blat\b/i),longitude:new RegExp(/longitude|\blng\b/i)};return c.prototype.autoSetCoordinateColumns=function(){["latitude","longitude"].forEach(function(a){var b=this[a+"Column"];null===b&&(this.header.forEach(function(c,d){null===b&&c.name.match(f[a])&&(b=d)}),this[a+"Column"]=b)},this)},c.prototype.toJson=function(){var b=a.prototype.toJson.call(this);return angular.extend(b,{latitudeColumn:this.latitudeColumn,longitudeColumn:this.longitudeColumn,markerColumn:this.markerColumn})},c}]),angular.module("foundersMapQuestApp.foundersManager").factory("SelectHandler",function(){var a={allSelected:function(a,b){return Object.keys(b).length===a.length},isSelected:function(a,b){return"undefined"!=typeof a[b]},selectAll:function(a){var b={};return a.forEach(function(a,c){b[c]=!0}),b},unselectAll:function(){return{}},toggleSelection:function(b,c,d){return a.isSelected(d,c)?delete d[c]:d[c]=!0,d},toggleAllSelection:function(b,c){return a.allSelected(b,c)?a.unselectAll():a.selectAll(b)}};return a}),angular.module("foundersMapQuestApp.foundersManager").factory("FilterHandler",function(){var a={setFilter:function(a,b,c){return a[b]=c,a},getFilter:function(a,b){return a[b]},resetFilters:function(){return{}},passesFilter:function(a,b){var c=!0;return Object.keys(a).forEach(function(d){if(c){var e=a[d];if("undefined"!=typeof e&&""!==e){var f=e.toLowerCase(),g=b[d];-1===(""+g).toLowerCase().indexOf(f)&&(c=!1)}}}),c}};return a}),angular.module("foundersMapQuestApp.foundersManager").factory("SortHandler",function(){var a={getSortState:function(a,b){return a[b]},getSortKeys:function(a){return Object.keys(a)},applySort:function(a,b,c){return a[c]=b,a},resetSorts:function(){return{}}};return a}),angular.module("foundersMapQuestApp.foundersManager").factory("FoundersManagerFactory",["FoundersManager","FoundersFactory",function(a,b){var c={create:function(b,c,d,e){return new a(b,c,d,e)},createFromJson:function(a){var d=b.createFromJson(a.founders);return c.create(d,a.selectedItems,a.filterStates,a.sortStates)}};return c}]).factory("FoundersManager",["SelectHandler","FilterHandler","SortHandler","SortStates",function(a,b,c,d){var e=function(d,e,f,g){this.founders=d,this.selectedItems=e||a.selectAll(d.items||[]),this.filterStates=f||b.resetFilters(),this.sortStates=g||c.resetSorts()};return e.prototype.allSelected=function(){return a.allSelected(this.founders.items||[],this.selectedItems)},e.prototype.isSelected=function(b){return a.isSelected(this.selectedItems,(this.founders.items||[]).indexOf(b))},e.prototype.toggleAllSelection=function(){this.selectedItems=a.toggleAllSelection(this.founders.items||[],this.selectedItems)},e.prototype.toggleSelection=function(b){return a.toggleSelection(this.founders.items||[],(this.founders.items||[]).indexOf(b),this.selectedItems)},e.prototype.setFilter=function(a,c){this.filterStates=b.setFilter(this.filterStates,this.founders.header.indexOf(a),c)},e.prototype.getFilter=function(a){return b.getFilter(this.filterStates,this.founders.header.indexOf(a))},e.prototype.resetFilters=function(){this.filterStates=b.resetFilters()},e.prototype.passesFilter=function(a){return b.passesFilter(this.filterStates,a)},e.prototype.getSort=function(a){return c.getSortState(this.sortStates,this.founders.header.indexOf(a))},e.prototype.applySort=function(a,b){this.sortStates=c.resetSorts(),this.sortStates=c.applySort(this.sortStates,b,this.founders.header.indexOf(a))},e.prototype.getSortConfig=function(){var a=c.getSortKeys(this.sortStates)[0];return"undefined"==typeof a||this.sortStates[a]===d.NONE?{predicate:void 0,reverse:!1}:{predicate:a,reverse:this.sortStates[a]===d.DESC}},e.prototype.resetSorts=function(){this.sortStates=c.resetSorts()},e.prototype.toJson=function(){return{founders:this.founders.toJson(),filterStates:this.filterStates,selectedItems:this.selectedItems,sortStates:this.sortStates}},e}]),angular.module("foundersMapQuestApp.state",["foundersMapQuestApp.constants","LocalStorageModule"]),angular.module("foundersMapQuestApp.state").factory("StateFactory",["State",function(a){var b={create:function(b){return new a(b)}};return b}]).factory("State",["localStorageService",function(a){var b=function(b){this.key=b;var c=a.get(b);this.value="undefined"!=typeof c?c:null};return b.prototype.set=function(a){return this.value=a,this},b.prototype.save=function(){return a.set(this.key,this.value),this},b.prototype.get=function(){return this.value},b}]),angular.module("foundersMapQuestApp.navigation",["foundersMapQuestApp.constants","ui.router"]),angular.module("foundersMapQuestApp.navigation").directive("fmqNavigation",["FMQ_MODULE_SETTINGS",function(a){var b=a["foundersMapQuestApp.navigation"];return{templateUrl:b.moduleLocation+"fmq-navigation.html",restrict:"EA",replace:!0,controllerAs:"vm",bindToController:!0,controller:["$state","$rootScope",function(a,b){var c=this;c.state=a,b.$on("$stateChangeSuccess",function(a,b){c.currentName=b.name}),c.items=a.get().filter(function(a){return!a["abstract"]&&"undefined"!=typeof a.params&&"undefined"!=typeof a.params.label}).map(function(a){return{name:a.name,label:a.params.label}})}]}}]),angular.module("foundersMapQuestApp.columnSorter",["foundersMapQuestApp.constants"]),angular.module("foundersMapQuestApp.columnSorter").factory("SortStates",function(){var a={NONE:0,ASC:1,DESC:2},b={0:a.ASC,1:a.DESC,2:a.NONE},c={NONE:a.NONE,ASC:a.ASC,DESC:a.DESC,getNextState:function(a){var d="undefined"==typeof a?c.ASC:b[a];return d}};return c}),angular.module("foundersMapQuestApp.columnSorter").directive("fmqColumnSorter",["FMQ_MODULE_SETTINGS",function(a){var b=a["foundersMapQuestApp.columnSorter"];return{scope:{state:"=",change:"&"},templateUrl:b.moduleLocation+"fmq-column-sorter.html",restrict:"EA",replace:!0,controllerAs:"vm",bindToController:!0,controller:["$scope","SortStates",function(a,b){var c=this;c.SortStates=b,a.$watch(function(){return c.state},function(){"undefined"==typeof c.state&&(c.state=b.NONE)}),c.changeSortState=function(){c.state=b.getNextState(c.state),c.change({state:c.state})}}]}}]),angular.module("foundersMapQuestApp.dashboard",["foundersMapQuestApp.constants","foundersMapQuestApp.loadData","foundersMapQuestApp.showImage","foundersMapQuestApp.table","foundersMapQuestApp.map","foundersMapQuestApp.foundersManager","foundersMapQuestApp.state","ui.bootstrap","ui.router","uiGmapgoogle-maps"]).config(["$stateProvider","FMQ_MODULE_SETTINGS",function(a,b){var c=b["foundersMapQuestApp.dashboard"];a.state(c.routes.dashboard,{url:"/dashboard",params:{label:"Dashboard",founders:null},views:{"main@":{templateUrl:c.moduleLocation+"dashboard.html",resolve:{foundersManagerState:["$stateParams","StateFactory","FoundersFactory","FoundersManagerFactory",function(a,b,c,d){var e=b.create("fmq.foundersManager"),f=a.founders,g=null;if(null!==f)g=d.create(f);else{var h=e.get();null!==h?g=d.createFromJson(h):(f=c.create(),g=d.create(f))}return e.set(g.toJson()).save(),e}],tableHelpInfoState:["StateFactory",function(a){var b=a.create("fmq.tableHelpInfo"),c=b.get();return c=null!==c?c:!0,b.set(c).save(),b}]},controller:"DashboardCtrl",controllerAs:"vm"}}})}]),angular.module("foundersMapQuestApp.dashboard").controller("DashboardCtrl",["$scope","$state","foundersManagerState","tableHelpInfoState","FoundersManagerFactory","FMQ_MODULE_SETTINGS","$anchorScroll",function(a,b,c,d,e,f,g){var h=this;h.foundersManager=e.createFromJson(c.get()),h.founders=h.foundersManager.founders,h.tableHelpInfo=d.get();var i=!0;a.$watch(function(){return JSON.stringify(h.founders.markerColumn)+JSON.stringify(h.foundersManager.selectedItems)+JSON.stringify(h.foundersManager.filterStates)+JSON.stringify(h.foundersManager.sortStates)},function(){return i?void(i=!1):void c.set(h.foundersManager.toJson()).save()}),a.$watch(function(){return h.tableHelpInfo},function(){d.set(h.tableHelpInfo).save()}),h.loadData=function(){b.go(f["foundersMapQuestApp.loadData"].routes["load-data"],{founders:h.founders})},h.mapHooks={},h.viewOnMap=function(a){h.mapHooks.openMarker(a),g("fmq-map")}}]),angular.module("foundersMapQuestApp.loadData",["foundersMapQuestApp.constants","foundersMapQuestApp.foundersManager","ui.bootstrap","ui.router"]).value("FileReader","undefined"!=typeof window.FileReader?window.FileReader:!1).config(["$stateProvider","FMQ_MODULE_SETTINGS",function(a,b){var c,d=b["foundersMapQuestApp.loadData"];a.state(d.routes["load-data"],{url:"/load-data",params:{founders:null},onEnter:["$stateParams","$state","$uibModal","FMQ_ANIMATE","FileReader","FoundersFactory",function(a,b,e,f,g,h){c=e.open({animation:f,templateUrl:d.moduleLocation+"load-data.html",controller:"LoadDataCtrl",controllerAs:"vm",backdrop:"static",resolve:{founders:function(){var b=a.founders;return null!==b?(b=h.clone(b),b.setDefaultMarkerColumn()):b=h.create(),b},supportsFileReader:function(){return g!==!1}}}),c.result.then(function(a){b.go("^",{founders:a},{reload:!0})},function(){b.go("^")})}],onExit:function(){c.close()}})}]),angular.module("foundersMapQuestApp.loadData").controller("LoadDataCtrl",["$scope","$uibModalInstance","founders","supportsFileReader","Csv","Founders",function(a,b,c,d,e,f){var g=this;g.founders=c,g.supportsFileReader=d,g.delimiters=f.delimiters,g.form={raw:c.encodeToRaw(),delimiter:c.delimiter,latitudeColumn:c.latitudeColumn,longitudeColumn:c.longitudeColumn};var h=function(){g.founders.autoSetCoordinateColumns(),g.form.latitudeColumn=g.founders.latitudeColumn,g.form.longitudeColumn=g.founders.longitudeColumn};h(),g.applyRawData=function(a){var b=g.founders.header,c=e.parse(g.form.raw,a);g.founders.header=c.header,g.founders.items=c.items,g.founders.delimiter=c.delimiter,g.form.delimiter=g.founders.delimiter;var d=JSON.stringify(b)===JSON.stringify(g.founders.header);d||h()},g.coordinateSelected=function(){g.founders.latitudeColumn=g.form.latitudeColumn,g.founders.longitudeColumn=g.form.longitudeColumn},a.$watch(function(){return null!==g.founders.items&&null!==g.form.latitudeColumn&&null!==g.form.longitudeColumn&&g.form.latitudeColumn!==g.form.longitudeColumn},function(a){g.formValid=a}),g.ok=function(){b.close(g.founders)},g.cancel=function(){b.dismiss("cancel")},g.supportsFileReader=d,d&&a.$watch(function(){return g.fileText},function(a){a&&(g.form.raw=g.fileText,g.applyRawData(),g.fileText="")})}]),angular.module("foundersMapQuestApp.loadData").directive("fmqFileReader",["FMQ_MODULE_SETTINGS","FileReader",function(a,b){var c=a["foundersMapQuestApp.loadData"];return{restrict:"EA",scope:{text:"=",reset:"="},link:function(a,c){if(b!==!1){var d=c.find("input");d.bind("change",function(c){a.$evalAsync(function(){var e=new b;e.onload=function(b){a.$evalAsync(function(){a.text=b.target.result,a.reset&&d.val("")})},e.readAsText(c.target.files[0])})}),d.bind("click",function(a){a.stopPropagation()}),c.bind("click",function(a){a.preventDefault(),d[0].click()})}},templateUrl:c.moduleLocation+"fmq-file-reader.html",replace:!0,transclude:!0}}]),angular.module("foundersMapQuestApp.showImage",["foundersMapQuestApp.constants","ui.bootstrap","ui.router"]).config(["$stateProvider","FMQ_MODULE_SETTINGS",function(a,b){var c,d=b["foundersMapQuestApp.showImage"];a.state(d.routes["show-image"],{url:"/show-image",params:{image:null},onEnter:["$stateParams","$state","$uibModal","FMQ_ANIMATE",function(a,b,e,f){c=e.open({animation:f,templateUrl:d.moduleLocation+"show-image.html",controller:"ShowImageCtrl",controllerAs:"vm",backdrop:"static",resolve:{image:function(){return a.image}}}),c.result["finally"](function(){b.go("^")})}],onExit:function(){c.close()}})}]),angular.module("foundersMapQuestApp.showImage").controller("ShowImageCtrl",["$uibModalInstance","image",function(a,b){var c=this;null===b&&a.opened.then(function(){a.close()}),c.image=b,c.ok=function(){a.close()}}]),angular.module("foundersMapQuestApp.showImage").directive("fmqShowImage",["$state","FMQ_MODULE_SETTINGS",function(a,b){return{scope:{fmqShowImage:"@"},restrict:"EA",link:function(c,d){d.on("click",c.fmqShowImage,function(c){c.preventDefault();var d=c.currentTarget.href;a.go(b["foundersMapQuestApp.showImage"].routes["show-image"],{image:d})})}}}]),angular.module("foundersMapQuestApp.map",["foundersMapQuestApp.constants","foundersMapQuestApp.foundersManager","foundersMapQuestApp.visualize"]),angular.module("foundersMapQuestApp.map").directive("fmqMap",["FMQ_MODULE_SETTINGS",function(a){var b=a["foundersMapQuestApp.map"];return{scope:{foundersManager:"=",hooks:"="},templateUrl:b.moduleLocation+"fmq-map.html",restrict:"EA",controllerAs:"vm",bindToController:!0,controller:["$scope",function(a){var c=this,d=c.foundersManager.founders;c.markers=[],c.markerTemplateUrl=b.moduleLocation+"marker.html",c.center={latitude:0,longitude:0},c.zoom=4,c.markersEvents={click:function(a,b,d){c.showMarkerWindow(d)}},c.showMarkerWindow=function(a){c.markerWindow.model=a,c.markerWindow.show=!0},c.closeMarkerWindow=function(){c.markerWindow.show=!1},c.markerWindow={model:null,show:!1};var e=function(){var a=[];d.items.forEach(function(b,e){if(c.foundersManager.isSelected(b)&&c.foundersManager.passesFilter(b)){if(isNaN(b[d.latitudeColumn])||isNaN(b[d.longitudeColumn]))return!0;a.push({id:e,item:b,coords:{latitude:b[d.latitudeColumn],longitude:b[d.longitudeColumn]},content:b[d.markerColumn],type:d.getMarkerContentType(b)})}}),c.markers=a};e();var f=!0;a.$watch(function(){return JSON.stringify(c.foundersManager.selectedItems)+JSON.stringify(c.foundersManager.filterStates)+JSON.stringify(c.foundersManager.founders.markerColumn)},function(){return f?void(f=!1):(c.closeMarkerWindow(),void e())}),c.hooks=c.hooks||{},c.hooks.openMarker=function(a){var b=null;c.markers.forEach(function(c){null===b&&c.item===a&&(b=c)}),null!==b?c.showMarkerWindow(b):c.closeMarkerWindow()}}]}}]),angular.module("foundersMapQuestApp.table",["foundersMapQuestApp.constants","foundersMapQuestApp.foundersManager","foundersMapQuestApp.columnSorter","foundersMapQuestApp.visualize"]),angular.module("foundersMapQuestApp.table").directive("fmqTable",["FMQ_MODULE_SETTINGS",function(a){var b=a["foundersMapQuestApp.table"];return{scope:{foundersManager:"=",viewItem:"&"},templateUrl:b.moduleLocation+"fmq-table.html",restrict:"EA",replace:!0,controllerAs:"vm",bindToController:!0,controller:["$scope",function(a){var b=this;b.founders=b.foundersManager.founders,b.chooseAsMarker=function(a){b.founders.chooseAsMarker(a)},b.isMarker=function(a){return b.founders.isMarker(a)},b.isSelected=function(a){return b.foundersManager.isSelected(a)},b.toggleAllSelection=function(){b.foundersManager.toggleAllSelection(),b.allSelected=b.foundersManager.allSelected()},b.toggleSelection=function(a){b.foundersManager.toggleSelection(a),b.allSelected=b.foundersManager.allSelected()},a.$watch(function(){return JSON.stringify(b.foundersManager.selectedItems)},function(){b.allSelected=b.foundersManager.allSelected()}),b.setFilter=function(a,c){b.foundersManager.setFilter(a,c)},b.resetFilters=function(){b.foundersManager.resetFilters()},b.passesFilter=function(a){return b.foundersManager.passesFilter(a)},a.$watch(function(){return JSON.stringify(b.foundersManager.filterStates)},function(){b.filterStates=b.founders.header.map(function(a){return b.foundersManager.getFilter(a)})}),b.getSort=function(a){b.foundersManager.getSort(a)},b.applySort=function(a,c){b.foundersManager.applySort(a,c)},b.resetSorts=function(){b.foundersManager.resetSorts()},a.$watch(function(){return JSON.stringify(b.foundersManager.sortStates)},function(){b.sortStates=b.founders.header.map(function(a){return b.foundersManager.getSort(a)}),b.sortConfig=b.foundersManager.getSortConfig()})}]}}]),angular.module("foundersMapQuestApp.visualize",["foundersMapQuestApp.constants"]),angular.module("foundersMapQuestApp.visualize").directive("fmqVisualize",["FMQ_MODULE_SETTINGS",function(a){var b=a["foundersMapQuestApp.visualize"];return{scope:{data:"@",type:"@"},templateUrl:b.moduleLocation+"fmq-visualize.html",controller:function(){},controllerAs:"vm",bindToController:!0,restrict:"EA",replace:!0}}]),angular.module("foundersMapQuestApp.visualize").filter("decimal2dms",function(){return function(a,b){var c=0,d=0,e=0,f="X";if(isNaN(a)||Math.abs(a)>180)return"";f=b&&0>a?"S":!b&&0>a?"W":b?"N":"E";var g=Math.abs(a);return c=Math.floor(g),e=3600*(g-c),d=Math.floor(e/60),e=Math.floor(e-60*d),d=10>d?"0"+d:d,e=10>e?"0"+e:e,c+"° "+d+"′ "+e+"″ "+f}}),angular.module("foundersMapQuestApp.about",["foundersMapQuestApp.constants","ui.router"]).config(["$stateProvider","FMQ_MODULE_SETTINGS",function(a,b){var c=b["foundersMapQuestApp.about"];a.state(c.routes.about,{url:"/about",params:{label:"About"},views:{"main@":{templateUrl:c.moduleLocation+"about.html"}}})}]),angular.module("foundersMapQuestApp.error",["foundersMapQuestApp.constants","ui.router"]).config(["$stateProvider","$urlRouterProvider","FMQ_MODULE_SETTINGS",function(a,b,c){var d=c["foundersMapQuestApp.error"],e=d.routes["not-found"];b.otherwise(function(a){a.invoke(["$state",function(a){a.go(e)}])}),a.state(e,{views:{main:{templateUrl:d.moduleLocation+"404.html"}}})}]),angular.module("foundersMapQuestApp").run(["$templateCache",function(a){a.put("components/about/about.html",'<div class="fmq-about-page"> <div class="jumbotron"> <h1>Founders Quest Map</h1> <p class="lead"> This page presents solution of <a href="http://trycatch.us/"><strong>Try Catch</strong></a> challenge. </p> <p>It was developed by <a href="https://milosz.ch/">Miłosz Chmura</a></p> <h2>Development Details</h2> <ul> <li><a href="https://github.com/renobit/vagrant-node-env">Vagrant/Virtualbox</a> machine</li> <li><strike>Yeoman\'s <a href="https://github.com/yeoman/generator-angular">AngularJS generator</a></strike>Modular project structure</li> <li><a href="https://atom.io/">Atom.io</a> editor</li> <li>Trello <a href="https://trello.com/b/0NsrOTRq/founder-s-map-quest">board</a></li> <li>Git <a href="https://github.com/mieszko4/founders-map-quest">repository</a></li> </ul> </div> <div></div></div>'),a.put("components/column-sorter/fmq-column-sorter.html",'<a class="column-sorter" ng-click="vm.changeSortState()"> <span ng-show="vm.state == vm.SortStates.NONE" class="glyphicon glyphicon-sort" uib-tooltip="Not sorted"></span> <span ng-show="vm.state == vm.SortStates.ASC" class="glyphicon glyphicon glyphicon-sort-by-attributes" uib-tooltip="Sorted ascending"></span> <span ng-show="vm.state == vm.SortStates.DESC" class="glyphicon glyphicon-sort-by-attributes-alt" uib-tooltip="Sorted descending"></span> </a>'),a.put("components/dashboard/dashboard.html",'<div class="fmq-dashboard-page" fmq-show-image="a.show-image"> <div class="container" ng-class="{\'data-loaded\': vm.founders.header.length > 0}"> <button class="btn btn-primary btn-load-data" ng-click="vm.loadData()"> <span ng-show="vm.founders.header.length == 0">Load data</span> <span ng-show="vm.founders.header.length > 0">Load data again</span> </button> </div> <div class="container table-container" ng-show="vm.founders.header.length > 0"> <h2>Table</h2> <div uib-alert type="info" ng-show="vm.tableHelpInfo" close="vm.tableHelpInfo = false"> Choose a star in order to select column for marker labels. </div> <div class="table-wrapper"> <table ng-if="vm.founders.header.length > 0" fmq-table founders-manager="vm.foundersManager" view-item="vm.viewOnMap(item)"></table> </div> </div> <div class="container map-container" ng-if="vm.founders.header.length > 0" id="fmq-map"> <h2>Map</h2> <div fmq-map founders-manager="vm.foundersManager" selected-items="vm.selectedItems" hooks="vm.mapHooks"></div> </div> <div></div></div>'),a.put("components/dashboard/load-data/fmq-file-reader.html",'<button type="button"> <ng-transclude></ng-transclude> <input type="file" style="display:none"> </button>'),a.put("components/dashboard/load-data/load-data.html",'<div class="fmq-load-data-page"> <form ng-submit="vm.ok()"> <div class="modal-header"> <h3 class="modal-title">Load Founders</h3> </div> <div class="modal-body"> <ol> <li> <p ng-show="vm.supportsFileReader"> <fmq-file-reader class="btn btn-primary" text="vm.fileText" reset="true"> Choose File </fmq-file-reader> <span>or paste your data below directly:</span> </p> <p ng-if="!vm.supportsFileReader"> Paste your data below: </p> <div class="form-group"> <textarea class="form-control" rows="5" ng-model="vm.form.raw" ng-change="vm.applyRawData();"></textarea> </div> </li> <li> <p>Choose delimiter:</p> <label class="checkbox-inline" ng-repeat="item in vm.delimiters"> <input type="radio" ng-model="vm.form.delimiter" name="delimiter" ng-value="item.delimiter" ng-change="vm.applyRawData(item.delimiter)"> {{item.label}} </label> </li> <li> <p>Choose latitude and longitude columns:</p> <div class="form-group"> <label for="fmq-load-data-latitudeColumn">Latitude:</label> <select class="form-control" name="latitudeColumn" id="fmq-load-data-latitudeColumn" ng-model="vm.form.latitudeColumn" ng-options="idx*1 as column.name for (idx, column) in vm.founders.header" ng-change="vm.coordinateSelected()"> <option></option> </select> </div> <div class="form-group"> <label for="fmq-load-data-longitudeColumn">Longitude:</label> <select class="form-control" name="longitudeColumn" id="fmq-load-data-longitudeColumn" ng-model="vm.form.longitudeColumn" ng-options="idx*1 as column.name for (idx, column) in vm.founders.header" ng-change="vm.coordinateSelected()"> <option></option> </select> </div> </li> </ol> </div> <div class="modal-footer"> <button class="btn btn-primary" ng-disabled="!vm.formValid" type="submit">Load</button> <button class="btn btn-warning" type="button" ng-click="vm.cancel()">Cancel</button> </div> </form> </div>'),a.put("components/dashboard/map/fmq-map.html",'<div ui-gmap-google-map center="vm.center" zoom="vm.zoom" options="{scrollwheel: false}"> <div ui-gmap-window show="vm.markerWindow.show" coords="vm.markerWindow.model.coords" closeclick="vm.closeMarkerWindow()" templateurl="vm.markerTemplateUrl" templateparameter="vm.markerWindow"></div> <div ui-gmap-markers models="vm.markers" coords="\'coords\'" events="vm.markersEvents" dorebuildall="true" fit="true"></div> </div>'),a.put("components/dashboard/map/marker.html",'<div class="gm-pro-popup"> <fmq-visualize data="{{parameter.model.content}}" type="{{parameter.model.type}}"></fmq-visualize> </div>'),a.put("components/dashboard/show-image/show-image.html",'<div class="fmq-show-image-page"> <div class="modal-header"> <h3 class="modal-title">Image preview</h3> </div> <div class="modal-body"> <img ng-src="{{vm.image}}" alt=""> </div> <div class="modal-footer"> <button class="btn btn-primary" ng-click="vm.ok()">Close</button> </div> </div>'),a.put("components/dashboard/table/fmq-table.html",'<table class="fmq-table table table-striped"> <thead> <tr> <th> <a class="all-items-selector" ng-click="vm.toggleAllSelection()"> <span ng-show="!vm.allSelected" class="glyphicon glyphicon-unchecked" uib-tooltip="Display all on map"></span> <span ng-show="vm.allSelected" class="glyphicon glyphicon-check" uib-tooltip="Display none on map"></span> </a> </th> <th ng-repeat="column in vm.founders.header"> <a class="marker-column-chooser active" ng-show="vm.isMarker(column)"> <span class="glyphicon glyphicon-map-marker" uib-tooltip="This column is used as description for markers"></span> </a> <a class="marker-column-chooser" ng-show="!vm.isMarker(column)" ng-click="vm.chooseAsMarker(column)"> <span class="glyphicon glyphicon-map-marker" uib-tooltip="Choose this column as description for markers"></span> </a> <span class="column-label" ng-click="vm.chooseAsMarker(column)">{{column.name}}</span> </th> </tr> <tr> <th> <a class="filters-sorts-reset" ng-click="vm.resetFilters(); vm.resetSorts()"> <span class="glyphicon glyphicon-trash" uib-tooltip="Clear all filters and sorting"></span> </a> </th> <th ng-repeat="column in vm.founders.header"> <div class="column-filter-and-sorter"> <form ng-submit="void"> <input type="text" ng-model="vm.filterStates[$index]" ng-change="vm.setFilter(column, vm.filterStates[$index])" placeholder="Filter"> </form> <fmq-column-sorter state="vm.sortStates[$index]" change="vm.applySort(column, state)"></fmq-column-sorter> </div> </th> </tr> </thead> <tbody> <tr ng-repeat="item in filtered = (vm.founders.items | orderBy:vm.sortConfig.predicate:vm.sortConfig.reverse | filter:vm.passesFilter)" ng-class="{selected: vm.isSelected(item)}"> <td> <a class="item-selector" ng-click="vm.toggleSelection(item)"> <span ng-show="!vm.isSelected(item)" class="glyphicon glyphicon-unchecked" uib-tooltip="Display on map"></span> <span ng-show="vm.isSelected(item)" class="glyphicon glyphicon-check" uib-tooltip="Do not display on map"></span> </a> </td> <td ng-repeat="value in item"> <span fmq-visualize data="{{value}}" type="{{type = vm.founders.detectType(value, vm.founders.header[$index])}}" ng-class="{\'item-viewer\': type == \'longitude\' || type == \'latitude\'}" ng-click="(type == \'longitude\' || type == \'latitude\') && vm.viewItem( {item: item})"></span> </td> </tr> <tr ng-if="filtered.length == 0"> <td colspan="{{vm.founders.header.length + 2}}" class="alert alert-info"> <p>No items</p> </td> </tr> </tbody> </table>'),a.put("components/dashboard/visualize/fmq-visualize.html",'<span ng-attr-class="vm.type-{{vm.type || \'unknown\'}}"> <a ng-if="vm.type == \'image\'" class="show-image" ng-href="{{vm.data}}"> <img ng-src="{{vm.data}}" alt=""> </a> <a ng-if="vm.type == \'link\'" target="_blank" ng-href="{{vm.data}}"> {{vm.data}} </a> <span ng-if="vm.type == \'latitude\' || vm.type == \'longitude\'" uib-tooltip="View on map"> <span class="glyphicon glyphicon-map-marker"></span> <span>{{vm.data | decimal2dms:(vm.type == \'latitude\')}}</span> </span> <span ng-if="!vm.type"> {{vm.data}} </span> </span>'),a.put("components/error/404.html",'<div class="fmq-error-page"> <div class="jumbotron"> <h2> <span class="error-number">404</span> <span class="error-description">Page not found</span> </h2> <p><a ui-sref="root">Back to homepage</a></p> </div> </div>'),a.put("components/navigation/fmq-navigation.html",'<ul class="nav navbar-nav"> <li ng-repeat="item in vm.items" ng-class="{active: vm.currentName == item.name}"> <a ui-sref="{{item.name}}">{{item.label}}</a> </li> </ul>')}]);