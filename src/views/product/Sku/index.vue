<template>
  <div>
    <!-- 这里是表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row, $index}">
          <img :src="row.skuDefualtImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit-outline" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 这里是分页 -->
    <el-pagination
    @current-change="getSkuList"
    @size-change="handleSizeChange" 
    style="text-align: center" 
    :current-page="page" 
    :page-sizes="[1, 2, 5]" 
    :page-size="limit"
    layout="prev, pager, next, jumper, -> , sizes, total" 
    :total="total">
  </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data () {
    return {
      page: 1,
      limit: 1,
      // 存储SKU列表
      records: [],
      total: 0  
    }
  },
  mounted () {
    // 获取SKU列表
    this.getSkuList();
  },

  methods: {
    async getSkuList(pages=1) {
      this.page = pages;
      // 解构出默认参数
      const {page, limit} = this
      let result = await this.$API.sku.reqAllSkuList(page, limit);
      if (result.code==200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
  }
}
</script>

<style>
</style>