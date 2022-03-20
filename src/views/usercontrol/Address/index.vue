<template>
  <div style="padding: 30px;">
    <el-input placeholder="请输入用户ID" size="mini" style="width: 13%;margin-right: 10px"/>
    <el-input placeholder="请输入收货人名称" size="mini" style="width: 13%; margin-right: 10px"/>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px">查找
    </el-button>

    <el-table border style="width: 100%;margin-top: 20px" :data="AddressList">
      <el-table-column prop="id" align="center" label="地址ID" sortable width="100"/>
      <el-table-column prop="username" label="用户ID" align="center" width="150"/>
      <el-table-column prop="avatar" label="收货人名称" align="center"  width="150"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" align="center"  width="150"/>
      <el-table-column prop="gender" label="区域地址" align="center"></el-table-column>
      <el-table-column prop="url" label="详细地址" align="center" />
      <el-table-column prop="userLevel" label="默认" align="center" width="100"></el-table-column>
    </el-table>
    <!--    用户详情-->
  </div>
</template>

<script>

import { reqAddressList } from '@/api/usercontrol'

export default {
  name: 'Address',
  data() {
    return {
      AddressParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      AddressList: [],
      total: 0
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    async getAddressList() {
      const result = await reqAddressList(this.AddressParams)
      if (result.status === 200) {
        this.AddressList = result.data.data.list
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
