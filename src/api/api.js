import axios from '@/utils/axios'
const api_all = {
    post_user_login_api(username,password) {
        return axios({
            url: '/login',
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
    },
    print_token(){
       console.log(JSON.parse(window.localStorage.getItem("username")))
       console.log(JSON.parse(window.localStorage.getItem("time")))
    }
    
};

export default api_all
