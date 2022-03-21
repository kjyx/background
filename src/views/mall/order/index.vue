<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 20px">
      <el-input v-model="dataForm.nickname" placeholder="请输入用户名昵称" size="mini"
                style="width: 160px;margin-right: 10px;margin-bottom: 10px"
      ></el-input>
      <el-input v-model="dataForm.consignee" placeholder="请输入收货人名称" size="mini"
                style="width: 160px;margin-right: 10px;margin-bottom: 10px"
      ></el-input>
      <el-input v-model="dataForm.orderSn" placeholder="请输入订单编号" size="mini"
                style="width: 160px;margin-right: 10px;margin-bottom: 10px"
      ></el-input>
      <el-date-picker
        v-model="dataForm.timeArray"
        size="mini"
        style="margin-right: 10px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-select v-model="dataForm.orderStatusArray" style="margin-right: 10px;margin-bottom: 10px" size="mini" multiple
                 placeholder="请选择订单状态"
      >
        <el-option
          v-for="item in options"
          :key="item.orderStatusArray"
          :label="item.stateName"
          :value="item.orderStatusArray"
        >
        </el-option>
      </el-select>
      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-search" size="mini">查找</el-button>
      <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-download" size="mini">导出</el-button>
    </div>
    <div>
      <el-table style="width: 100%;" border size="mini" :data="orderList" v-loading="loading"
                element-loading-text="拼命加载中"
      >
        <el-table-column prop="prop" align="center" label="" width="50"></el-table-column>
        <el-table-column prop="prop" align="center" label="订单编号"></el-table-column>
        <el-table-column prop="prop" align="center" label="用户头像"></el-table-column>
        <el-table-column prop="prop" align="center" label="下单用户"></el-table-column>
        <el-table-column prop="prop" align="center" label="下单时间"></el-table-column>
        <el-table-column prop="prop" align="center" label="订单状态"></el-table-column>
        <el-table-column prop="prop" align="center" label="订单金额"></el-table-column>
        <el-table-column prop="prop" align="center" label="实付金额"></el-table-column>
        <el-table-column prop="prop" align="center" label="支付时间"></el-table-column>
        <el-table-column prop="prop" align="center" label="收货人"></el-table-column>
        <el-table-column prop="prop" align="center" label="收货电话"></el-table-column>
        <el-table-column prop="prop" align="center" label="物流单号"></el-table-column>
        <el-table-column prop="prop" align="center" label="物流渠道">
          <template slot-scope="{row,$index}">
            <el-tag v-for="(item,index) in orderChannel" :key="index" type="success">{{ item.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" align="center" width="200" label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reqOrderChannel, reqOrderList } from '@/api/mall'

export default {
  name: 'Order',
  data() {
    return {
      loading: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      options: [
        { orderStatusArray: 101, stateName: '未付款' },
        { orderStatusArray: 102, stateName: '用户取消' },
        { orderStatusArray: 103, stateName: '系统取消' },
        { orderStatusArray: 201, stateName: '已付款' },
        { orderStatusArray: 202, stateName: '申请退款' },
        { orderStatusArray: 203, stateName: '已退款' },
        { orderStatusArray: 301, stateName: '已发货' },
        { orderStatusArray: 401, stateName: '用户收货' },
        { orderStatusArray: 402, stateName: '系统收货' }
      ],
      value: '',
      dataForm: {
        page: 1,
        limit: 20,
        nickname: undefined,
        consignee: undefined,
        orderSn: undefined,
        timeArray: [],
        orderStatusArray: [],
        sort: 'add_time',
        order: 'desc'
      },
      orderList: [],
      orderChannel: []
    }
  },
  mounted() {
    this.getOrderList()
    this.getOrderChannel()
  },
  methods: {
    // 订单列表
    async getOrderList() {
      this.loading = true
      const result = await reqOrderList(this.dataForm)
      if (result.status === 200) {
        this.orderList = result.data.data.list
        this.loading = false
      }
    },
    // 快递列表
    async getOrderChannel() {
      const result = await reqOrderChannel()
      if (result.status === 200) {
        this.orderChannel = result.data.data.list
      }
    }
  }
}
</script>

<style scoped>

</style>
