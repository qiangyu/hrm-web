<template>
    <div style="width: 500px;">
        <el-input
                placeholder="请输入部门名称进行搜索..."
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>

        <el-tree
                :data="deps"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                style="margin-top: 20px">
            <span class="custom-tree-node" style="display: flex; justify-content: space-between; width: 100%;"
                  slot-scope="{ node, data }" :title="data.remark">
                <span style="font-size: 20px;">{{data.name }}</span>
                <span>
                    <el-button
                            type="primary"
                            size="mini"
                            class="depBtn"
                            @click="() => addDep(data)"
                            :disabled="!power">
                        添加部门
                    </el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            class="depBtn"
                            @click="() => deleteDep(data)"
                            :disabled="!power">
                        删除部门
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>{{pname}}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门描述</el-tag>
                        </td>
                        <td>
                            <el-input v-model="dep.remark" placeholder="请输入部门描述..."></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddDep">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                dialogVisible: false,
                filterText: '',
                dep: {
                    name: '',
                    parentId: -1, 
                    remark: ''
                },
                pname: '',
                deps: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }, 
                power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            initDep() {
                this.dep = {
                    name: '',
                    parentId: -1
                }
                this.pname = '';
            },
            addDep2Deps(deps, dep) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id == dep.parentId) {
                        d.children = d.children.concat(dep);
                        if (d.children.length > 0) {
                            d.parent = true;
                        }
                        return;
                    } else {
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            // 添加
            doAddDep() {
                if (this.dep.name == '' || this.dep.remark == '') {
                    return this.$message.error('请输入部门名称及描述！');
                }
                this.postRequest("/department/basic/", this.dep).then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.addDep2Deps(this.deps, resp.obj);
                        this.dialogVisible = false;
                        //初始化变量
                        this.initDep();
                    }
                })
            },
            removeDepFromDeps(p,deps, id) {
                for(let i=0;i<deps.length;i++){
                    let d = deps[i];
                    if (d.id == id) {
                        deps.splice(i, 1);
                        if (deps.length == 0) {
                            p.parent = false;
                        }
                        return;
                    }else{
                        this.removeDepFromDeps(d,d.children, id);
                    }
                }
            },
            deleteDep(data) {
                if (data.parent) {
                    this.$message.error("父部门删除失败");
                } else {
                    this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (data.id && data.name) {
                            this.deleteRequest("/department/basic/", data).then(resp=>{
                                if (resp.status === 20000402) {
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    this.removeDepFromDeps(null,this.deps,data.id);
                                }
                            })
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            addDep(data) {
                this.pname = data.name;
                this.dep.parentId = data.id;
                this.dep
                this.dialogVisible = true;
            },
            initDeps() {
                this.getRequest("/department/basic/").then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.deps = resp.obj;
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
    }
</script>

<style>
    .depBtn {
        padding: 2px;
    }
</style>