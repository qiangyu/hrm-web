<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin: 30px 10px;">
            <div style="border: 2px solid skyblue; padding: 20px; margin: 0 auto; width: 80%;">
                <el-form :model="newUser" :rules="rules" ref="newUser" :disabled="!power">
                    <el-row style="text-align: center;">
                        <el-col :span="4">
                            <el-form-item label="用户名:" prop="username">
                                <el-input size="small " maxlength="10" style="width: 140px" prefix-icon="el-icon-edit" v-model="newUser.username"
                                        placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
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
                        <el-col :span="5">
                            <el-form-item label="确认密码:" prop="checkPassword">
                                <el-input type="password" size="small " maxlength="32" style="width: 150px" prefix-icon="el-icon-edit" v-model="newUser.checkPassword"
                                        placeholder="请确认密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="用户状态:" prop="status">
                                <el-radio-group v-model="newUser.status">
                                    <el-radio label="1">普通用户</el-radio>
                                    <el-radio label="2">管理员</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer" style="margin-top: 30px">
                <el-button :disabled="!power" @click="resetForm('newUser')">重置</el-button>
                <el-button :disabled="!power" type="primary" @click="doAddUser">确 定</el-button>
            </span>
        </div>
        <!-- <p v-if="!power" style="font-size: 20px; color: red;">权限不足，无法操作</p> -->
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
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status === 1 ? false : true, 
                // 保存查询除用户的信息
                users: [],
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
                }
            }
        },
        methods: {
            // 重置添加用户表单
            resetForm(formName) {
                this.emptyUser();
                this.$refs[formName].resetFields();
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
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initUsers();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initUsers();
            },
            doAddUser() {
                // 无id表示添加
                if (!this.newUser.id) {
                    this.$refs['newUser'].validate(valid => {
                        if (valid) {
                            let that = this;
                            this.postRequest("/user/basic/", that.newUser).then(resp => {
                                if (resp.status === 20000402) {
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    // 添加完用户,格式化表单
                                    this.resetForm('newUser');
                                }
                            })
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    
</style>