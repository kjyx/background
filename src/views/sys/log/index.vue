<template>
  <div style="padding: 30px;">
    <el-input v-model="name" placeholder="请输入内容" size="mini" style="width: 13%;"></el-input>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="sousuoLog">查找
    </el-button>

    <el-table border style="width: 100%;margin-top: 20px" :data="logList">
      <el-table-column prop="admin" label="操作管理员" align="center"></el-table-column>
      <el-table-column prop="ip" label="ip地址" align="center"></el-table-column>
      <el-table-column prop="addTime" label="操作时间" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作类型" align="center">
        <template slot-scope="{row,$index}">
          <el-tag>安全操作</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作动作" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作状态" align="center">
        <template slot-scope="{row,$index}">
          <el-tag type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="操作结果" align="center"></el-table-column>
      <el-table-column prop="prop" label="备注信息" align="center"></el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="logParams.page" :limit.sync="logParams.limit"
                @pagination="getLogList"
    />
  </div>
</template>

<script>
import { reqLogList } from '@/api/sys'

export default {
  name: 'Log',
  data() {
    return {
      logParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      name: '',
      total: 0,
      logList: []
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    async getLogList() {
      const result = await reqLogList(this.logParams)
      if (result.status === 200) {
        this.logList = result.data.data.list
        this.total = result.data.data.total
      }
    },
    sousuoLog() {
      this.logParams.name = this.name
      this.getLogList()
    }
  }
}
</script>

<style scoped>

</style>
