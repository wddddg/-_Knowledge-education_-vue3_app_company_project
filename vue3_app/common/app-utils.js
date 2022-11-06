var base='https://wechat.xingpeixuetang.cn/system-api/'
import uniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';

// import {https} from './https.js';

function getClientId() {
	let cid = ''
	// #ifdef APP-PLUS
	let pinf = plus.push.getClientInfo();
	cid = pinf && pinf.clientid || '';
	// #endif
	uni.setStorageSync('clientid',cid)
	
	if(!uni.getStorageSync('showAdvertTime')){
		uni.setStorageSync('showAdvertTime',new Date().getTime())
	}
};

function getDataType() {
	console.log(uni.getSystemInfoSync().uniPlatform)
	uni.setStorageSync('useDevice',uni.getSystemInfoSync())
	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			uni.setStorageSync("type", 1);
			break;
		case 'ios':
			uni.setStorageSync("type", 1);
			break;
		default:
			uni.setStorageSync("type", 2);
			break;
	}
};

export function goLogin(){
	if(uni.getStorageSync("user").token){
		return
	}
	uni.showModal({
		title:'提示',
		content:'尚未登入，是否登录',
		success:function (res){
			if (res.confirm) {
				console.log('用户点击确定');
				uni.navigateTo({
					url:'/pages/login/login',
				})
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	})	
}

//自定义tabIcon
export function setTab(){
	let bottomIcon = uni.getStorageSync('bottomIcon')
	if(!bottomIcon){
		setTimeout(()=>{
			// bottomIcon = uni.getStorageSync('bottomIcon')
			// bottomIcon.forEach((itme,index)=>{
			// 	uni.setTabBarItem({
			// 		"index":index,
			// 		"pagePath": itme.onclickUrl,
			// 		"iconPath": itme.onclickAgo,
			// 		"selectedIconPath": itme.onclickAfter,
			// 		"text": itme.title,
			// 		"visible":true,
			// 	})
			// })
			// uni.setTabBarStyle({
			// 	selectedColor:uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#97fffe'
			// })
			setTab()
		},2000)
		return
	}
	bottomIcon.forEach((itme,index)=>{
		console.log('已经设置',itme);
		uni.setTabBarItem({
			"index":index,
			"pagePath": itme.onclickUrl,
			"iconPath": itme.onclickAgo,
			"selectedIconPath": itme.onclickAfter,
			"text": itme.title,
			"visible":true,
		})
	})
	uni.setTabBarStyle({
		selectedColor:uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#97fffe'
	})
}

function getAllClass(cId) {d
	let user = uni.getStorageSync("user");
	return new Promise(async (resolve, reject) => {
		await uni.request({
			url: base+`api/systemMember/checkIsPay`, //请求接口
			data: {
				id: user.userId,
				cateId: cId
			},
			method: 'GET',
			success: (res) => {
				//isCharge 0 不需要付费  1需要付费 res.data.result.isCharge
				if (res.data.code == 200) {
					if (res.data.result.isCharge == 1) {
						if (user.isVip == 1) {
							resolve(1);
						} else {
							resolve(0);
						}
					} else if (res.data.result.isCharge == 0) {
						resolve(1);
					}
				}

			},
			fail: (err) => {
				reject('err')
			}
		});
	})
}

function pushDate() {
	plus.push.setAutoNotification(true)
	//【APP在线】，收到透传消息通过，不会提醒至通知栏目，需要发送本地消息，再进行点击触发的点击事件。
	//【APP离线】，收到离线透传消息，必须通过Java后台的Intent字符串携带payload，且符合格式才能触发click事件，格式不符合不会触发
	plus.push.addEventListener("click", function(msg) {
		var payload;
		if (isIOS) {
			//APP离线点击包含click属性，这时payload是JSON对象
			if (msg.type && msg.type == "click") {
				payload = msg.payload;
			} else {
				//APP在线，收到消息不会包含type属性,这时的payload是JSON字符串，需要转为JSON对象
				payload = JSON.parse(msg.payload);
			}
			navigateTo(payload)
		} else {
			payload = JSON.parse(msg.payload);
			if (typeof payload === "string") {
				payload = JSON.parse(payload)
			}
			navigateTo(payload)
		}
	}, false);


	plus.push.addEventListener('receive', function(msg) {
		console.log("addEventListener receive:" + JSON.stringify(msg));
		if (isIOS) {
			//【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）
			//【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环
			if (!msg.aps && msg.type == "receive") {
				//创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null
				plus.push.createMessage(msg.content, JSON.stringify(msg.payload), {
					title: msg.title
				});
			}
		} else {
			//如果是Android，当APP在线时，收到透传消息不会进入系统消息，需要发送本地提醒。
			plus.push.createMessage(msg.content, JSON.stringify(msg.payload), {
				title: msg.title
			});
		}
	});
}

function update(model) {
	var _this = this;
	uni.request({
		url: base+`api/getNewVersion/list`, //请求接口
		data: {
			type: plus.os.name.toLowerCase()==='android'?1:0
		},
		method: 'GET',
		success: result => {
			if (result.data.code == 200) {
				uni.setStorageSync("downUrl", result.data.result.downUrl);
				if (plus.runtime.version != result.data.result.version) {
					uni.showModal({
						title: "发现新版本",
						content: "确认下载更新",
						cancelText:"稍后再说",
						confirmText:"立即更新",
						success: (res) => {
							if (res.confirm == true) { //当用户确定更新，执行更新
								if(plus.os.name.toLowerCase()==='android'){
									_this.doUpData(result.data.result);
								}else{
									plus.runtime.openURL(result.data.result.downUrl);
								}
							}else{
								if(result.data.result.isElide==1){
									if(plus.os.name.toLowerCase()==='android'){
										plus.runtime.quit()
									}else{
										const thread = plus.ios.importClass('NSThread')
										const mains=plus.ios.invoke(threadm,'mainThread');
										plus.ios.invoke(mains,'exit')
									}
								}
							}
						}
					})
				}
			}
		},
	})
}

function doUpData(versionData) {
	uni.showLoading({
		title: '正在下载...',
		mask:true
	})
	const downloadTask = uni.downloadFile({ //执行下载
		url: versionData.downUrl, //下载地址
		success: downloadResult => { //下载成功
		console.log(downloadResult)
			uni.hideLoading();
			if (downloadResult.statusCode == 200) {
				uni.showModal({
					title: '',
					content: '更新成功，确定现在重启吗？',
					confirmText: '重启',
					confirmColor: '#EE8F57',
					success: function(res) {
						if (res.confirm == true) {
							uni.showLoading({
								title: '正在安装...',
								mask:true
							})
							plus.runtime.install( //安装
								downloadResult.tempFilePath,{
									force: true
								},
								function(res) {
									console.log("下载最新1", res)
									uni.showToast({
									    title: '更新成功，重启中',
									    duration: 2000,
										icon:"none",
										mask:true
									});
									plus.runtime.restart();

									if(plus.os.name.toLowerCase()==='android'){
										plus.runtime.quit()
									}else{
										const thread = plus.ios.importClass('NSThread')
										const mains=plus.ios.invoke(threadm,'mainThread');
										plus.ios.invoke(mains,'exit')
									}
								},
								function(res){
									console.log("下载最新3", res)
									uni.showToast({
									    title: '安装失败',
									    duration: 2000,
										icon:"none",
										mask:true
									});
								}
							);
						}
					}
				});
			}
		}
	});
	// downloadTask.onProgressUpdate((res) => {
	// 	console.log(res)
	// 	uni.showLoading({
	// 		title: '已下载'+res.progress+"%",
	// 		mask:true
	// 	})
	// });
}

function uniShares(versionData) {
	let downUrl = 'https://exam.minhuiedu.com/login'; //uni.getStorageSync("downUrl");
	uniShare({
		content: { //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
			type: 0,
			href: downUrl,
			title: '兴智囊',
			summary: '为广大考生提供高效的智能题库备考服务,是各类考生顺利通过考试的好帮手',
			imageUrl: 'http://106.55.0.177/system-admin/sys/common/static/temp/logo.png',
			// imageUrl: 'http://wechat.xingpeixuetang.cn/system-api/sys/common/static/temp/logo.png'
		},
		menus: [{
				"img": "/static/sharemenu/wechatfriend.png",
				"text": "微信好友",
				"share": { //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
					"provider": "weixin",
					"scene": "WXSceneSession"
				}
			},
			{
				"img": "/static/sharemenu/wechatmoments.png",
				"text": "微信朋友圈",
				"share": {
					"provider": "weixin",
					"scene": "WXSenceTimeline"
				}
			}
		],
		cancelText: "取消分享",
	}, e => { //callback
	})
}

function ispay() {
	let user = uni.getStorageSync("user");
	// return false
	if(user.isVip==1){
		return false
	}else{
		if(user.isCharge==1){
			return true
		}else{
			return false
		}
	}
}


	function Download(fileUrl){
	// 文件下载
	// #ifdef MP-WEIXIN
	uni.downloadFile({
		url: fileUrl,//下载资源的 url
		success: res => {
			console.log(res);
			if (res.statusCode === 200) {
				console.log('下载成功');
			}
			console.log(res.tempFilePath);
			//文件保存到本地
			uni.saveFile({
				tempFilePath: res.tempFilePath, //临时路径
				success: function(res) {
					console.log(res);
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '文件已保存：' + res.savedFilePath, //保存路径
						duration: 3000
					});
					setTimeout(() => {
						//打开文档查看
						uni.openDocument({
							filePath: res.savedFilePath,
							success: function(res) {
								console.log('打开文档成功');
							},
							fail: function() {
								console.log('打开失败');
							}
						});
					}, 3000);
				},
				fail: function() {
					console.log('保存失败');
				}
			});
		},
		fail: function() {
			console.log('下载失败');
			uni.showToast({
				icon: 'none',
				mask: true,
				title: '失败请重新下载'
			});
		}
	});
	// #endif
	
		//注意：url是你要下载的文件路径，  xlsName（变量，随便命名） 是文件的后缀名，用于文件命名和格式修改
		// #ifdef APP-PLUS
		let xlsName = 'courware'
		let dtask = plus.downloader.createDownload(fileUrl,{
			//1.本地路径开头使用file://;
			//2.Android平台本地绝对路径为"storage/emulated/0",就是用户文件管理器能看到的了;
			//3.创建"xxx"作为文件夹名称，后缀是用于文件命名和格式修改，大家可以使用变量。
			filename: 'file://storage/emulated/0/xxx/' + xlsName //利用保存路径，实现下载文件的重命名
			},function(d, status) {//d为下载的文件对象;status下载状态
				console.log(d)
				if (status == 200) {//下载成功
					console.log("下载成功")
					//d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
					let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
					plus.runtime.openFile(d.filename); //选择软件打开文件
				} else {//下载失败
					console.log("下载失败")
					plus.downloader.clear(); //清除下载任务
				}
			}
		);
		dtask.start();//启用
		// #endif
	}

export default {
	getClientId: getClientId,
	getDataType: getDataType,
	update: update,
	pushDate: pushDate,
	doUpData: doUpData,
	uniShares: uniShares,
	ispay:ispay,
	Download:Download
}
