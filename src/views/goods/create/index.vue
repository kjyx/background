<template>
  <div style="padding: 20px;">
    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="form" :model="goods" label-width="100px" size="mini" style="margin-left: 80px">
        <el-form-item label="商品编号" prop="goodsSn" :rules="[ { required: true, message: '请输入商品编号', trigger: 'blur' },]">
          <el-input v-model="goods.goodsSn" placeholder="请输入商品编号" size="mini"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name" :rules="[ { required: true, message: '请输入商品编号', trigger: 'blur' },]">
          <el-input v-model="goods.name" placeholder="请输入商品名称" size="mini"/>
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
      <div style="margin-bottom: 20px">
        <el-radio-group v-model="SelectSpecification" size="mini" @change="changeSpecification">
          <el-radio-button :label="false">默认标准规格</el-radio-button>
          <el-radio-button :label="true">多规格支持</el-radio-button>
        </el-radio-group>
        <el-button
          v-if="SelectSpecification"
          type="primary"
          size="mini"
          style="margin-left: 30%"
          @click="SpecificationsSet"
        >添加
        </el-button>
      </div>
      <div>
        <el-table style="width: 100%" :data="specifications" size="mini">
          <el-table-column prop="specification" label="规格名"/>
          <el-table-column prop="value" label="规格值">
            <template slot-scope="{row,$index}">
              <el-tag size="mini">{{ row.value }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="picUrl" label="规格图片">
            <template slot-scope="{row,$index}">
              <img :src="row.picUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column v-if="SelectSpecification" prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <h3>商品库存</h3>
      <div>
        <el-table style="width: 100%" :data="products" size="mini">
          <el-table-column prop="value" label="货品规格">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(item) in row.specifications" :key="item.id" size="mini">{{ item }}</el-tag>
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
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <h3>商品参数</h3>
      <el-button type="primary" size="mini" @click="attributesAddAndSet">添加</el-button>
      <el-table style="width: 100%" :data="attributes" size="mini">
        <el-table-column prop="attribute" label="商品参数名称"/>
        <el-table-column prop="value" label="商品参数值"/>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="" size="mini" @click="attributesDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div style="display: flex;justify-content: center;margin-top: 20px">
      <el-button type="" size="mini" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" size="mini" @click="goodsCreate">上架</el-button>
    </div>

    <!--    规格设置-->
    <el-dialog title="规格设置" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="specificationsObj" label-width="80px">
        <el-form-item label="规格名" prop="value">
          <el-input v-model="specificationsObj.specification" size="mini" placeholder="placeholder"/>
        </el-form-item>
        <el-form-item label="规格值" prop="specification">
          <el-input
            v-model="specificationsObj.value"
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
import { createStorage, reqCatAndBrand, reqGoodsCreate, reqGoodsDetail, reqGoodsUpdate } from '@/api/goods'
import { getToken } from '@/utils/auth'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'Edit',
  components: { Editor },
  data() {
    return {
      SelectSpecification: false,
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
      goods: {
        gallery: [],
        picUrl: ''
      },
      productsFrom: [{ id: 0, specifications: [], price: 0.00, number: 0, url: '' }],
      products: [{ id: 0, specifications: ['标准'], price: 0.00, number: 0, url: '' }],
      specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
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
    this.getCatAndBrand()
  },
  methods: {
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
    // 照片墙（添加）
    handlePictureCardPreview(file) {
      this.fileGalleryList.push(file.data.url)
    },
    // 删除
    handleRemove(file) {
      // 判断 如果删除的url跟 数组里的url相同就把他从数组中移除
      this.fileGalleryList.forEach((item, index) => {
        if (item === file.response.data.url) {
          this.fileGalleryList.splice(index, 1)
        }
      })
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
      this.specificationsObj = {}
      this.dialogVisible = true
    },

    handleAvatarSuccess1(file) {
      this.specificationsObj.picUrl = file.data.url
    },
    // 确认修改规格
    handlequedingguige() {
      var index = this.specifications.length - 1
      console.log(index)
      for (let i = 0; i < this.specifications.length; i++) {
        console.log(i)
        const v = this.specifications[i]
        console.log(v)
        if (v.specification === this.specificationsObj.specification) {
          if (v.value === this.specificationsObj.value) {
            this.$message({
              type: 'warning',
              message: '已经存在规格值:' + v.value
            })
            this.specificationsObj = {}
            this.dialogVisible = false
            return
          } else {
            index = i
            console.log(index)
          }
        }
      }
      this.specifications.splice(index + 1, 0, this.specificationsObj)
      this.dialogVisible = false
      this.specToProduct()
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return
      }
      console.log(111)
      // 根据specifications创建临时规格列表
      var specValues = []
      var spec = this.specifications[0].specification
      console.log(spec)
      var values = []
      values.push(0)

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification

        if (aspec === spec) {
          values.push(i)
        } else {
          specValues.push(values)
          spec = aspec
          values = []
          values.push(i)
        }
      }
      specValues.push(values)

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0
      var products = []
      var combination = []
      var n = specValues.length
      for (var s = 0; s < n; s++) {
        combination[s] = 0
      }
      var index = 0
      var isContinue = false
      do {
        var specifications = []
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]]
          specifications.push(this.specifications[z].value)
        }
        products[productsIndex] = { id: productsIndex, specifications: specifications, price: 0.00, number: 0, url: '' }
        productsIndex++

        index++
        combination[n - 1] = index
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0
            index = 0
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1
            }
          }
        }
        isContinue = false
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true
          }
        }
      } while (isContinue)

      this.products = products
    },

    // 点击多规格
    changeSpecification(a) {
      if (a === false) {
        this.specifications = [{ specification: '规格', value: '标准', picUrl: '' }]
        this.products = [{ id: 0, specifications: ['标准'], price: 0.00, number: 0, url: '' }]
      } else {
        this.specifications = []
        this.products = []
        this.productsFrom = [{ id: 0, specifications: [], price: 0.00, number: 0, url: '' }]
      }
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
    attributesAddAndSet() {
      this.attributesObj = {}
      this.dialogVisibleAttributes = true
    },

    // 确认参数
    attributesEnd() {
      // 生成时间戳 为唯一id
      this.attributesObj.deleted = false
      this.attributes.unshift(this.attributesObj)
      this.dialogVisibleAttributes = false
    },
    // 删除
    attributesDelete(row) {
      row.deleted = true
      this.attributes.forEach((item, index) => {
        if (row.deleted === true) {
          this.attributes.splice(index, 1)
        }
      })
    },

    // 更新商品
    async goodsCreate() {
      const goodsCreate = {}
      goodsCreate.attributes = this.attributes
      goodsCreate.goods = this.goods
      goodsCreate.products = this.products
      goodsCreate.specifications = this.specifications
      const result = await reqGoodsCreate(goodsCreate)
      console.log(result)
      this.$router.push({ path: '/goods/list' })
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success'
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

