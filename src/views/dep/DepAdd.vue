<template>
    <div>
        <div v-if="power">
            <el-button type="primary" icon="el-icon-plus" @click="jump()">
                    添加部门
                </el-button>
        </div>
        <p v-if="!power" style="font-size: 20px; color: red;">权限不足，无法操作</p>
    </div>
</template>

<script>
    export default {
        name: "DepAdd", 
        // 权限
        power: JSON.parse(window.sessionStorage.getItem("user")).status == 1 ? false : true, 
        methods: {
            jump() {
                this.$router.replace('/dep/basic');
            }
        }
    }
</script>

<style scoped>

</style>