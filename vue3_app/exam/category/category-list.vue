<template>
	<view class="container">
		<u-navbar title="行业类别"></u-navbar>

		<view @touchend="touchend">
			<view class="u-flex u-col-top centont">
				<scroll-view class="scroll-view-left" scroll-y :scroll-with-animation="true" :scroll-top="scrollTop">
					<block v-for="(item,index) in primaryItemData" :key="index">
						<view class="list-col-left" :style="{color:tagIndex == index ? themeColor : ''}"
							@tap="btn(index)">
							<view class="border" :style="{background:tagIndex == index ? themeColor : ''}"></view>
							{{item.name}}
						</view>
					</block>
				</scroll-view>

				<scroll-view class="scroll-view-right" scroll-y :scroll-with-animation="true" :scroll-top="scrollTopRg"
					@scroll="scrollRight">
					<block v-for="(item,index) in subCategoryList" :key="index">
						<view class="list-col-right">
							<view class="child-title" @click="selectItem(item)">{{item.name}}</view>
							<view class="child-list">
								<view @click="selectItem(itemChild)" :data-item="itemChild" class="child-list-item"
									v-for="(itemChild,index) in item.subCategoryList" :key="index">
									<image class="u-m-l-30" :src="itemChild.img"></image>
									<label class="u-m-l-20">{{itemChild.name}}</label>
								</view>
							</view>
						</view>
					</block>
					<view style="height: 80vh;"></view>
				</scroll-view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		listAll,
		mallGoodsClassify
	} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				staticUrl: getApp({
					allowDefault: true
				}).globalData.staticUrl,
				primaryItemData: [],
				subCategoryList: [],
				scrollTop: 0,
				windowHeight: 0,
				scrollViewHeight: 0,
				tagIndex: 0,
				scrollRightTop: [],
				ind: 0,
				navHeight: 0,
				scrollTopRg: 0,
				show: true,
				page: "",
				plantList: [],
				themeColor: uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
					.themeColor : '#395AE1',
				buttonColor: uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync(
						'otherThemeColor')
					.buttonColor : '#395AE1',
				themeFontColor: uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
					'otherThemeColor').themeFontColor : '#fff',
			}
		},
		onLoad(option) {
			this.page = option.page;
			if (this.page === 'product') {
				this.getProductList();
				return;
			}
			this.getList();
		},
		onShow() {
			let that = this;
			let info = uni.createSelectorQuery();
			let query = uni.createSelectorQuery();
			let navHeight = uni.createSelectorQuery();
			// setTimeout(() => {
			// 	info.select(".scroll-view-left").boundingClientRect(function(data) {
			// 		that.scrollViewHeight = data.height
			// 	}).exec()
			// 	query.selectAll('.list-col-right').boundingClientRect()
			// 	query.exec(function(res) {
			// 		for (var i = 0; i < that.primaryItemData.length; i++) {
			// 			// 放入到一个数组内
			// 			that.scrollRightTop.push(res[0][i].top)
			// 		}
			// 	})
			// }, 1000)
		},
		methods: {
			getProductList() {
				mallGoodsClassify().then(ret => {
					this.primaryItemData = ret.result.map((item) => {
						return {
							name: item.name,
							childList: item.subClassifyVOList
						}
					})
				})
			},
			getList() {
				listAll({}).then(ret => {
					this.primaryItemData = ret.result;
					this.subCategoryList = ret.result[0].subCategoryList
				});
			},
			//选择分类
			selectItem(even) {
				if (this.page === 'product') {
					uni.$emit('productCate', even.id)
					return;
				}
				// var item=even.currentTarget.dataset.item
				// uni.navigateTo({
				// 	url: '/exam/category/category-list-item?cateId='+item.id+"&page="+this.page||'home'
				// });
				// uni.$emit('courseCate',even)
				// uni.navigateBack();
				let keys = this.page || 'home';
				if (keys == "plant") {
					if (this.plantList.indexOf(even.id) != -1) {
						uni.showToast({
							title: '该计划已添加',
							duration: 2000,
							icon: "none"
						});
						return
					}
				}
				let userIofo = uni.getStorageSync("user") || {};
				userIofo = JSON.stringify(userIofo)
				userIofo = JSON.parse(userIofo)
				if (userIofo != null) {
					userIofo.cId = even.id;
					userIofo.cName = even.name;
					if (keys == 'plant') {
						uni.setStorageSync("plant", {
							cId: even.id,
							cName: even.name
						});
					} else {
						uni.setStorageSync("user", userIofo);
					}

				}
				if (keys == 'course') {
					uni.$emit('courseCate', even.id)
				}
				uni.navigateBack({
					delta: 1
				});
				uni.setStorageSync("routerCateId", 'routerCateId');
				//  getNewQuestionCount({
				// 	pid: item.id
				// }).then(ret => {
				// 	if(ret != undefined && ret != null && ret != ''){
				// 		// if(this.page=='plant'){
				// 		// 	uni.setStorageSync("routerCateId", 'routerCateId');
				// 		// 	uni.setStorageSync("plant", {cId:item.id,cName:item.name});
				// 		// 	uni.navigateBack({
				// 		// 		delta: 1
				// 		// 	});
				// 		// 	return
				// 		// }
				// 	}
				// });
			},
			// 左边点击事件 滚动
			async btn(index) {
				if (this.primaryItemData[index]?.id) {
					await listAll({
						pid: this.primaryItemData[index].id
					}).then(res => {
						this.subCategoryList = res.result
					})
				}
				this.tagIndex = index;
				// let query = uni.createSelectorQuery();
				// query.selectAll('.list-col-left').boundingClientRect()
				// query.exec(function(res) {
				// 	let scrollTop = res[0][index].top
				// 	if (that.tagIndex != 0 && that.tagIndex > index) {
				// 		that.scrollTop = res[0][index].height * index - (that.tagIndex - index) * res[0][index]
				// 			.height
				// 	} else {
				// 		that.scrollTop = res[0][index].height * index
				// 	}
				// 	// 右边滚动到相应位置
				// 	if (that.show) {
				// 		that.scrollTopRg = that.scrollRightTop[index] - that.navHeight-64
				// 	}
				// 	// 记录是否往会滚的索引
				// 	that.tagIndex = index;
				// })
			},
			// 右边滚动事件
			scrollRight(event) {
				let that = this
				that.show = false
				// that.scrollTopRg = Math.random();
				// 滚动的时候取消右边滚动scrollTopRg
				let scrollTop = event.detail.scrollTop
				// 左边相应的滚动方法
				let index = that.scrollRightTop.findIndex((item, index) => {
					return (scrollTop + 64) + that.navHeight >= that.scrollRightTop[index] && (scrollTop + 64) +
						that.navHeight < that.scrollRightTop[index + 1]
				})
				// index >= -1 ? that.btn(index) : that.btn(0)
			},
			touchend() {
				this.show = true
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F5F9;
	}

	.centont {
		display: flex;

	}

	.category-search {
		height: 80upx;
		background-color: #FFFFFF;
		margin: 0 auto;
	}

	.list-col-left {
		height: 50px;
		line-height: 50px;
		text-align: center;
	}

	.scroll-view-left {
		width: 25%;
		height: 100vh;
		background-color: #FFFFFF;
	}


	.active {
		// color: #00B7FD;
		/* border-left: 4px solid #00B7FD; */
		background-color: #F3F5F9;
		font-size: 32upx;
		font-weight: 600;
	}

	.border {
		width: 5upx;
		height: 50%;
		position: relative;
		top: 25%;
		float: left;
	}

	.active-border {
		// background: #00B7FD;
	}


	.scroll-view-right {
		width: 75%;
		height: 100vh;
		background-color: #F3F5F9;

	}

	.list-col-right {
		height: auto;
		display: flex;
		flex-direction: column;
	}

	.category-search-list {
		width: 80%;
		height: 80%;
		background-color: #F3F5F9;
		border-radius: 50px;
		margin: 0 auto;
	}

	.se-icon {
		float: left;
		color: #999FAE;

	}

	.se-input {
		float: left;
		width: 80%;
	}

	.list-col-right .child-title {
		height: 100upx;
		line-height: 100upx;
		font-size: 32upx;
		padding-left: 50upx;
		font-weight: 600;
	}

	.child-list {
		display: flex;
		align-items: center;
		// justify-content: space-around;
	}

	.list-col-right .child-list-item {
		// float: left;
		width: 46%;
		margin-left: 2%;
		height: 100upx;
		line-height: 100upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		margin-bottom: 20upx;
		text-align: center;
	}

	.child-list-item {
		display: flex;
		align-items: center;
		white-space: nowrap; // 默认不换行；
	}

	.child-list-item image {
		width: 40upx;
		height: 40upx;
		// margin-top: 30upx;
		// float: left;
	}

	.child-list-item label {
		// float: left;
		white-space: nowrap; // 默认不换行；
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
