<template>
  <div style="padding: 20px;">
    <div style="margin-bottom: 20px">
      <el-input placeholder="请输入商品编号" size="mini" style="width: 200px;margin-right: 10px"></el-input>
      <el-button size="mini" type="primary" icon="el-icon-search">查找</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table style="width: 100%" :data="grouponList" border size="mini">
      <el-table-column align="center" prop="id" label="团购规则ID"></el-table-column>
      <el-table-column align="center" prop="goodsId" label="商品ID"></el-table-column>
      <el-table-column align="center" prop="goodsName" label="名称"></el-table-column>
      <el-table-column align="center" prop="picUrl" label="图片">
        <template v-slot="{row,$index}">
          <img :src="row.picUrl" alt="" style="width: 40px;height: 40px;">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="discount" label="团购优惠"></el-table-column>
      <el-table-column align="center" prop="discountMember" label="团购要求"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template v-slot="{row,$index}">
          <el-tag size="mini">{{ row.status === 1 ? '到期下线' : '' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="expireTime" label="结束时间"></el-table-column>
      <el-table-column align="center" prop="prop" label="操作" width="200">
        <template v-show="{row,$index}">
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqGrouponList } from '@/api/promotiion'

export default {
  name: 'Grouponrule',
  data() {
    return {
      grouponList: [],
      total: 0,
      dateForm: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  mounted() {
    this.getGrouponList()
  },
  methods: {
    async getGrouponList() {
      const result = await reqGrouponList(this.dateForm)
      if (result.status === 200) {
        this.grouponList = result.data.data.list
        this.total = result.data.data.total
      }
    }
  }
}
</script>

<style scoped>

</style>
