<template>
  <div style="padding: 20px">
    <div style="padding-bottom: 20px; ">
      <el-input v-model="name" size="mini" style="margin-right: 10px; width: 200px" placeholder="请输入广告标题"></el-input>
      <el-input v-model="content" size="mini" style="margin-right: 10px; width: 200px" placeholder="请输入广告内容"></el-input>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="handleAdFind">查找</el-button>
      <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleAdCompileAndAdd">添加</el-button>
      <el-button size="mini" type="primary" icon="el-icon-download">导出</el-button>
    </div>

    <el-table style="width: 100%" border size="mini" :data="adList">
      <el-table-column align="center" prop="id" label="广告ID" sortable></el-table-column>
      <el-table-column align="center" prop="name" label="广告标语"></el-table-column>
      <el-table-column align="center" prop="content" label="广告内容"></el-table-column>
      <el-table-column align="center" prop="url" label="广告图片">
        <template v-slot="{row, $index}">
          <el-image style="width: 100px;height: 50px;" :src="row.url" :preview-src-list="srcList"
                    @click="srcList.splice(0,1,row.url)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="position" label="广告位置"></el-table-column>
      <el-table-column align="center" prop="link" label="活动链接"></el-table-column>
      <el-table-column align="center" prop="enabled" label="是否启用">
        <template v-slot="{row,$index}">
          <el-tag size="mini" type="success">{{ row.enabled === true ? '启用' : '不启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleAdCompileAndAdd(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleAdDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="dateFrom.page"  :limit="dateFrom.limit" @pagination="getAdList"></pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="adQuery" label-width="80px" style="padding: 0 50px">
        <el-form-item label="广告标题" prop="name" :rules="[ { required: true, message: '标题不能为空', trigger: 'blur' },]">
          <el-input v-model="adQuery.name" style="width: 500px" size="mini" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item label="广告内容" prop="content" :rules="[ { required: true, message: '广告不能为空', trigger: 'blur' },]">
          <el-input v-model="adQuery.content" style="width: 500px" size="mini" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item label="广告图片" prop="url" :rules="[ { required: true, message: '图片不能为空', trigger: 'blur' },]">
          <template v-slot="{row,$index}">
            <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="`${baseUrl}/storage/create`"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="adQuery.url" :src="adQuery.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </template>
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
          <template v-slot="{row,$index}">
            <el-select v-model="adQuery.position" size="mini">
              <el-option :label="item.name" :value="item.id" v-for="item in positions" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="活动链接" prop="link">
          <template v-slot="{row, $index}">
            <el-input v-model="adQuery.link" style="width: 500px" size="mini" placeholder="请输入活动链接"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <template v-slot="{row, $index}">
            <el-select v-model="adQuery.enabled" size="mini">
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in enabled" :key="index"></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEndUpdate('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqAdCreate, reqAdDelete, reqAdList, reqAdUpdate } from '@/api/promotiion'
import { getToken } from '@/utils/auth'

export default {
  name: 'Ad',
  data() {
    return {
      flag: null,
      baseUrl: 'http://182.160.8.76:8080/admin',
      dialogVisible: false,
      title: '',
      name: null,
      content: null,
      dateFrom: {
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      positions: [{ id: 1, name: '首页' }],
      enabled: [{ id: true, name: '启用' }, { id: false, name: '不启用' }],
      adQuery: {},
      srcList: [],
      adList: [],
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
    this.getAdList()
  },
  methods: {
    async getAdList() {
      const result = await reqAdList(this.dateFrom)
      if (result.status === 200) {
        this.adList = result.data.data.list
        this.total = result.data.data.total
      }
    },

    // 点击编辑and添加
    handleAdCompileAndAdd(row) {
      if (row.id) {
        this.flag = 0
        this.title = '编辑'
        this.adQuery = Object.assign({}, row)
        this.dialogVisible = true
      } else {
        this.flag = 1
        this.title = '添加'
        this.adQuery = {}
        this.dialogVisible = true
      }
    },
    // 确认
    handleEndUpdate(from) {
      this.$refs[from].validate(async(valid) => {
        if (valid) {
          if (this.flag === 0) {
            const result = await reqAdUpdate(this.adQuery)
            if (result.status === 200) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getAdList()
            }
          } else {
            const result = await reqAdCreate(this.adQuery)
            if (result.status === 200) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getAdList()
            }
          }
        }
      })
    },

    // 上传图片
    handleAvatarSuccess(res) {
      console.log(res)
      this.adQuery.url = res.data.url
    },

    // 删除
    async handleAdDelete(row) {
      const result = await reqAdDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getAdList()
      }
    },

    // 查找
    handleAdFind() {
      this.dateFrom.name = this.name
      this.dateFrom.content = this.content
      this.getAdList()
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
