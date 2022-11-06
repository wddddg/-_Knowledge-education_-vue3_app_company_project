import $http from "@/common/requestConfig"

enum Api {
  courseListForPage = '/api/course/apiListForPage',
  bookListForPage = '/api/book/apiListForPage',
  knowledgeListForPage = '/api/knowledge/apiListForPage',
  getDetailsById = '/api/knowledge/getDetailsById',
  getBookDetailsById = '/api/book/getDetailsById',
  getOfflineCourseDetails = '/api/course/getOfflineCourseDetails',
  getClassCourseDetails = '/api/course/getClassCourseDetails',
  getTeacherApiDetails = '/api/teacherInfo/getTeacherApiDetails',
  apiCourseListForPage = '/api/teacherInfo/apiCourseListForPage',
  apiBookListForPage = '/api/teacherInfo/apiBookListForPage',
  apiKnowledgeListForPage = '/api/teacherInfo/apiKnowledgeListForPage',
  addCourseApplyUserConnect = '/api/course/addCourseApplyUserConnect',
  getCourseContactByCourseId = '/api/course/getCourseContactByCourseId',
  listForCourseCommentPage = '/api/course/listForCourseCommentPage',
  addCourseComment = '/api/course/addCourseComment',
  systemHot = '/api/systemHot/list',
  addTeacherCollection = '/api/teacherInfo/addTeacherCollection',
  getOnlineCourseDetails = '/api/course/getOnlineCourseDetails',
  getLiveCourseDetails = '/api/course/getLiveCourseDetails',
  getCourseSectionDetails = '/api/course/getCourseSectionDetails',
  addCollectionCourse = '/api/course/addCollectionCourse',
  findSectionList = '/api/book/findSectionList',
  getSectionById = '/api/book/getSectionById',
  apiNewsListForPage = '/api/teacherInfo/apiNewsListForPage',
  getLiveSectionBackUrl = '/api/course/getLiveSectionBackUrl',
  addCollectionBook = '/api/book/addCollectionBook',
  addCourseUserStudyRecord = '/api/course/addCourseUserStudyRecord',
}

//课程列表
export const courseListForPage = (params) =>
  $http.get({url: Api.courseListForPage, params ,noToken:true});

//书籍列表
export const bookListForPage = (params) =>
  $http.get({url: Api.bookListForPage, params ,noToken:true});
  
//资料列表
export const knowledgeListForPage = (params) =>
  $http.get({url: Api.knowledgeListForPage, params ,noToken:true});

//资料详情
export const getDetailsById = (params) =>
  $http.get({url: Api.getDetailsById, params,noToken:true});
  
//书籍详情
export const getBookDetailsById = (params) =>
  $http.get({url: Api.getBookDetailsById, params,noToken:true});

//面授课详情
export const getOfflineCourseDetails = (params) =>
  $http.get({url: Api.getOfflineCourseDetails, params,noToken:true});

//班级课详情
export const getClassCourseDetails = (params) =>
  $http.get({url: Api.getClassCourseDetails, params ,noToken:true});

//讲师详情
export const getTeacherApiDetails = (params) =>
  $http.get({url: Api.getTeacherApiDetails, params,noToken:true });

//讲师课程列表
export const apiCourseListForPage = (params) =>
  $http.get({url: Api.apiCourseListForPage, params ,noToken:true});

//讲师书籍列表
export const apiBookListForPage = (params) =>
  $http.get({url: Api.apiBookListForPage, params ,noToken:true});

//讲师知识列表
export const apiKnowledgeListForPage = (params) =>
  $http.get({url: Api.apiKnowledgeListForPage, params ,noToken:true});
  
//讲师资讯列表
export const apiNewsListForPage = (params) =>
  $http.get({url: Api.apiNewsListForPage, params ,noToken:true});

//添加联系方式
export const addCourseApplyUserConnect = (params) =>
  $http.post({url: Api.addCourseApplyUserConnect, data:params,noLogdImg:noLogdImg});

//讲师课程咨询信息
export const getCourseContactByCourseId = (params) =>
  $http.get({url: Api.getCourseContactByCourseId, params});

//评论与答疑列表
export const listForCourseCommentPage = (params) =>
  $http.get({url: Api.listForCourseCommentPage, params,noToken:true});
  
//评论与答疑列表添加
export const addCourseComment = (params) =>
  $http.post({url: Api.addCourseComment, data:params});
  
//分页列表查询
export const systemHot = (params) =>
  $http.get({url: Api.systemHot, params,noToken:true});
    
//讲师收藏
export const addTeacherCollection = (params) =>
  $http.post({url: Api.addTeacherCollection, params});
  
//线上课详情
export const getOnlineCourseDetails = (params) =>
  $http.get({url: Api.getOnlineCourseDetails, params ,noToken:true});
    
//直播课课详情
export const getLiveCourseDetails = (params) =>
  $http.get({url: Api.getLiveCourseDetails, params ,noToken:true});
      
//章节内容详情
export const getCourseSectionDetails = (params) =>
  $http.get({url: Api.getCourseSectionDetails, params});
        
//课程收藏
export const addCollectionCourse = (params) =>
  $http.post({url: Api.addCollectionCourse, params});
        
//书籍章节列表
export const findSectionList = (params) =>
  $http.get({url: Api.findSectionList, params});
           
//书籍章节内容
export const getSectionById = (params) =>
  $http.get({url: Api.getSectionById, params});
             
//课程-获取直播章节的回放信息
export const getLiveSectionBackUrl = (params) =>
  $http.get({url: Api.getLiveSectionBackUrl, params});
  
//收藏书籍
export const addCollectionBook = (params) =>
  $http.post({url: Api.addCollectionBook, params});
    
//课程-学习记录保存（直播无需保存）
export const addCourseUserStudyRecord = (params) =>
  $http.post({url: Api.addCourseUserStudyRecord, params});