(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e45d3794"],{"20d8":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",[n("el-button",{attrs:{disabled:!e.power,type:"primary",icon:"el-icon-plus"},on:{click:function(t){return e.jump()}}},[e._v("\n                添加部门\n            ")])],1)])},i=[],r=(n("a481"),{name:"DepAdd",data:function(){return{power:1!==JSON.parse(window.sessionStorage.getItem("user")).status}},methods:{jump:function(){this.$router.replace("/dep/basic")}}}),s=r,o=n("2877"),d=Object(o["a"])(s,a,i,!1,null,"54693813",null);t["default"]=d.exports},"416a":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-tabs",{staticStyle:{"min-width":"400px"},attrs:{type:"card"},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[n("el-tab-pane",{attrs:{label:"部门管理",name:"depmana"}},[n("DepMana")],1)],1)],1)},i=[],r=n("e6e3"),s={name:"DepBasic",data:function(){return{activeName:"depmana"}},components:{DepMana:r["a"]}},o=s,d=n("2877"),l=Object(d["a"])(o,a,i,!1,null,"24b86d64",null);t["default"]=l.exports},"69f6":function(e,t,n){"use strict";var a=n("ed24"),i=n.n(a);i.a},"8da0":function(e,t,n){var a={"./DepAdd.vue":"20d8","./DepBasic.vue":"416a"};function i(e){var t=r(e);return n(t)}function r(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}i.keys=function(){return Object.keys(a)},i.resolve=r,e.exports=i,i.id="8da0"},e6e3:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{width:"30%","min-width":"350px"}},[n("el-input",{attrs:{placeholder:"请输入部门名称进行搜索...","prefix-icon":"el-icon-search"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),n("el-tree",{ref:"tree",staticStyle:{"margin-top":"20px"},attrs:{data:e.deps,props:e.defaultProps,"expand-on-click-node":!1,"filter-node-method":e.filterNode},scopedSlots:e._u([{key:"default",fn:function(t){t.node;var a=t.data;return n("span",{staticClass:"custom-tree-node",staticStyle:{display:"flex","justify-content":"space-between",width:"100%"},attrs:{title:a.remark}},[n("span",{staticStyle:{"font-size":"20px"}},[e._v(e._s(a.name))]),n("span",[n("el-button",{staticClass:"depBtn",attrs:{type:"primary",size:"mini",disabled:!e.power},on:{click:function(){return e.addDep(a)}}},[e._v("\n                    添加部门\n                ")]),n("el-button",{staticClass:"depBtn",attrs:{type:"danger",size:"mini",disabled:!e.power},on:{click:function(){return e.deleteDep(a)}}},[e._v("\n                    删除部门\n                ")])],1)])}}])}),n("el-dialog",{attrs:{title:"添加部门",visible:e.dialogVisible,width:"360px"},on:{"update:visible":function(t){e.dialogVisible=t}}},[n("div",[n("table",[n("tr",[n("td",[n("el-tag",[e._v("上级部门")])],1),n("td",[e._v(e._s(e.pname))])]),n("tr",[n("td",[n("el-tag",[e._v("部门名称")])],1),n("td",[n("el-input",{attrs:{placeholder:"请输入部门名称..."},model:{value:e.dep.name,callback:function(t){e.$set(e.dep,"name",t)},expression:"dep.name"}})],1)]),n("tr",[n("td",[n("el-tag",[e._v("部门描述")])],1),n("td",[n("el-input",{attrs:{placeholder:"请输入部门描述..."},model:{value:e.dep.remark,callback:function(t){e.$set(e.dep,"remark",t)},expression:"dep.remark"}})],1)])])]),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.doAddDep}},[e._v("确 定")])],1)])],1)},i=[],r=(n("a481"),n("7f7f"),{name:"DepMana",data:function(){return{dialogVisible:!1,filterText:"",dep:{name:"",parentId:-1,remark:""},pname:"",deps:[],defaultProps:{children:"children",label:"name"},power:1!=JSON.parse(window.sessionStorage.getItem("user")).status}},watch:{filterText:function(e){this.$refs.tree.filter(e)}},mounted:function(){this.initDeps()},methods:{initDep:function(){this.dep={name:"",parentId:-1},this.pname=""},addDep2Deps:function(e,t){for(var n=0;n<e.length;n++){var a=e[n];if(a.id==t.parentId)return a.children=a.children.concat(t),void(a.children.length>0&&(a.parent=!0));this.addDep2Deps(a.children,t)}},doAddDep:function(){var e=this;if(""==this.dep.name||""==this.dep.remark)return this.$message.error("请输入部门名称及描述！");this.postRequest("/department/basic/",this.dep).then((function(t){20000402===t.status?e.$router.replace("/"):200===t.status&&(e.addDep2Deps(e.deps,t.obj),e.dialogVisible=!1,e.initDep(),window.sessionStorage.removeItem("department"))}))},removeDepFromDeps:function(e,t,n){for(var a=0;a<t.length;a++){var i=t[a];if(i.id==n)return t.splice(a,1),void(0==t.length&&(e.parent=!1));this.removeDepFromDeps(i,i.children,n)}},deleteDep:function(e){var t=this;e.parent?this.$message.error("父部门删除失败"):this.$confirm("此操作将永久删除【"+e.name+"】部门, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){e.id&&e.name&&t.deleteRequest("/department/basic/",e).then((function(n){20000402===n.status?t.$router.replace("/"):200===n.status&&(t.removeDepFromDeps(null,t.deps,e.id),window.sessionStorage.removeItem("department"))}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))},addDep:function(e){this.pname=e.name,this.dep.parentId=e.id,this.dep,this.dialogVisible=!0},initDeps:function(){var e=this;this.getRequest("/department/basic/").then((function(t){20000402===t.status?e.$router.replace("/"):200===t.status&&(e.deps=t.obj)}))},filterNode:function(e,t){return!e||-1!==t.name.indexOf(e)}}}),s=r,o=(n("69f6"),n("2877")),d=Object(o["a"])(s,a,i,!1,null,null,null);t["a"]=d.exports},ed24:function(e,t,n){}}]);
//# sourceMappingURL=chunk-e45d3794.a5efe008.js.map