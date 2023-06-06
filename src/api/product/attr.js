// 品牌属性管理
import request from "@/utils/request"

// 增加商品分类的接口
export const reqNewCategory = (category1Id, category2Id, category3Id)=>request({url: "/admin/categoryManagement/addCategory", method: "get", params: {category1Id, category2Id, category3Id}});

// 获取一级分类数据的接口
export const reqCategory1List = ()=>request({url: "/admin/categoryManagement/getCategory1", method: "get"});

// 获取二级分类数据的接口
export const reqCategory2List = (category1Id)=>request({url: `/admin/categoryManagement/getCategory2/${category1Id}`, method: "get"});

// 获取三级分类数据的接口
export const reqCategory3List = (category2Id)=>request({url: `/admin/categoryManagement/getCategory3/${category2Id}`, method: "get"});

// 获取平台属性的接口
export const reqAttrList = (category1Id, category2Id, category3Id)=>request({url: `/admin/categoryManagement/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get"});

// 添加属性与属性值的接口
export const reqAddOrUpdateAttr = (data)=>request({url: "/admin/categoryManagement/saveAttrInfo", method: "post", data});
