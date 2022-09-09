import request from "@/utils/request"

// 获取SPU列表数据
export const reqSpuList = (page, limit, category3Id)=>request({url: `/admin/spuManagement/product/${page}/${limit}`, method: "get", params:{category3Id}});

// 获取SPU信息
export const reqSpu = (spuId)=>request({url: `/admin/spuManagement/product/getSpuById/${spuId}`, method: "get"});

// 获取品牌的数据
export const reqTrademarkList = ()=>request({url: '/admin/product/baseTrademark/getTrademarkList', method: "get"});

// 获取品牌图片
export const reqSpuImageList = (spuId)=>request({url: `/admin/spuManagement/product/spuImageList/${spuId}`, method: "get"});

// 获取平台全部的销售属性
export const reqBaseSaleAttrList = ()=>request({url: '/admin/spuManagement/product/baseSaleAttrList', method: "get"});

// 修改或添加SPU信息的接口
// 唯一的区别就是参数是否带id(相当于数据库中的spuId)
export const reqAddOrUpdateSpu = (spuInfo)=>{
    if(spuInfo.id) {
        return request({url: "/admin/spuManagement/product/updateSpuInfo", method:"post", data:spuInfo});
    }else{
        return request({url: "/admin/spuManagement/product/saveSpuInfo", method: "post", data: spuInfo});
    }
}

// 删除spu信息的接口
export const reqDeleteSpu = (spuId)=>request({url: `/admin/spuManagement/product/deleteSpu/${spuId}`, method: "delete"});

