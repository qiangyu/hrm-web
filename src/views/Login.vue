<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                v-loading="loading"
                element-loading-text="正在登录..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="loginname">
                <el-input size="normal" type="text" v-model="loginForm.loginname" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="code">
                <el-input size="normal" type="text" v-model="loginForm.code" auto-complete="off"
                          placeholder="点击图片更换验证码" @keydown.enter.native="submitLogin" style="width: 250px"></el-input>
                <img :src="vcUrl" @click="updateVerifyCode" alt="" style="cursor: pointer">
            </el-form-item> -->
            <el-checkbox size="normal" class="loginRemember" v-model="checked">记住我</el-checkbox>
            <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data() {
            return {
                loading: false,
                vcUrl: '/verifyCode?time='+new Date(),
                loginForm: {
                    loginname: 'admin',
                    password: 'z123456',
                    // code:''
                },
                checked: true,
                rules: {
                    loginname: [{required: true, message: '请输入用户账号！', trigger: 'blur'}, {
                        pattern: /^[0-9A-Za-z]{5,16}$/g, 
                        // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/g, 
                        message: '用户名由字母或数字组成5-16位！', 
                        trigger: 'blur'
                    }],
                    password: [{required: true, message: '请输入密码！', trigger: 'blur'}, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/g, 
                        message: '密码由字母数字组成5-16位！', 
                        trigger: 'blur'
                    }]
                    // code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                }
            }
        },
        methods: {
            // updateVerifyCode() {
            //     this.vcUrl = '/verifyCode?time='+new Date();
            // },
            submitLogin() {
                // 获取用户的信息
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.postKeyValueRequest('/user/doLogin', this.loginForm).then(resp => {
                            this.loading = false;

                            // alert(JSON.stringify(resp));
                            // alert(JSON.stringify(resp.obj.status));
                            // console.log(JSON.stringify(resp));

                            if (resp.status === 20000402) {
                                // 用户没登录，跳转至登录页面
                                this.$router.replace('/');
                            } else if (resp.status === 200) {
                                this.$store.commit('INIT_CURRENTHR', resp.obj);
                                // 设置用户信息到session
                                window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
                                // 将token保存在本地
                                window.localStorage.setItem('token', resp.obj.token);
                                let path = this.$route.query.redirect;
                                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                            }
                            // else{
                            //     this.vcUrl = '/verifyCode?time='+new Date();
                            // }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
    .el-form-item__content{
        display: flex;
        align-items: center;
    }
</style>