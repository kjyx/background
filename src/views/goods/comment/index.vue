<template>
  <div style="padding: 20px">
    <div style="padding-bottom: 20px;">
      <el-input v-model="userId" size="mini" style="width: 200px; margin-right: 10px" placeholder="请输入用户ID"></el-input>
      <el-input v-model="valueId" size="mini" style="width: 200px; margin-right: 10px" placeholder="请输入商品ID"></el-input>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="handleCommentfind">查找</el-button>
      <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
    </div>
    <el-table style="width: 100%" border :data="commentList" size="mini">
      <el-table-column align="center" prop="userId" label="用户ID" width="180"></el-table-column>
      <el-table-column align="center" prop="valueId" label="商品ID" width="180"></el-table-column>
      <el-table-column align="center" prop="star" label="打分"></el-table-column>
      <el-table-column align="center" prop="content" label="评论内容"></el-table-column>
      <el-table-column align="center" prop="picUrls" label="评论图片">
        <template v-slot="{row,$index}">
          <el-image :preview-src-list="srcList" :src="item" v-for="item in row.picUrls"
                    style="height: 50px;margin-right: 5px" @click="handleClickImages(item)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="时间"></el-table-column>
      <el-table-column align="center" prop="prop" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleReply(row)">回复</el-button>
          <el-button type="danger" size="mini" @click="handleCommentDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="dateFrom.page" :limit.sync="dateFrom.limit" @pagination="getCommentList"></pagination>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="replayQuery" label-width="80px">
        <el-form-item label="回复内容">
          <el-input type="textarea" style="width: 50%;" rows="5" v-model="replayQuery.content"
                    placeholder="placeholder"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleEndReply">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqCommentList, reqOrderReply, reqCommentDelete } from '@/api/goods'

export default {
  name: 'Comment',
  data() {
    return {
      dialogVisible: false,
      commentList: [],
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      userId: null,
      valueId: null,
      replayQuery: {
        commentId: null,
        content: ''
      },
      srcList: []
    }
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const result = await reqCommentList(this.dateFrom)
      if (result.status === 200) {
        this.commentList = result.data.data.list
        this.total = result.data.data.total
      }
    },

    // 点击图片放大
    handleClickImages(item) {
      this.srcList.splice(0, 1, item)
    },
    // 回复
    handleReply(row) {
      this.replayQuery.commentId = row.id
      this.dialogVisible = true
    },
    // 确认回复
    async handleEndReply() {
      try {
        await reqOrderReply(this.replayQuery)
        this.$notify({
          title: '成功',
          message: '回复成功',
          type: 'message'
        })
      } catch (e) {
        this.$notify.error({
          title: '失败',
          message: e.data.errmsg
        })
      }
      this.dialogVisible = false
    },

    // 删除
    async handleCommentDelete(row) {
      const result = await reqCommentDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getCommentList()
      } else {
        this.$notify.error({
          title: '失败',
          message: '删除失败'
        })
      }
    },

    // 查找
    handleCommentfind() {
      this.dateFrom.userId = this.userId
      this.dateFrom.valueId = this.valueId
      this.getCommentList()
    }
  }
}
</script>

<style scoped>

</style>
