<template>
    <!-- <div style="display: flex; justify-content: space-between; margin: 30px 10px;"> -->
    <div style="display: flex; margin: 30px 10px;">
        <div style="border: 2px solid skyblue; padding: 20px; width: 20%; min-width: 350px;">

            <el-row style="margin-bottom: 20px;">
                <el-input
                    :disabled="!power"
                    size="small"
                    class="addPosInput"
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    placeholder="填写职位名称..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
                </el-input>
            </el-row>
            
            <el-row style="margin-bottom: 20px;">
                <el-input
                    :disabled="!power"
                    size="small"
                    class="addPosInput"
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    placeholder="填写职位描述..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.remark"
                    style="margin-right: 20px;">
                </el-input>
            </el-row>
            <el-button style="float: right;" icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "PosAdd",
        data() {
            return {
                pos: {
                    name: '', 
                    remark: ''
                },
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true, 
                loading: false,
            }
        },
        methods: {
            // 添加职位
            addPosition() {
                if (this.pos.name == '' || this.pos.remark == '') {
                    return this.$message.error('职位名称以及描述不可以为空！');
                }
                this.postRequest("/position/basic/", this.pos).then(resp => {
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.pos.name = '';
                        this.pos.remark = '';
                        // 删除操作,移除session里面得职位信息,不然缓存的存在会导致在添加或修改员工时依赖的职位信息不能及时的更新
                        window.sessionStorage.removeItem('positions');
                    }
                })
            }
        }
    }
</script>

<style>
    .addPosInput {
        width: 300px;
        margin-right: 30px
    }
</style>