<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0">
      </CategorySelect>
    </el-card>

    <el-card>
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width:100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu" @click="addSku(row)">
              </hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)">
              </hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)">
              </hint-button>
              <el-popconfirm title="你确定要删除该商品吗?" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference">
                </hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 这里是分页组件 -->
        <el-pagination style="text-align: center" :current-page="page" :page-sizes="[3, 5, 7]" :page-size="limit"
          layout="prev, pager, next, jumper, -> , sizes, total" @current-change="getSpuList"
          @size-change="handleSizeChange" :total="total"></el-pagination>

      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的SKU列表`" 
    :visible.sync="dialogTableVisible"
    :before-close="close">
      <el-table :data="skuList" style="width: 100%" border
      v-loading="loading"
      element-loading-text="亲，我在拼命加载中~"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefualtImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm"
import SkuForm from "./SkuForm"

export default {
  name: "Spu",

  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      // 用于切换场景
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },

  methods: {
    // 把子组件的id传递给相应的父组件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        // 记得清除2，3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 获取SPU列表数据进行展示
        this.getSpuList();

      }
    },

    // 获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
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
      // 通知子组件发送两个请求(并把category3Id传过去)
      this.$refs.spu.addSpuData(this.category3Id);
    },

    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      // 在父组件当中通过$ref获取子组件
      this.$refs.spu.initSpuData(row);

    },

    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },

    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功！" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },

    // 添加Sku
    addSku(row) {
      // console.log(row)
      this.scene = 2;
      // 父组件调用子组件的方法，子组件发送三个请求\
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },

    changeScenes(scene) {
      this.scene = scene;
    },

    // 查看SKU的按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      // 保存spu的信息
      this.spu = spu;
      let result = await this.$API.sku.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        // 隐藏loading
        this.loading = false;
      }
    },

    // 关闭对话框的回调
    close(done){
      this.loading = true;
      // 清除SKU列表的数据，防止回显
      this.skuList = [];
      // 最后关闭对话框
      done();
    }
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>

<style>
</style>