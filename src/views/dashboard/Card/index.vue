<template>
  <div>
    <el-row :gutter="10">
        <el-col :span="6">
            <el-card>
                <Detail title="总销售额" count="7758"></Detail>
            </el-card>
        </el-col>

        <el-col :span="6">
            <el-card>
                <Detail title="访问量" count="258"></Detail>
            </el-card>
        </el-col>

        <el-col :span="6">
            <el-card>
                <Detail title="支付笔数" count="13"></Detail>
            </el-card>
        </el-col>

        <el-col :span="6">
            <el-card>
                <Detail title="运营活动效果" count="14"></Detail>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail"

export default {
    name: '',
    components: {
        Detail
    }
}
</script>

<style>

</style>