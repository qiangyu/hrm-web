<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">人力资源管理系统</div>
                <div>
                    <!-- <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000;" size="normal" @click="goChat"></el-button> -->
                    <el-dropdown class="userInfo" @command="commandHandler">
                        <span class="el-dropdown-link">
                            {{user.loginname}}【{{user.status === 1 ? '普通用户' : user.status === 2 ? '管理员' : user.status === 3 ? '开发者' : '权限异常'}}】<i><img src="http://47.96.164.65/blog/pictures/logo.jpg" alt=""></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <!-- <el-dropdown-item command="setting">设置</el-dropdown-item> -->
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <!-- 这里如果不将超出盒子部分隐藏（overflow: hidden;），会出现个问题。。可能是：el-menu-item 标签默认是200px，如果这个盒子小于200px，则会出现滚动条... -->
                <el-aside width="8%" style="height: 600px; margin-top: 10px; min-width: 130px; overflow: hidden;">
                    <el-radio-group v-model="isCollapse" style="margin-left: 10px; margin-bottom: 10px;">
                        <el-radio-button :label="false">展开</el-radio-button>
                        <el-radio-button :label="true">收起</el-radio-button>
                    </el-radio-group>
                    <el-menu router unique-opened :collapse="isCollapse">
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                            <template slot="title">
                                <i style="color: #409eff; margin-right: 5px;" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到人力资源管理系统！
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                // user: JSON.parse(window.sessionStorage.getItem("user"))
                isCollapse: false
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            },
            user() {
                return JSON.parse(window.sessionStorage.getItem("user"));
            }
        },
        methods: {
            goChat() {
                this.$router.push("/chat");
            },
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 移除用户信息
                        window.sessionStorage.removeItem('user');
                        this.getRequest('/user/logout');
                        this.$store.commit('initRoutes', []);
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }else if (cmd == 'userinfo') {
                    this.$router.push('/userinfo');
                }
            }
        }
    }
</script>

<style>
    .homeRouterView {
        margin-top: 10px;
    }

    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #409eff;
        padding-top: 50px;
    }

    .homeHeader {
        background-color: #409eff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
</style>