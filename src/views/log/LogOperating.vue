<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between; min-width: 980px;">
                <div>
                    <el-input placeholder="请输入用户账号进行搜索，可以直接回车搜索..." 
                            prefix-icon="el-icon-search"
                            clearable
                            @clear="initLog"
                            style="width: 340px; margin-right: 50px" 
                            v-model="searchValue.user"
                            @keydown.enter.native="initLog" 
                            :disabled="showAdvanceSearchView"></el-input>
                    
                    时间筛选:
                    <el-date-picker
                        v-model="searchValue.screenDate"
                        style="margin-right: 50px" 
                        type="daterange"
                        align="right"
                        unlink-panels
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button icon="el-icon-search" type="primary" @click="initLog" :disabled="showAdvanceSearchView">
                        搜索
                    </el-button>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px; min-width: 980px;">
            <el-table
                    :data="logs"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="id"
                        align="left"
                        label="id"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="user"
                        align="left"
                        label="所属用户"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="operating"
                        label="操作类型"
                        align="left"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="operatingData"
                        label="操作内容"
                        align="left"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="ip"
                        label="ip地址"
                        align="left"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="date"
                        width="145"
                        align="left"
                        label="登陆时间">
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex;justify-content: flex-end; min-width: 750px;">
            <el-pagination
                    background
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="10"
                    layout="sizes, prev, pager, next, jumper, ->, total, slot"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LogOperating",
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近半年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                // 搜索的信息
                searchValue: {
                    user: '',
                    screenDate: []
                },
                importDataBtnText: '导入数据',
                importDataBtnIcon: 'el-icon-upload2',
                importDataDisabled: false,
                showAdvanceSearchView: false,
                // 保存查询出登陆的日志信息
                logs: [],

                loading: false,
                popVisible: false,
                popVisible2: false,
                dialogVisible: false,
                total: 0,
                page: 1,
                size: 10
            }
        },
        mounted() {
            this.initLog();
        },
        methods: {
            // 清除搜索的信息
            cleanSearchValues() {
                this.searchValue.username = null;
                this.searchValue.loginname = null;
                this.searchValue.status = null;
                this.showAdvanceSearchView = !this.showAdvanceSearchView;
            }, 
            onError(err, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess(response, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
                this.initLog();
            },
            beforeUpload() {
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            exportData() {
                window.open('/log/login/export', '_parent');
            },
            handleNodeClick(data) {
                this.inputDepName = data.name;
                this.emp.departmentId = data.id;
                this.popVisible = !this.popVisible
            },
            showDepView() {
                this.popVisible = !this.popVisible
            },
            showDepView2() {
                this.popVisible2 = !this.popVisible2
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initLog();
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initLog();
            },
            // 行数的改变
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initLog();
            },
            // 页数的改变
            currentChange(currentPage) {
                this.page = currentPage;
                this.initLog();
            },
            initLog(type) {
                this.loading = true;
                let url = '/log/operating/?page=' + this.page + '&size=' + this.size;
                if (this.searchValue.user) {
                    url += '&user=' + this.searchValue.user;
                }
                if (this.searchValue.screenDate && this.searchValue.screenDate.length === 2) {
                    // 日期相同，需要手动调整
                    // if (this.searchValue.screenDate[0] === this.searchValue.screenDate[1]) {
                    
                    var start = this.searchValue.screenDate[0] + "";
                    var end  = this.searchValue.screenDate[1] + "";

                    var s = start.split(' ');
                    var e = end.split(' ');
                    
                    // 当后面的 HH:mm:ss 相同时，需要手动调整，将前面的日期调整为 '00:00:00' 、 后面的调整为 '23:59:59'
                    if (s[1] === e[1]) {
                        start = start.replace(s[1], '00:00:00');
                        end = end.replace(e[1], '23:59:59');

                        this.searchValue.screenDate.length = 0;
                        this.searchValue.screenDate.push(start);
                        this.searchValue.screenDate.push(end);
                    }
                    url += '&screenDate=' + this.searchValue.screenDate;
                    // console.log("---: " + this.searchValue.screenDate);
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp.status === 20000402) {
                        // 用户没登录，跳转至登录页面
                        this.$router.replace('/');
                    } else if (resp.status === 200) {
                        this.logs = resp.obj.data;
                        this.total = resp.obj.total;
                    } else {
                        this.logs = null;
                        this.total = 0;
                    }
                });
            }
        }
    }
</script>

<style>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>