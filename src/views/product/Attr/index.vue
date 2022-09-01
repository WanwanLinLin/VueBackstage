<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
        </el-button>
        <!-- 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row, $index}">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                style="margin:0px 20px">
                {{  attrValue.valueName  }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">
              </el-button>

              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性，修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">
          添加属性值
        </el-button>
        <!-- <el-button @click="isShowTable = true">取消</el-button> -->
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)"
                @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block">{{  row.valueName  }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`你确定要删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference">
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep"

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      // 接收平台属性的字段
      attrList: [],

      // 控制table表格的显示与隐藏
      isShowTable: true,

      // 收集新增属性||修改原有属性
      attrInfo: {
        attrName: "",
        attrValueList: [
        ],
        categoryId: 0,
        categoryLevel: 3,
      }
    }
  },

  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 三级分类id有了说明此时应该发请求
        this.category3Id = categoryId;
        this.getAttrList()
      }
    },

    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },

    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        // 给每一个属性添加一个标记，用于切换查看模式与编辑模式
        flag: true,
      });

      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })

    },

    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
    },

    updateAttr(row) {
      this.isShowTable = false;

      // 将选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row);

      // 在修改某一个属性的时候将该属性值添加上flag标记
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, "flag", false);
      })
    },

    deleteAttr() {
      this.$message({type: "failed", message: "抱歉,你的权限不足!!"});
    },

    // 切换为查看模式（失去焦点）
    toLook(row) {
      // 校验用户的输入值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个非空的属性值");
        return;
      }

      // 使用最后一个元素与前面的元素依次比较
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });

      if (isRepeat) return;
      row.flag = false;
    },

    toEdit(row, index) {
      row.flag = true;
      // 获取input节点以实现自动聚焦
      // 使用nextTick保证节点渲染完毕后执行一次
      this.$nextTick(() => {
        // 获取相应的input表单元素实现聚焦
        this.$refs[index].focus()
      })

    },

    // 气泡删除框删除按钮的回调
    deleteAttrValue(index) {
      // 当前删除属性的操作是不需要发请求的，因为还没有保存
      this.attrInfo.attrValueList.splice(index, 1);
    },

    async addOrUpdateAttr() {
      //1.属性值为空的不会提交给服务器，flag字段也不会提交
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if (item.valueName != "") {
          delete item.flag;
          delete item.id;
          return true;
        }
      })
      try{
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true
        this.$message({type: "success", message: "保存成功"});
        // 保存成功后需要再次获取平台信息进行展示
        this.getAttrList();
      } catch (error) {
        this.$message({type: "failed", message: "保存失败"});
      }
    },
  }
}
</script>

<style>
</style>