<template>
  <div class="box">
    <el-input v-model="AdminInfoQuery.username" placeholder="请输入内容" size="mini" style="width: 13%;"></el-input>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="handleFind">查找
    </el-button>
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleAddAdmin">添加</el-button>
    <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>

    <div class="tab">
      <el-table style="width: 100%" :data="AdminList" v-loading="listLoading" element-loading-text="正在查询中。。。" border>
        <el-table-column prop="id" align="center" label="管理员ID" sortable></el-table-column>
        <el-table-column prop="username" align="center" label="管理员名称"></el-table-column>
        <el-table-column prop="prop" align="center" label="管理员头像">
          <template slot-scope="{row, $index}">
            <img style="height: 20px" :src="row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="prop" align="center" label="管理员角色">
          <template slot-scope="{row,$index}">
            <el-tag type="success" v-for="item in row.roleIds" :key="item">{{ formeRole(item) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" align="center" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="primary" @click="handleCompile(row)">编辑</el-button>
            <el-button type="danger" @click="handleDetailAdmin(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" :rules="rules" :model="dataForm" ref="formName">

        <el-form-item label="管理员名称" prop="username">
          <el-input autocomplete="off" size="mini" style="width: 300px;" v-model="dataForm.username"></el-input>
        </el-form-item>

        <el-form-item label="管理员密码" prop="password">
          <el-input autocomplete="off" type="password" size="mini" style="width: 300px;" v-model="dataForm.password"
          ></el-input>
        </el-form-item>

        <el-form-item label="管理员头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="`${baseUrl}/storage/create`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="dataForm.avatar" class="avatar" :src="dataForm.avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="管理员角色">
          <el-select placeholder="请选择" multiple v-model="dataForm.roleIds">
            <el-option :label="item.label" :value="item.value" v-for="item in role" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="uploadAndAdd === 0" @click="subInfo('formName')">确 定</el-button>
        <el-button type="primary" v-else @click="addAdminInfo('formName')">确 定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="AdminInfoQuery.page" :limit.sync="AdminInfoQuery.limit" @pagination="getAdminInfo" />
  </div>
</template>

<script>
import { reqAddAdmin, reqAdminList, reqAdminOptions, reqDetailAdmin, reqRedactAdminInfo } from '@/api/sys'
import { getToken } from '@/utils/auth'

export default {
  name: 'Admin',
  data() {
    return {
      input: '',
      baseUrl: 'http://182.160.8.76:8080/admin',
      uploadAndAdd: 0,
      AdminInfoQuery: {
        limit: 3,
        order: 'desc',
        page: 1,
        sort: 'add_time',
        username: ''
      },
      listLoading: true,
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      AdminList: [],
      total: 0,
      // 管理员
      role: [],
      dialogFormVisible: false,
      imageUrl: '',
      rules: {
        username: { required: true, message: '用户名不能为空', trigger: 'blur' },
        password: { required: true, message: '密码不能为空', trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.getAdminInfo()
    this.getAdminRole()
  },
  methods: {
    // 管理员信息
    async getAdminInfo(page = 1) {
      this.AdminInfoQuery.page = page
      this.listLoading = true
      const result = await reqAdminList(this.AdminInfoQuery)
      if (result.status === 200) {
        this.AdminList = result.data.data.list
        this.total = result.data.data.total
        this.listLoading = false
      } else {
        this.AdminList = []
        this.total = 0
        this.listLoading = false
      }
    },
    // 管理员角色
    async getAdminRole() {
      const result = await reqAdminOptions()
      this.role = result.data.data.list
    },
    // 计算出是那个管理员，并显示出来
    formeRole(id) {
      const label = {}
      this.role.map(item => {
        if (id === item.value) {
          label.name = item.label
        }
      })
      return label.name
    },

    // 编辑回调
    handleCompile(row) {
      this.uploadAndAdd = 0
      this.dataForm = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['formName'].clearValidate()
      })
    },

    // 图片
    handleAvatarSuccess(res, file) {
      this.dataForm.avatar = res.data.url
    },
    // 点击确定提交信息
    subInfo(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const result = await reqRedactAdminInfo(this.dataForm)
          if (result.status === 200) {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.getAdminInfo()
            this.getAdminRole()
          }
        } else {
          alert('error submit!!')
          return false
        }
      })
    },
    // 添加管理员
    async handleAddAdmin() {
      this.uploadAndAdd = 1
      this.dataForm = {}
      this.dialogFormVisible = true
    },
    // 点击添加确认回调
    async addAdminInfo() {
      const result = await reqAddAdmin(this.dataForm)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加管理员成功',
          type: 'success'
        })
        this.getAdminInfo()
        this.getAdminRole()
      } else {
        this.dialogFormVisible = false
        this.$notify({
          title: '失败',
          massage: '添加管理员失败'
        })
      }
    },

    // 点击删除管理员
    async handleDetailAdmin(row) {
      console.log(row)
      const result = await reqDetailAdmin(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除管理员成功',
          type: 'success'
        })
        this.getAdminInfo()
        this.getAdminRole()
      }
    },

    // 点击查找
    handleFind() {
      this.AdminInfoQuery.page = 1
      this.getAdminInfo()
    }
  },
  computed: {
    // 图片上传携带的请求头
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
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
