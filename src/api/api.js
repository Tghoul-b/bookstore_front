import axios from '@/utils/axios'
const api_all = {
    post_user_login_api(username,password) {
        return axios({
            url: '/Login',
            method: 'POST',
            data: {
                username: username,
                password: password,
            }
        })
    },
    post_user_register_api(username,password,date,add,sex){
        let address=this.to_string(add)
        return axios({
            url:'/register',
            method:'POST',
            data:{
                username: username,
                password: password,
                date:date,
                address:address,
                sex:sex
            }
        })
    },
    get_user_info(username){
        return axios({
            url:'/getUserInfo',
            method:'POST',
            data:{
                username:username
            }
        })
    },
    get_all_books(){
        return axios({
            url:'/getAllBooks',
            method:'POST',
            data:{}
        })
    },
    insert_into_cart(username,bookname){
        return axios({
            url:'/InsertIntoCart',
            method:'POST',
            data:{
                username:username,
                bookname:bookname
            }
        })
    },
    get_cart_books(username){
        return axios({
            url:'/getAllCartBooks',
            method:'POST',
            data:{
                username:username
            }
        })
    },
    to_string(res_s){
        let ans=""
        var i;
        for(i=0;i<res_s.length;i++)
        {
            ans+=res_s[i]
            if(i<res_s.length-1)
               ans+="-"
        }
        return ans;
    },
    add_token(username,time){
        window.localStorage.setItem("username", JSON.stringify(username))
        window.localStorage.setItem("time", time)
    },
    remove_token(){

        window.localStorage.removeItem("username"),
        window.localStorage.removeItem("time")
        window.localStorage.removeItem("last_data")
    },
    print_token(){
       console.log(JSON.parse(window.localStorage.getItem("username")))
       console.log(JSON.parse(window.localStorage.getItem("time")))
    },
    judge_token(t){
        let s=JSON.parse(window.localStorage.getItem("username"))
        var that=t
        if(s==null||s==' '){
            that.$Message.error("请你先登录")
            that.$router.push('/login')
            return true
        }
        return false
    },
    delFromCart(username,booklist){
        return axios({
            url:'/DelFromCart',
            method:'POST',
            data:{
                username:username,
                booklist:JSON.stringify(booklist)
            }
        })
    },
    InsertIntoRecord(username,bookname,price){
        return axios({
            url:'/InsertIntoRecord',
            method:'POST',
            data:{
                username:username,
                bookname:bookname,
                price:price
            }
        })
    },
    boughtRecord(username){
        console.log(username)
        return axios({
            url:'/boughtRecord',
            method:'POST',
            data:{
                username:username
            }
        })
    },
    UpdateBookInfo(bookname,author,price,classfication){
        return axios({
            url:'/UpdateBookInfo',
            method:'POST',
            data:{
                bookname:bookname,
                author:author,
                price:price,
                classfication:classfication
            }
        })
    },
    DeleteOneBook(bookname){
        return axios({
            url:'/deleteOneBook',
            method:'POST',
            data:{
                bookname:bookname
            }
        })
    },
    checkExistBook(bookname){
        return axios({
            url:'/checkExistBook',
            method:'POST',
            data:{
                bookname:bookname
            }
        })
    },
    UploadFile(formdata){
        const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
         
    },
    getAllClassNum(){
        return axios({
            url:'./getAllUsersInfo',
            method:'POST',
            data:{}
        })
    }
};

export default api_all
