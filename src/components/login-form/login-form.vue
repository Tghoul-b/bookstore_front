<template>
	<Form ref="loginForm" :model="form" :rules="ruleslogin" @keydown.enter.native="handleSubmit">
		<FormItem prop="username">
			<Input v-model="form.username" placeholder="请输入用户名">
				<span slot="prepend">
				<Icon :size="16" type="ios-person"></Icon>
				</span>
			</Input>
		</FormItem>
		<FormItem prop="password">
			<Input ref="in_password" :type="this.visiable==0?'password':'text'" v-model="form.password" placeholder="请输入密码">
				<span slot="prepend">
				<Icon :size="14" type="md-lock"></Icon>
				</span>
				<span slot="append">
					<Icon :size="14" :type="eye==0?'md-eye-off':'md-eye'" @click.native="handleIcon"></Icon>
				</span>
			</Input>
		</FormItem>
		<FormItem>
			<Button @click="handleSubmit" :loading="loading" type="primary" long>
				 <span v-if="!loading">登录</span>
                  <span v-else>登陆中...</span>
			</Button>
		</FormItem>
	</Form>
</template>

<script>
export default {
	name: 'LoginForm',

	data () {
			const checkExist=(rule,value,callback)=>{
			   this.$api.api_all.post_user_login_api(
                    this.form.username,this.form.password
                ).then((response)=>{
                    let d=response.data.flag
                    if(d==0)
                       callback(new Error("该用户名不存在"))
                    else 
                       callback()
				}).catch((error)=>{
                    console,log(error.data.message)
				})};

		return {
			flag:0,
			eye:0,
			visiable:0,
			loading:false,
			form: {
                username: '',
				password: '',
			},
            ruleslogin:{ // 校验表单规则
                username: [ // FormItem标签中的 prop 属性预期值
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
					{validator:checkExist,trigger:'blur'}
                ],
                password: [ // FormItem标签中的 prop 属性预期值
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { type: 'string', min: 6, message: '6位数密码', trigger: 'blur' }
                ]
            }
		}
	},
	methods: {
		handleIcon(){
			this.visiable=!this.visiable
			this.eye=!this.eye
		},
		handleSubmit () {
			this.loading=true;
			this.$refs.loginForm.validate((valid) => {
			    // this.$refs.loginForm.validate : 获取表单校验结果; 校验正确-> valid为True; 校验失败-> valid为False;
				if (valid) {
					this.$emit('on-success-valid', {
                        username: this.form.username, // 将this.form.username和this.form.password传给父组件的on-success-valid参数
						password: this.form.password}
					)
					}
				}
			)
		},

	}
}
</script>
