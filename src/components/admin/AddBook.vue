<template>
<Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="100" style="width:500px">
        <FormItem label="书名" prop="name">
            <Input v-model="formItem.name" placeholder="请输入书名"></Input>
        </FormItem>
        <FormItem label="作者" prop="author">
            <Input v-model="formItem.author" placeholder="请输入作者"></Input>
        </FormItem>
        <FormItem label="价格" prop="price">
            <Input v-model="formItem.price" placeholder="请输入价格"></Input>
        </FormItem>
        <FormItem label="分类" prop="classfication">
            <Select v-model="formItem.classfication" placeholder="请选择分类">
                <Option value="玄幻">玄幻</Option>
                <Option value="武侠">武侠</Option>
                <Option value="都市">都市</Option>
                <Option value="历史">历史</Option>
                <Option value="科幻">科幻</Option>
                <Option value="网游">网游</Option>
                <Option value="同人">同人</Option>
            </Select>
        </FormItem>
        <FormItem label="描述" prop="description">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请简要描述这本书"></Input>
        </FormItem>
        <FormItem label="上传封面图" prop="fileimage">
         <input v-if="reloadImage" type="file" placeholder="上传封面图" @change="handleUploadImage" accept="image/*"></input>
        </FormItem >
        <FormItem label="上传书籍" prop="filepdf">
           <input v-if="reloadpdf" type="file" placeholder="上传书籍" @change="handleUploadPDF" ></input>
        </FormItem>
        <FormItem>
            <Button type="primary" :loading="loading" @click="handleSubmit('formItem')">
              <span v-if="!loading">添加</span>
              <span v-else>上传中</span></Button>
            <Button @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
        </FormItem>
        
    </Form>
</template>
<script>
    export default {
      name:"AddBook",
     
        data () {
           const checkExistBook=(rule,value,callback)=>{
             this.$api.api_all.checkExistBook(this.formItem.name
             ).then((response)=>{
               let res=response.data.res
               if(res){
                 callback(new Error("该书已经存在,请不要重复录入"))
               }
                else{
                   callback()
                }
             })
           }
            const validateUpload = (rule, value, callback) => {
               if (this.formItem.fileImage == null) {
                 callback(new Error('请选择要上传的封面'))
              }
               else {
                   callback()
               }
             }
             const validateUploadpdf=(rule, value, callback) => {
               if(this.formItem.filepdf==null){
                 callback(new Error('请选择要上传的pdf文件'))
               }
               else{
                 callback()
               }
             }
            const checkPrice=(rule, value, callback) => {
              let d=Number(this.formItem.price)
                if(isNaN(d)){
                callback(new Error("书的价格必须是数字类型"))
                this.formItem.price=null
              }
              else{
                callback()
              }
            }
            return {
              reloadImage:true,
              reloadpdf:true,
              loading:false,
                formItem: {
                    name:'',
                    author:'',
                    price:'',
                    classfication:'',
                    description:'',
                    fileImage:null,
                    filepdf:null,
                    
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '书名不能为空', trigger: 'blur' },
                         {validator:checkExistBook,trigger:'blur'}
                    ],
                    author:[
                      {required:true,message:'书的作者不能为空',trigger:'blur'}
                    ],
                    price:[
                      {required:true,message:'书的价格不能为空',trigger:'blur'},
                      {validator:checkPrice,trigger:'blur'}
                    ],
                    classfication:[
                      {required:true,message:'书的分类不能为空',trigger:'blur'}
                    ],
                    description:[
                      {required:true,message:'书的描述不能为空',trigger:'blur'}
                    ],
                    fileimage:[
                      {validator:validateUpload,trigger:'blur'}
                    ],
                    filepdf:[
                      {validator:validateUploadpdf,trigger:'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                          this.loading=true
                          var formData = new FormData();
                          formData.append('bookname',this.formItem.name)
                          formData.append("author",this.formItem.author)
                          formData.append("price",this.formItem.price)
                          formData.append("classfication",this.formItem.classfication)
                          formData.append("description",this.formItem.description)
                          formData.append("ImgFile",this.formItem.fileImage)
                          formData.append("PdfFile",this.formItem.filepdf)
                          const xhr = new XMLHttpRequest()
                          xhr.open('POST','http://106.52.12.54:9999/UploadFile',true)
                          
                          xhr.send(formData)
                           xhr.onreadystatechange = () => { 
                          if(xhr.readyState == 4 && xhr.status == 200){
                            this.loading=false
                             this.$Notice.success({
                              title:"上传成功",
                              desc:"添加图书成功",
                              duration:0
                            })
                            }else if(xhr.readyState == 4&&xhr.status != 200){
                              this.loading=false
                            this.$Notice.error({
                                            title:"上传失败",
                                            desc:"上传文件失败,可能是您上传的文件太大(超出100M)",
                                            duration:0
                                    
                                          })
                            }
                            }
                }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
                this.formItem.fileImage=null
                this.formItem.filepdf=null
                 this.reloadImage=false
                    this.reloadpdf=false
                     this.$nextTick(()=>{
                       this.reloadImage=true
                       this.reloadpdf=true
                     })
            },
    
           handleUploadImage(event){
              this.formItem.fileImage=event.target.files[0]
              let name=this.formItem.fileImage.name
              let suffix=name.substring(name.lastIndexOf('.'))
              if(suffix=='.png'||suffix=='.jpg'||suffix=='.jpeg'){
              this.$Notice.success({
                title:"上传成功",
                desc:"您选择的图片已加载成功"
              })
              }
              else{
                this.$Notice.error({
                title:"文件类型错误",
                desc:"您选择的文件类型不正确,请选择jpg,png或jpeg格式的图片"
              })
              this.formItem.fileImage=null
              this.reloadImage=false
              this.$nextTick(()=>{
                this.reloadImage=true
              })
              }
           },
           handleUploadPDF(event){
               this.formItem.filepdf=event.target.files[0]
              let name=this.formItem.filepdf.name
              let suffix=name.substring(name.lastIndexOf('.'))
              if(suffix=='.pdf'){
              this.$Notice.success({
                title:"上传成功",
                desc:"您选择的文件已加载成功"
              })
              }
              else{
                 this.$Notice.error({
                title:"文件类型错误",
                desc:"您选择的文件类型不正确,请选择pdf文件"
              })
              this.formItem.filepdf=null
              this.reloadpdf=false
               this.$nextTick(()=>{
                this.reloadpdf=true
              })
              }
           },
        }
    }
</script>