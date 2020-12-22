<template>
<div>
  <Table :columns="columns" :data="dataArr">
    <template slot-scope="{ row, index }" slot="name">
      <span >{{ row.name }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="author">
      <Input type="text" v-model="author" v-if="editIndex === index" />
      <span v-else>{{ row.author }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="price">
      <Input type="text" v-model="price" v-if="editIndex === index" />
      <span v-else>{{ row.price }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="classfication">
      <Input type="text" v-model="classfication" v-if="editIndex === index" />
      <span v-else>{{ row.classfication }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="action">
      <div v-if="editIndex === index">
        <Button @click="handleModify(index)" type="warning">修改</Button>
        <Button @click="handleDelete(index)" type="error">删除</Button>
      </div>
      <div v-else>
        <Button @click="handleAction(row, index)" type="primary">操作</Button>
      </div>
    </template>
  </Table>
   <Page :total="total" :page-size="pagesize" :current="pageIndex" show-elevator show-sizer
                             @on-change="changePageNum" @on-page-size-change="changePageSize"
                             style="margin-left:400px;margin-top:50px" :page-size-opts="[5,10,15]"
                             placement="top"></Page>
</div>
</template>
<script>
  export default {
    mounted(){
      var d=[]
      this.$api.api_all.get_all_books().then((response)=>{
                     let ans=response.data.bookInfos
                     for(let i=0;i<ans.length;i++){
                         d.push({
                             name:"《"+ans[i].bookname+"》",
                             author:ans[i].author,
                             price:ans[i].price,
                             classfication:ans[i].classfication
                        })
                 }
                 this.total_data=d
                this.total=this.total_data.length
                var _start = ( this.pageIndex-1) * this.pagesize;  //pageIndex 第几页  pageNum:每页几条数据
                var _end = _start+this.pagesize
                this.dataArr = this.total_data.slice(_start,_end);
                })
          },
    data () {
      return {
        total:0,
        pageIndex:1,
        pagesize:10,
        total_data: [],
        dataArr:[],
        editIndex: -1,  
        bookname: '',  
        author: '',  
        price: '', 
        classfication: '',  
        columns: [{
            title: '书名',
            slot: 'name'
          },{
            title: '作者',
            slot: 'author'
          },{
            title: '价格',
            slot: 'price'
          },{
            title: '分类',
            slot: 'classfication'
          },
          {
            title: '#',
            slot: 'action'
          }
        ],
      }
    },
    methods: {
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
      handleAction (row, index) {
        this.bookname = row.name;
        this.author = row.author;
        this.classfication = row.classfication;
        this.price = row.price;
        this.editIndex = index;
      },
      handleModify (index) {
        this.dataArr[index].name = this.bookname;
        this.dataArr[index].author = this.author;
        this.dataArr[index].price = this.price;
        this.dataArr[index].classfication = this.classfication;
        let t=this.bookname
        t=t.substring(1,t.length-1);
        this.$api.api_all.UpdateBookInfo(t,this.author,this.price,this.classfication)
        this.editIndex = -1;
      },
      handleDelete(index){
      let t=this.dataArr[index].name;
      this.dataArr.splice(index,1)
      t=t.substring(1,t.length-1)
      this.$api.api_all.DeleteOneBook(t);
      this.editIndex=-1
    }
    }
    
  }
</script>