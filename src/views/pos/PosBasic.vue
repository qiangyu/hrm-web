<template>
    <div>
        <el-tabs v-model="activeName" type="card" style="min-width: 500px;">
            <el-tab-pane label="职位管理" name="posmana"><PosMana></PosMana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from '../../components/sys/basic/DepMana'
    import PosMana from '../../components/sys/basic/PosMana'
    import JobLevelMana from '../../components/sys/basic/JobLevelMana'
    import EcMana from '../../components/sys/basic/EcMana'
    import PermissMana from '../../components/sys/basic/PermissMana'
    export default {
        name: "PosBasic",
        data(){
            return{
                activeName: 'posmana'
            }
        },
        components:{
            DepMana,
            PosMana,
            JobLevelMana,
            EcMana,
            PermissMana
        }
    }
</script>

<style scoped>

</style>