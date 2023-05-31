<template>
  <div>
    <el-input v-model="input1" placeholder="请输入一级类目名称"></el-input>
    <br><br>
    <el-input v-model="input2" placeholder="请输入二级类目名称"></el-input>
    <br><br>
    <el-input v-model="input3" placeholder="请输入三级类目名称"></el-input>
    <br><br>
    <el-button type="primary" @click="submitForm">提交</el-button>
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
    submitForm() {
      // 这里是提交表单的逻辑
      console.log('提交表单');
    }
  }
};
</script>
