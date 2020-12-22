<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录网上书店" :bordered="false">
        <div class="form-con">
          <login-form ref="loginform" @on-success-valid="handleSubmit"></login-form>
          <a v-on:click="modal1=true">没有账号?</a>
        </div>
      </Card>
    </div>
    <Modal
      v-model="modal1"
      title="注册账号"
      width="1200"
      ok-text="确定"
      @on-ok="ok('formItem')"
    >
    <Form ref="formItem" :model="formItem" :label-width="80" :rules="rulesRegister">
      <Row type="flex" justify="center">
        <Col span="11">
        <FormItem label="用户名" prop="username">
            <Input v-model="formItem.username" placeholder="请输入你的用户名" width="90"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="formItem.password" placeholder="请输入你的密码" width="90"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="password_r">
            <Input type="password" v-model="formItem.password_r" placeholder="请再次输入你的密码" width="90"></Input>
        </FormItem>
        <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formItem.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="出生日期" prop="date">
                    <DatePicker type="date" placeholder="请选择你的出生日期" v-model="formItem.date"></DatePicker>
        </FormItem>
        <FormItem label="家庭住址" prop="add" >
          <al-selector v-if="formItem.update" v-model="formItem.address" data-type="name" :gutter="20" :searchable="true" :placeholder="formItem.placetext"/>
        </FormItem>
          </Col>
            </Row>
    </Form>
    <div slot="footer">
         <Button type="primary" size="large" @click="register('formItem')">注册</Button>
   	    <Button type="text" size="large" @click="ResetModal('formItem')">重置</Button>
   	</div>
    </Modal>
  </div>
  
</template>

<script> 
import LoginForm from '../login-form/login-form.vue';
	export default {
	    data(){
        const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value !== this.formItem.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            };
        const checkExitUserName=(rule,value,callback)=>{
          this.$api.api_all.post_user_login_api(
                    this.formItem.username,this.formItem.password
                ).then((response)=>{
                    let d=response.data.flag
                    if(d!=0)
                       callback(new Error("该用户名已注册"))
                    else 
                       callback()
                })
        };
        // const checkExitUserName2=(rule,value,callback)=>{
        //       if(this.tmp!=0)
        //           callback(new Error("该用户名已注册"))
        //       else  
        //           callback()
        // }
	      return{
          modal1: false,
          flag:0,
          formItem:
          {
            username:'',
            password:'',
            password_r:'',
            sex:'男',
            date:'',
            address:[],
            placetext:['请选择省','请选择市','请选择县','请选择乡'],
            update:true
          },
          rulesRegister:{
               username: [ // FormItem标签中的 prop 属性预期值
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {validator:checkExitUserName,trigger:'blur'}
                ],
                password: [ // FormItem标签中的 prop 属性预期值
                     {required:true,message:"请输入密码",trigger:'blur'},
                     {type:'string',min:6,message:"密码不少于6位",trigger:'blur'}
                ],
                password_r:[
                   { required: true, message: '请再次输入密码', trigger: 'blur' },
                   { validator: validatePassCheck, trigger: 'blur'}
                ],
                date:[
                  {required:true,message:"请选择出生日期",type:"date",trigger:'blur'}
                ]
                }
        }
	    },
		components: {
	     'login-form':LoginForm
	    },
		methods:{
            handleSubmit({username, password,valid},callback){
              if(!valid)
                this.$refs.loginform.loading=false    
              if(valid){
                this.$api.api_all.post_user_login_api(
                    username,password
                ).then((response)=>{
                    this.flag=response.data.flag
                    if(this.flag==-1){
                       this.$Message.error("您输入的密码有误")
                       this.$refs.loginform.loading=false
                       }
                    else if(this.flag==1){
                        let timestamp = Math.round(new Date().getTime());
                        this.$api.api_all.add_token(username,timestamp)
                        if(username!='admin')
                           this.$router.push('/')
                        else
                           this.$router.push('/admin')
                    }
                    else if(this.flag==0){
                      this.$refs.loginform.loading=false
                    }
                }).catch((error)=>{
                })
            }},
                register(name){
                  this.$refs[name].validate((valid)=>{
                    if(!valid)
                         console.log('')
                    else if(this.formItem.address.length!=4)
                        this.$Message.error("请选择完整的家庭住址")
                    else if(valid&&this.formItem.address.length==4){
                       this.$api.api_all.post_user_register_api(
                         this.formItem.username,this.formItem.password,this.formItem.date,
                         this.formItem.address,this.formItem.sex
                         ).then((response)=>{
                              this.modal1=false
                              this.$refs['formItem'].resetFields()
                               this.formItem.update=false;
                              this.$nextTick(() => {
                                this.formItem.address=[]
                                this.formItem.update = true
                              })
                         }).catch((error)=>{
                         })
                    }
                   })
                },
                ResetModal(name){
                  this.$refs[name].resetFields()
                  this.formItem.update=false;
                    this.$nextTick(() => {
                      this.formItem.address=[]
                       this.formItem.update = true
                    })
                }
		}
	}
</script>

