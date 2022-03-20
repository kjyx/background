<template>
  <div style="padding: 30px;">
    <el-input v-model="userID" placeholder="请输入用户ID" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input v-model="keyword" placeholder="请输入搜索历史关键词" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="handleFindHistoryList">查找</el-button>

    <el-table border style="width: 100%;margin-top: 20px" v-loading="listLoading" element-loading-text="正在查询中。。。" :data="HistoryList">
      <el-table-column prop="id" align="center" label="搜索ID" sortable width="100"/>
      <el-table-column prop="userId" label="用户ID" align="center"/>
      <el-table-column prop="goodsId" label="关键词" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"/>
    </el-table>
  </div>
</template>

<script>

import { reqHistoryList } from '@/api/usercontrol'

export default {
  name: 'History',
  data() {
    return {
      HistoryParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      listLoading: true,
      userID: null,
      keyword: null,
      HistoryList: [],
      total: 0
    }
  },
  mounted() {
    this.getHistoryList()
    this.listLoading = false
  },
  methods: {
    async getHistoryList() {
      const result = await reqHistoryList(this.HistoryParams)
      if (result.status === 200) {
        this.HistoryList = result.data.data.list
        this.total = result.data.data.total
        this.listLoading = false
      }
    },
    // 查找
    handleFindHistoryList() {
      this.listLoading = true
      this.HistoryParams.userId = this.userID
      this.HistoryParams.keyword = this.keyword
      this.getHistoryList()
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

