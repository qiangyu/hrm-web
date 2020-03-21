<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                        添加用户
                    </el-button>
                </div>
            </div>
        </div>
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
                            <el-form-item label="密码:" prop="password">
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
                            <el-form-item label="用户状态:" prop="status">
                                <el-radio-group v-model="newUser.status">
                                    <el-radio label="1">普通用户</el-radio>
                                    <el-radio label="2">超级管理员</el-radio>
                                </el-radio-group>
                            </el-form-item>
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
    </div>
</template>

<script>
    export default {
        name: "UserAdd",
        data() {
            var checkPasswordFun = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码！'));
                } else if (value !== this.newUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
                // if (this.newUser.newPassword != null || this.newUser.newPassword != '') {
                //     callback(new Error('密码不能与之前的相同！'));
                // }
            };
            var powerFun = (rule, value, callback) => {
                if (value == '1') {
                    callback();
                } else if (value == '2') {
                    callback();
                } else {
                    callback(new Error('请选择该用户权限！'));
                }
            };
            return {
                searchValue: {
                    username: null, 
                    status: null
                },
                title: '',
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                importDataDisabled: false,
                showAdvanceSearchView: false,
                // 保存查询除用户的信息
                users: [],
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
                    status: ''
                },
                power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true, 
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
                        message: '用户名任意字符组成6-16位(特殊字符除外)！', 
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

                }
            }
        },
        mounted() {
            this.initUsers();
        },
        methods: {
            // 添加用户是重置输入框
             resetForm(formName) {
                this.emptyUser();
                this.$refs[formName].resetFields();
            }, 
            searvhViewHandleNodeClick(data) {
                this.inputDepName = data.name;
                this.searchValue.departmentId = data.id;
                this.popVisible2 = !this.popVisible2
            },
            emptyUser() {
                this.newUser = {
                    username: '', 
                    loginname: '', 
                    password: '', 
                    checkPassword: '', 
                    newPassword: '', 
                }
            },
            doAddUser() {
                // 有id表示编辑
                if (this.newUser.id) {
                    // this.$refs['newUser'].validate(valid => {
                    //     // alert(valid);
                    //     let that = this;
                    //     if (valid) {
                    //         this.putRequest("/user/basic/", that.newUser).then(resp => {
                    //             if (resp.status == 200) {
                    //                 that.dialogVisible = false;
                    //                 that.initUsers();
                    //             }
                    //         })
                    //     }
                    // });
                // 无id表示添加
                } else {
                    this.$refs['newUser'].validate(valid => {
                        if (valid) {
                            let that = this;
                            // alert(JSON.stringify(this.newUser));
                            this.postRequest("/user/basic/", that.newUser).then(resp => {
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