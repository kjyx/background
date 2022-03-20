<template>
  <div style="padding: 30px;">
    <el-input v-model="searchUsername" placeholder="请输入用户名" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input v-model="id" placeholder="请输入用户ID" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-input v-model="searchMobile" placeholder="请输入手机号" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="searchUser">查找
    </el-button>

    <el-table border style="width: 100%;margin-top: 20px" :data="userList">
      <el-table-column prop="id" align="center" label="用户ID" sortable width="100"/>
      <el-table-column prop="username" label="用户昵称" align="center"/>
      <el-table-column prop="avatar" label="用户头像" align="center" width="80">
        <template slot-scope="{row, $index}">
          <img :src="row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center"/>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="{row,$index}">
          <el-tag>{{ sex(row.gender) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="生日" align="center"/>
      <el-table-column prop="userLevel" label="用户等级" align="center">
        <template slot-scope="{row,$index}">
          <el-tag>{{ userLevel(row.userLevel) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="{row,$index}">
          <el-tag>{{ status(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="userInfo(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="userParams.page"
      :limit.sync="userParams.limit"
      @pagination="getUserList"
    />

    <!--    用户详情-->
    <el-dialog title="用户编辑" :visible.sync="dialogFormVisible">
      <el-form style="width: 400px;margin-left: 50px">
        <el-form-item label="用户名" size="mini">
          <el-input autocomplete="off" style="width: 300px" :disabled="true" v-model="userInfoQuery.username"/>
        </el-form-item>
        <el-form-item label="用户昵称" size="mini">
          <el-input autocomplete="off" style="width: 300px" v-model="userInfoQuery.nickname"/>
        </el-form-item>
        <el-form-item label="用户手机" size="mini">
          <el-input autocomplete="off" style="width: 300px" v-model="userInfoQuery.mobile"/>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select v-model="userInfoQuery.gender">
            <el-option v-for="item in sexList" :key="item.id" :label="item.gender" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户等级">
          <el-select v-model="userInfoQuery.userLevel">
            <el-option v-for="item in userLevelList" :key="item.id" :label="item.userLevel" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="userInfoQuery.status">
            <el-option v-for="item in statusList" :key="item.id" :label="item.status" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { reqUserDetail, reqUserList, reqUserUpdate } from '@/api/usercontrol'

export default {
  name: 'Member',
  data() {
    return {
      dialogFormVisible: false,
      sexList: [
        { id: 0, gender: '未知' },
        { id: 1, gender: '男' },
        { id: 2, gender: '女' }
      ],
      userLevelList: [
        { id: 0, userLevel: '普通用户' },
        { id: 1, userLevel: 'VIP用户' },
        { id: 2, userLevel: '高级VIP用户' }
      ],
      statusList: [
        { id: 0, status: '可用' },
        { id: 1, status: '禁用' },
        { id: 2, status: '注销' }
      ],
      userParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      searchUsername: '',
      id: '',
      searchMobile: '',
      // 编辑携带参数
      userInfoQuery: {
        username: '',
        nickname: '',
        mobile: '',
        gender: '',
        userLevel: '',
        status: ''
      },
      userList: [],
      total: 0
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const result = await reqUserList(this.userParams)
      if (result.status === 200) {
        this.userList = result.data.data.list
        this.total = result.data.data.total
      }
    },
    // 性别判断
    // eslint-disable-next-line vue/no-dupe-keys
    sex(id) {
      if (id === 1) {
        return '男'
      } else if (id === 0) {
        return '未知'
      } else {
        return '女'
      }
    },
    // 用户等级判断
    userLevel(userLevel) {
      if (userLevel === 0) {
        return '普通用户'
      } else if (userLevel === 1) {
        return 'VIP用户'
      } else {
        return '高级VIP用户'
      }
    },
    // 状态判断
    status(status) {
      if (status === 0) {
        return '可用'
      } else if (status === 1) {
        return '禁用'
      } else {
        return '注销'
      }
    },

    // 详情
    userInfo(row) {
      this.dialogFormVisible = true
      // eslint-disable-next-line no-unused-vars
      this.userInfoQuery = Object.assign({},row)
    },
    // 确定
    async handleUpdateUserInfo() {
      await reqUserUpdate(this.userInfoQuery)
      this.$notify({
        title: '成功',
        message: '修改成功',
        type: 'success'
      })
      this.dialogFormVisible = false
      this.getUserList()
    },
    // 搜索
    async searchUser() {
      if (this.searchId === '') {
        this.userParams.username = this.searchUsername
        this.userParams.mobile = this.searchMobile
        this.userParams.userId = this.id
        this.getUserList()
      } else {
        const result = await reqUserDetail(this.id)
        console.log(result)
      }
    }
  }
}
</script>

<style scoped>
/deep/ .el-form-item__label {
  text-align: left;
  width: 100px;
  padding: 0 12px 0 0;
}
</style>
