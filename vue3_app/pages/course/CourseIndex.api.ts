import $http from "@/common/requestConfig"

enum Api {
  courseListForPage = '/api/course/apiListForPage',
  bookListForPage = '/api/book/apiListForPage',
  knowledgeListForPage = '/api/knowledge/apiListForPage',
}

//课程列表
export const courseListForPage = (params,noLogdImg=false) =>
  $http.get({url: Api.courseListForPage, params,noToken:true,noLogdImg:noLogdImg});

//书籍列表
export const bookListForPage = (params,noLogdImg=false) =>
  $http.get({url: Api.bookListForPage, params,noToken:true,noLogdImg:noLogdImg});
  
//资料列表
export const knowledgeListForPage = (params,noLogdImg=false) =>
  $http.get({url: Api.knowledgeListForPage, params ,noToken:true,noLogdImg:noLogdImg});

