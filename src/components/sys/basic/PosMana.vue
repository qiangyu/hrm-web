<template>
    <div>
        <div>
            <el-input placeholder="请输入职位名称进行模糊搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                        clearable
                        @clear="initPositions"
                        style="width: 380px;margin-right: 10px" v-model="keyword"
                        @keydown.enter.native="initPositions"></el-input>
            <el-button icon="el-icon-search" type="primary" @click="initPositions">
                搜索
            </el-button>
        </div>
        <div class="posManaMain">
            <el-table
                    :data="positions"
                    border
                    @selection-change="handleSelectionChange"
                    size="small"
                    stripe
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="职位描述"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        width="150"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        width="150"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag size="small" type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)"
                                :disabled="!power">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                                :disabled="!power">删除
                        </el-button>
                        <!-- <p v-if="!power">权限不足，无法操作</p> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px"
                       :disabled="multipleSelection.length == 0 || !power">批量删除
            </el-button>
        </div>
        <el-dialog
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <div>
                    <el-tag>职位名称</el-tag>
                    <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
                </div>
                <div>
                    <el-tag>职位描述</el-tag>
                    <el-input class="updatePosInput" size="small" v-model="updatePos.remark"></el-input>
                </div>
                <div>
                    <el-tag>是否启用</el-tag>
                    <el-switch
                            v-model="updatePos.enabled"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                searchValue: {
                    name: null
                },
                pos: {
                    name: ''
                },
                dialogVisible: false,
                loading: false,
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true, 
                updatePos: {
                    name: '',
                    remark: '', 
                    enabled: false
                },
                // 批量删除
                multipleSelection: [],
                positions: [], 
                // 搜索信息
                keyword: '', 
            }
        },
        mounted() {
            this.initPositions();
        },
        methods: {
            deleteMany() {
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // // let ids = '?';
                    // let ids = []; 
                    // this.multipleSelection.forEach((item, index) => {
                    //     ids[index] = item.id;
                    // })
                    this.deleteRequest("/position/basic/ids/", this.multipleSelection).then(resp => {
                        if (resp.status === 20000402) {
                            // 用户没登录，跳转至登录页面
                            this.$router.replace('/');
                        } else if (resp.status === 200) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showEditView(index, data) {
                Object.assign(this.updatePos, data);
                this.dialogVisible = true;
            },
            doUpdate() {
                if (this.updatePos.name == '' || this.updatePos.remark == '') {
                    return this.$message.error('职位名称以及描述不可以为空！');
                }
                this.putRequest("/position/basic/", this.updatePos).then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.initPositions();
                        this.updatePos.name = '';
                        this.updatePos.remark = '';
                        this.dialogVisible = false;
                    }
                })
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/position/basic/", data).then(resp => {
                        if (resp.status === 20000402) {
                            // 用户没登录，跳转至登录页面
                            this.$router.replace('/');
                        } else if (resp.status === 200) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            initPositions(type) {
                this.loading = true;
                let url = '/position/basic/';
                if (type && type == 'advanced') {
                    if (this.searchValue.name) {
                         url += '?name=' + this.searchValue.name;
                    }
                } else {
                    url += "?name=" + this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.positions = resp.obj;
                    } else if (resp.status != 200) {
                        this.users = null;
                        this.total = 0;
                    }
                });
            }
        }
    }
</script>

<style>
    .addPosInput {
        width: 300px;
        margin-right: 8px
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }

    .posManaMain {
        margin-top: 10px;
    }
</style>