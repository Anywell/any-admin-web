import request from '@/utils/request'


export default {
  // 查询角色
  getRoles(searchModel) {
    return request({
      url: '/role/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        roleName: searchModel.roleName
      }      
    }); 
  },

// 添加角色
  addRole(role) {
    return request({
      url: '/role',
      method: 'post',
      data: role  
    }); 
  },
// 根据id查找角色
  getRoleById(id) {
    return request({
      // url: '/role/' + id，两种方式都可以
      url: `/role/${id}`,
      method: 'get'
    })
  },

  // 修改角色信息
  updateRole(role) {
    return request({
      url: '/role',
      method: 'put',
      data: role
    })
  },
  saveRole(role){
    // 新增用户
    if(role.roleId == null || role.roleId == undefined){
      return this.addRole(role);
    }
    // 修改用户
    return this.updateRole(role);
  },
  
  // 删除角色
  deleteRoleById(id) {
    return request({
      url: `/role/${id}`,
      method: 'delete'
    })
  },

  // 获取所有角色列表
  getAllRoleList(){
    return request({
      url: `/role/all`,
      method: 'get'
    })
  }

}