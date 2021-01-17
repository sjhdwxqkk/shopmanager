<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/zhuye' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区-->
    <el-card>
<!--      提示区域-->
      <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false">
      </el-alert>
<!--      步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
<!--      tab栏区域-->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               label-position="top">
      <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_name">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
<!--            复选框组-->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
<!--          富文本编辑器-->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
<!--    图片预览-->
    <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
  export default {
    name: "Add",
    data() {
      return {
        activeIndex: '0',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        addFormRules: {
          goods_name: [
            {
              required: true, message: '请输入商品的名称', trigger: 'blur'
            },
          ],
          goods_price: [
            {
              required: true, message: '请输入商品的价格', trigger: 'blur'
            },
          ],
          goods_weight: [
            {
              required: true, message: '请输入商品的重量', trigger: 'blur'
            },
          ],
          goods_number: [
            {
              required: true, message: '请输入商品的数量', trigger: 'blur'
            },
          ],
          goods_cat: [
            {
              required: true, message: '请选择商品分类', trigger: 'blur'
            },
          ]
        },
        cateList: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          expandTrigger: 'hover'
        },
        manyTableData: [],
        onlyTableData: [],
        //上传图片的URL地址
        uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewVisible: false
      }
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get(`categories`)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败！')
        }
        this.cateList = res.data
        // console.log(this.cateList);
      },
      //级联选择器选中项变化触发
      handleChange() {
        // console.log(this.addForm.goods_cat);
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        // console.log('即将离开标签页的名字是:' + oldActiveName)
        // console.log('即将进入标签页的名字是:' + activeName)
        // return false
        if (oldActiveName === '0' && this.addForm.goods_cat.length !==3) {
          this.$message.error('请先选择商品分类！')
          return false
        }
      },
      async tabClicked() {
        if (this.activeIndex === '1') {
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('获取动态参数列表失败！')
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态参数列表失败！')
          }
          this.onlyTableData = res.data
        }
      },
      //预览图片
      handlePreview(file) {
        // console.log(file);
        this.previewPath = file.response.data.url;
        this.previewVisible = true
      },
      //移除图片
      handleRemove(file) {
        //1.获取对应图片的临时路径
        const filePath = file.response.data.tmp_path;
        //2.从pics数组中找到这临时路径对应的索引
        const i = this.addForm.pics.findIndex(x =>
            x.pic === filePath
        )
        //3.用splice方法把对象从pics中移除
        this.addForm.pics.splice(i, 1)
        console.log(this.addForm);
      },
      // 监听图片上传成功
      handleSuccess(response) {
        console.log(response);
        // 1.拼接得到一个图片信息对象
        const picInfo = {
          pics: response.data.tmp_path
        };
        // 2.push到pics数组
        this.addForm.pics.push(picInfo)
        console.log(this.addForm);
      },
      add() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项！')
          }
          // lodash 深拷贝 cloneDeep(obj)
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          //处理动态参数和静态属性
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          // console.log(form);
          const {data: res} = await this.$http.post(`goods`,form)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败！')
          }
          this.$message.success('添加商品成功！')
          this.$router.push('/goods')
        })
      }
    },
    created() {
      this.getCateList()

    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length ===3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>