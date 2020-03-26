<template>
    <div>
        <el-form :model="documentContent" :rules="rules" ref="documentContent">
            <div class="input" style="margin-bottom: 50px;">
                <el-form-item label="文档标题:" prop="title">
                    <el-input
                        type="text"
                        placeholder="请输入文档标题"
                        v-model="documentContent.title"
                        maxlength="30"
                        show-word-limit
                        style="font-size: 20px;"></el-input>
                </el-form-item>
                <div style="margin: 20px 0;"></div>
                <el-form-item label="文档描述:" prop="remark">
                    <el-input
                        type="textarea"
                        :rows="8"
                        placeholder="请输入文档描述"
                        v-model="documentContent.remark"
                        maxlength="300"
                        show-word-limit
                        style="font-size: 20px"></el-input>
                </el-form-item>
            </div>
            
                <div style="margin-top: 50px;">
                    <el-form-item label="文档内容:" prop="content">
                    <el-upload
                    class="upload"
                    drag
                    action="uploadFileUrl"
                    :before-upload="beforeUpload"
                    :auto-upload="false"
                    :on-success="uploadSuccess"
                    :on-change="changeFile"
                    :on-error="uploadError"
                    :data="documentData"
                    ref="upload"
                    :headers="myHeader"
                    limit: 1>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    </el-form-item>
                </div> 
                
        </el-form>
        <span slot="footer" class="dialog-footer" style="margin-left: 25%;">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button @click="resetForm('documentContent')" v-if="!isEditUser">重置</el-button>
                    <el-button type="primary" @click="doAddDocument">确 定</el-button>
                </span>
    </div>
</template>

<script>
export default {
    name: 'SysUpload', 
        data() {
            return {
                text: '',
                textarea: '', 
                documentContent: {
                    id: null, 
                    title: '', 
                    remark: ''
                }, 
                uploadFileUrl: 'http://localhost:8080/document/basic/',
                isHaveFile: false, 
                rules: {
                    title: [{required: true, message: '请输入文档标题！', trigger: 'blur'}],
                    remark: [{required: true, message: '请输入文档描述！', trigger: 'blur'}], 
                }
            }
        }, 
        computed: {
            myHeader(){
                return {
                    'token': window.localStorage.getItem('token')
                }
            },
            documentData() {
                return {
                    'title': this.documentContent.title, 
                    'remark': this.documentContent.remark
                }
            }
        },
        methods: {
            // 添加文件的重置输入框
             resetForm(formName) {
                // 清除上传文件项
                this.$refs.upload.clearFiles();
                this.$refs[formName].resetFields();
            }, 
            doAddDocument() {
                this.$refs['documentContent'].validate(valid => {
                    if (valid) {
                        if (!this.isHaveFile) {
                            return this.$message({
                                message: '请您选择上传的文件！',
                                type: 'warning'
                            });
                        }
                        this.$refs.upload.submit();
                    }
                });
            }, 
            // 取消上传
            cancel() {
                this.$router.replace('/home');
            }, 
            // 上传文件之前判断文件类型
            beforeUpload(file) {
                let isText = file.type === 'application/vnd.ms-excel'
                let isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                return (isText | isTextComputer)
            },
            uploadSuccess(resp){
                if (resp.status === 20000402) {
                    // 用户没登录，跳转至登录页面
                    this.$router.replace('/');
                } else if(resp.status === 200){
                    this.documentContent.id = null;
                    this.documentContent.title = '';
                    this.documentContent.remark = '';
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                }else if(resp.status === 400){
                    this.$message({
                        message: resp.msg,
                        type: 'warning'
                    });
                }else{
                    this.$message.error('上传失败，请重新上传');
                }
                // 无论成功失败，清空上传文件
                this.$refs.upload.clearFiles();
                this.isHaveFile = false;
            },
            uploadError(){
                this.$refs.upload.clearFiles();
                this.$message.error('上传失败，请重新上传');
            }, 
            changeFile(file){
                if(file.status=='ready'){
                    this.$prompt('请输入上传后的文件名', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValue: file.name
                        }).then(({ value }) => {
                        file.name = value;
                        this.isHaveFile = true;
                        // this.$refs.upload.submit();
                    }).catch(() => {
                        this.$refs.upload.clearFiles();
                        this.$message({
                            type: 'info',
                            message: '取消文件上传'
                        });
                    });
                }
            }
        }
}

</script>

<style>
    /* @import url("//unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css"); */
    .input {
        width: 30%;
    }
</style>