<template>
  <div style="padding: 30px;">
    <el-input v-model="username" placeholder="请输入用户名" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input v-model="id" placeholder="请输入反馈ID" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="handleFindHistoryList">查找</el-button>

    <el-table border style="width: 100%;margin-top: 20px" v-loading="listLoading" element-loading-text="正在查询中。。。" :data="FeedBackList">
      <el-table-column prop="id" align="center" label="反馈ID"/>
      <el-table-column prop="userId" label="用户名" align="center"/>
      <el-table-column prop="goodsId" label="手机号码" align="center"></el-table-column>
      <el-table-column prop="addTime" label="反馈类型" align="center"/>
      <el-table-column prop="addTime" label="反馈内容" align="center"/>
      <el-table-column prop="addTime" label="反馈图片" align="center"/>
      <el-table-column prop="addTime" label="时间" align="center"/>
    </el-table>
  </div>
</template>

<script>

import { reqFeedBackList } from '@/api/usercontrol'

export default {
  name: 'FeedBack',
  data() {
    return {
      FeedBackParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      listLoading: true,
      username: null,
      id: null,
      FeedBackList: [],
      total: 0
    }
  },
  mounted() {
    this.getFeedBackList()
    this.listLoading = false
  },
  methods: {
    async getFeedBackList() {
      const result = await reqFeedBackList(this.FeedBackParams)
      if (result.status === 200) {
        this.FeedBackList = result.data.data.list
        this.total = result.data.data.total
        this.listLoading = false
      }
    },
    // 查找
    handleFindHistoryList() {
      this.listLoading = true
      this.FeedBackParams.username = this.username
      this.FeedBackParams.id = this.id
      this.getFeedBackList()
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

