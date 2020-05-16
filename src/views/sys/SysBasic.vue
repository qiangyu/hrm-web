<template>
    <div>
        <div>
            <div style="display: flex; min-width: 530px;">
                <el-input placeholder="请输入文件标题进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                            clearable
                            @clear="initDocuments"
                            style="width: 380px;margin-right: 10px" v-model="searchValue.title"
                            @keydown.enter.native="initDocuments" :disabled="showAdvanceSearchView"></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initDocuments" :disabled="showAdvanceSearchView">
                    搜索
                </el-button>
            </div>
        </div>
        <div style="margin-top: 10px; min-width: 600px;">
            <el-table
                    :data="documents"
                    :model="power" 
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%;">
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="id"
                        align="left"
                        label="id"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="title"
                        align="left"
                        label="文件标题"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="文件描述"
                        align="left"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="fileName"
                        label="文件名称"
                        align="left"
                        width="200">
                </el-table-column>
                <!-- <el-table-column
                        prop="filePath"
                        label="文件路径"
                        align="left"
                        width="150">
                </el-table-column> -->
                <el-table-column
                        prop="fileType"
                        label="文件类型"
                        width="100"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="fileSize"
                        label="文件大小(字节)"
                        width="100"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="100"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="user.loginname"
                        label="上传用户"
                        width="100"
                        align="left">
                </el-table-column>
                <el-table-column
                        align="left"
                        width="150"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button :disabled="!power" @click="showEditDocuView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
                        <el-button :disabled="!power" @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                        <el-button @click="downloadDocument(scope.row)" style="padding: 3px" size="mini">下载</el-button>
                        <!-- <p v-if="!power" style="color: red;">权限不足，无法操作</p> -->
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex; justify-content: flex-end; min-width: 600px;">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="5"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="editDocument" :rules="rules" ref="editDocument">
                    <el-row style="text-align: center">
                        <el-col :span="7">
                            <el-form-item label="标题:" prop="title">
                                <el-input size="small " maxlength="20" style="width: 250px" prefix-icon="el-icon-edit" v-model="editDocument.title"
                                          placeholder="请输入标题"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="文件描述:" prop="remark">
                                <el-input size="small " maxlength="100" style="width: 250px" prefix-icon="el-icon-edit" v-model="editDocument.remark"
                                          placeholder="请输入对文件的描述"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="文件名称:" prop="password">
                                <el-input size="small " maxlength="32" style="width: 200px" prefix-icon="el-icon-edit" v-model="editDocument.fileName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="文件路径:" prop="filePath">
                                <el-input size="small " maxlength="32" style="width: 350px" prefix-icon="el-icon-edit" v-model="editDocument.filePath"
                                :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="文件类型:" prop="fileType">
                                <el-input size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="editDocument.fileType"
                                :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="文件大小:" prop="fileSize">
                                <el-input size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="editDocument.fileSize"
                                :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="上传时间:" prop="createDate">
                                <el-input size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="editDocument.createDate"
                                :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="上传用户:" prop="user.loginname">
                                <el-input size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="editDocument.user.loginname"
                                :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="用户状态:" prop="status">
                                <el-radio-group v-model="newUser.status">
                                    <el-radio :label="1">普通用户</el-radio>
                                    <el-radio :label="2">超级管理员</el-radio>
                                </el-radio-group>
                            </el-form-item> -->
                            <!-- <p>如果没有选择权限，则默认普通用户！</p> -->
                        <!-- </el-col> -->
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddDocument">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SysBasic",
        data() {
            return {
                searchValue: {
                    title: '', 
                },
                title: '',
                showAdvanceSearchView: false,
                // 保存查询出的文件的信息
                documents: [],
                loading: false,
                dialogVisible: false,
                total: 0,
                page: 1,
                keyword: '',
                size: 5,
                editDocument: {
                    id: null,  
                    title: '', 
                    remark:'', 
                    fileName: '', 
                    filePath: '', 
                    fileType: '', 
                    fileSize: '', 
                    isDelete: '', 
                    createDate: '', 
                    userId: '', 
                    user: {
                        id: null, 
                        loginname: ''
                    }
                },
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true, 
                rules: {
                    title: [{required: true, message: '请输入文件标题！', trigger: 'blur'}], 
                    remark: [{required: true, message: '请输入对文件的描述！', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.initDocuments();
        },
        methods: {
            // 清除搜索的信息
            emptyDocument() {
                this.editDocument = {
                    id: null,  
                    title: '', 
                    remark:'', 
                    fileName: '', 
                    filePath: '', 
                    fileType: '', 
                    fileSize: '', 
                    isDelete: '', 
                    createDate: '', 
                    userId: '', 
                    user: {
                        id: null, 
                        loginname: ''
                    }
                }
            },
            // 行数的改变
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initDocuments();
            },
            // 页数的改变
            currentChange(currentPage) {
                this.page = currentPage;
                this.initDocuments();
            },
            // 编辑
            showEditDocuView(data) {
                this.title = '编辑文件信息';
                // 数据回显
                this.editDocument = {...data};
                this.dialogVisible = true;
            }, 
            // 下载
            downloadDocument(data) {
                // alert(JSON.stringify(data));
                // this.getRequest("/document/basic/download/?fileName=" + data.fileName).then(resp => {
                //     if (resp.status === 20000402) {
                //         // 用户没登录，跳转至登录页面
                //         this.$router.replace('/');
                //     } else if (resp.status === 200) {
                //         // that.dialogVisible = false;
                //         // that.initDocuments();
                //     }
                // })
                window.location.href="/document/basic/download/?token=" + window.localStorage.getItem('token') + "&fileName=" + data.fileName;
                // window.opener("/document/basic/download/?fileName=" + data.fileName);
            }, 
            deleteEmp(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/document/basic/", data).then(resp => {
                        if (resp.status === 20000402) {
                            // 用户没登录，跳转至登录页面
                            this.$router.replace('/');
                        } else if (resp.status === 200) {
                            this.initDocuments();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddDocument() {
                // 有id表示编辑
                if (this.editDocument.id) {
                    this.$refs['editDocument'].validate(valid => {
                        let that = this;
                        if (valid) {
                            this.putRequest("/document/basic/", that.editDocument).then(resp => {
                                if (resp.status === 20000402) {
                                    // window.sessionStorage.removeItem('user'); 
                                    // window.localStorage.removeItem('token');
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    that.dialogVisible = false;
                                    that.initDocuments();
                                }
                            })
                        }
                    });
                }
            },
            initDocuments(type) {
                this.loading = true;
                let url = '/document/basic/?page=' + this.page + '&size=' + this.size;
                url += "&title=" + this.searchValue.title;

                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.documents = resp.obj.data;
                        this.total = resp.obj.total;
                    } else if (resp.status != 200) {
                        this.documents = null;
                        this.total = 0;
                    }
                });

            }
        }
    }
</script>

<style>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>