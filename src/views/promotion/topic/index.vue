<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 10px">
      <el-input size="mini" style="width: 200px; margin-right: 10px" v-model="dateForm.title" placeholder="请输入专题标题"></el-input>
      <el-input size="mini" style="width: 200px; margin-right: 10px" v-model="dateForm.subtitle" placeholder="请输入专题字标题"></el-input>
      <el-select size="mini" style="width: 200px; margin-right: 10px" v-model="dateForm.sort">
        <el-option v-for="(item,index) in sortSelect" :label="item.label" :value="item.sort"></el-option>
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="getTopicList">查找</el-button>
      <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <div style="margin-bottom: 10px; display: flex; justify-content: right">
      <el-button size="mini" type="primary" icon="l-icon-edit" @click="handleTopicEditAndCreate">添加</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleTopicBatchDetail">批量删除</el-button>
    </div>

    <el-table style="width: 100%" border size="mini" :data="topicList" v-loading="loading"
              element-loading-text="拼命加载中。。。" @selection-change="selectChange"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="title" label="专题标题" width="130"></el-table-column>
      <el-table-column align="center" prop="subtitle" label="专题字标题" width="300"></el-table-column>
      <el-table-column align="center" prop="picUrl" label="图片">
        <template v-slot="{row,$index}">
          <el-image :src="row.picUrl" style="height: 40px; width: 40px"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="专题详情">
        <template v-slot="{row,$index}">
          <el-button size="mini" type="primary" @click="examineContent(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="底价"></el-table-column>
      <el-table-column align="center" prop="readCount" label="阅读数量"></el-table-column>
      <el-table-column align="center" prop="address" label="操作" width="180">
        <template v-slot="{row,$index}">
          <el-button size="mini" type="primary" @click="handleTopicEditAndCreate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleTopicDetail(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="dateForm.page" :limit.sync="dateForm.limit" @pagination="getTopicList"
    ></pagination>

    <!--    详情-->
    <el-dialog
      title="详情"
      :visible.sync="centerDialogVisible"
      width="55%"
      center
    >
      <span v-html="topicContent"></span>
    </el-dialog>
  </div>
</template>

<script>
import { reqTopicBatchDelete, reqTopiceDelete, reqTopicList } from '@/api/promotiion'

export default {
  name: 'Topic',
  data() {
    return {
      selectList: [],
      batchDelete: {
        ids: []
      },
      topicContent: null,
      centerDialogVisible: false,
      loading: true,
      sortSelect: [
        { sort: 'id', label: '按序号排序' },
        { sort: 'add_time', label: '按时间排序' },
        { sort: 'price', label: '按价格排序' }
      ],
      dateForm: {
        page: 1,
        limit: 20,
        title: null,
        subtitle: null,
        sort: 'add_time',
        order: 'desc'
      },
      topicList: [],
      total: 0
    }
  },
  mounted() {
    this.getTopicList()
  },
  methods: {
    async getTopicList() {
      this.loading = true
      const result = await reqTopicList(this.dateForm)
      if (result.status === 200) {
        this.topicList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },

    // 查看详情
    examineContent(row) {
      this.centerDialogVisible = true
      this.topicContent = row.content
    },

    // 添加and编辑
    handleTopicEditAndCreate(row) {
      // 如果有id就是编辑
      if (row.id) {
        this.$router.push({ name: 'TopicCeateAndEdit', query: { id: row.id } })
      } else {
        this.$router.push('topic-reateAndedit')
      }
    },

    // 删除
    async handleTopicDetail(row) {
      const result = await reqTopiceDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getTopicList()
      }
    },

    // checked
    selectChange(select) {
      this.selectList = select
    },

    // 批量删除
    async handleTopicBatchDetail() {
      this.selectList.forEach(item => {
        this.batchDelete.ids.push(item.id)
      })
      const result = await reqTopicBatchDelete(this.batchDelete)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '批量删除成功',
          type: 'success'
        })
        this.getTopicList()
      }
    },

  }
}
</script>

<style scoped>

</style>
