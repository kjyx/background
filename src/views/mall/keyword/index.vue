<template>
  <div style="padding: 20px;">
    <div style="margin-bottom: 20px">
      <el-input v-model="keyword" placeholder="请输入关键字" size="mini" style="width: 200px;margin-right: 10px"></el-input>
      <el-input v-model="url" placeholder="请输入跳转链接" size="mini" style="width: 200px;margin-right: 10px"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleKeywordFind">查找</el-button>
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleKeywordAdd">添加</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini">导出</el-button>
    </div>
    <el-table :data="keywordList" border size="mini" style="width: 100%" v-loading="loading"
              element-loading-text="拼命加载中。。" :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="id" align="center" label="关键词ID" sortable></el-table-column>
      <el-table-column prop="keyword" align="center" label="关键词"></el-table-column>
      <el-table-column prop="url" align="center" label="跳转链接" min-width="300"></el-table-column>
      <el-table-column prop="isHot" align="center" label="是否推荐">
        <template slot-scope="{row,$index}">
          <el-tag :type="row.isHot === false ? '': 'success'" size="mini">{{ row.isHot === false ? '否' : '是' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDefault" align="center" label="是否默认">
        <template slot-scope="{row,$indedx}">
          <el-tag :type="row.isDefault === false ? '': 'success'" size="mini">{{ row.isDefault === false ? '否' : '是' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleKeywordCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleKeywordDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="keyWordUpadte" size="mini" ref="dynamicValidateForm">
        <el-form-item prop="keyword" label="关键词" :label-width="formLabelWidth"
                      :rules="[ { required: true, message: '关键词不能为空', trigger: 'blur' },]"
        >
          <el-input v-model="keyWordUpadte.keyword" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="跳转链接" :label-width="formLabelWidth">
          <el-input v-model="keyWordUpadte.url" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item prop="isHot" label="是否推荐" :label-width="formLabelWidth">
          <el-select v-model="keyWordUpadte.isHot" placeholder="请选择活动区域">
            <el-option v-for="(item,index) in isHot" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isDefault" label="是否默认" :label-width="formLabelWidth">
          <el-select v-model="keyWordUpadte.isDefault" placeholder="请选择活动区域">
            <el-option v-for="(item,index) in isDefault" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="flag === 0" @click="handleKeywordUpdate('dynamicValidateForm')">确 定</el-button>
        <el-button type="primary" v-else @click="handleKeywordCreate('dynamicValidateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqKeywordList, reqKetwordUpdate, reqKeywordCreate, reqkeywordDelete } from '@/api/mall'

export default {
  name: 'Keyword',
  data() {
    return {
      flag: null,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      url: undefined,
      keyword: undefined,
      isHot: [
        { id: true, name: '是' },
        { id: false, name: '否' }
      ],
      isDefault: [
        { id: true, name: '是' },
        { id: false, name: '否' }
      ],
      keyWordUpadte: {
        isDefault: null,
        isHot: null,
        keyword: '',
        url: ''
      },
      keywordList: [],
      total: 0,
      loading: true
    }
  },
  mounted() {
    this.getKeywordList()
  },
  methods: {
    async getKeywordList() {
      this.loading = true
      const result = await reqKeywordList(this.dateFrom)
      if (result.status === 200) {
        this.keywordList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },

    // 编辑
    handleKeywordCompile(row) {
      this.flag = 0
      this.keyWordUpadte = Object.assign({}, row)
      this.dialogFormVisible = true
    },

    // 确认
    handleKeywordUpdate(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const result = await reqKetwordUpdate(this.keyWordUpadte)
          if (result.status === 200) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getKeywordList()
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

    // 查找
    handleKeywordFind() {
      this.dateFrom.keyword = this.keyword
      this.dateFrom.url = this.url
      this.getKeywordList()
    },

    // 添加
    handleKeywordAdd() {
      this.flag = 1
      this.dialogFormVisible = true
      this.keyWordUpadte = {}
    },

    // 确认添加
    handleKeywordCreate(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const result = await reqKeywordCreate(this.keyWordUpadte)
          if (result.status === 200) {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getKeywordList()
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
    async handleKeywordDelete(row) {
      const result = await reqkeywordDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getKeywordList()
      }
    }
  }
}
</script>

<style scoped>

</style>
