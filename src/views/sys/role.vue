<template>
  <div>
    <!-- 搜索栏 -->
    <el-card class="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.roleName"
            placeholder="角色名称"
            clearable
          ></el-input>
          <el-button
            @click="getRoleList"
            type="primary"
            round
            icon="el-icon-search"
            >查询</el-button
          >
        </el-col>
        <el-col :span="4" align="right">
          <el-button
            @click="openEditUI(null)"
            type="success"
            circle
            icon="el-icon-plus"
          ></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            <!-- (pageNo -1) * pageSize + index + 1 -->
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="roleId" label="角色ID" width="200">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="260">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="openEditUI(scope.row.roleId)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
            ></el-button>
            <el-button
              @click="deleteRole(scope.row)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 10, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 角色信息编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="clearForm"
    >
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item
          label="角色名称"
          prop="roleName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="权限设置"
          prop="menuIdList"
          :label-width="formLabelWidth"
        >
          <el-tree ref="menuRef" style="width:85%"
            :data="menuList"
            :props="menuProps"
            show-checkbox
            default-expand-all
            node-key="menuId"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/roleManage";
import menuApi from "@/api/menuManage"

export default {
  data() {
    return {
      menuProps: {
        children: 'children',
        label: 'title'
      },
      menuList: [],
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      roleList: [],
      title: "",
      dialogFormVisible: false,
      roleForm: {},
      formLabelWidth: "100px",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getMenuList(){
      menuApi.getAllMenu().then(res => {
        this.menuList = res.data;
      })
    },
    deleteRole(role) {
      this.$confirm(`确认删除角色 ${role.roleName} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roleApi.deleteRoleById(role.roleId).then((res) => {
            this.$message({
              type: "success",
              message: res.message,
            });
            // 更新表格数据
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveRole() {
      // 触发表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          let checkedKeys = this.$refs.menuRef.getCheckedKeys();
          let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();          

          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys);
          console.log(this.roleForm.menuIdList);     

          // 验证通过，提交请求给后端
          roleApi.saveRole(this.roleForm).then((res) => {
            console.log(res);
            // 成功提示
            this.$message({
              showClose: true,
              message: res.message,
              type: "success",
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新数据
            this.getRoleList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openEditUI(id) {
      if (id == null) {
        this.title = "新增角色";
      } else {
        this.title = "修改角色";
        // 根据id查询角色信息,在对话框中回显
        roleApi.getRoleById(id).then((res) => {
          this.roleForm = res.data;
          this.$refs.menuRef.setCheckedKeys(res.data.menuIdList);
        });
      }
      this.dialogFormVisible = true;
    },
    // 清除表单
    clearForm() {
      this.roleForm = {};
      //清除表校验结果
      this.$refs.roleFormRef.clearValidate();
      // 清除权限信息
      this.$refs.menuRef.setCheckedKeys([]);
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    getRoleList() {
      roleApi.getRoles(this.searchModel).then((res) => {
        console.log(res);
        this.roleList = res.data.rows;
        this.total = res.data.total;
      });
    },
  },
  created() {
    this.getRoleList();
    this.getMenuList();
  },
};
</script>

<style scoped>
.search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>