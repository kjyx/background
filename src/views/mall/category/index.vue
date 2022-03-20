<template>
  <div style="padding: 30px">
    <el-button type="primary" size="mini" style="margin-left: 100px" @click="handleCategoryAdd">添加</el-button>
    <el-table
      v-loading="loading"
      size="mini"
      :data="CategoryList"
      style="width: 100%;margin-bottom: 20px; margin-top: 20px"
      element-loading-text="拼命加载中"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" align="center" label="类目ID"/>
      <el-table-column prop="name" align="center" label="类目名"/>
      <el-table-column prop="iconUrl" align="center" label="类目图标">
        <template slot-scope="{row, $index}">
          <img :src="row.iconUrl" alt="" style="height: 40px;">
        </template>
      </el-table-column>
      <el-table-column prop="picUrl" align="center" label="类目图片">
        <template slot-scope="{row,$idnex}">
          <el-image :src="row.picUrl" style="height: 40px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" label="关键字"/>
      <el-table-column prop="desc" align="center" label="简介"/>
      <el-table-column prop="level" align="center" label="级别">
        <template slot-scope="{row,$index}">
          <el-tag :type="row.level === 'L1' ? '': 'info'">{{ row.level | Levels }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="categoryCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleCartgoryDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    对话框-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" size="mini" :model="dataForm">
        <el-form-item label="类目名称" :rules="[{ required: true, message: '名称不能为空'}]" prop="name"
                      :label-width="formLabelWidth"
        >
          <el-input v-model="dataForm.name" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords" :label-width="formLabelWidth">
          <el-input v-model="dataForm.keywords" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="级别" prop="level" :label-width="formLabelWidth">
          <el-select v-model="dataForm.level" placeholder="请选择活动区域" @change="SelectChange">
            <el-option v-for="(item,index) in leimu" :key="index" :label="item.name" :value="item.level"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid" :label-width="formLabelWidth">
          <el-select v-model="dataForm.pid">
            <el-option v-for="item in CategoryL1list" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类目图标" prop="iconUrl" :label-width="formLabelWidth">
          <template slot-scope="{row,$index}">
            <el-upload
              class="avatar-uploader"
              :headers="headers"
              :action="`${baseUrl}/storage/create`"
              :show-file-list="false"
              :on-success="handleAvatarIconSuccess"
            >
              <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="类目图片" prop="picUrl" :label-width="formLabelWidth">
          <template slot-scope="{row,$index}">
            <el-upload
              class="avatar-uploader"
              :headers="headers"
              :action="`${baseUrl}/storage/create`"
              :show-file-list="false"
              :on-success="handleAvatarUrlSuccess"
            >
              <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="类目简介" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="dataForm.desc" autocomplete="off" style="width: 300px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="flag === 0" type="primary" @click="ConfirmEditorCategory">确 定</el-button>
        <el-button v-else type="primary" @click="handleConfirmAdd('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqCategoryCreate, reqCategoryL1, reqCategoryList, reqCategoryUpdate, reqCartgoryDelete } from '@/api/mall'
import { getToken } from '@/utils/auth'

export default {
  name: 'Category',
  filters: {
    // 级别
    Levels(level) {
      if (level === 'L1') {
        return '一级类目'
      } else {
        return '二级类目'
      }
    }
  },
  data() {
    return {
      flag: null,
      baseUrl: 'http://182.160.8.76:8080/admin',
      CategoryList: [],
      CategoryL1list: [],
      total: 0,
      color: '',
      loading: true,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      title: '',
      dataForm: {
        id: null,
        name: null,
        keywords: null,
        level: null,
        iconUrl: null,
        picUrl: null,
        desc: null,
        pid: 0
      },
      leimu: [
        { level: 'L1', name: '一级类目' },
        { level: 'L2', name: '二级类目' }
      ]
    }
  },
  computed: {
    // 图片上传携带的请求头
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  mounted() {
    this.getCategoryList()
    this.getCategoryL1List()
  },
  methods: {
    // 全部商品类目
    async getCategoryList() {
      const result = await reqCategoryList()
      if (result.status === 200) {
        this.CategoryList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },
    // 以及商品类目
    async getCategoryL1List() {
      const result = await reqCategoryL1()
      if (result.status === 200) {
        this.CategoryL1list = result.data.data.list
      }
    },
    // 编辑
    categoryCompile(row) {
      console.log(row)
      this.dialogFormVisible = true
      this.flag = 0
      this.title = '编辑类目'
      this.dataForm = Object.assign({}, row)
    },
    // 确认编辑
    async ConfirmEditorCategory() {
      const result = await reqCategoryUpdate(this.dataForm)
      if (result.status === 200) {
        await this.getCategoryList()
        await this.getCategoryL1List()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success'
        })
        this.dialogFormVisible = false
      }
    },
    // 当选中类目发生生改变时
    SelectChange() {
      if (this.dataForm.level === 'L1') {
        this.dataForm.pid = 0
      }
    },
    // 图片
    handleAvatarIconSuccess(res, file) {
      this.dataForm.iconUrl = res.data.url
    },
    handleAvatarUrlSuccess(res, file) {
      this.dataForm.picUrl = res.data.url
    },

    // 添加类目
    handleCategoryAdd() {
      this.flag = 1
      this.title = '添加类目'
      this.dialogFormVisible = true
      this.dataForm = {}
    },
    handleConfirmAdd(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const result = await reqCategoryCreate(this.dataForm)
          if (result.status === 200) {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getCategoryList()
            this.getCategoryL1List()
          }
        } else {
          alert('类目名不能为空')
          return false
        }
      })
    },

    // 删除类目
    async handleCartgoryDelete(row) {
      const result = await reqCartgoryDelete(row)
      if (result.status === 200) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.getCategoryL1List()
        this.getCategoryList()
      } else {
        this.$notify.error({
          title: '失败',
          message: '删除失败'
        })
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
</style>
