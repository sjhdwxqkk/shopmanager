<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/zhuye' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区-->
    <el-card>
      <!--   头部警告区-->
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning" :closable="false" show-icon>
      </el-alert>
<!--      选择商品分类区-->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
<!--          选择商品分类的级联选择框-->
          <el-cascader
              v-model="selectedCateKeys"
              :options="catelist"
              :props="cateProps"
              @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
<!--      tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--        动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true">添加参数</el-button>
<!--          动态参数表格-->
          <el-table :data="manyTableData" border stripe>
<!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!--                输入的文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--                添加的按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引-->
            <el-table-column type="index"></el-table-column>
<!--            参数名称-->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        静态属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
<!--                循环渲染tag标签-->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!--                输入的文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--                添加的按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引-->
            <el-table-column type="index"></el-table-column>
            <!--            参数名称-->
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
<!--    添加参数的对话框-->
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <el-form
          ref="addFormRef"
          :model="addForm"
          label-width="100px"
          :rules="addFormRules" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改参数对话框-->
    <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
      <el-form
          ref="editFormRef"
          :model="editForm"
          label-width="100px"
          :rules="editFormRules" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

  <script>
  export default {
    name: "Params",
    data() {
      return {
        //商品分类列表
        catelist: [],
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        //级联选择框双向绑定到的数组
        selectedCateKeys: [],
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        addDialogVisible: false,
        addForm: {
          attr_name: '',
        },
        addFormRules: {
          attr_name: [
            {
              required: true, message: '请输入参数名称', trigger: 'blur'
            },
          ]},
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          attr_name: [
            {
              required: true, message: '请输入参数名称', trigger: 'blur'
            },
          ]},
      }
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data
        // console.log(this.catelist);
      },
      //级联选择框选中变化会触发这个函数
      handleChange() {
        this.getParamsData()
      },
      //Tab页签点击事件的处理函数
      handleTabClick() {
        this.getParamsData()
      },
      //获取参数的列表数据
      async getParamsData() {
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        // console.log(this.selectedCateKeys);
        // 根据所选分类的id和当前所处的面板，获取对应的参数
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: { sel: this.activeName }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        // console.log(res);
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          //控制住文本框的显示与隐藏 以及值
          item.inputVisible = false
          item.inputValue = ''
        })
        // console.log(res);
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        }else {
          this.onlyTableData = res.data
        }
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败！')
          }
          this.$message.success('添加参数成功!')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      async showEditDialog(attr_id) {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: { attr_sel: this.activeName }
        })
        // console.log(res);
        // console.log(scope.row.attr_id);
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败！')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return
          }
          const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }
          this.$message.success('修改参数成功！')
          this.editDialogVisible = false
          //重新获取用户列表数据
          this.getParamsData()
        })
      },
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message.success('删除参数成功！')
        this.getParamsData()
      },
      //文本框失去焦点或者按下enter
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        //如果没有return 需要后续处理
        this.saveAttrVals(row)
      },
      //将对attr_vals的操作保存到数据库
      async saveAttrVals(row) {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        //保存数据
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
      },
      showInput(row) {
        row.inputVisible = true;
        //让文本框自动获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除对应的参数和选项
      handleClose(i, row) {
        row.attr_vals.splice(i, 1);
        console.log(row.attr_vals);
        this.saveAttrVals(row)
      }
    },
    computed: {
      //如果按钮需要被禁用，则返回true，否则返回false
      isBtnDisabled() {
        if (this.selectedCateKeys.length !==3) {
          return true
        }
        return false
      },
      //当前选中的三级分类的id
      cateId() {
        if (this.selectedCateKeys.length ===3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    },
    created() {
      //获取所有商品分类
      this.getCateList()
    }
  }
</script>

<style scoped>
 .cat_opt {
   margin: 15px 0;
 }
 .el-tag {
   margin: 0 10px;
 }
 .input-new-tag {
   width: 120px;
 }
</style>