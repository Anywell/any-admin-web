import request from '@/utils/request'



export default {
  // 查询用户
  getUsers(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }      
    }); 
  },

// 添加用户
  addUser(user) {
    return request({
      url: '/user',
      method: 'post',
      data: user  
    }); 
  },
// 根据id查找用户
  getUserById(id) {
    return request({
      // url: '/user/' + id，两种方式都可以
      url: `/user/${id}`,
      method: 'get'
    })
  },

  // 修改用户信息
  updateUser(user) {
    return request({
      url: '/user',
      method: 'put',
      data: user
    })
  },
  saveUser(user){
    // 新增用户
    if(user.id == null || user.id == undefined){
      return this.addUser(user);
    }
    // 修改用户
    return this.updateUser(user);
  },
  deleteUserById(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  }



  

}