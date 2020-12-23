<style lang="less">
    @import './main.less';
</style>
<template>
    <div class="layout">
        <Layout>
            <Header style="display:flex;flex-direction:column">
                <div style="display:flex;
                            align-items:center;
                            justify-content:space-between;
                            position:relative;
                            margin-left:50%">
                    <div style="display:flex;align-items:center">
                         <h1 style="color:white;text-align:center">网上书店</h1>
                    </div>
                     
                        <Dropdown v-if="showDropMenu">
                            <Icon type="md-person" style="color:white;margin-right:20px"></Icon>
                          <a href="javascript:void(0)" style="color:white" >{{username}}
                            <Icon type="ios-arrow-down"></Icon>
                          </a>
                            <DropdownMenu slot="list" style="z-index:20">
                                <DropdownItem @click.native="openUserInfo">个人信息</DropdownItem>
                                <DropdownItem @click.native="toCart(this)"> 购物车</DropdownItem>
                                <DropdownItem @click.native="BuyRecord">购物记录</DropdownItem>
                                <DropdownItem @click.native="toAdmin" v-if="this.username=='admin'">管理员界面</DropdownItem>
                                <DropdownItem @click.native="logout">登出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <a v-if="!showDropMenu" href="./login" style="font-size:20px">登录</a>
                    </div>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu ref="menu" :active-name="active_name" theme="light" width="auto" :open-names="['1']" 
                     @on-select="changeActive">
                        <Submenu name="1" >
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                图书分类
                            </template>
                            <MenuItem name="全部">全部</MenuItem>
                            <MenuItem name="玄幻">玄幻</MenuItem>
                            <MenuItem name="武侠">武侠</MenuItem>
                            <MenuItem name="都市">都市</MenuItem>
                            <MenuItem name="历史">历史</MenuItem>
                            <MenuItem name="科幻">科幻</MenuItem>
                            <MenuItem name="网游">网游</MenuItem>
                            <MenuItem name="同人">同人</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                             <Table border :columns="columns12" :data="dataArr">
                             <template slot-scope="{ row }" slot="name">
                             <strong>{{ row.name }}</strong>
                             </template>
                           <template slot-scope="{ row, index }" slot="action">
                        <Button type="success" size="small" style="margin-right: 10px" @click="show_buy_modal(index)" ghost>购买</Button>
                          <Button type="warning" size="small" style="margin-right: 10px" @click="add_shop(index)" ghost>加入购物车</Button>
                         </template>
    </Table>   
                            <Page :total="total" :page-size="pagesize" :current="pageIndex" show-elevator show-sizer
                             @on-change="changePageNum" @on-page-size-change="changePageSize"
                             style="margin-left:400px;margin-top:50px" :page-size-opts="[5,10,15]"
                             placement="top"></Page>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
            <Modal v-model="modaluser"  
            width="600" 
            min-height="300"
            title="个人基本信息"
            text-align="center"
            footer-hide>
                <Card>
                    <Form ref="formItem" :model="formItem" :label-width="80">
                        <Row>
                            <Col>
                                <FormItem label="用户名:" prop="username">
                                <p>{{formItem.username}}</p>
                                </FormItem>
                                 <FormItem label="性别:" prop="sex">
                                <p>{{formItem.sex}}</p>
                                </FormItem>
                                 <FormItem label="生日:" prop="username">
                                <p style="font-family:">{{formItem.date}}</p>
                                </FormItem>
                                 <FormItem label="地址:" prop="address">
                                <p>{{formItem.address}}</p>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
    </Modal>
    <Modal v-model="modalbuy"  
            width="800" 
            min-height="300"
            title="书籍信息"
            :styles="{top: '20px'}">
              <img :src="this.imgsrc" style="width:500px;margin-left:100px"/>
              <div style="margin-top:30px">
                  <span><strong>书名:{{this.buyBooKName}}</strong></span>
                  <br>
                  <span><strong>作者:{{this.buyBooKAuthor}}</strong></span>
                  <br>
                  <span><strong>价格:{{this.buyBooKPrice}}</strong></span>
                  <br>
                  <span><strong>类型:{{this.buyBooKClass}}</strong></span>
                  <br>
                  <span><strong>简介:{{this.buyBooKDes}}</strong></span>
              </div>
    <div slot="footer">
         <Button size="large" @click="preview_book">预览</Button>
         <Button type="primary" :disabled="disable_btn"  size="large" @click="buy_download">购买</Button>
         <Progress  v-if="show_process" :percent="percentage" :stroke-color="['#108ee9', '#87d068']" />
   	</div>
    </Modal>
    <Modal
    v-model="boughtModal"
    title="购物记录"
    width="800"
    >
        <div v-for="item in boughtrecords" :key="item.name">
            您在{{item[2]}} 购买了书籍 《{{item[0]}}》, 花费了{{item[1]}}元
        </div>
    </Modal>
    </div>
</template>
<script>
    import baseConfig from '../../static/config'
    export default {
        mounted(){
                var d=[]
                this.username=JSON.parse(window.localStorage.getItem("username"));
                if(!this.username||this.username==' ')
                     this.showDropMenu=false
                this.$api.api_all.get_all_books(
                    
                ).then((response)=>{
                     let ans=response.data.bookInfos
                     for(let i=0;i<ans.length;i++){
                         d.push({
                             name:"《"+ans[i].bookname+"》",
                             author:ans[i].author,
                             price:ans[i].price,
                             class:ans[i].classfication
                        }),
                        this.des_data.push({
                            description:ans[i].description
                        })
                     }
                this.total_data=d
                this.tmp=this.total_data
                this.total=this.total_data.length
                var _start = ( this.pageIndex-1) * this.pagesize;  //pageIndex 第几页  pageNum:每页几条数据
                var _end = _start+this.pagesize
                this.dataArr = this.tmp.slice(_start,_end);
                })
               
            },
        data(){
            return{
                boughtModal:false,
                boughtrecords:[],
                disable_btn:false,
                show_process:false,
                modaluser:false,
                modalbuy:false,
                showDropMenu:true,
                total:100,
                username:'',
                pagesize:10,
                pageIndex:1,
                active_name:'全部',
                imgsrc:'',
                percentage:0,
                tmp:[],
                formItem:{
                    username:'',
                    sex:'',
                    date:'',
                    address:'',
                    firstGetUserInfo:false
                },
                columns12: [{
                        title: '书名',
                        key: 'name'
                    },{
                        title: '作者',
                        key: 'author'
                    },{
                        title: '价格',
                        key: 'price'
                    },{
                        title:'分类',
                        key:'class'
                    },{
                        title: '',
                        slot: 'action',
                        width: 300,
                        align: 'center'
                    }
                ],
                buyBooKName:'',
                buyBooKAuthor:'',
                buyBooKPrice:'',
                buyBooKClass:'',
                buyBooKDes:'',
                dataArr: [],
                total_data:[],
                des_data:[]
            }
        },
     methods:{
            changePageNum(value){
                 this.pageIndex = value;
                 var _start = (value-1) * this.pagesize;
                 var _end = _start+this.pagesize
                 this.dataArr = this.tmp.slice(_start,_end);
            },
            changePageSize(value){
                this.pagesize=value
                var _start=(this.pageIndex-1)*value;
                var _end=_start+value;
                this.dataArr=this.tmp.slice(_start,_end)
            },
            changeActive(value){
                this.active_name=value
                var tmp=[]
                if(value=='全部'){
                   this.dataArr=this.total_data.slice(0,this.pagesize);
                   this.total=this.total_data.length
                   this.tmp=this.total_data
                }
                else{
                for(let i=0;i<this.total_data.length;i++)
                 {
                     if(this.total_data[i].class==value){
                         tmp.push(this.total_data[i])
                     }
                 }
                 this.tmp=tmp
                 this.total=tmp.length
                 this.dataArr=tmp.slice(0,this.pagesize)
                }
            },
            openUserInfo(){
                this.modaluser=true
                if(!this.formItem.firstGetUserInfo){
                this.$api.api_all.get_user_info(
                this.username).then((response)=>{
                    this.formItem.username=response.data.Info.username
                    this.formItem.sex=response.data.Info.sex
                    var d=response.data.Info.birthday
                    let index=d.indexOf('T')
                    d=d.substring(0,index)
                    this.formItem.date=d
                    this.formItem.address=response.data.Info.address
                })
                this.formItem.firstGetUserInfo=true
                }
            },
            logout(){
                this.$api.api_all.remove_token()
                this.showDropMenu=false
                window.location.reload()
            },
            show_buy_modal(index){
                let f=this.$api.api_all.judge_token(this)
                if(!f){
                var i;
                this.show_process=false
                for(i=0;i<this.total_data.length;i++){
                    if(this.total_data[i].name==this.dataArr[index].name){
                          break;
                    }
                }
                let t=this.dataArr[index].name
                t=t.substring(1, t.length-1); 
                let src='http://106.52.12.54/bookstore/'+t+'/封面.jpg'
                this.modalbuy=true
                this.imgsrc=src
                this.buyBooKName=this.total_data[i].name
                this.buyBooKAuthor=this.total_data[i].author
                this.buyBooKPrice=this.total_data[i].price
                this.buyBooKClass=this.total_data[i].class
                this.buyBooKDes=this.des_data[i].description
            }},
            add_shop(index){
                var that =this
                let f=this.$api.api_all.judge_token(this)
                if(!f){
                let username=JSON.parse(window.localStorage.getItem("username"));
                let bookname=this.dataArr[index].name
                bookname=bookname.substring(1,bookname.length-1)
                this.$api.api_all.insert_into_cart(username,bookname).then((response)=>{
                        if(response.status==200){
                        let flag=response.data.flag
                        if(flag=="0"){
                        this.$Modal.success({
                            title:'添加成功',
                            render:(h)=>{
                                return h('div',[
                                    h('p',{
                                      
                                    },"《"+bookname+"》"+"已成功添加进您的购物车"),
                                    h('a',{
                                    attrs:{
                                        href:''
                                        },
                                    on:{
                                        click:()=>{
                                            this.toCart()
                                        }
                                    }
                                },'点击进入购物车')
                                ])
                            }
                        })}
                        else{
                            let content="<p>《"+bookname+"》已在您的购物车当中,本店均是电子产品,无需重复下单</p>"
                            that.$Modal.error({
                             title:"添加失败",
                              content:content
                            })
                        }
                        }
                })
                
            }},
            buy_download(){
                 let t=this.buyBooKName
                 this.percentage=0
                 this.disable_btn=true
                 this.show_process=true
                 t=t.substring(1,t.length-1)
                 this.Filedownload(t)
                 this.$api.api_all.InsertIntoRecord(this.username,t,this.buyBooKPrice);
            },
         Filedownload(filename) {
                var that = this;
                var page_url = baseConfig.file_url+filename+'/'+filename+'.pdf';
                var req = new XMLHttpRequest();
                req.open("get", page_url, true);
                req.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                that.percentage = parseInt((evt.loaded / evt.total) * 100);
                if(that.percentage==100)
                    that.disable_btn=false
            }
            }, false);
            req.responseType = "blob";
            req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                var filenames = filename+'.pdf';
                if (typeof window.chrome !== 'undefined') {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(req.response);
                link.download = filenames;
                link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                var blob = new Blob([req.response], { type: 'application/force-download' });
                window.navigator.msSaveBlob(blob, filename);
                } else {
                var file = new File([req.response], filename, { type: 'application/force-download' });
                window.open(URL.createObjectURL(file));
                }
                
            }
            };
            req.send();
        },
        preview_book(){
             let t=this.buyBooKName
             t=t.substring(1,t.length-1)
             let url=baseConfig.file_url+t+'/'+t+'pre.pdf'
             window.open(url)
        },
        toCart(th){
           window.localStorage.setItem("last_data", JSON.stringify(this.total_data))
           this.$router.push('/cart')
        },
        toAdmin(){
            this.$router.push('/admin')
        },
        BuyRecord(){
            let tmp_name=this.username
            this.$api.api_all.boughtRecord(
                tmp_name
            ).then((response)=>{
                let res=response.data.res
                this.boughtrecords=[]
                if(res.length==0){
                    this.$Modal.error({
                        title:"提示",
                        content:"您并没有购买过任何物品"
                    })
                }else{
                   this.boughtModal=true
                   for(let i=0;i<res.length;i++){
                       let tmp=res[i].split(';')
                       this.boughtrecords.push(tmp)
                   }
                }
            })
        }
     }
    }
</script>