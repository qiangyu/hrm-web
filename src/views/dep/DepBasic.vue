<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="depmana"><DepMana></DepMana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from '../../components/sys/basic/DepMana'
    // import PosMana from '../../components/sys/basic/PosMana'
    // import JobLevelMana from '../../components/sys/basic/JobLevelMana'
    // import EcMana from '../../components/sys/basic/EcMana'
    // import PermissMana from '../../components/sys/basic/PermissMana'
    export default {
        name: "DepBasic", 
        data(){
            return{
                activeName: 'depmana'
            }
        },
        components:{
            DepMana,
            // PosMana,
            // JobLevelMana,
            // EcMana,
            // PermissMana
        }
    }
</script>

<style scoped>

</style>