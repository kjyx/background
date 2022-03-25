<template>
  <div class="app-container">
    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">名称</el-col>
        <el-col :span="4" class="table-cell-title">介绍名称</el-col>
        <el-col :span="4" class="table-cell-title">标签</el-col>
        <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="4" class="table-cell-title">最低消费</el-col>
        <el-col :span="4" class="table-cell-title">优惠面值</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.desc }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.tag }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.type | formatType }}</el-col>
        <el-col :span="4" class="table-cell">满{{ coupon.min }}元可用</el-col>
        <el-col :span="4" class="table-cell">减免{{ coupon.discount }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell-title">每人限额</el-col>
        <el-col :span="4" class="table-cell-title">当前状态</el-col>
        <el-col :span="4" class="table-cell-title">商品范围</el-col>
        <el-col :span="4" class="table-cell-title">有效期</el-col>
        <el-col :span="4" class="table-cell-title">优惠兑换码</el-col>
        <el-col :span="4" class="table-cell-title">发行数量</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon.limit }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.status | formatStatus }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.goodsType |formatGoodsType }}</el-col>
        <el-col :span="4" class="table-cell">{{ getTimeScope() }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.code }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.total === 0 ? '不限' : coupon.total }}</el-col>
      </el-row>
    </div>

    <div style="margin-top: 30px;margin-bottom: 30px">
      <el-input size="mini" style="width: 200px;margin-right: 10px" v-model="dateForm.userId" placeholder="请输入用户ID"
      ></el-input>
      <el-select size="mini" v-model="dateForm.status" style="margin-right: 10px" placeholder="请选择">
        <el-option v-for="item in statusUser" :key="item.id" :label="item.label" :value="item.id"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="getCouponListusre">查找</el-button>
    </div>
    <el-table style="width: 100%" :data="CouponListusre" size="mini" border >
      <el-table-column align="center" prop="prop" label="用户优惠卷ID" sortable></el-table-column>
      <el-table-column align="center" prop="prop" label="用户ID"></el-table-column>
      <el-table-column align="center" prop="prop" label="领取时间"></el-table-column>
      <el-table-column align="center" prop="prop" label="使用状态"></el-table-column>
      <el-table-column align="center" prop="prop" label="订单ID"></el-table-column>
      <el-table-column align="center" prop="prop" label="使用时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqCouponListuser, reqCouponRead } from '@/api/promotiion'

export default {
  name: 'CouponDetail',
  filters: {
    formatType(id) {
      if (id === 0) {
        return '通用领卷'
      } else if (id === 1) {
        return '注册赠卷'
      } else {
        return '兑换码'
      }
    },
    formatGoodsType(goodsType) {
      if (goodsType === 0) {
        return '全场通用'
      } else if (goodsType === 1) {
        return '指定分类'
      } else {
        return '指定商品'
      }
    },
    formatStatus(id) {
      if (id === 0) {
        return '正常'
      } else if (id === 1) {
        return '已过期'
      } else {
        return '已下架'
      }
    }

  },
  data() {
    return {
      statusUser: [
        { id: 0, label: '未使用' },
        { id: 1, label: '已使用' },
        { id: 2, label: '已过期' },
        { id: 3, label: '已下架' }
      ],
      CouponListusre: [],
      coupon: {},
      dateForm: {
        page: 1,
        limit: 20,
        couponId: 8,
        sort: 'add_time',
        order: 'desc',
        status: null,
        userId: null
      }
    }
  },
  mounted() {
    this.getCouponReadList(this.$route.query.id)
    this.getCouponListusre()
  },
  methods: {
    async getCouponReadList(id) {
      const result = await reqCouponRead(id)
      if (result.status === 200) {
        this.coupon = result.data.data
      }
    },
    async getCouponListusre() {
      const result = await reqCouponListuser(this.dateForm)
      if (result.status === 200) {
        this.CouponListusre = result.data.data.list
      }
    },
    getTimeScope() {
      if (this.coupon.timeType === 0) {
        return '领取' + this.coupon.days + '天有效'
      } else if (this.coupon.timeType === 1) {
        return '自' + this.coupon.startTime + '至' + this.coupon.endTime + '有效'
      } else {
        return '未知'
      }
    },
  }
}
</script>

<style scoped lang="scss">
.filter-container {
  margin-top: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  background: #F2F6FC;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
