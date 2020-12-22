<style lang="less">
    @import '../main/main.less';
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
                         <h1 style="color:white;text-align:center">购物车</h1>
                    </div>
                     
                        <Dropdown v-if="showDropMenu">
                            <Icon type="md-person" style="color:white;margin-right:20px"></Icon>
                          <a href="javascript:void(0)" style="color:white" >{{username}}
                            <Icon type="ios-arrow-down"></Icon>
                          </a>
                            <DropdownMenu slot="list" style="z-index:20">
                                <DropdownItem @click.native="openUserInfo">个人信息</DropdownItem>
                                <DropdownItem @click.native="toMain">商城主页</DropdownItem>
                                <DropdownItem @click.native="BuyRecord">购物记录</DropdownItem>
                                <DropdownItem @click.native="toadmin" >购物记录</DropdownItem>
                                <DropdownItem @click.native="toadmin" v-if="this.username=='admin'">管理员页面</DropdownItem>
                                <DropdownItem @click.native="logout">登出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
            </Header>
            <Layout>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '500px', background: '#fff'}">
                             <Table border ref="selection" :columns="columns12" :data="dataArr"
                             @on-selection-change="selectChange"
                             no-data-text="<div>您的购物车空空如也,<a href='/Book'>点击</a>前往商城主页</div>">
                             <template slot-scope="{ row }" slot="name">
                       
                             <strong>{{ row.name }}</strong>
                             </template>
                            </Table>   
                            <Page :total="total" :page-size="pagesize" :current="pageIndex" show-elevator show-sizer
                             @on-change="changePageNum" @on-page-size-change="changePageSize"
                             style="margin-left:44%;margin-top:80px" :page-size-opts="[5,10,15]"
                             placement="top"></Page>
                             
                             <div style="margin-left:1200px">
                             <span style="color:red;font-size:20px">合计(不含运费):￥<span style="">{{total_price}}</span></span>
                             <Button type="primary" size="large" @click="buy_goods" style="margin-left:10px">购买</Button>
                             <Button type="error" size="large" style="margin-left:10px" @click="del_goods">删除</Button>
                             </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
            <Modal v-model="modaluser"  
            width="600" 
            min-height="300"
            title="购买确认"
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
    <Modal  
    v-model="modalbuy"  
    width="600" 
    min-height="300"
    title="购买确认"
    text-align="center"
    type="success"
    >
    <p style="font-family:微软雅黑">你本次购买的书籍有:
        </p>
        <div v-for="item in select_arr" :key="item.name">
            {{item.name}}
        </div>
        <p>您本次共需支付人民币{{this.total_price}}元</p>
         <Progress  :percent="percentage" :stroke-color="['#108ee9', '#87d068']" style="width；100px"/>
    <div slot="footer" style="margin-left:60%px">
        <Button type="success" size="large" :disabled="disable_btn" @click="buy_download">购买</Button>
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
        created(){
           var param=this.$route.query.param
           this.last_data=JSON.parse(window.localStorage.getItem("last_data"))//这个是主页面传过来的所有书籍的信息(不包含描述)
        },
        mounted(){
                this.username=JSON.parse(window.localStorage.getItem("username"))
                let f=this.$api.api_all.judge_token(this)
                if(!f){
                this.$api.api_all.get_cart_books(
                    this.username
                ).then((response)=>{     //response里面的数据得到的是所有在这个用户购物车下的书名
                var booklists=response.data.booklists
                let map=[]
                for(let i=0;i<this.last_data.length;i++){
                    let d=this.last_data[i].name
                    d=d.substring(1,d.length-1)
                    map[d]=this.last_data[i]
                }
                for(let i =0;i<booklists.length;i++){
                   let d=booklists[i]
                   this.total_data.push(map[d])
                }
                this.total=this.total_data.length
                var _start = ( this.pageIndex-1) * this.pagesize;  //pageIndex 第几页  pageNum:每页几条数据
                var _end = _start+this.pagesize
                this.dataArr = this.total_data.slice(_start,_end);
                })
                }
            },
        data(){
            return{
                boughtrecords:[],
                boughtModal:false,
                disable_btn:false,
                total_price:0,
                percentage:0,
                indeterminate: true,
                modalbuy:false,
                checkAll: false,
                modaluser:false,
                showDropMenu:true,
                total:100,
                username:'',
                pagesize:10,
                pageIndex:1,
                select_arr:[],
                formItem:{
                    username:'',
                    sex:'',
                    date:'',
                    address:'',
                    firstGetUserInfo:false
                },
                columns12: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },{
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
                    }
                ],
                last_data:[],
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
                 this.dataArr = this.total_data.slice(_start,_end);
            },
            changePageSize(value){
                this.pagesize=value
                var _start=(this.pageIndex-1)*value;
                var _end=_start+value;
                this.dataArr=this.total_data.slice(_start,_end)
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
            toMain(){
                this.$router.push('/')
            },
            selectChange(data){
                  this.select_arr=data
                  this.total_price=0
                  for(let i=0;i<data.length;i++){
                      this.total_price+=data[i].price
                  }
                },
                buy_download(){
                    this.percentage=0
                    this.disable_btn=true
                  for(let i=0;i<this.select_arr.length;i++){
                    let d=this.select_arr[i].name
                    d=d.substring(1,d.length-1)
                    this.Filedownload(d)
                    this.$api.api_all.InsertIntoRecord(this.username,d,this.select_arr[i].price)
                    }
                    this.del_goods()
                },
            buy_goods(){
                if(this.select_arr.length==0){
                   this.$Modal.warning({
                       title:'提示',
                       content:'请选择购买的商品'
                   })
                }else{
                this.modalbuy=true
                this.percentage=0
                this.disable_btn=false}
            },
         Filedownload(filename) {
                var that = this;
                var page_url = baseConfig.file_url+filename+'/'+filename+'.pdf';
                var req = new XMLHttpRequest();
                req.open("get", page_url, true);
                req.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                that.percentage = parseInt((evt.loaded / evt.total) * 100);
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
            }
            req.send();},
            del_goods(){
                if(this.select_arr.length==0){
                   this.$Modal.warning({
                       title:'提示',
                       content:'请选择删除的商品'
                   })
                }
                else{
                let len=this.select_arr.length
                let tmp_name=[]
                for(let i=0;i<len;i++){
                    tmp_name.push(this.select_arr[i].name)
                    for(let j=0;j<this.dataArr.length;j++){
                        if(this.select_arr[i].name==this.dataArr[j].name){
                            this.dataArr.splice(j,1);
                            break;
                        }
                    }
                }
                this.$api.api_all.delFromCart(
                    this.username,tmp_name
                ).then((response)=>{
                })
            }
            },
            toadmin(){
                this.$router.push('/admin')
            },
             BuyRecord(){
            let tmp_name=this.username
            this.$api.api_all.boughtRecord(
                tmp_name
            ).then((response)=>{
                let res=response.data.res
                if(res.length==0){
                    this.$Modal.error({
                        title:"提示",
                        content:"您并没有购买过任何物品"
                    })
                }else{
                   this.boughtModal=true
                   this.boughtrecords=[]
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