<template>
  <div class="adminlogin">
    <img src="../../assets/logo.png">
    <div class="logininfo">
      <el-form :model="ruleForm" :rules="rules" ref="loginInfo" label-width="0px">
        <el-form-item  prop="userName">
          <el-input v-model="ruleForm.userName"  placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('loginInfo')">登录</el-button>
          <el-button @click="resetLogin('loginInfo')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import store from '../../store/store'
import {loginRequest} from '../../utils/api'
export default {
  name: "adminlogin",
  data() {
    return {
      ruleForm: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  store,
  methods: {
    login: function(ruleForm) {
      this.$refs.loginInfo.validate((valid) => {
        if (valid) {
          // var password = this.$MD5(this.ruleForm.password);
          this.loginRequest("/admin/admin/login",{username:this.ruleForm.userName,password:this.ruleForm.password}).then(response => {
            debugger;
            if(response.status==200){
              var data = response.data;
              if(data.Result){
                localStorage.setItem('userName',this.ruleForm.userName)
                this.$store.commit('setUserName',this.ruleForm.userName)
                this.$router.push({path:"/content"})
              }else{
                this.$message({message:data.Message,type:"error"})
              }
            }
          }).catch(e => {
            console.log(e)
          })
        } else {
          return false;
        }
      });
    },
    resetLogin: function(param) {
      this.$refs[param].resetFields();
    }
  }
}
</script>
<style scoped>
  .adminlogin{
    width:30%;
    margin:10px auto;
    text-align:center;
  }
</style>
