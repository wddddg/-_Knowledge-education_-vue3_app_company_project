import $http from "@/common/requestConfig"

enum Api {
	findBannerList = '/api/mallGoods/findBannerList',
	listForHostGoodsPage = 'api/mallGoods/listForHostGoodsPage',
	getUserTotalIntegral = '/api/integralUserInfo/getUserTotalIntegral'
}

//查询积分商城轮播图
export const findBannerList = () =>
  $http.get({url: Api.findBannerList});

//查询热门兑换list
export const listForHostGoodsPage = (params) =>
  $http.get({url: Api.listForHostGoodsPage,params});
  
//查询用户积分
export const getUserTotalIntegral = () =>
  $http.get({url: Api.getUserTotalIntegral});