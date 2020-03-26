<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="depmana"><DepMana></DepMana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from '../../components/sys/basic/DepMana'
    export default {
        name: "DepBasic", 
        data(){
            return{
                activeName: 'depmana'
            }
        },
        components:{
            DepMana
        }
    }
</script>

<style scoped>

</style>