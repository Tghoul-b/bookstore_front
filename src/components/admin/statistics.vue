<style scoped>


#title{
  font-size: 40px;
  text-shadow: 5px 5px 5px black, 0px 0px 2px black; 
   color: white;
}
</style>
<template>
<div class="container" >
    <div>
    <div id="SoldInfo"  style="width:500px;height:400px;float:left"></div>
    <div id="userInfo"  style="margin-left:600px;width:400px;height:400px;"></div>
    </div>
    <HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="100%" color=#987cb9 SIZE=5></HR>
    <div style="text-align:center;margin-top:30px;font-size:20px">
        <p id="title">总销量及金额</p>
        <br>
    <p>总共卖出了多少<span style="color:red">{{this.total_book}}</span>本书</p>
    <br>
    <p>其中销量最好的三本书是:<span v-for="item in firstThreeBooks"  :key="item.name" style="color:red">《{{item}}》</span></p>
    <br>
    <p>总交易金额为<span style="color:red">{{this.totalmoney}}</span>元</p>
    <br>
    </div>
</div>

</template>
<script>
import echarts from "echarts";
export default {
    name:"statistics",
    mounted(){
        this.$api.api_all.getAllBooksFirst(
        ).then((response)=>{
            this.firstThreeBooks=response.data.booklist
            this.total_book=response.data.total[0]
            this.totalmoney=response.data.price[0]
        })
        this.$api.api_all.getAllClassNum(
              ).then((response)=>{
                  this.dataclass=response.data.recordInfo
                  this.male=response.data.fmale[0]
                  this.female=response.data.fmale[1]
                  this.malerate=((this.male)/(this.male+this.female)).toFixed(2)*100
                  this.femalerate=100-this.malerate
                  this.drawSoldInfo()
                  this.drawUserInfo()
        })
        
    },
    data(){
        return {
            dataclass:[],
            male:null,
            malerate:null,
            female:null,
            femalerate:null,
            total_book:0,
            firstThreeBooks:[],
            totalmoney:0
        }
    },
    methods:{
    drawSoldInfo(){
    var myChart = echarts.init(document.getElementById('SoldInfo'));
       var option = {
            title: {
                text: '不同类别书\n销量排行榜'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["玄幻","武侠","都市","历史","科幻","网游","同人"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                color:'green',
                data: this.dataclass
            }]
        };
        myChart.setOption(option);
    },
    drawUserInfo(){
        
    var myChart1 = echarts.init(document.getElementById('userInfo'));
    var option= {
	    title:{
            text:'用户男女比例',
            top:'bottom',
            left:'center',
            textStyle:{
                fontSize: 14,
                fontWeight: '',
                color: '#333'
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
            show: true,
            orient: 'vertical',
            x: 'right',
            data: [this.malerate+'%-男', this.femalerate+'%-女']
        },
        graphic:{
            type:'text',
            left:'center',
            top:'center',
            style:{
                text:'用户统计\n'+'(总数为:'+(this.male+this.female)+')', 
                textAlign:'center',
                font:'italic bolder 16px cursive',
                fill:'#000',
                width:30,
                height:30
            }
        },
        series: [
            {
                name:'用户统计',
                type: 'pie',
                radius: ['35%', '65%'],
                itemStyle: {
                    normal:{
                        label:{
                            show:true,
                            textStyle:{color:'#3c4858',fontSize:"18"},
                            formatter:function(val){   //让series 中的文字进行换行
                                return val.name.split("-").join("\n");}
                        },
                        labelLine:{
                            show:true,
                            lineStyle:{color:'#3c4858'}
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        textColor:'#000'
                    }
                },
                data: [
                    {value: this.male, name:this.malerate+'%-男'},
                    {value: this.female, name: this.femalerate+'%-女'},
                ],
                color: ['#51CEC6','#FFB703','#5FA0FA'],
            },
        ],
    };
    myChart1.setOption(option);
    
    }
    }
}
</script>