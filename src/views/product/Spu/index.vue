<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect 
      @getCategoryId="getCategoryId"
      :show="!isShowTable">
    </CategorySelect>
    </el-card>

    <el-card>
      <div v-show="scene==0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" 
        :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width:100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 这里是分页组件 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper, -> , sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total"
        ></el-pagination>
      
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm"
import SkuForm from "./SkuForm"

export default {
  name: "Spu",

  data () {
    return {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        isShowTable: true,
        page: 1,
        limit: 3,
        records: [],
        total: 0,
        // 用于切换场景
        scene: 0
    }
  },

  methods: {
    // 把子组件的id传递给相应的父组件
    getCategoryId({categoryId, level}) {
      if (level == 1) {
        this.category1Id = categoryId;
        // 记得清除2，3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      }else if (level == 2){
        this.category2Id = categoryId;
        this.category3Id = "";
      }else{
        this.category3Id = categoryId;
        // 获取SPU列表数据进行展示
        this.getSpuList();

      }
    },

    // 获取SPU列表数据的方法
    async getSpuList(pages=1) {
      this.page = pages;
      const {page, limit, category3Id} = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code==200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    // 当分页器每一页展示数据条数发生变化时使用的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    addSpu() {
      this.scene = 1;
    },

    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      // 在父组件当中通过$ref获取子组件
      this.$refs.spu.initSpuData(row);

    },

    changeScene(scene) {
      this.scene = scene;
    },
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>

<style>
</style>