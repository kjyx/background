<template>
  <div style="padding: 20px">
    <div style="padding-bottom: 20px; ">
      <el-input v-model="dateFrom.name" size="mini" style="margin-right: 10px; width: 200px" placeholder="请输入广告标题"/>
      <el-select v-model="dateFrom.type" size="mini" style="margin-right: 10px" clearable placeholder="请选择优惠卷类型">
        <el-option v-for="item in coupons" :value="item.type" :label="item.name"/>
      </el-select>
      <el-select v-model="dateFrom.status" size="mini" style="margin-right: 10px" clearable placeholder="请选择优惠卷状态">
        <el-option v-for="item in CouponState" :value="item.status" :label="item.name"/>
      </el-select>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="getCouponList">查找</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="couponCompileAndAdd">添加</el-button>
      <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button>
    </div>

    <el-table style="width: 100%" border size="mini" :data="couponList">
      <el-table-column align="center" prop="id" label="优惠卷ID" sortable/>
      <el-table-column align="center" prop="name" label="优惠卷名称"/>
      <el-table-column align="center" prop="desc" label="介绍"/>
      <el-table-column align="center" prop="tag" label="标签"/>
      <el-table-column align="center" prop="min" label="最低消费">
        <template v-slot="{row,$index}">
          <span>满{{ row.min }}元可用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="discount" label="满减金额">
        <template v-slot="{row,$index}">
          <span>减免{{ row.discount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="limit" label="每人限领"/>
      <el-table-column align="center" prop="goodsType" label="商品使用范围">
        <template v-slot="{row,$index}">
          <span>{{ goodsType(row.goodsType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="优惠卷类型">
        <template v-slot="{row,$index}">
          <span>{{ Type(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="total" label="优惠卷数量">
        <template v-slot="{row,$index}">
          <span>{{ row.total === 0 ? '不限' : row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template v-slot="{row,$index}">
          <span>{{ status(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prop" label="操作" width="300">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="$router.push({path:'/coupondetail',query:{id:row.id}})">详情
          </el-button>
          <el-button type="info" size="mini" @click="couponCompileAndAdd(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleCouponDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="dateFrom.page" :limit="dateFrom.limit" @pagination="getCouponList"/>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
      <el-form :label-position="labelPosition" label-width="100px" :model="couponQuery" size="mini">
        <el-form-item prop="name" label="优惠卷名称">
          <el-input v-model="couponQuery.name" class="inp" size="mini"/>
        </el-form-item>
        <el-form-item prop="desc" label="介绍">
          <el-input v-model="couponQuery.desc" class="inp" size="mini"/>
        </el-form-item>
        <el-form-item prop="tag" label="标签">
          <el-input v-model="couponQuery.tag" class="inp" size="mini"/>
        </el-form-item>
        <el-form-item prop="min" label="最低消费">
          <div class="div" style="width: 300px;">
            <el-input v-model="couponQuery.min" class="inp" placeholder="请输入内容" size="mini">
              <template slot="append">元</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="discount" label="满减金额">
          <div class="div" style="width: 300px;">
            <el-input v-model="couponQuery.discount" class="inp" placeholder="请输入内容" size="mini">
              <template slot="append">元</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="limit" label="最低限领">
          <div class="div" style="width: 300px;">
            <el-input v-model="couponQuery.limit" class="inp" placeholder="请输入内容" size="mini">
              <template slot="append">张</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="type" label="分发类型">
          <el-select v-model="couponQuery.type">
            <el-option v-for="(item,index) in coupons" :key="index" :label="item.name" :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="total" label="优惠卷数量">
          <div class="div" style="width: 300px;">
            <el-input v-model="couponQuery.total" class="inp" placeholder="请输入内容" size="mini">
              <template slot="append">张</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="days" label="有效期">
          <div>
            <el-radio-group v-model="radio" size="mini">
              <el-radio-button label="领卷相对天数"/>
              <el-radio-button label="指定绝对时间"/>
            </el-radio-group>
          </div>
          <div v-show="radio === '领卷相对天数'" class="div" style="width: 300px;margin-top: 10px">
            <el-input v-model="couponQuery.days" class="inp" placeholder="请输入内容" size="mini">
              <template slot="append">元</template>
            </el-input>
          </div>
          <div v-show="radio === '指定绝对时间'" class="block" style="margin-top: 10px;">
            <el-date-picker
              v-model="couponQuery.startTime"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="开始"
              style="width: 140px"
            />
            <span>至</span>
            <el-date-picker
              v-model="couponQuery.endTime"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              style="width: 140px"
              type="date"
              placeholder="结束"
            />
          </div>
        </el-form-item>
        <el-form-item label="商品限制范围">
          <div>
            <el-radio-group v-model="radio1" size="mini" @change="handlequehuan">
              <el-radio-button label="全场通用"/>
              <el-radio-button label="指定分类"/>
              <el-radio-button label="指定商品"/>
            </el-radio-group>
          </div>
          <div v-show="radio1 === '指定分类'" style="margin-top: 10px">
            <el-cascader ref="cascader" v-model="cartgoryValue" :options="cartgoryList" clearable/>
            <el-button type="primary" size="mini" @click="handleCartgoryAdd">添加</el-button>
            <div style="margin-top: 10px">
              <el-table style="width: 50%" border size="mini" :data="cartgoryAddList">
                <el-table-column align="center" prop="name" label="分类名称" width="200"/>
                <el-table-column align="center" prop="prop" label="操作">
                  <template v-slot="{row,$index}">
                    <el-button
                      style="background-color: #fff;border: none; color: #1e6abc;"
                      @click="cartgoryDelete(row,$index)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div v-show="radio1 === '指定商品'" style="margin-top: 10px">
            <el-cascader ref="cascader" v-model="goodsValue" :options="goodsList" clearable/>
            <el-button type="primary" size="mini" @click="handleGoodsAdd">添加</el-button>
            <div style="margin-top: 10px">
              <el-table style="width: 50%" border size="mini" :data="goodsAddList">
                <el-table-column align="center" prop="label" label="商品名称" width="120"/>
                <el-table-column align="center" prop="value" label="商品分类" width="80"/>
                <el-table-column align="center" prop="prop" label="操作">
                  <template v-slot="{row,$index}">
                    <el-button
                      type=""
                      style="background-color: #fff;border: none; color: #1e6abc;"
                      @click="goodsDelete(row,$index)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEndCreateAndUpdate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import {
  reqCategoryList,
  reqCouponCreate,
  reqCouponDelete,
  reqCouponList,
  reqCouponUpdate,
  reqGoodsList
} from '@/api/promotiion'

export default {
  name: 'Coupon',
  data() {
    return {
      goodsAddList: [],
      goodsValue: [],
      cartgoryAddList: [],
      cartgoryValue: [],
      radio: '领卷相对天数',
      radio1: '全场通用',
      labelPosition: 'left',
      dialogVisible: false,
      flag: null,
      title: '',
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
        order: 'desc',
        name: null,
        type: null,
        status: null
      },
      couponList: [],
      total: 0,
      cartgoryList: [],
      goodsList: [],
      couponQuery: {
        days: '',
        desc: '', // 价绍
        discount: '', // 满减金额
        endTime: null, // 结算时间
        goodsType: 1,
        goodsValue: [],
        limit: '', // 每人限领
        min: '', // 最低满减
        name: '', // 名字
        startTime: null, // 开始时间
        status: 0, // 状态
        tag: '', // 标签
        timeType: 0, //
        total: '', // 优惠卷数量
        type: 0 // 优惠卷类型
      }
    }
  },
  mounted() {
    this.getCouponList()
    this.getCartgoryList()
    this.getGoodsList()
  },
  methods: {
    // 优惠卷列表
    async getCouponList() {
      const result = await reqCouponList(this.dateFrom)
      if (result.status === 200) {
        this.couponList = result.data.data.list
        this.total = result.data.data.total
      }
    },
    // 分类
    async getCartgoryList() {
      const result = await reqCategoryList()
      if (result.status === 200) {
        const list = result.data.data.list
        list.forEach(item => {
          const children = []
          item.children.forEach(item1 => {
            children.push({
              label: item1.name,
              value: item1.id
            })
          })
          this.cartgoryList.push({
            label: item.name,
            value: item.id,
            children
          })
        })
      }
    },
    //
    async getGoodsList() {
      const result = await reqGoodsList(0)
      if (result.status === 200) {
        const list = result.data.data.list
        list.forEach(item => {
          this.goodsList.push({
            label: item.brief,
            value: item.id
          })
        })
      }
    },

    // 优惠卷类型
    Type(type) {
      if (type === 0) {
        return '通用领卷'
      } else if (type === 1) {
        return '注册赠卷'
      } else {
        return '兑换码'
      }
    },

    // 商品适用范围
    goodsType(type) {
      if (type === 0) {
        return '全场通用'
      } else if (type === 1) {
        return '指定分类'
      } else {
        return '指定商品'
      }
    },

    // 优惠卷状态
    status(id) {
      if (id === 0) {
        return '正常'
      } else if (id === 1) {
        return '已过期'
      } else {
        return '已下架'
      }
    },

    // 编辑and添加
    couponCompileAndAdd(row) {
      // 编辑
      if (row.id) {
        this.flag = 0
        this.title = '编辑'
        this.dialogVisible = true
        this.couponQuery = []
        this.couponQuery = Object.assign({}, row)
        // 点击编辑判断 goodsType的值
        this.cartgoryAddList = []
        this.goodsAddList = []
        if (this.couponQuery.goodsType === 1) {
          this.cartgoryList.forEach((item, index) => {
            item.children.forEach((item1, index1) => {
              this.couponQuery.goodsValue.forEach(item2 => {
                if (item1.value === item2) {
                  this.cartgoryAddList.push({
                    name: item.label + `>` + item1.label,
                    value: item1.value
                  })
                }
              })
            })
          })
          this.radio1 = '指定分类'
        } else if (this.couponQuery.goodsType === 2) {
          this.couponQuery.goodsValue.forEach(item => {
            this.goodsList.forEach(item1 => {
              if (item === item1.value) {
                this.goodsAddList.push(item1)
              }
            })
          })
          this.radio1 = '指定商品'
        }
      } else {
        // 添加
        this.flag = 1
        this.title = '添加'
        this.couponQuery = {
          days: '',
          desc: '',
          discount: '',
          endTime: null,
          goodsType: 1,
          goodsValue: [],
          limit: '',
          min: '',
          name: '',
          startTime: null,
          status: 0,
          tag: '',
          timeType: 0,
          total: '',
          type: 0
        }
        this.dialogVisible = true
      }
    },

    // 添分类
    handleCartgoryAdd() {
      if (this.cartgoryValue === null || this.cartgoryValue.length === 0) {
        this.$message({
          message: '请先选择商品分类',
          type: 'warning'
        })
        return
      } else {
        const nameList = []
        let name = ''
        let id = null
        // 遍历分类数组
        this.cartgoryList.forEach(item => {
          // 判断如果选中的数组里的第一个id等于item.value 就把 item.label push进数组里
          if (this.cartgoryValue[0] === item.value) {
            nameList.push(item.label)
            item.children.forEach(item1 => {
              if (this.cartgoryValue[1] === item1.value) {
                nameList.push(item1.label)
                id = item1.value
              }
            })
          }
        })
        // 现在 nameList 里面存的就是选中的两个值 把他们切割成字符串
        name = nameList.join('>')
        // 然后push进要展示的列表中
        this.cartgoryAddList.unshift({
          name,
          value: id
        })
        this.cartgoryValue = []
      }
    },

    // 删除分类
    cartgoryDelete(row, index) {
      this.cartgoryAddList.splice(index, 1)
      this.couponQuery.goodsValue.forEach((item, index) => {
        if (item === row.value) {
          this.couponQuery.goodsValue.splice(index, 1)
        }
      })
    },

    // 添加商品分类
    handleGoodsAdd() {
      this.goodsValue.forEach(item => {
        this.goodsList.forEach(item1 => {
          if (item === item1.value) {
            this.goodsAddList.unshift({
              label: item1.label,
              value: item1.value
            })
          }
        })
      })
      this.goodsValue = []
    },

    // 删除商品分类
    goodsDelete(row, index) {
      this.goodsAddList.splice(index, 1)
    },

    handlequehuan(name) {
      if (name === '指定分类') {
        this.couponQuery.goodsType = 1
      } else if (name === '指定商品') {
        this.couponQuery.goodsType = 2
      } else if (name === '全场通用') {
        this.couponQuery.goodsType = 0
      }
    },

    judgeGoodType() {
      if (this.couponQuery.goodsType === 1) {
        this.couponQuery.goodsValue = []
        this.cartgoryAddList.forEach(item => {
          this.couponQuery.goodsValue.push(item.value)
        })
      } else if (this.couponQuery.goodsType === 2) {
        this.couponQuery.goodsValue = []
        this.goodsAddList.forEach(item1 => {
          this.couponQuery.goodsValue.push(item1.value)
        })
      }
    },
    // 点击确认(编辑)
    async handleEndCreateAndUpdate() {
      if (this.flag === 0) {
        this.judgeGoodType()
        const result = await reqCouponUpdate(this.couponQuery)
        if (result.status === 200) {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getCouponList()
          this.couponQuery = {}
          this.cartgoryAddList = []
          this.goodsAddList = []
        }
      } else {
        this.judgeGoodType()
        const result = await reqCouponCreate(this.couponQuery)
        if (result.status === 200) {
        }
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        })
        this.getCouponList()
        this.dialogVisible = false
      }
    },

    // 删除优惠卷
    async handleCouponDelete(row) {
      const result = await reqCouponDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getCouponList()
      }
    }
  }
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

/deep/ .el-dialog__body {
  padding: 30px 20px;
}

/deep/ .el-form {
  margin-left: 50px;
}

.inp {
  width: 300px;
}
</style>

