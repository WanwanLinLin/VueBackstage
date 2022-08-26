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

          <el-button type="danger" icon="el-icon-delete">
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
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">

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
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 搜集品牌的信息
      tmForm: {
        tmName: "",
        logoUrl: ""
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
      this.tmForm = {...row};
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
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    async addOrUpdateTrademark() {
      this.dialogFormVisible = false;
      // 发请求（添加品牌||修改品牌）
      let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
      if (result.code==200) {
        this.$message({
          type: "success",
          message: this.tmForm.id? "修改品牌成功！" : "添加品牌成功！"
        });
        // 若是添加品牌，则停留在第一页；若是修改品牌，则停留在当前页

        this.getPageList(this.tmForm.id?this.page:1);
      }
    }
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