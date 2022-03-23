<template>
  <div style="padding: 20px">
    <div style="padding-bottom: 20px; ">
      <el-input size="mini" style="margin-right: 10px; width: 200px" placeholder="请输入广告标题"></el-input>
      <el-select :value="dateFrom.type" size="mini" style="margin-right: 10px" placeholder="请选择优惠卷类型">
        <el-option :value="item.type" :label="item.name" v-for="item in coupons"></el-option>
      </el-select>
      <el-select :value="dateFrom.status" size="mini" style="margin-right: 10px" placeholder="请选择优惠卷状态">
        <el-option :value="item.status" :label="item.name" v-for="item in CouponState"></el-option>
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search">查找</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button>
    </div>

    <el-table style="width: 100%" border size="mini" :data="adList">
      <el-table-column align="center" prop="id" label="广告ID" sortable></el-table-column>
      <el-table-column align="center" prop="name" label="广告标语"></el-table-column>
      <el-table-column align="center" prop="content" label="广告内容"></el-table-column>
      <el-table-column align="center" prop="url" label="广告图片"></el-table-column>
      <el-table-column align="center" prop="position" label="广告位置"></el-table-column>
      <el-table-column align="center" prop="link" label="活动链接"></el-table-column>
      <el-table-column align="center" prop="enabled" label="是否启用"></el-table-column>
      <el-table-column align="center" prop="address" label="操作"></el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="dateFrom.page" :limit="dateFrom.limit" @pagination="getAdList"></pagination>
  </div>
</template>

<script>

export default {
  name: 'Coupon',
  data() {
    return {
      coupons: [
        { type: 0, name: '通用领卷' },
        { type: 1, name: '注册赠卷' },
        { type: 2, name: '兑换码' }
      ],
      CouponState: [
        { status: 0, name: '正常' },
        { status: 1, name: '已过期' },
        { status: 2, name: '已下架' }
      ],
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style scoped>
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

