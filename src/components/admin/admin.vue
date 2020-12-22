<template>
  <div class="layout">
    <Row type="flex" style="min-height:700px">
      <Col span="5" class="layout-menu-left">
      <Menu active-name="1-1" theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
          <h2 style="color:white;">图书馆</h2>
        </div>
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            欢迎你，网上书店管理员:{{msg}}
          </template>
          <MenuItem name="1-1" @click.native="addBook"><span>添加图书</span></MenuItem>
          <MenuItem name="1-2" @click.native="DelBook"><span>修改图书</span></MenuItem>
          <MenuItem name="1-3" @click.native="statistic"><span>统计</span></MenuItem>
        </Submenu>
      </Menu>
      </Col>
      <Col span="19">
      <div class="layout-header"></div>
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">{{one_nav}}</BreadcrumbItem>
          <BreadcrumbItem href="#">{{two_nav}}</BreadcrumbItem>
          <BreadcrumbItem>{{three_nav}}</BreadcrumbItem>
        </Breadcrumb>
        <span style="float:right;font-size:15px">点击<a href="/Book">此处</a>返回主页面</span>
      </div>
      <div class="layout-content">
        <div class="layout-content-main" style="height:700px">
          <template id="AddBook"></template>
          <template id="DelBook"></template>
          <template id="statistics"></template>
          <component :is="currentView"></component>
        </div>
      </div>
      <div class="layout-copy">

      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import AddBook from '@/components/admin/AddBook.vue'
  import DelBook from '@/components/admin/DelBook.vue'
  import Button from 'iview/src/components/button/button'
  import statistics from '@/components/admin/statistics.vue'
  export default {
    name: 'Manager',
    data () {
      return {
        one_nav: '主页',
        two_nav: '后台管理',
        three_nav: '图书管理',
        currentView: 'AddBook',
        msg:''
      }
    },
    mounted () {
      this.msg = JSON.parse(window.localStorage.getItem('username'))
    },
    methods: {
      addBook () {
        this.one_nav = '主页'
        this.two_nav = '后台管理'
        this.three_nav = '添加图书'
        this.currentView = 'AddBook'
      },
      DelBook () {
        this.one_nav = '主页'
        this.two_nav = '后台管理'
        this.three_nav = '修改图书'
        this.currentView = 'DelBook'
      },
      statistic(){
         this.one_nav = '主页'
        this.two_nav = '后台管理'
        this.three_nav = '统计信息'
        this.currentView = 'statistics'
      }
    },
    components: {
      Button,
      AddBook: AddBook,
      DelBook: DelBook,
      statistics:statistics
    }
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    margin-top:-60px;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
    text-align:left;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  Button{
    color:white;
  }
</style>