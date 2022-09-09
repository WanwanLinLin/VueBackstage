import request from "@/utils/request"

// /admin/skuManagement/product/
// 获取SPU图片的数据
export const reqSpuImageList = (spuId)=>request({url: `/admin/skuManagement/product/spuImageList/${spuId}`, method: "get"});

// 获取SPU销售属性的数据
export const reqSpuSaleAttrList = (spuId)=>request({url: `/admin/skuManagement/product/spuSaleAttrList/${spuId}`, method: "get"});

// 获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id)=>request({url: `/admin/categoryManagement/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get"});

// 添加sku
export const reqAddSku = (skuInfo)=>request({url: '/admin/skuManagement/product/saveSkuInfo', method: "post", data: skuInfo});

// 展示SKU
export const reqSkuList = (spuId)=>request({url: `/admin/skuManagement/product/findBySpuId/${spuId}`, method: "get"});

// 展示所有SKU
export const reqAllSkuList = (page, limit)=>request({url: `/admin/skuManagement/product/list/${page}/${limit}`, method: "get"});
