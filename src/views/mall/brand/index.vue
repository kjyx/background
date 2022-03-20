<template>
  <div style="padding: 20px;">
    <el-input v-model="id" placeholder="请输入品牌商ID" size="mini" style="width: 200px;margin-right: 10px"/>
    <el-input v-model="name" placeholder="请输入品牌商名称" size="mini" style="width: 200px;margin-right: 10px"/>
    <el-button type="primary" size="mini" @click="handleBrandSearch">查找</el-button>
    <el-button type="primary" size="mini" @click="handleAddBrand">添加</el-button>
    <el-button type="primary" size="mini">导出</el-button>

    <el-table style="width: 100%; margin-top: 20px" size="mini" border :data="brandList" v-loading="listLoading"
              element-loading-text="正在加载中。。。"
    >
      <el-table-column prop="id" label="品牌商ID" align="center"/>
      <el-table-column prop="name" label="品牌商名称" align="center"/>
      <el-table-column prop="picUrl" label="品牌商图片" align="center">
        <template slot-scope="{row,$index}">
          <el-image :src="row.picUrl" style="width: 80px;" :preview-src-list="srcList"
                    @click="previewImg(row)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="介绍" min-width="400" align="center"/>
      <el-table-column prop="floorPrice" label="底价" align="center"/>
      <el-table-column prop="address" label="操作" align="center" width="150">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleBrandAdd(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleBrandDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="brandParams.page"
      :limit.sync="brandParams.limit"
      @pagination="getBrandList"
    />

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="formName" label-width="100px" :model="brandInfo">

        <el-form-item label="品牌商名称" prop="username">
          <el-input v-model="dataForm.name" autocomplete="off" size="mini" style="width: 300px;"/>
        </el-form-item>

        <el-form-item label="介绍" prop="password">
          <el-input v-model="dataForm.desc" autocomplete="off" size="mini" style="width: 300px;"/>
        </el-form-item>

        <el-form-item label="品牌商图片" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="`${baseUrl}/storage/create`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="dataForm.picUrl" class="avatar" :src="dataForm.picUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="底价">
          <el-input v-model="dataForm.floorPrice" placeholder="placeholder" size="mini" style="width: 300px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="flage === 0" type="primary" @click="handleConfirmAlter">确 定</el-button>
        <el-button v-else type="primary" @click="handleAppend">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { reqBrandAdd, reqBrandDelete, reqBrandList, reqBrandUpdate } from '@/api/mall'
import { getToken } from '@/utils/auth'

export default {
  name: 'Brand',
  data() {
    return {
      baseUrl: 'http://182.160.8.76:8080/admin',
      flage: null,
      listLoading: true,
      dialogFormVisible: false,
      brandList: [],
      brandParams: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      srcList: [],
      id: '',
      name: '',
      dataForm: {
        id: undefined,
        name: '',
        desc: '',
        floorPrice: undefined,
        picUrl: undefined
      },
      brandInfo: {},
      total: 0
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  mounted() {
    this.listLoading = true
    this.getBrandList()
  },
  methods: {
    async getBrandList() {
      this.listLoading = true
      const result = await reqBrandList(this.brandParams)
      if (result.status === 200) {
        this.brandList = result.data.data.list
        this.total = result.data.data.total
        this.listLoading = false
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.dataForm.picUrl = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 编辑
    handleBrandAdd(row) {
      this.flage = 0
      this.dialogFormVisible = true
      this.dataForm = Object.assign({}, row)
    },
    // 确认修改
    async handleConfirmAlter() {
      const result = await reqBrandUpdate(this.dataForm)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.getBrandList()
      }
    },

    // 添加
    handleAddBrand() {
      this.flage = 1
      this.dataForm = {}
      this.dialogFormVisible = true
    },
    // 确认添加
    async handleAppend() {
      const result = await reqBrandAdd(this.dataForm)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        })
        this.getBrandList()
      }
    },

    // 删除
    async handleBrandDelete(row) {
      const result = await reqBrandDelete(row)
      if (result.status === 200) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success'
        })
        this.getBrandList()
      }
    },

    // 搜索
    handleBrandSearch() {
      this.listLoading = true
      this.brandParams.id = this.id
      this.brandParams.name = this.name
      this.getBrandList()
    },

    previewImg(row) {
      this.srcList.splice(0)
      this.srcList.push(row.picUrl)
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
</style>
