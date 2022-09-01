<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称" :model="spu">
                <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList" :key="tm.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" row="4" placeholder="描述" v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload action="/v1/admin/fileController/fileUpload_2" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select placeholder="还有3项未选择" value="">
                    <el-option label="label" value="value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus">
                    添加销售属性
                </el-button>
                <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80px" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150px">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template slot-scope="{row, $index}">
                            <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable
                                :disable-transitions="false">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- 以下结构相当于span与input切换 -->
                            <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                                size="small">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small">添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row, $index}">
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button @click="$emit('changeScene', 0)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            // 存储SPU的信息属性
            // 在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
            // 在添加SPU的时候也要考虑数据的结构
            spu: {
                "category3Id": 0,
                "tmId": 0,
                "description": "",
                "spuName": "",
                "spuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "spuId": 0
                    // }
                ],

                // 平台属性与属性值的收集
                "spuSaleAttrList": [
                    // {
                    //     "baseSaleAttrId": 0,
                    //     "id": 0,
                    //     "saleAttrName": "string",
                    //     "spuId": 0,
                    //     "spuSaleAttrValueList": [
                    //         {
                    //             "baseSaleAttrId": 0,
                    //             "id": 0,
                    //             "isChecked": "string",
                    //             "saleAttrName": "string",
                    //             "saleAttrValueName": "string",
                    //             "spuId": 0
                    //         }
                    //     ]
                    // }
                ],
            },
            // 存储品牌的信息
            tradeMarkList: [],
            // 存储spu图片
            spuImageList: [],
            // 存储基础销售属性
            saleAttrList: []
        }
    },

    mounted() {

    },

    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        // 初始化SpuForm的数据
        async initSpuData(spu) {
            // 获取SPU信息
            let spuResult = await this.$API.spu.reqSpu(spu.id);
            if (spuResult.code == 200) {
                this.spu = spuResult.data;
            }

            let tradeMarkResult = await this.$API.spu.reqTrademarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }

            // 获取spu图片的数据
            let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
            if (spuImageResult.code == 200) {
                let listAttr = spuImageResult.data;
                // 返回符合照片墙展示数据的格式
                // 新增两个属性
                listAttr.forEach(item => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                this.spuImageList = listAttr;
            }

            // 获取平台全部的销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        },



    },

    computed: {
        unSelectSaleAttr() {
            // 从已有的数据中过滤出还未选择的销售属性
            let result = this.saleAttrList.filter(item =>{
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name != item1.saleAttrName;
                })
            })
            return result;
        }
    }

}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
  