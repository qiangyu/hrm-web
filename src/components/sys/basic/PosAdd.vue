<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    placeholder="添加职位..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
            </el-input>
        </div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    placeholder="添加职位..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.remark">
            </el-input>
        </div>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
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
                dialogVisible: false,
                loading: false,
                updatePos: {
                    name: '',
                    enabled: false
                },
                multipleSelection: [],
                positions: []
            }
        },
        mounted() {
            this.initPositions();
        },
        methods: {
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            this.initPositions();
                            this.pos.name = '';
                        }
                    })
                } else {
                    this.$message.error('职位名称不可以为空');
                }
            }
        }
    }
</script>

<style>
    .addPosInput {
        width: 300px;
        margin-right: 8px
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }

    .posManaMain {
        margin-top: 10px;
    }
</style>