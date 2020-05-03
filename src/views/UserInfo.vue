<template>
    <div v-if="user">
        <el-card class="box-card" style="width: 400px">
            <div slot="header" class="clearfix">
                <span>{{user.loginname}}</span>
            </div>
            <div>
                <div style="display: flex;justify-content: center">
                    <!-- <el-upload
                            :show-file-list="false"
                            :on-success="onSuccess"
                            :data="user"
                            action="/user/userface"> -->
                        <img title="点击修改用户图像" src="64573ce2edc0728.jpg" style="width: 100px;height: 100px;border-radius: 50px"
                             alt="">
                    <!-- </el-upload> -->
                </div>
                <div style="margin-top: 10px">用户昵称：
                    <el-tag>{{user.username}}</el-tag>
                </div>
                <div style="margin-top: 10px">用户账号：
                    <el-tag>{{user.loginname}}</el-tag>
                </div>
                <!-- <div>用户密码：
                    <el-tag>{{user.password}}</el-tag>
                </div> -->
                <div style="margin-top: 10px">用户权限：
                    <el-tag type="success" style="margin-right: 5px">
                        {{user.status === 1 ? '普通用户' : user.status === 2 ? '管理员' : user.status === 3 ? '开发者' : '权限异常'}}
                    </el-tag>
                </div>
                <div style="display: flex;justify-content: space-around; margin-top: 20px">
                    <el-button type="primary" @click="showUpdateUserInfoView">修改信息</el-button>
                    <el-button type="danger" @click="showUpdatePasswdView">修改密码</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog
                title="修改用户信息"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>用户昵称：</el-tag>
                        </td>
                        <td>
                            <el-input v-model="user2.username"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改密码"
                :visible.sync="passwdDialogVisible"
                width="30%">
            <div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="输入旧密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="输入新密码" prop="newPassword">
                        <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="passwdDialogVisible = false">取消</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
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
            return {
                ruleForm: {
                    password: '',
                    newPassword: '',
                    checkPass: ''
                },
                rules: {
                    password: [{required: true, message: '请输入旧密码！', trigger: 'blur'}, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g, 
                        message: '密码由字母数字组成6-16位！', 
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
                    // password: [
                    //     {validator: validatePass, trigger: 'blur'}
                    // ],
                    // newPassword: [
                    //     {validator: validatePass, trigger: 'blur'}
                    // ],
                    // checkPass: [
                    //     {validator: validatePass2, trigger: 'blur'}
                    // ]
                },
                user: null,
                user2: [],
                dialogVisible: false,
                passwdDialogVisible: false
            }
        },
        mounted() {
            this.initHr();
        },
        methods: {
            onSuccess() {
                this.initHr();
            },
            updateUserInfo() {
                // 修改昵称
                this.putRequest("/user/basic/", this.user2).then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.dialogVisible = false;
                        // 从session移除用户信息
                        window.sessionStorage.removeItem("user");
                        this.initHr();
                    }
                })
            },
            showUpdateUserInfoView() {
                this.dialogVisible = true;
            },
            submitForm(formName) {
                // 修改密码
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.id = this.user.id;
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            showUpdatePasswdView() {
                this.passwdDialogVisible = true;
                this.ruleForm = Object.assign({}, this.user);
            },
            initHr() {
                this.getRequest('/user/info/').then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.user = resp.obj;
                        // 将user的值赋值给user2
                        this.user2 = Object.assign({}, this.user);
                        if (!window.sessionStorage.getItem('user')) {
                            window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
                        }
                        this.$store.commit('INIT_CURRENTHR', resp.obj);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>