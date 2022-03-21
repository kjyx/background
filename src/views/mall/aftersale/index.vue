<template>
  <div style="padding: 20px;">
    <div>
      <el-input placeholder="请输入售后编号" size="mini" style="width: 200px; margin: 0 10px 10px 0"></el-input>
      <el-input placeholder="请输入订单ID" size="mini" style="width: 200px; margin: 0 10px 10px 0"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini">查找</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini">导出</el-button>
    </div>
    <div style="display: flex; justify-content: right">
      <el-button type="success" size="mini" icon="el-icon-warning">批量通过</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete">批量拒绝</el-button>
    </div>

    <el-tabs v-model="name" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待审核" name="audit"></el-tab-pane>
      <el-tab-pane label="待退款" name="refund"></el-tab-pane>
    </el-tabs>

    <el-table ref="multipleTable" :data="aftersaleList" tooltip-effect="dark" size="mini" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="prop" align="center" label="售后编号"></el-table-column>
      <el-table-column prop="prop" align="center" label="订单ID"></el-table-column>
      <el-table-column prop="prop" align="center" label="用户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prop" align="center" label="售后类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prop" align="center" label="退款原因" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prop" align="center" label="退款价格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prop" align="center" label="申请时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prop" align="center" label="操作" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqAftersaleList } from '@/api/mall'

export default {
  name: 'Aftersale',
  data() {
    return {
      loading: true,
      aftersaleList: [],
      name: 'all',
      detaFrom: {
        page: 1,
        limit: 20,
        status: '',
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  mounted() {
    this.getAftersaleList()
  },
  methods: {
    async getAftersaleList() {
      this.loading = true
      const result = await reqAftersaleList(this.detaFrom)
      if (result.status === 200) {
        this.aftersaleList = result.data.data.list
        this.loading = false
      }
    },
    handleClick(a) {
      if (a.name === 'all') {
        this.detaFrom.status = ''
      } else if (a.name === 'audit') {
        this.detaFrom.status = 1
      } else if (a.name === 'refund') {
        this.detaFrom.status = 2
      }
      this.getAftersaleList()
    }
  }
}
</script>

<style scoped>

</style>
