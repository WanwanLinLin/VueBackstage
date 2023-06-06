<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <br>
    <el-input v-model="input1" placeholder="请输入一级类目名称"></el-input>
    <br><br>
    <el-input v-show="input1" v-model="input2" placeholder="请输入二级类目名称"></el-input>
    <br><br>
    <el-input v-show="input2" v-model="input3" placeholder="请输入三级类目名称"></el-input>
    <br><br>
    <el-button v-show="input1" type="primary" @click="submitForm">提交</el-button>
  </div>
</template>

<script>

export default {

  data() {
    return {
      input1: '',
      input2: '',
      input3: ''
    };
  },
  methods: {
    async submitForm() {
      // 这里是提交表单的逻辑
      let result = await this.$API.attr.reqNewCategory(this.input1, this.input2, this.input3);
      if (result.code == 200) {
        // console.log(result.message)
        this.$message({
        message: result.message,
        type: 'success'
      })
      } else {
        console.log(result.message)
      }
      console.log(this.input1, this.input2, this.input3);
    }
  }
};
</script>
