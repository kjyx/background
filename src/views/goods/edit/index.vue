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
              :on-success="handlePictureCardPreview"
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
            v-model="categoryIds"
            placeholder="请选择"
            :options="categoryList"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          />
        </el-form-item>

        <el-form-item label="所属品牌商" prop="brandId">
          <el-select v-model="goods.brandId" placeholder="请选择">
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品简介" prop="brief">
          <el-input v-model="goods.brief" placeholder="商品简介"/>
        </el-form-item>
        <el-form-item label="商品详情介绍">
          <Editor v-model="goods.detail" :init="editorInit"/>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <h3>商品规格</h3>
      <el-table style="width: 100%" :data="specifications" size="mini">
        <el-table-column prop="specification" label="规格名"/>
        <el-table-column prop="value" label="规格值">
          <template slot-scope="{row,$index}">
            <el-tag size="mini">{{ row.specification }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="picUrl" label="规格图片">
          <template slot-scope="{row,$index}">
            <img :src="row.picUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="SpecificationsSet(row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <h3>商品库存</h3>
      <el-table style="width: 100%" :data="products" size="mini">
        <el-table-column prop="specification" label="货品规格">
          <template slot-scope="{row,$index}">
            <el-tag v-for="(item,index) in row.specifications" :key="index" size="mini">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="货品售价"/>
        <el-table-column prop="number" label="货品数量"/>
        <el-table-column prop="url" label="规格图片">
          <template slot-scope="{row,$index}">
            <img :src="row.url" alt="" style="width: 30px;height: 30px">
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="productsSet(row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <h3>商品参数</h3>
      <el-button type="primary" size="mini" @click="attributesAddAndSet">添加</el-button>
      <el-table style="width: 100%" :data="attributes" size="mini">
        <el-table-column prop="attribute" label="商品参数名称"/>
        <el-table-column prop="value" label="商品参数值"/>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="attributesAddAndSet(row)">设置</el-button>
            <el-button type="" size="mini" @click="attributesDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div style="display: flex;justify-content: center;margin-top: 20px">
      <el-button type="" size="mini" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" size="mini" @click="goodsUpdate">更新商品</el-button>
    </div>

    <!--    规格设置-->
    <el-dialog title="规格设置" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="specificationsObj" label-width="80px">
        <el-form-item label="规格名" prop="value">
          <el-input v-model="specificationsObj.value" :disabled="true" size="mini" placeholder="placeholder"/>
        </el-form-item>
        <el-form-item label="规格值" prop="specification">
          <el-input
            v-model="specificationsObj.specification"
            :disabled="true"
            size="mini"
            placeholder="placeholder"
          />
        </el-form-item>
        <el-form-item label="规格图片" prop="picUrl">
          <template slot-scope="{row,$index}">
            <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="`${baseUrl}/storage/create`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
            >
              <img v-if="specificationsObj.picUrl" :src="specificationsObj.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlequedingguige">确 定</el-button>
      </span>
    </el-dialog>

    <!--    库存设置-->
    <el-dialog title="库存设置" :visible.sync="dialogVisibleProducts" width="50%">

      <el-form ref="form" :model="productsObj" label-width="100px">
        <el-form-item label="货品规格列" prop="specifications">
          <template slot-scope="{row,$index}">
            <el-tag v-for="item in productsObj.specifications" type="">{{ item }}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="货品售价" prop="price">
          <el-input v-model.number="productsObj.price" placeholder="placeholder"/>
        </el-form-item>
        <el-form-item label="货品数量" prop="number">
          <el-input v-model.number="productsObj.number" placeholder="placeholder"/>
        </el-form-item>
        <el-form-item label="货品图片">
          <template slot-scope="{row,$index}">
            <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="`${baseUrl}/storage/create`"
              :show-file-list="false"
              :on-success="handleAvatarSuccessProducts"
            >
              <img v-if="productsObj.url" :src="productsObj.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleProducts = false">取 消</el-button>
        <el-button type="primary" @click="productsEnd">确 定</el-button>
      </span>
    </el-dialog>

    <!--    商品参数设置-->
    <el-dialog title="编辑商品参数" :visible.sync="dialogVisibleAttributes" width="50%">
      <el-form ref="form" :model="attributesObj" label-width="100px">
        <el-form-item label="商品参数名称">
          <el-input v-model="attributesObj.attribute" size="mini" placeholder="placeholder"/>
        </el-form-item>
        <el-form-item label="商品参数值">
          <el-input v-model="attributesObj.value" size="mini" placeholder="placeholder"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAttributes = false">取 消</el-button>
        <el-button type="primary" @click="attributesEnd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createStorage, reqCatAndBrand, reqGoodsDetail, reqGoodsUpdate } from '@/api/goods'
import { getToken } from '@/utils/auth'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'Edit',
  components: { Editor },
  data() {
    return {
      flag: null,
      dialogVisibleAttributes: false,
      dialogVisibleProducts: false,
      keywords: [],
      newkeyword: '',
      fileGalleryList: [],
      inputVisible: false,
      dialogVisible: false,
      baseUrl: 'http://182.160.8.76:8080/admin',
      attributes: [],
      categoryIds: [],
      goods: {},
      products: [],
      specifications: [],
      brandList: [],
      categoryList: [],
      specificationsObj: {},
      productsObj: {},
      attributesObj: {},
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
        // 展示的图片列表
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
    // 这里删除的时候有两种可能 一种是删除的刚添加的本地地址照片 ， 一种是服务器地址的图片
    handleRemove(file, fileList) {
      let url
      // 如果是服务器地址照片是没有 response 的 直接就是 file.url
      if (file.response === undefined) {
        url = file.url
      } else {
        url = file.response.data.url
      }
      // 遍历 如果删除的item 跟 url 相同就把当前这个删掉
      this.goods.gallery.forEach((item, index) => {
        if (item === url) {
          this.goods.gallery.splice(index, 1)
        }
      })
    },

    handlePictureCardPreview(file) {
      this.goods.gallery.push(file.data.url)
    },

    // 关键词  删除时
    handleClose(index) {
      this.keywords.splice(index, 1)
      this.goods.keywords = this.keywords.join(',')
    },

    // 切换input自动聚焦
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 添加关键词
    handleInputConfirm() {
      const inputValue = this.newkeyword
      if (inputValue) {
        this.keywords.push(inputValue)
        this.goods.keywords = this.keywords.join(',')
      }
      this.inputVisible = false
      this.newkeyword = ''
    },

    // 选择分类
    handleChange(value) {
      this.goods.categoryId = value[value.length - 1]
    },

    // 规格设置
    SpecificationsSet(row) {
      this.specificationsObj = Object.assign({}, row)
      this.dialogVisible = true
    },

    handleAvatarSuccess1(file) {
      this.specificationsObj.picUrl = file.data.url
    },
    // 确认修改规格
    handlequedingguige() {
      this.specifications.forEach((item, index) => {
        if (item.id === this.specificationsObj.id) {
          this.specifications.splice(index, 1, this.specificationsObj)
        }
      })
      this.dialogVisible = false
    },

    // 商品库存设置
    productsSet(row) {
      this.dialogVisibleProducts = true
      this.productsObj = Object.assign({}, row)
    },

    // 上传图片回调
    handleAvatarSuccessProducts(res) {
      this.productsObj.url = res.data.url
    },

    // 确认修改
    productsEnd() {
      this.products.forEach((item, index) => {
        if (this.productsObj.id === item.id) {
          this.products.splice(index, 1, this.productsObj)
        }
      })
      this.dialogVisibleProducts = false
    },

    // 商品参设置和添加
    attributesAddAndSet(row) {
      if (row.id) {
        this.flag = 0
        this.attributesObj = Object.assign({}, row)
      } else {
        this.attributesObj = {}
        this.flag = 1
      }
      this.dialogVisibleAttributes = true
    },

    // 确认参数
    attributesEnd() {
      if (this.flag === 0) {
        this.attributes.forEach((item, index) => {
          if (item.id === this.attributesObj.id) {
            this.attributes.splice(index, 1, this.attributesObj)
          }
        })
      } else {
        // 生成时间戳 为唯一id
        this.attributesObj.id = this.attributes[0].id - 1
        this.attributesObj.deleted = false
        this.attributes.unshift(this.attributesObj)
      }
      this.dialogVisibleAttributes = false
    },
    // 删除
    attributesDelete(row) {
      row.deleted = true
      this.attributes.forEach((item, index) => {
        if (row.id === item.id && row.deleted === true) {
          this.attributes.splice(index, 1)
        }
      })
    },

    // 更新商品
    async goodsUpdate() {
      const goodsUpdate = {}
      goodsUpdate.attributes = this.attributes
      goodsUpdate.goods = this.goods
      goodsUpdate.products = this.products
      goodsUpdate.specifications = this.specifications
      const result = await reqGoodsUpdate(goodsUpdate)
      if (result.status === 200) {
        this.$router.go(-1)
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success'
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
