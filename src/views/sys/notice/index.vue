<template>
  <div style="padding: 30px;">
    <el-input v-model="title" placeholder="请输入内容" size="mini" style="width: 13%;" />
    <el-input v-model="content" placeholder="请输入内容" size="mini" style="width: 13%;" />
    <el-button type="primary" size="mini" icon="el-icon-search" style="margin-left: 20px">查找
    </el-button>

    <el-table
      ref="multipleTable"
      :data="noticeList"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="通知标签" show-overflow-tooltip align="center" />
      <el-table-column prop="name" label="通知详情" show-overflow-tooltip align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleLook(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="添加时间" show-overflow-tooltip align="center" />
      <el-table-column prop="id" label="管理员ID" show-overflow-tooltip align="center" />
      <el-table-column prop="prop" label="操作" show-overflow-tooltip align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleNoticeCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="noticeParams.page"
      :limit.sync="noticeParams.limit"
      @pagination="getNoticeList"
    />
    <!--    查看-->
    <el-dialog title="通知详情" :visible.sync="dialogVisible" width="30%">
      <span>{{ title1 }}</span>
    </el-dialog>

    <!--    添加-->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form >
        <el-form-item label="通知标题">
          <el-input autocomplete="off" style="width: 300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="falg === 0" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button v-else type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqNoticeList } from '@/api/sys'

export default {
  name: 'Notice',
  data() {
    return {
      falg: 0,
      dialogVisible: false,
      dialogFormVisible: false,
      noticeParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      title1: '',
      title: '',
      content: '',
      total: 0,
      noticeList: []
    }
  },
  mounted() {
    this.getNoticeList()
  },
  methods: {
    // 获取列表
    async getNoticeList() {
      const result = await reqNoticeList(this.noticeParams)
      if (result.status === 200) {
        this.noticeList = result.data.data.list
        this.total = result.data.data.total
      }
    },

    // 查看
    handleLook(row) {
      this.dialogVisible = true
      this.title1 = row.title
    },
    // 编辑
    handleNoticeCompile(row) {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped>

</style>

