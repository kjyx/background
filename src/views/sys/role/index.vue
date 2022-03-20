<template>
  <div class="box">
    <el-input placeholder="请输入角色名称" size="mini" style="width: 13%;" v-model="permissions.name"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="handleChazhao">查找
    </el-button>
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleAddAdministrator">添加</el-button>

    <div class="tab">
      <el-table style="width: 100%" element-loading-text="正在查询中。。。" border :data="AdminList">
        <el-table-column prop="name" align="center" label="角色名称" sortable/>
        <el-table-column prop="desc" align="center" label="说明"/>
        <el-table-column prop="prop" align="center" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
            <el-button type="primary" size="mini" @click="handleAccredit(row)">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="formName" label-width="100px" :model="AdminList">

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="permissions.name" autocomplete="off" size="mini" style="width: 300px;"/>
        </el-form-item>

        <el-form-item label="说明" prop="desc">
          <el-input v-model="permissions.desc" autocomplete="off" size="mini" style="width: 300px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="flage === 0" type="primary" @click="handleUpdate">确 定</el-button>
        <el-button v-else type="primary" @click="handleAddAdmin">确 定</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="AdminInfoQuery.page"
      :limit.sync="AdminInfoQuery.limit"
      @pagination="getAdminInfo"
    />

    <!--    授权-->
    <el-dialog title="权限配置" :visible.sync="dialogTableVisible">
      <el-tree
        ref="tre"
        :data="systemPermissions"
        show-checkbox
        node-key="id"
        :default-checked-keys="assignedPermissions"
      />
      <div style="display: flex; justify-content: right">
        <el-button size="mini" @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" size="mini" style="text-align: right;" @click="handleUpdateAccredit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  reqRoleCreate,
  reqRoleDetele,
  reqRoleList,
  reqRolePermissions,
  reqRoleUpdate,
  reqUpdateAccredit
} from '@/api/sys'

export default {
  name: 'Role',
  data() {
    return {
      flage: null,
      dialogFormVisible: false,
      dialogTableVisible: false,
      AdminInfoQuery: {
        limit: 10,
        order: 'desc',
        page: 1,
        sort: 'add_time'
      },
      permissions: {
        desc: '',
        id: '',
        name: ''
      },
      AdminList: [],
      total: 0,
      systemPermissions: [],
      assignedPermissions: []
    }
  },
  mounted() {
    this.getAdminInfo()
  },
  methods: {
    // 管理员信息
    async getAdminInfo(page = 1) {
      this.AdminInfoQuery.page = page
      const result = await reqRoleList(this.AdminInfoQuery)
      if (result.status === 200) {
        this.AdminList = result.data.data.list
        this.total = result.data.data.total
      } else {
        this.AdminList = []
        this.total = 0
        this.listLoading = false
      }
    },

    // 点击编辑
    handleCompile(row) {
      this.permissions = Object.assign({}, row)
      this.dialogFormVisible = true
      this.flage = 0
    },

    // 修改确定回调
    async handleUpdate() {
      const result = await reqRoleUpdate(this.permissions)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.getAdminInfo()
      }
    },

    // 删除
    async handleDelete(row) {
      try {
        await reqRoleDetele(row)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getAdminInfo()
      } catch (e) {
        this.$notify({
          title: '警告',
          message: e.data.errmsg,
          type: 'warning'
        })
      }
    },
    // 授权
    async handleAccredit(row) {
      this.permissions.id = row.id
      this.dialogTableVisible = true
      const result = await reqRolePermissions({ roleId: row.id })
      this.systemPermissions = result.data.data.systemPermissions
      this.assignedPermissions = result.data.data.assignedPermissions
    },

    // 确认修改授权
    async handleUpdateAccredit() {
      this.assignedPermissions = this.$refs.tre.getCheckedKeys(true)
      const query = {
        permissions: this.assignedPermissions,
        roleId: this.permissions.id
      }
      try {
        await reqUpdateAccredit(query)
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success'
        })
        this.dialogTableVisible = false
      } catch (e) {
        this.$notify({
          title: '警告',
          message: e.data.errmsg,
          type: 'warning'
        })
      }
    },

    // 添加管理员
    async handleAddAdministrator() {
      this.permissions = {}
      this.flage = 1
      this.dialogFormVisible = true
    },

    // 确定天机
    async handleAddAdmin() {
      const result = await reqRoleCreate(this.permissions)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        })
        this.getAdminInfo()
      }
    },

    // 查找
    handleChazhao() {
      this.AdminInfoQuery.name = this.permissions.name
      this.getAdminInfo()
    }
  }
}
</script>

<style>
.box {
  padding: 20px
}

.tab {
  margin-top: 20px
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
