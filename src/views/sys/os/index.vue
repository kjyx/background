<template>
  <div style="padding: 30px;">
    <el-input v-model="key" placeholder="请输入对象KEY" size="mini" style="width: 13%;"></el-input>
    <el-input v-model="name" placeholder="请输入对象名称" size="mini" style="width: 13%;"></el-input>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px" @click="sousuoLog">查找
    </el-button>
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px">添加</el-button>

    <el-table border style="width: 100%;margin-top: 20px" :data="OsList">
      <el-table-column prop="key" label="对象KEY" align="center"></el-table-column>
      <el-table-column prop="name" label="对象名称" align="center"></el-table-column>
      <el-table-column prop="type" label="对象类型" align="center"></el-table-column>
      <el-table-column prop="size" label="对象大小" align="center"></el-table-column>
      <el-table-column prop="action" label="图片" align="center">
        <template slot-scope="{row,$index}">
          <img :src="row.url" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="url" label="图片链接" align="center"></el-table-column>
      <el-table-column prop="result" label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="OsCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="OsDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="OsParams.page" :limit.sync="OsParams.limit"
                @pagination="getOsList"
    />

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="OsList" label-width="80px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="name1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCompile">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { reqStorageDelete, reqStorageList, reqStorageUpdate } from '@/api/sys'

export default {
  name: 'Os',
  data() {
    return {
      dialogVisible: false,
      OsParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      name: '',
      name1: '',
      key: '',
      total: 0,
      OsList: [],
      CompileParams: {}
    }
  },
  mounted() {
    this.getOsList()
  },
  methods: {
    // 获取列表
    async getOsList() {
      const result = await reqStorageList(this.OsParams)
      console.log(result)
      if (result.status === 200) {
        this.OsList = result.data.data.list
        this.total = result.data.data.total
      }
    },
    // 查找
    sousuoLog() {
      this.OsParams.name = this.name
      this.OsParams.key = this.key
      this.getOsList()
    },
    // 编辑
    OsCompile(row) {
      this.dialogVisible = true
      this.name1 = row.name
      this.CompileParams = row
    },
    // 确定编辑
    async handleCompile() {
      this.CompileParams.name = this.name1
      const result = await reqStorageUpdate(this.CompileParams)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.dialogVisible = false
      }
    },

    // 删除
    async OsDelete(row) {
      const result = await reqStorageDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.getOsList()
      }
    }
  }
}
</script>

<style scoped>

</style>
