import request from "@/utils/request";

// 这是获取品牌列表的接口
export const reqTradeMarkList = (page, limit)=>request({url: `/admin/product/baseTrademark/${page}/${limit}`, method: "get"});

// 这是添加或更新品牌的接口
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    if(tradeMark.id) {
        return request({url: "/admin/product/baseTrademark/update", method: "put", data: tradeMark});
    }else{
        return request({url: "/admin/product/baseTrademark/save", method: "post", data: tradeMark});
    }
}

// 这是删除品牌的接口
export const reqDeleteTradeMark = (id)=>request({url: `/admin/product/baseTrademark/remove/${id}`, method: "delete"});