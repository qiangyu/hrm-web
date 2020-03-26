<template>
    <div>
        <div>
            <el-button v-if="power" type="primary" icon="el-icon-plus" @click="jump()">
                    添加部门
                </el-button>
            <p v-if="!power" style="font-size: 20px; color: red;">权限不足，无法操作</p>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: "DepAdd", 
        data(){
            return{
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status === 1 ? false : true
            }
        },
        methods: {
            jump() {
                this.$router.replace('/dep/basic');
            }
        }
    }
</script>

<style scoped>

</style>