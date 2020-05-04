<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input placeholder="请输入用户名进行搜索，可以直接回车搜索..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initUsers"
                              style="width: 380px;margin-right: 10px" v-model="searchValue.username"
                              @keydown.enter.native="initUsers" :disabled="showAdvanceSearchView"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initUsers" :disabled="showAdvanceSearchView">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="cleanSearchValues()">
                        <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                           aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <!-- <el-upload
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :disabled="importDataDisabled"
                            style="display: inline-flex;margin-right: 8px"
                            action="/user/basic/import">
                        <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" @click="exportData" icon="el-icon-download">
                        导出数据
                    </el-button> -->
                    <el-button :disabled="!(power === 1 ? false : true)" type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加用户
                    </el-button>
                </div>
            </div>
            <transition name="slide-fade">
                <div v-show="showAdvanceSearchView"
                     style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
                    <el-row>
                        <!-- <el-col :span="5" style="margin: 10px">
                            用户账号:
                            <el-select v-model="searchValue.loginname" placeholder="用户账号" size="mini"
                                       style="width: 250px;">
                                &ensp;查找：<el-input v-model="searchValue.loginname" placeholder="输入需查找用户账号" size="mini" style="width: 180px" />
                                <el-option
                                        v-for = "user in users"
                                        :key = "user.id"
                                        :label = "user.loginname"
                                        :value = "user.loginname">
                                </el-option>
                            </el-select>
                        </el-col> -->
                        <el-col :span="4" style="margin: 10px">
                            用户状态:
                            <el-select v-model="searchValue.status" placeholder="用户状态" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for = "user in userStatus"
                                        :key = "user"
                                        :label = "user == '' ? '' : user == '1' ? '普通用户' : '超级管理员'"
                                        :value = "user">
                                </el-option>
                            </el-select>
                        </el-col>
                        
                        <el-col :span="5" :offset="1" style="margin: 10px">
                            <el-button type="primary" @click="cleanSearchValues()">
                                <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                                aria-hidden="true"></i>
                                取消
                            </el-button>
                            <el-button size="mini" icon="el-icon-search" type="primary" @click="initUsers('advanced')">搜索</el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="users"
                    :model="power" 
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
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
                        prop="username"
                        align="left"
                        label="用户名"
                        width="125">
                </el-table-column>
                <el-table-column
                        prop="loginname"
                        label="账号"
                        align="left"
                        width="100">
                </el-table-column>
                <!-- <el-table-column
                        prop="password"
                        label="密码"
                        align="left"
                        width="85">
                </el-table-column> -->
                <el-table-column
                        prop="textStatus"
                        label="用户权限"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="createdate"
                        width="100"
                        align="left"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        align="left"
                        label="操作"
                        width="190">
                    <template slot-scope="scope">
                        <el-button :disabled="loginUserId !== scope.row.id || (power === 1 && scope.row.status === 3 && !(power !== 2 && scope.row.status !== 2))" @click="showUpdateUserInfoView(scope.row)" style="padding: 3px; margin-left: 2px" size="mini">编辑信息</el-button>
                        <el-button :disabled="loginUserId !== scope.row.id || (power === 1 && scope.row.status === 3 && !(power !== 2 && scope.row.status !== 2))" @click="showUpdatePasswdView(scope.row)" style="padding: 3px" size="mini" type="primary">修改密码</el-button>
                        <el-button :disabled="loginUserId !== scope.row.id || (power === 1 && scope.row.status === 3 && !(power !== 2 && scope.row.status !== 2))" @click="deleteUser(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
                        <!-- <p v-if="loginUserId !== scope.row.id && (power === 1 || scope.row.status === 3 || (power === 2 && scope.row.status === 2))" style="color: red; text-align: center;">权限不足，无法操作</p> -->
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 新增用户弹窗 -->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="newUser" :rules="rules" ref="newUser">
                    <el-row style="text-align: center">
                        <el-col :span="4">
                            <el-form-item label="用户名:" prop="username">
                                <el-input size="small " maxlength="10" style="width: 150px" prefix-icon="el-icon-edit" v-model="newUser.username"
                                          placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="用户账号:" prop="loginname">
                                <el-input size="small " maxlength="16" style="width: 150px" prefix-icon="el-icon-edit" v-model="newUser.loginname"
                                          placeholder="请输入用户账号" :disabled="isEditUser"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="新密码" prop="password">
                                <el-input type="password" size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="newUser.password"
                                          placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="确认密码:" prop="checkPassword">
                                <el-input type="password" size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="newUser.checkPassword"
                                          placeholder="请确认密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户权限:" prop="status">
                                <el-radio-group v-model="newUser.status">
                                    <el-radio :label="1">普通用户</el-radio>
                                    <el-radio :label="2">超级管理员</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- <p>如果没有选择权限，则默认普通用户！</p> -->
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="resetForm('newUser')" v-if="!isEditUser">重置</el-button>
                <el-button type="primary" @click="doAddUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改信息弹窗 -->
        <el-dialog
                title="修改用户信息"
                :visible.sync="updateDialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>用户昵称：</el-tag>
                        </td>
                        <td>
                            <el-input v-model="updateUser.username"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改密码弹窗 -->
        <el-dialog
                title="修改密码"
                :visible.sync="passwordDialogVisible"
                width="30%">
            <div>
                <el-form :model="ruleForm" status-icon :rules="updatePasswordRules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="输入旧密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="输入新密码" prop="newPassword">
                        <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新确认密码" prop="checkPassword">
                        <el-input type="password" v-model="ruleForm.checkPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitPasswordForm('ruleForm')">提交</el-button>
                        <el-button @click="passwordDialogVisible = false">取消</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserBasic",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPassword !== '') {
                        this.$refs.ruleForm.validateField('checkPassword');
                    }
                    callback();
                }
            };
            var checkPasswordFun = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码!'));
                } else if (value !== this.newUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
                // if (this.newUser.newPassword != null || this.newUser.newPassword != '') {
                //     callback(new Error('密码不能与之前的相同！'));
                // }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var powerFun = (rule, value, callback) => {
                if (value == '1') {
                    callback();
                } else if (value == '2') {
                    callback();
                } else {
                    callback(new Error('请选择该用户权限！'));
                }
                // if (this.newUser.newPassword != null || this.newUser.newPassword != '') {
                //     callback(new Error('密码不能与之前的相同！'));
                // }
            };
            return {
                // 搜索的信息
                searchValue: {
                    username: '', 
                    loginname: '', 
                    status: null
                },
                // 修改密码信息
                ruleForm: {
                    password: '',
                    newPassword: '',
                    checkPassword: ''
                },
                // 添加或修改弹窗的标题
                title: '',
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                importDataDisabled: false,
                showAdvanceSearchView: false,
                // 保存查询出用户的信息
                users: [],
                // user: null,
                updateUser: [],
                // 修改信息弹框
                updateDialogVisible: false,
                // 修改密码弹框
                passwordDialogVisible: false, 

                loading: false,
                popVisible: false,
                popVisible2: false,
                dialogVisible: false,
                isEditUser: false, 
                total: 0,
                page: 1,
                keyword: '',
                size: 10,
                newUser: {
                    id: '', 
                    username: '', 
                    loginname: '', 
                    // 保存用户的密码
                    password: '', 
                    // 修改的新密码
                    checkPassword: '', 
                    // 修改用户信息是验证与之前的密码是否一致
                    newPassword: '', 
                    createdate: '', 
                    status: 1
                },
                // 权限
                // power: JSON.parse(window.sessionStorage.getItem("user")).status === 1 ? false : true, 
                power: JSON.parse(window.sessionStorage.getItem("user")).status, 
                // 登录用户的id
                loginUserId: JSON.parse(window.sessionStorage.getItem("user")).id, 
                userStatus: [
                    "", 
                    "1", 
                    "2"
                ], 
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                
                rules: {
                    username: [{required: true, message: '请输入用户名！', trigger: 'blur'}, {
                        pattern: /[^\~\!\@\#\$\%\^\&\*\(\)\_\+\=\{\}\[\]\<\>\?\/\\\！\￥\……\…\（\）\——\—\【\】\、\《\》\？\;\|\'\"\；\‘\’\”\“]{5,16}$/g, 
                        message: '用户名由任意字符组成5-16位(特殊字符除外)！', 
                        trigger: 'blur'
                    }], 
                    loginname: [{required: true, message: '请输入用户账号！', trigger: 'blur'}, {
                        pattern: /^[0-9A-Za-z]{5,16}$/g, 
                        // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g, 
                        message: '用户名由字母或数字组成5-16位！', 
                        trigger: 'blur'
                    }],
                    password: [{required: true, message: '请输入密码！', trigger: 'blur'}, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g, 
                        message: '密码由字母数字组成6-16位！', 
                        trigger: 'blur'
                    }],
                    checkPassword: [
                        { validator: checkPasswordFun, trigger: 'blur' }
                    ], 
                    status: [
                        { validator: powerFun, trigger: 'blur' }
                    ]

                    // [{required: true, message: '请确认密码', trigger: 'blur'}]
                }, 
                updatePasswordRules: {
                    password: [{required: true, message: '请输入密码！', trigger: 'blur'}, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g, 
                        message: '旧密码由字母数字组成6-16位！', 
                        trigger: 'blur'
                    }],
                    newPassword: [{required: true, message: '请输入新密码！', trigger: 'blur'}, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g, 
                        message: '新密码由字母数字组成6-16位！', 
                        trigger: 'blur'
                    }],
                    checkPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.initUsers();
        },
        methods: {
            // 清除搜索的信息
            cleanSearchValues() {
                this.searchValue.username = null;
                this.searchValue.loginname = null;
                this.searchValue.status = null;
                this.showAdvanceSearchView = !this.showAdvanceSearchView;
            }, 
            // 添加用户是重置输入框
             resetForm(formName) {
                this.emptyUser();
                this.$refs[formName].resetFields();
            },
            // 显示修改用户信息弹框 
            showUpdateUserInfoView(data) {
                this.updateDialogVisible = true;
                this.updateUser = Object.assign({}, data);
                // this.updateUser.id = data.id;
                // this.updateUser.username = data.username;
            },
            // 显示修改密码弹框
            showUpdatePasswdView(data) {
                this.passwordDialogVisible = true;
                this.ruleForm = Object.assign({}, data);
                // this.ruleForm.id = data.id;
                // this.ruleForm.loginname = data.loginname;

            },
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.name;
                this.searchValue.departmentId = data.id;
                this.popVisible2 = !this.popVisible2
            },
            onError(err, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess(response, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
                this.initUsers();
            },
            beforeUpload() {
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            exportData() {
                window.open('/employee/basic/export', '_parent');
            },
            emptyUser() {
                this.newUser = {
                    username: '', 
                    loginname: '', 
                    password: '', 
                    checkPassword: '', 
                    newPassword: '', 
                    status: ''
                }
            },
            showEditEmpView(data) {
                this.title = '编辑用户信息';
                // 验证修改的密码是否与之前的密码相同，不过用户万一不想改密码呢。。
                // this.newUser.newPassword = data.password;
                // 不允许编辑用户名
                this.isEditUser = true;

                // 数据回显
                this.newUser.id = data.id;
                this.newUser.username = data.username;
                this.newUser.loginname = data.loginname;
                this.newUser.password = data.password;
                this.newUser.checkPassword = data.password;
                this.newUser.createdate = data.createdate;
                this.newUser.status = data.status;
                // alert(JSON.stringify(this.newUser));

                this.dialogVisible = true;
            },
            deleteUser(data) {
                this.$confirm('此操作将永久删除账号【 ' + data.loginname + ' 】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (data.id && data.loginname) {
                        this.deleteRequest("/user/basic/", data).then(resp => {
                            if (resp.status === 20000402) {
                                // window.sessionStorage.removeItem('user');
                                // window.localStorage.removeItem('token');
                                // 用户没登录，跳转至登录页面
                                this.$router.replace('/');
                            } else if (resp.status === 200) {
                                this.initUsers();
                            }
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 修改密码
            submitPasswordForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.ruleForm.loginname) {
                        // this.ruleForm.id = this.user.id;
                        this.putRequest("/user/basic/", this.ruleForm).then(resp => {
                            if (resp.status === 20000402) {
                                // 用户没登录，跳转至登录页面
                                this.$router.replace('/');
                            } else if (resp.status === 200) {
                                this.getRequest("/user/logout");
                                // 从session移除用户信息
                                window.sessionStorage.removeItem("user")
                                // 从本地移除token
                                window.localStorage.removeItem('token');
                                this.$store.commit('initRoutes', []);
                                this.$router.replace("/");
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 修改昵称
            updateUserInfo() {
                if(this.updateUser.id) {
                    this.putRequest("/user/basic/", this.updateUser).then(resp => {
                        if (resp.status === 20000402) {
                            // 用户没登录，跳转至登录页面
                            this.$router.replace('/');
                        } else if (resp.status === 200) {
                            this.updateDialogVisible = false;
                            // 从session移除用户信息
                            // window.sessionStorage.removeItem("user");
                            this.initUsers();
                        }
                    })
                }
            },
            doAddUser() {
                // 有id表示编辑
                if (this.newUser.id) {
                    this.$refs['newUser'].validate(valid => {
                        // alert(valid);
                        let that = this;
                        if (valid) {
                            this.putRequest("/user/basic/", that.newUser).then(resp => {
                                if (resp.status === 20000402) {
                                    // window.sessionStorage.removeItem('user'); 
                                    // window.localStorage.removeItem('token');
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    that.dialogVisible = false;
                                    that.initUsers();
                                }
                            })
                        }
                    });
                // 无id表示添加
                } else {
                    this.$refs['newUser'].validate(valid => {
                        if (valid) {
                            this.postRequest("/user/basic/", this.newUser).then(resp => {
                                // alert(JSON.stringify(this.newUser));
                                if (resp.status === 20000402) {
                                    // window.sessionStorage.removeItem('user');
                                    // window.localStorage.removeItem('token');
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    this.dialogVisible = false;
                                    this.initUsers();
                                }
                            })
                        }
                    });
                }
            },
            handleNodeClick(data) {
                this.inputDepName = data.name;
                this.emp.departmentId = data.id;
                this.popVisible = !this.popVisible
            },
            showDepView() {
                this.popVisible = !this.popVisible
            },
            showDepView2() {
                this.popVisible2 = !this.popVisible2
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initUsers();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initUsers();
            },
            showAddEmpView() {
                this.emptyUser();
                this.title = '添加用户';
                // 将用户名的框启用
                this.isEditUser = false;
                this.dialogVisible = true;
            },
            initUsers(type) {
                this.loading = true;
                let url = '/user/basic/?page=' + this.page + '&size=' + this.size;
                if (type && type == 'advanced') {
                    if (this.searchValue.username) {
                         url += '&loginname=' + this.searchValue.loginname;
                    }
                    if (this.searchValue.status) {
                         url += '&status=' + this.searchValue.status;
                    }
                } else {
                    url += "&username=" + this.searchValue.username;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp.status === 20000402) {
                        // window.sessionStorage.removeItem('user');
                        // window.localStorage.removeItem('token');
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.users = resp.obj.data;
                        this.total = resp.obj.total;

                        // 将 1 2 3 转为文本意思
                        if(this.users.length != 0) {
                            this.users.forEach(v => {
                                // alert(JSON.stringify(v));
                                v.textStatus = (v.status === 1 ? '普通用户' : v.status === 2 ? '管理员' : v.status === 3 ? '开发者' : '权限异常');
                            });
                        }
                    } else if (resp.status != 200) {
                        this.users = null;
                        this.total = 0;
                    }
                    // alert(JSON.stringify(resp.data));
                    // alert(JSON.stringify(resp.total));
                    // alert(window.localStorage.getItem("token"));
                    // console.log(this.power);
                    // console.log(JSON.parse(window.sessionStorage.getItem("user")) + '<-----用户信息');
                    // console.log(JSON.parse(window.localStorage.getItem("token")) + '<-----token');
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