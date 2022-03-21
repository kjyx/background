<template>
  <div style="padding: 20px">
    <div style="padding-bottom: 10px">
      <el-input style="margin: 0 10px 10px 0;width: 200px" placeholder="请输入商品ID" size="mini"/>
      <el-input style="margin: 0 10px 10px 0;width: 200px" placeholder="请输入商品编号" size="mini"/>
      <el-input style="margin: 0 10px 10px 0;width: 200px" placeholder="请输入商品名称" size="mini"/>
      <el-button type="primary" icon="el-icon-search" size="mini">查找</el-button>
      <el-button type="primary" icon="el-icon-edit" size="mini">添加</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini">导出</el-button>
    </div>
    <el-table
      v-loading="loading"
      style="width: 100%"
      :data="goodsList"
      border
      size="mini"
      element-loading-text="正在加载中。。"
    >
      <el-table-column align="center" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" size="mini">
            <el-form-item label="商品编号">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="宣传画廊" prop="">
              <template v-for="item in props.row.gallery">
                <el-image style="width: 40px;margin-right: 10px" :src="item" :preview-src-list="srcList"
                          @click="handleGoodsImage(item)"
                />
              </template>
            </el-form-item>
            <el-form-item label="商品介绍">
              <span>{{ props.row.brief }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="关键字">
              <span>{{ props.row.keywords }}</span>
            </el-form-item>
            <el-form-item label="类目ID">
              <span>{{ props.row.categoryId }}</span>
            </el-form-item>
            <el-form-item label="品牌上ID">
              <span>{{ props.row.brandId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品 ID" prop="id"/>
      <el-table-column align="center" label="名称" style="font-size: 12px;" width="200" prop="name"/>
      <el-table-column align="center" label="图片" prop="picUrl">
        <template slot-scope="{row,$index}">
          <el-image style="width: 40px; height: 40px" :src="row.picUrl" :preview-src-list="srcList"
                    @click="handleGoodsImage(row.picUrl)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="分享图" prop="desc"/>
      <el-table-column align="center" label="详情" prop="desc">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleGoodsInfo(row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场售价" prop="counterPrice"/>
      <el-table-column align="center" label="当前价格" prop="retailPrice"/>
      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="{row,$index}">
          <el-tag :type="row.isNew === true ? 'success': ''" size="mini">{{ row.isNew === true ? '新品' : '非新品' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否热卖" prop="isHot">
        <template slot-scope="{row,$index}">
          <el-tag :type="row.isHot === true ? 'success': ''" size="mini">{{ row.isHot === true ? '热卖' : '非热卖' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="{row,$index}">
          <el-tag :type="row.isOnSale === true ? 'success': ''" size="mini">{{ row.isOnSale === true ? '在售' : '未售' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="desc" width="200">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="$router.push({path:'/goods/edit',query:{id: row.id}})">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="dateFrom.page" :limit.sync="dateFrom.limit" @pagination="getGoodsList"
    ></pagination>

    <el-dialog title="商品详情" :visible.sync="centerDialogVisible" width="50%" center>
      <span v-html="goodsInfo" style="text-align: center;"></span>
    </el-dialog>
  </div>
</template>

<script>
import { reqGoodsList } from '@/api/goods'

export default {
  name: 'List',
  data() {
    return {
      centerDialogVisible: false,
      srcList: [],
      loading: false,
      goodsList: [],
      total: 0,
      goodsInfo: '',
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      this.loading = true
      const result = await reqGoodsList(this.dateFrom)
      if (result.status === 200) {
        this.goodsList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },

    // 查看
    handleGoodsInfo(row) {
      this.centerDialogVisible = true
      this.goodsInfo = row.detail
    },

    // 点击图片预览
    handleGoodsImage(picUrl) {
      this.srcList.splice(0, 1, picUrl)
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
