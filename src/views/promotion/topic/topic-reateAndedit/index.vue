<template>
  <div style="padding: 20px">
    <el-form ref="form" :model="topicRead" label-width="100px" size="mini" style="width: 800px; margin-left: 50px;">
      <el-form-item label="专题标题" prop="title" :rules="[ { required: true, message: '请输入专题标题', trigger: 'blur' }]">
        <el-input size="mini" v-model="topicRead.title" placeholder="请填写专题标题"></el-input>
      </el-form-item>
      <el-form-item label="专题子标题" prop="subtitle" :rules="[ { required: true, message: '请填写专题子标题', trigger: 'blur' }]">
        <el-input size="mini" v-model="topicRead.subtitle" placeholder="请填写专题子标题"></el-input>
      </el-form-item>
      <el-form-item label="专题图片" prop="picUrl">
        <template v-slot="{row,$index}">
          <el-upload
            :headers="headers"
            class="avatar-uploader"
            :action="`${baseUrl}/storage/create`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="topicRead.picUrl" :src="topicRead.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="专题内容" prop="content" :rules="[ { required: true, message: '请填写专题内容', trigger: 'blur' }]">
        <Editor v-model="topicRead.content" :init="editorInit"/>
      </el-form-item>
      <el-form-item label="商品低价" prop="price" :rules="[ { required: true, message: '请填写商品低价', trigger: 'blur' }]">
        <el-input v-model="topicRead.price" size="mini" placeholder="请填写商品低价"></el-input>
      </el-form-item>
      <el-form-item label="阅读量" prop="readCount">
        <el-input v-model="topicRead.readCount" size="mini" placeholder="请填写阅读量"></el-input>
      </el-form-item>

      <el-form-item label="专题商品" prop="goods">
        <el-button type="primary" size="mini" style="float: right;" @click="handleAddGoods">添加</el-button>
        <el-table style="width: 100%" :data="goodsList" border size="mini">
          <el-table-column align="center" prop="id" label="商品ID"></el-table-column>
          <el-table-column align="center" prop="picUrl" label="图片">
            <template v-slot="{row,$index}">
              <img :src="row.picUrl" alt="" style="width: 50px;height: 50px;">
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="商品名称"></el-table-column>
          <el-table-column align="center" prop="brief" label="商品介绍"></el-table-column>
          <el-table-column align="center" prop="prop" label="操作">
            <template v-slot="{row,$index}">
              <el-button type="danger" size="mini" @click="handleTopicDetail(row,$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-button size="mini" @click="$router.go(-1)">取消</el-button>
    <el-button type="primary" size="mini" @click="handleEndRedact('form')">确定</el-button>

    <!--    添加商品-->
    <el-dialog title="添加商品" :visible.sync="dialogTableVisible" width="60%">
      <el-input size="mini" v-model="dateFrom.goodsSn" style="width: 200px; margin-right: 10px" placeholder="请输入商品编号"
      ></el-input>
      <el-input size="mini" v-model="dateFrom.name" style="width: 200px; margin-right: 10px" placeholder="请输入商品名称"
      ></el-input>
      <el-button type="primary" size="mini" @click="handleSearchGoodList">查找</el-button>
      <el-table :data="searchGoodsList" border size="mini" v-loading="loading" @selection-change="selectChange"
                element-loading-text="拼命加载中"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" property="id" label="商品ID"></el-table-column>
        <el-table-column align="center" property="picUrl" label="图片">
          <template v-slot="{row,$index}">
            <img :src="row.picUrl" alt="" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column align="center" property="name" label="商品名称"></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="dateFrom.page" :limit.sync="dateFrom.limit"
                  @pagination="handleSearchGoodList"
      ></pagination>
      <div style="display: flex; justify-content: right">
        <el-button size="mini" @click="dialogTableVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleEndAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqTopicCreate, reqTopicRead, reqTopicUpdate } from '@/api/promotiion'
import { getToken } from '@/utils/auth'
import Editor from '@tinymce/tinymce-vue'
import { createStorage, reqGoodsList } from '@/api/goods'

export default {
  name: 'TopicreateAndedit',
  components: { Editor },
  data() {
    return {
      flage: null,
      loading: false,
      total: 0,
      searchGoodsList: [],
      dialogTableVisible: false,
      baseUrl: 'http://182.160.8.76:8080/admin',
      goodsList: [],
      topicRead: {},
      dateFrom: {
        page: 1,
        limit: 5,
        sort: 'add_time',
        order: 'desc',
        goodsSn: null,
        name: null
      },
      selectList: [],
      editorInit: {
        language: 'zh_CN',
        height: '400px',
        convert_urls: false,
        plugins: [
          'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        ],
        toolbar: [
          'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
          'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData)
            .then(res => {
              success(res.data.data.url)
            })
            .catch(() => {
              failure('上传失败，请重新上传')
            })
        }
      }
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
    this.getTopicRead(this.$route.query.id)
  },
  methods: {
    async getTopicRead(id) {
      if (id) {
        this.flage = 0
        const result = await reqTopicRead(id)
        if (result.status === 200) {
          this.topicRead = result.data.data.topic
          this.goodsList = result.data.data.goodsList
        }
      } else {
        this.flage = 1
        this.topicRead = {}
        this.goodsList = []
      }
    },

    // 图片
    // 图片
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.topicRead.picUrl = res.data.url
    },

    // 添加商品
    handleAddGoods() {
      this.dialogTableVisible = true
    },
    // 查找商品
    async handleSearchGoodList() {
      this.loading = true
      const result = await reqGoodsList(this.dateFrom)
      console.log(result)
      if (result.status === 200) {
        this.searchGoodsList = result.data.data.list
        this.total = result.data.data.total
        this.loading = false
      }
    },

    selectChange(select) {
      this.selectList = select
    },
    // 确认添加
    handleEndAdd() {
      this.goodsList = this.selectList
      this.selectList = []
      this.dialogTableVisible = false
    },

    // 删除
    handleTopicDetail(row, index) {
      this.goodsList.splice(index, 1)
    },

    // 确认编辑
    handleEndRedact(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.flage === 0) {
            if (this.goodsList.length > 0) {
              this.goodsList.forEach(item => {
                this.topicRead.goods.push(item.id)
              })
            } else {
              this.topicRead.goods = []
            }
            const result = await reqTopicUpdate(this.topicRead)
            if (result.status === 200) {
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success'
              })
              this.$router.go(-1)
            }
          } else {
            const result = await reqTopicCreate(this.topicRead)
            if (result.status === 200) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.$router.go(-1)
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
