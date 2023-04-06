import request from '@/utils/request'


export default {
  // 查询菜单
  getAllMenu(searchModel) {
    return request({
      url: '/menu',
      method: 'get'
   
    }); 
  },


}