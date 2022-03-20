<template>
  <div style="padding: 20px">
    <el-table style="width: 100%" :data="RegionList" border row-key="id" v-loading="listLoading" element-loading-text="正在加载中。。。">
      <el-table-column prop="name" label="区域名称"></el-table-column>
      <el-table-column prop="type" label="区域类型">
        <template slot-scope="{row,$index}">
          {{ row.type | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="区域编码"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqRegionList } from '@/api/mall'

export default {
  name: 'Region',
  filters: {
    typeFilter(status) {
      const typeMap = {
        '1': '省',
        '2': '市',
        '3': '区'
      }
      return typeMap[status]
    }
  },
  data() {
    return {
      RegionList: [],
      listLoading: true
    }
  },
  mounted() {
    this.listLoading = true
    this.getRegionList()
  },
  methods: {
    async getRegionList() {
      const result = await reqRegionList()
      if (result.status === 200) {
        this.RegionList = result.data.data.list
        this.listLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
