<style lang="less">
    @import './main.less';
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <h1 style="color:white;text-align:center">网上书店</h1>
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
                            <MenuItem name="1-1">全部</MenuItem>
                            <MenuItem name="1-2">玄幻</MenuItem>
                            <MenuItem name="1-3">武侠</MenuItem>
                            <MenuItem name="1-4">都市</MenuItem>
                            <MenuItem name="1-5">历史</MenuItem>
                            <MenuItem name="1-6">科幻</MenuItem>
                            <MenuItem name="1-7">网游</MenuItem>
                            <MenuItem name="1-8">同人</MenuItem>
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
                        <Button type="success" size="small" style="margin-right: 10px" >购买</Button>
                          <Button type="warning" size="small" style="margin-right: 10px">加入购物车</Button>
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
    </div>
</template>
<script>
    export default {
        mounted(){
                let d=[]
                for (let i=0;i<115;i++){
                    d.push({
                        name:'计算机网络'+i,
                        author:'黄传河',
                        class:'计算机',
                        price:300
                    })
                }
                this.total_data=d
                this.total=this.total_data.length
                var _start = ( this.pageIndex-1) * this.pagesize;  //pageIndex 第几页  pageNum:每页几条数据
                var _end = _start+this.pagesize
                this.dataArr = this.total_data.slice(_start,_end);
            },
        data(){
            return{
                total:100,
                pagesize:10,
                pageIndex:1,
                active_name:'1-1',
                columns12: [{
                        title: '书名',
                        key: 'name'
                    },
                    {
                        title: '作者',
                        key: 'author'
                    },
                    {
                        title: '价格',
                        key: 'price'
                    },
                    {
                        title:'分类',
                        key:'class'
                    },
                    {
                        title: '',
                        slot: 'action',
                        width: 300,
                        align: 'center'
                    }
                ],
                dataArr: [],
                total_data:[]
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
            changeActive(value){
                this.active_name=value
            }
     }
    }
</script>