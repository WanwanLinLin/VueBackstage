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
                <el-upload action="/v1/admin/fileController/fileUpload_2" 
                list-type="picture-card"
                :on-preview="handlePictureCardPreview" 
                :on-remove="handleRemove" 
                :file-list="spuImageList"
                :on-success="handlerSuccess">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="attrIdAndAttrName">
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" 
                :disabled="!attrIdAndAttrName"
                @click="addSaleAttr">
                    添加销售属性
                </el-button>
                <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80px" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150px">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template slot-scope="{row, $index}">
                            <!-- el-tag专门用于展示已有的属性值列表的数据 -->
                            <el-tag :key="tag.id" 
                                v-for="(tag,index) in row.spuSaleAttrValueList" closable
                                :disable-transitions="false"
                                @close="row.spuSaleAttrValueList.splice(index,1)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- 以下结构相当于span与input切换 -->
                            <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                            <el-input 
                                class="input-new-tag" 
                                v-if="row.inputVisible" 
                                v-model="row.inputValue" 
                                ref="saveTagInput"
                                size="small"
                                @blur="handleInputConfirm(row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small"
                            @click="addSaleAttrValue(row)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row, $index}">
                            <el-button type="danger" icon="el-icon-delete" 
                            size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
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
                category3Id: "",
                tmId: "",
                description: "",
                spuName: "",
                spuImageList: [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "spuId": 0
                    // }
                ],

                // 平台属性与属性值的收集
                spuSaleAttrList: [
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
            saleAttrList: [],
            // 收集未选择的基础销售属性的id
            attrIdAndAttrName: "",
        };
    },

    mounted() {

    },

    methods: {
        // 在照片墙删除某一个图片的时候会触发
        handleRemove(file, fileList) {
            // 收集照片墙的数据
            this.spuImageList = fileList;  
        },
        handlePictureCardPreview(file) {
            // 将图片的地址赋值给这个属性
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

        // 照片墙图片上传成功的回调
        handlerSuccess(response, file, fileList) {
            // 收集片的信息
            this.spuImageList = fileList;
        },

        // 添加新的销售属性(通过attrIdAndAttrName收集得到)
        addSaleAttr() {
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
            // 向SPU对象的spuSaleAttrList属性里面添加新的销售属性
            let newSaleAttr = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList: []};
            // 添加新的销售属性
            this.spu.spuSaleAttrList.push(newSaleAttr);
            // 清空数据
            this.attrIdAndAttrName = "";

        },

        // 添加平台专有属性属性值的回调
        addSaleAttrValue(row) {
            this.$set(row, "inputVisible", true);
            // 通过响应式数据inputValue字段收集新增的销售属性值
            this.$set(row, "inputValue", "");
        },

        // el-input失去焦点的事件
        handleInputConfirm(row) {
            // 解构出销售属性当中收集到的数据
            const {baseSaleAttrId, inputValue} = row;
            // 新增的销售属性值不能为空！！
            if (inputValue.trim()=="") {
                this.$message({type: "failed", message: "抱歉,属性值不能为空!"})
                return;
            }
            // 属性值不能重复！
            let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue);
            if (!result) return;
            // 新增的销售属性值
            let newSaleAttrValue = {baseSaleAttrId: baseSaleAttrId, saleAttrValueName: inputValue};
            row.inputVisible = false;
            row.spuSaleAttrValueList.push(newSaleAttrValue);
        },

        // 保存SPU按钮的回调
        async addOrUpdateSpu() {
            // 需要整理照片墙的数据
            // 图片需要携带参数imageName和imageUrl字段
            this.spu.spuImageList = this.spuImageList.map(item=>{
                return {
                    imageName: item.name,
                    imageUrl: (item.response&&item.response.data) || item.url
                }
            });

            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
            if (result.code==200) {
                this.$message({type: "success", "message": "保存成功！！"})
                // 通知父组件回到场景0
                // 添加应该回到首页，修改应该停留在当前页
                this.$emit("changeScene", {scene: 0, flag: this.spu.id?"修改":"添加"});
                // 清除数据
                Object.assign(this._data, this.$options.data()); 
            }
        },

        // 添加SPU按钮的回调
        async addSpuData(category3Id) {
            // 添加SPU的时候收集三级分类的id
            this.spu.category3Id = category3Id;
            let tradeMarkResult = await this.$API.spu.reqTrademarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }

            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        },

        // 取消的时候清空输入框
        cancel() {
            this.$emit('changeScene', {scene:0, flag:''})
            // 清理数据
            // 组件实例上的this._data可以操作data当中的响应式数据
            // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
            Object.assign(this._data, this.$options.data());
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
  