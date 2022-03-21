<template>
  <div style="padding: 20px;">
    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="form" :model="goods" label-width="100px" size="mini" style="margin-left: 80px">
        <el-form-item label="商品ID" prop="id">
          <el-input v-model="goods.id" placeholder="" size="mini" :disabled="true"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goods.name" placeholder="请输入商品名称" size="mini"/>
        </el-form-item>
        <el-form-item label="商品编号" prop="id">
          <el-input v-model="goods.id" placeholder="请输入商品编号" size="mini"/>
        </el-form-item>
        <el-form-item label="市场售价" prop="counterPrice">
          <el-input v-model="goods.counterPrice" placeholder="市场售价" size="mini"/>
        </el-form-item>
        <el-form-item label="是否新品" prop="isNew">
          <el-radio-group v-model="goods.isNew">
            <el-radio :label="true">新品</el-radio>
            <el-radio :label="false">非新品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖" prop="isHot">
          <el-radio-group v-model="goods.isHot">
            <el-radio :label="false">普通</el-radio>
            <el-radio :label="true">热卖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在售" prop="isOnSale">
          <el-radio-group v-model="goods.isOnSale">
            <el-radio :label="true">在售</el-radio>
            <el-radio :label="false">未售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图片" prop="picUrl">
          <template>
            <el-upload
              class="avatar-uploader"
              :headers="headers"
              :action="`${baseUrl}/storage/create`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="宣传画廊" prop="gallery">
          <template>
            <el-upload
              :headers="headers"
              :action="`${baseUrl}/storage/create`"
              list-type="picture-card"
              :limit="5"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileGalleryList"
            >
              <i class="el-icon-plus"/>
            </el-upload>
          </template>
        </el-form-item>
        <el-form-item label="商品单位" prop="unit">
          <el-input v-model="goods.unit" placeholder="商品单位" size="mini"/>
        </el-form-item>
        <el-form-item label="关键字" prop="counterPrice">
          <template>
            <el-tag
              v-for="(tag,index) in keywords"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >{{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="newkeyword"
              class="input-new-tag"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="mini" type="primary" @click="showInput">+ 增加</el-button>
          </template>
        </el-form-item>

        <el-form-item label="所属分类">
          <el-cascader
            placeholder="请选择"
            v-model="categoryIds"
            :options="categoryList"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          />
        </el-form-item>

        <el-form-item label="所属品牌商" prop="brandId">
          <el-select v-model="goods.brandId" placeholder="请选择">
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品简介" prop="brief">
          <el-input v-model="goods.brief" placeholder="商品简介"></el-input>
        </el-form-item>
        <el-form-item label="商品详情介绍">
          <Editor v-model="goods.detail" :init="editorInit"></Editor>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { createStorage, reqCatAndBrand, reqGoodsDetail } from '@/api/goods'
import { getToken } from '@/utils/auth'
import Editor from '@tinymce/tinymce-vue'
export default {
  name: 'Edit',
  data() {
    return {
      keywords: [],
      newkeyword: '',
      fileGalleryList: [],
      inputVisible: false,
      dialogVisible: true,
      baseUrl: 'http://182.160.8.76:8080/admin',
      attributes: [],
      categoryIds: [],
      goods: {},
      products: [],
      specifications: [],
      brandList: [],
      categoryList: [],
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
  components:{ Editor },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  mounted() {
    this.getGoodsDetail(this.$route.query.id)
    this.getCatAndBrand()
  },
  methods: {
    async getGoodsDetail(id) {
      const result = await reqGoodsDetail(id)
      if (result.status === 200) {
        this.attributes = result.data.data.attributes
        this.categoryIds = result.data.data.categoryIds
        this.goods = result.data.data.goods
        this.products = result.data.data.products
        this.specifications = result.data.data.specifications
        if (this.goods.brandId === 0) {
          this.goods.brandId = ''
        }
        for (let i = 0; i < this.goods.gallery.length; i++) {
          this.fileGalleryList.push({
            url: this.goods.gallery[i]
          })
        }
      }
    },

    async getCatAndBrand() {
      const result = await reqCatAndBrand()
      if (result.status === 200) {
        this.brandList = result.data.data.brandList
        this.categoryList = result.data.data.categoryList
      }
    },

    // 图片
    handleAvatarSuccess(res, file) {
      this.goods.picUrl = res.data.url
    },
    handleRemove(file, fileList) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.goods.gallery.push(file.url)
      this.dialogVisible = true
    },

    // 关键词
    handleClose(index) {
      this.keywords.splice(index, 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.newkeyword
      if (inputValue) {
        this.keywords.push(inputValue)
      }
      this.inputVisible = false
      this.newkeyword = ''
    },

    // 选择分类
    handleChange(value) {
      this.goods.categoryId = value[value.length - 1]
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
  width: 145px;
  height: 145px;
  display: block;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
