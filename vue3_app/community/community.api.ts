import $http from "@/common/requestConfig"

enum Api {
	addNewsGood = '/api/news/addNewsGood',
	pushNews = '/api/news/pushNews',
	addNewsCommentGood = '/api/news/addNewsCommentGood',
	addNewsCollection = '/api/news/addNewsCollection',
	pushComment = '/api/comment/pushComment',
	apiNewsListForPage = '/api/news/apiNewsListForPage',
	getCommentDetails = '/api/comment/getCommentDetails',
	myReplyNewsCommentListForPage = '/api/comment/myReplyNewsCommentListForPage',
	findMyGoodNewsListForPage = '/api/news/findMyGoodNewsListForPage',
	getNewsDetails = '/api/news/getNewsDetails',
	getNewsUserDetails = '/api/news/getNewsUserDetails',
	systemCategory = '/api/systemCategory/list',
	findSubCommentListForPage = '/api/comment/findSubCommentListForPage',
	apiNewsCommentListForPage = '/api/comment/apiNewsCommentListForPage',
	myCollectionNewsListForPage = '/api/news/myCollectionNewsListForPage',
	myPushNewsListForPage = '/api/news/myPushNewsListForPage',
	addTeacherCollection = '/api/teacherInfo/addTeacherCollection'
}
//社区文章-查询个人信息（点赞、回复小红点标记、个人头像昵称）
export const getNewsUserDetails = (params) =>
	$http.get({ url: Api.getNewsUserDetails, params });

//发布评论-发布评论或回复评论
export const pushComment = (params) =>
	$http.post({ url: Api.pushComment, data: params });

//文章发布-动态发布或提问发布
export const pushNews = (params) =>
	$http.post({ url: Api.pushNews, data: params });

//评论点赞-点赞或取消点赞
export const addNewsCommentGood = (params) =>
	$http.post({ url: Api.addNewsCommentGood, data: params, header:{'content-Type':'application/x-www-form-urlencoded'} });

//社区文章-收藏或取消收藏
export const addNewsCollection = (params) =>
	$http.post({ url: Api.addNewsCollection, data: params , header:{'content-Type':'application/x-www-form-urlencoded'} });

//文章点赞-点赞或取消点赞
export const addNewsGood = (params) =>
	$http.post({ url: Api.addNewsGood, data: params, header:{'content-Type':'application/x-www-form-urlencoded'} });

//讲师收藏-收藏或取消收藏
export const	addTeacherCollection= (params) =>
$http.post({ url: Api.addTeacherCollection, data: params, header:{'content-Type':'application/x-www-form-urlencoded'} });


//社区文章-分页列表查询
export const apiNewsListForPage = (params) =>
	$http.get({ url: Api.apiNewsListForPage, params });

//我收到的回复-分页列表查询
export const myReplyNewsCommentListForPage = (params) =>
	$http.get({ url: Api.myReplyNewsCommentListForPage, params });

//我收到的点赞列表-分页列表查询
export const findMyGoodNewsListForPage = (params) =>
	$http.get({ url: Api.findMyGoodNewsListForPage, params });

//社区文章-查询详情
export const getNewsDetails = (params) =>
	$http.get({ url: Api.getNewsDetails, params });

//行业分类-查询所有
export const systemCategory = (params) =>
	$http.get({ url: Api.systemCategory, params });

//文章评论-分页列表查询
export const apiNewsCommentListForPage = (params) =>
	$http.get({ url: Api.apiNewsCommentListForPage, params });

// 文章二级（子）评论列表-分页列表查询
export const findSubCommentListForPage = (params) =>
	$http.get({ url: Api.findSubCommentListForPage, params });

//一级评论-查询详情
export const getCommentDetails = (params) =>
	$http.get({ url: Api.getCommentDetails, params });


//文章收藏列表-分页列表查询
export const myCollectionNewsListForPage = (params) =>
	$http.get({ url: Api.myCollectionNewsListForPage, params });


//我发布的文章-分页列表查询
export const myPushNewsListForPage = (params) =>
	$http.get({ url: Api.myPushNewsListForPage, params });