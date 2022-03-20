<template>
  <div style="padding: 30px;">
    <el-input placeholder="请输入用户ID" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input placeholder="请输入商品ID" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px">查找
    </el-button>

    <el-table border style="width: 100%;margin-top: 20px" :data="CollectionList">
      <el-table-column prop="id" align="center" label="收藏ID" sortable width="100"/>
      <el-table-column prop="username" label="用户ID" align="center"/>
      <el-table-column prop="avatar" label="商品ID" align="center" ></el-table-column>
      <el-table-column prop="mobile" label="添加时间" align="center" />
    </el-table>
  </div>
</template>

<script>

import { reqCollectionList } from '@/api/usercontrol'

export default {
  name: 'Collection',
  data() {
    return {
      CollectionParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      CollectionList: [],
      total: 0
    }
  },
  mounted() {
    this.CollectionList()
  },
  methods: {
    async getAddressList() {
      const result = await reqCollectionList(this.CollectionParams)
      if (result.status === 200) {
        this.CollectionList = result.data.data.list
        this.total = result.data.data.total
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
