<template>
  <div style="padding: 20px;">
    <div style="margin-bottom: 20px">
      <el-input placeholder="请输入问题" v-model="question" size="mini" style="width: 200px;padding-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleIssueFind">查找</el-button>
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleIssueAdd">添加</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini">导出</el-button>
    </div>
    <el-table :data="issueList" border size="mini" style="width: 100%" v-loading="loading"
              element-loading-text="拼命加载中。。" :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="id" align="center" label="问题ID" sortable width="100"></el-table-column>
      <el-table-column prop="question" align="center" label="问题内容" width="300"></el-table-column>
      <el-table-column prop="answer" align="center" label="问题回复"></el-table-column>
      <el-table-column prop="address" align="center" label="操作" width="200">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleIssueUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleIssueDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="dateFrom.page" :limit.sync="dateFrom.limit" @pagination="getIssueList"></pagination>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="rulesForm" :model="issueData">
        <el-form-item label="问题" prop="question" :label-width="formLabelWidth"
                      :rules="[{required:true,message:'问题不能为空', trigger: 'blur' }]"
        >
          <el-input size="mini" style="width: 300px;" v-model="issueData.question" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="回复" prop="answer" :label-width="formLabelWidth"
                      :rules="[{required: true,message: '回复不能为空', trigger: 'blur' }]"
        >
          <el-input size="mini" style="width: 300px;" rows="6" v-model="issueData.answer" type="textarea"
                    placeholder="placeholder"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="flage === 0" @click="handleIssueEnd('rulesForm')">确 定</el-button>
        <el-button type="primary" v-else @click="handleAddIssue('rulesForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { reqIsssueList, reqIssueAdd, reqIssueUpdate, reqIssueDelete } from '@/api/mall'

export default {
  name: 'Issue',
  data() {
    return {
      flage: null,
      loading: false,
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      question: '',
      dialogFormVisible: false,
      issueList: [],
      total: 0,
      formLabelWidth: '120px',
      issueData: {
        id: undefined,
        question: '',
        answer: ''
      }
    }
  },
  mounted() {
    this.getIssueList()
  },
  methods: {
    async getIssueList() {
      this.loading = true
      const result = await reqIsssueList(this.dateFrom)
      if (result.status === 200) {
        this.issueList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },

    // 编辑问题
    handleIssueUpdate(row) {
      this.flage = 0
      this.dialogFormVisible = true
      this.issueData = Object.assign({}, row)
    },
    // 确认修改
    handleIssueEnd(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const result = await reqIssueUpdate(this.issueData)
          if (result.status === 200) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getIssueList()
          }
        } else {
          this.$notify.error({
            title: '失败',
            message: '修改失败'
          })
          return false
        }
      })
    },

    // 添加
    handleIssueAdd() {
      this.flage = 1
      this.dialogFormVisible = true
      this.issueData = {}
    },

    // 确认添加
    handleAddIssue(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const result = await reqIssueAdd(this.issueData)
          if (result.status === 200) {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getIssueList()
          }
        } else {
          this.$notify.error({
            title: '失败',
            message: '添加失败'
          })
          return false
        }
      })
    },

    // 删除
    async handleIssueDelete(row) {
      const result = await reqIssueDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getIssueList()
      } else {
        this.$notify.error({
          title: '失败',
          message: '删除失败'
        })
      }
    },

    // 查找
    handleIssueFind() {
      this.dateFrom.question = this.question
      this.getIssueList()
    }
  }
}
</script>

<style scoped>

</style>
