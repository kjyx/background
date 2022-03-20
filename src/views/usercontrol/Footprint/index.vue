<template>
  <div style="padding: 30px;">
    <el-input v-model="userID" placeholder="请输入用户ID" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input v-model="goodsId" placeholder="请输入商品ID" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="handleFindFootprint">
      查找
    </el-button>

    <el-table border style="width: 100%;margin-top: 20px" v-loading="listLoading" element-loading-text="正在查询中。。。" :data="FootprintList">
      <el-table-column prop="id" align="center" label="足迹ID" sortable width="100"/>
      <el-table-column prop="userId" label="用户ID" align="center"/>
      <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"/>
    </el-table>
  </div>
</template>

<script>

import { reqFootprintList } from '@/api/usercontrol'

export default {
  name: 'Footprint',
  data() {
    return {
      FootprintParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      listLoading: true,
      userID: null,
      goodsId: null,
      FootprintList: [],
      total: 0
    }
  },
  mounted() {
    this.getFootprintList()
    this.listLoading = false
  },
  methods: {
    async getFootprintList() {
      const result = await reqFootprintList(this.FootprintParams)
      if (result.status === 200) {
        this.FootprintList = result.data.data.list
        this.total = result.data.data.total
        this.listLoading = false
      }
    },
    // 查找
    handleFindFootprint() {
      this.listLoading = true
      this.FootprintParams.userId = this.userID
      this.FootprintParams.goodsId = this.goodsId
      this.getFootprintList()
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
