<template>
    <!-- <div style="display: flex; justify-content: space-between; margin: 30px 10px;"> -->
    <div style="display: flex; margin: 30px 10px;">
        <div style="border: 2px solid skyblue; padding: 20px; margin: 0 auto; width: 80%; min-width: 1370px;">
            <el-form :model="emp" :rules="rules" ref="empForm" :disabled="!power">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="姓名:" prop="name">
                            <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name"
                                        placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="性别:" prop="sex">
                            <el-radio-group v-model="emp.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出生日期:" prop="birthday">
                            <el-date-picker
                                    v-model="emp.birthday"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 150px;"
                                    placeholder="出生日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="政治面貌:" prop="party">
                            <el-select v-model="emp.party" placeholder="政治面貌" size="mini" style="width: 200px;">
                                <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="民族:" prop="race">
                            <el-select v-model="emp.race" placeholder="民族" size="mini" style="width: 150px;">
                                <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="电子邮箱:" prop="email">
                            <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                        v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="QQ号码:" prop="qqNum">
                            <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                        v-model="emp.qqNum" placeholder="请输入QQ号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="联系地址:" prop="address">
                            <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                        v-model="emp.address" placeholder="请输入联系地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="职位:" prop="position.id">
                            <el-select v-model="emp.position.id" placeholder="职位" size="mini" style="width: 150px;">
                                <el-option
                                        v-for="item in positions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="所属部门:" prop="department">
                            <el-popover
                                    :disabled="!power"
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="showAddDepView">
                                    <!-- :visible.sync=" -->
                                <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                        @node-click="handleNodeClick"></el-tree>
                                <div slot="reference"
                                    style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                                    @click="showDepView">{{inputDepName}}
                                </div>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="电话号码:" prop="tel">
                            <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                        v-model="emp.tel" placeholder="电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="手机号码:" prop="phone">
                            <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                        v-model="emp.phone" placeholder="电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="学历:" prop="education">
                            <el-select v-model="emp.education" placeholder="学历" size="mini"
                                        style="width: 150px;">
                                <el-option
                                        v-for="item in educations"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="6">
                        <el-form-item label="专业名称:" prop="speciality">
                            <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                        v-model="emp.speciality" placeholder="请输入专业名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="身份证号码:" prop="cardId">
                            <el-input size="mini" style="width: 250px" prefix-icon="el-icon-edit"
                                        v-model="emp.cardId" placeholder="请输入身份证号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="爱好:" prop="hobby">
                            <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                        v-model="emp.hobby" placeholder="请输入爱好"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="自我描述:" prop="remark">
                            <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                        v-model="emp.remark" placeholder="请输入对自我的描述"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="邮政编码:" prop="postCode">
                            <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                        v-model="emp.postCode" placeholder="请输入邮政编码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            
        </div>
        <!-- <div style="min-width: 126px; margin-left: 10px; margin-top: 30px;"> -->
        <span slot="footer" class="dialog-footer" style="margin: 30px; min-width: 126px;">
            <el-button :disabled="!power" @click="resetForm('empForm')">重置</el-button>
            <el-button :disabled="!power" type="primary" @click="doAddEmp">确 定</el-button>
        </span>
        <!-- </div> -->
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                // 权限
                power: JSON.parse(window.sessionStorage.getItem("user")).status === 1 ? false : true, 
                // 添加用户时是否显示所属部门那个框
                showAddDepView: false, 
                // 搜索的部门信息
                allDeps: [],
                // 添加员工的部门信息备份
                addAllDeps: [], 
                emps: [],

                // 民族信息
                nations: [],
                // 政治面貌信息
                politicsstatus: [],
                // 职位信息
                positions: [],
                educations: [ '硕士', '博士', '本科', '大专', '高中', '初中', '小学', '其他'],
                inputDepName: '所属部门',

                emp: {
                    id: null, 
                    name: null,
                    sex: null,
                    birthday: null,
                    cardId: null,
                    // 民族
                    nationId: 1,
                    race: null, 
                    // 政治面貌
                    politicId: null,
                    party: null, 
                    email: null,
                    phone: null,
                    tel: null, 
                    qqNum: null, 
                    address: null,
                    departmentId: null,
                    positionId: null,
                    education: null,
                    specialty: null,
                    postCode: null,
                    hobby: null, 
                    remark: null, 
                    position: {
                        id: null
                    }, 
                    department: {
                        id: null
                    }
                },
                // 所属部门的树形信息
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
                    idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}, {
                        // pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        pattern: /^\w+$/, 
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}, {
                        pattern:  /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, 
                        message: '手机格式不正确',
                        trigger: 'blur'
                    }],
                    tel: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                    qqNum: [{required: true, message: '请输入QQ号码', trigger: 'blur'}, {
                        pattern:  /^\d+$/, 
                        message: 'QQ号码格式不正确',
                        trigger: 'blur'
                    }],
                    address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
                    department: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                    posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
                    education: [{required: true, message: '请输入学历', trigger: 'blur'}],
                    speciality: [{required: true, message: '请输入专业', trigger: 'blur'}], 
                    hobby: [{required: true, message: '请输入爱好', trigger: 'blur'}], 
                    remark: [{required: true, message: '请输入对自我的描述', trigger: 'blur'}], 
                    postCode: [{required: true, message: '请输入联系地址的邮政编码', trigger: 'blur'}, {
                        pattern:  /^\d+$/, 
                        message: '邮政编码格式不正确',
                        trigger: 'blur'
                    }]
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            // 重置添加员工表单
             resetForm(formName) {
                this.emptyEmp();
                this.$refs[formName].resetFields();
            }, 
            emptyEmp() {
                this.emp = {
                    id: null, 
                    name: '',
                    sex: null,
                    birthday: '',
                    cardId: '',

                    // 民族
                    nationId: 1,
                    race: '', 

                    // 政治面貌
                    politicId: 13,
                    party: '', 

                    email: '',
                    phone: '',
                    tel: '', 
                    qqNum: '', 
                    address: "",
                    departmentId: null,
                    positionId: 29,
                    education: '',
                    specialty: '',
                    postCode: '',
                    hobby: '', 
                    remark: '', 
                    position: {
                        id: null
                    }, 
                    department: {
                        id: null
                    }
                }
                this.inputDepName = '';
            },
            doAddEmp() {
                // 添加
                if (!this.emp.id) {
                    this.$refs['empForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp.status === 20000402) {
                                    // 用户没登录，跳转至登录页面
                                    this.$router.replace('/');
                                } else if (resp.status === 200) {
                                    this.resetForm('empForm');
                                }
                            })
                        }
                    });
                }
            },
            // 选取部门信息
            handleNodeClick(data) {
                this.inputDepName = data.name;
                this.emp.department.name = data.name;
                this.emp.department.id = data.id;
                this.showAddDepView = !this.showAddDepView;
            },
            // 所属部门的小窗口
            showDepView() {
                this.showAddDepView = !this.showAddDepView;
            },
            // 初始化添加员工所依赖的基础信息
            initData() {
                // 民族
                if (!window.sessionStorage.getItem("nations")) {
                    this.getRequest('/employee/basic/nations').then(resp => {
                        if (resp) {
                            this.nations = resp.obj;
                            window.sessionStorage.setItem("nations", JSON.stringify(resp.obj));
                        }
                    })
                } else {
                    this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
                }
                // 政治面貌
                if (!window.sessionStorage.getItem("politicsstatus")) {
                    this.getRequest('/employee/basic/politicsstatus').then(resp => {
                        if (resp) {
                            this.politicsstatus = resp.obj;
                            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp.obj));
                        }
                    })
                } else {
                    this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
                }
                // 部门
                if (!window.sessionStorage.getItem("deps")) {
                    this.getRequest('/department/basic/').then(resp => {
                        if (resp) {
                            this.allDeps = resp.obj;
                            window.sessionStorage.setItem("deps", JSON.stringify(resp.obj));
                        }
                    })
                } else {
                    this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
                }
                // 职位
                if (!window.sessionStorage.getItem("positions")) {
                    this.getRequest('/position/basic/').then(resp => {
                        if (resp) {
                            this.positions = resp.obj;
                            window.sessionStorage.setItem("positions", JSON.stringify(resp.obj));
                        }
                    })
                } else {
                    this.positions = JSON.parse(window.sessionStorage.getItem("positions"));
                }
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