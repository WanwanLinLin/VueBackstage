<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>

    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>

      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row, $index}">
          <img :src="row.logoUrl" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)">
            修改
          </el-button>

          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页器 -->
    <el-pagination style="margin-top: 20px; textAlign: center" :current-page="page" :total="total" :page-size="limit"
      :page-sizes="[1, 3, 9]" :page-count="5" @current-change="getPageList" @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total">
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">

          <el-upload class="avatar-uploader" action="/v1/admin/fileController/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌的名称长度应该为2~10位"));
      } else {
        callback();
      }
    }

    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: ""
      },

      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌的图片' }
        ],
      },

    };
  },

  mounted() {
    // 获取列表数据
    this.getPageList();
  },

  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      // 解构出参数
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },

    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },

    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },

    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // 将已有的信息赋值给tmForm展示(使用浅拷贝)
      this.tmForm = { ...row };
    },

    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回给前端的数组
      // this.imageUrl  = URL.createObjectURL(file.raw);
      //(收集表单的数据)
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    addOrUpdateTrademark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          // 发请求（添加品牌||修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功！" : "添加品牌成功！"
            });
            // 若是添加品牌，则停留在第一页；若是修改品牌，则停留在当前页

            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          this.$alert('抱歉，品牌logo不能重复！', '错误！', {
            confirmButtonText: '确定',
          })
        }
      })
    },

    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
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
