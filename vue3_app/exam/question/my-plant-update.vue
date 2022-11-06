<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor,'--button-color': buttonColor}">
		<u-navbar title="计划"></u-navbar>
		<view class="update-content clearfix">
			<label class="u-m-t-40 u-font-32">选择考试</label>
			<swiper class="swipes" :display-multiple-items='2' :next-margin='nextMargin'>
				<swiper-item @click="selectCateItem(item.questionCount,index,item.cateId,item.id)"
					v-for="(item,index) in plantList" :key="index">
					<view class="cate-item">
						<view class="item-info">
							<view class="u-m-l-30 twoLine u-font-16 u-p-t-30">{{item.cateName}}</view>
							<view class="u-m-l-30">共{{item.questionCount||0}}道题目</view>
						</view>
						<view class="select-item" v-show="selectIndex == index">
							<image style="width: 100%;height: 100%;" src="../../static/images/plant_d.png"></image>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="cate-item" @click="handleSelectCate">
						<view class="cate-item-right">
							<view class="cate-item-eneter">
								<view class="u-font-16 u-m-b-10">
									<u-icon name="plus" color="#00B7FD" size="48"></u-icon>
								</view>
								<view class="">添加考试</view>
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
				</swiper-item>
			</swiper>
		</view>
		<view style="padding: 0 50upx;">
			<view class="one">
				<view class="one-name">{{selectCateName}}</view>
				<view @click="deleteID" class="one-btn">
					<image mode="aspectFit" src="../../static/images/rep.png"></image>重置
				</view>
			</view>
			<view class="two" @click="handleShow">
				<view class="two-name">计划完成日期：</view>
				<view class="two-right">{{endDate || '请选择'}}
					<u-calendar max-date='3000' v-model="show" :mode="mode" @change="change"></u-calendar>
				</view>
			</view>
			<view class="one">
				<view class="one-name">目标完成天数</view>
			</view>
			<view class="three">
				<view @click="handleDayCount(7)" :class="{'item-active': newDayCount==7}" class="three-item">7天</view>
				<view @click="handleDayCount(15)" :class="{'item-active': newDayCount==15}" class="three-item">15天
				</view>
				<view @click="handleDayCount(30)" :class="{'item-active': newDayCount==30}" class="three-item">30天
				</view>
				<view @click="handleDayCount(100)" :class="{'item-active': newDayCount==100}" class="three-item">100天
				</view>
			</view>
			<view class="fuor">
				<u-input @input="oninput" v-model="newDayCount" type="number" :border="false"
					placeholder="自定义天数不小于7天" />
			</view>
			<view class="one">
				<view class="one-name">每日练习数量</view>
			</view>
			<view class="fuor">
				<u-input v-model="prNum" type="number" :border="false" placeholder="请输入练习数量" />
			</view>
		</view>
		<view @click="addPlant" class="plant-btn btn-start">
			继续计划/确定计划
		</view>
	</view>
</template>

<script>
	import {
		newDelete,
		newPlantList,
		getPQuestionCount,
		newAddPlant,
		plantUpdate,
		getNewQuestionCount
	} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
					.themeColor : '#395AE1',
				buttonColor: uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync(
						'otherThemeColor')
					.buttonColor : '#395AE1',
				themeFontColor: uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
					'otherThemeColor').themeFontColor : '#fff',
				plantList: [],
				userId: '',
				selectCateId: '',
				selectCateName: '',
				day: [],
				dayCount: [],
				visible: true,
				value: [1, 3],
				indicatorStyle: `height: 60upx;`,
				selectCount: 0,
				selectIndex: 0,
				dayNum: '',
				prNum: '',
				questionCount: '',
				mode: 'date',
				show: false,
				endDate: '',
				newDayCount: 0,
				plantId: '',
				oldCateId: "",
				nextMargin: '90upx',
				multiplese: 1,
				afershow: false
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.nextMargin = '90upx'
			// #endif

		},
		onShow() {
			this.selectCateId = uni.getStorageSync("plant").cId || '';
			this.selectCateName = uni.getStorageSync("plant").cName || '';
			this.oldCateId = ''
			if (uni.getStorageSync("routerCateId")) {
				this.oldCateId = uni.getStorageSync("routerCateId");
				uni.removeStorageSync('routerCateId')
			}
			this.getAllPlnt(this.oldCateId);
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value
				let dayCountValue = this.dayCount[val[0]];
				let dayitem = Math.ceil(this.selectCount / dayCountValue);
				let indexOf = this.day.indexOf(dayitem);
				this.value = [val[0], indexOf];
				//console.log(this.day);  
			},
			handleDayCount(e) {
				this.newDayCount = e;
			},
			oninput(e) {
				let sdate = new Date();
				let now = new Date(this.endDate);
				let days = now.getTime() - sdate.getTime();
				let day = parseInt(days / (1000 * 60 * 60 * 24));
				if (e < day) {
					uni.showToast({
						title: `自定义天数不小于${day}天`,
						duration: 2000,
						icon: "none"
					});
					return
				}
				this.newDayCount = e;
			},
			change(e) {
				// console.log(e);
				this.endDate = e.result;
			},
			handleShow() {
				// this.show = !this.show
				this.show = true
			},
			btnSt() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			deleteID() {
				console.log("this.plantList.length", this.plantList.length)
				if (this.plantList.length != 0) {
					newDelete({
						id: this.plantId
					}).then(ret => {

						if (this.plantList.length == 1) {
							this.newDayCount = '';
							this.prNum = '';
							this.endDate = '';
							this.plantList = [];
						}
						this.selectIndex = 0
						this.getAllPlnt();
						uni.showToast({
							title: '重置成功',
							duration: 2000,
							icon: "none"
						});
					});
				} else {
					uni.showToast({
						title: '请添加学习计划',
						duration: 2000,
						icon: "none"
					});
				}

			},
			getAllPlnt(oldCateId) {
				let that = this;
				let user = uni.getStorageSync("user");
				if (user != null && user != undefined) {
					var param = {
						userId: user.userId
					}
					//getPlantList
					newPlantList(param).then(ret => {
						if (ret.result.length > 0) {
							that.plantList = ret.result;
							that.endDate = ret.result[0].endDate;
							that.newDayCount = ret.result[0].dayCount;
							that.prNum = ret.result[0].dayQuestionCount;
							that.plantId = ret.result[0].id;
							that.questionCount = ret.result[0].questionCount;
							that.selectCateName = ret.result[0].cateName;
						}
						if (oldCateId == 'routerCateId') {
							this.plantId = '';
							let selectItem = {};
							selectItem.cateName = that.selectCateName;
							getNewQuestionCount({
								pid: that.selectCateId
							}).then(ret => {
								console.log(ret);
								if (ret.result) {
									selectItem.questionCount = ret.result.count;
									selectItem.cateName = ret.result.name;
									this.selectCateName = ret.result.name;
									this.questionCount = ret.result.count;
									this.newDayCount = '';
									this.prNum = '';
									this.endDate = '';
									that.plantList.unshift(selectItem);
								}
							});

						}

					});
				}
			},
			handleSelectCate() {
				uni.navigateTo({
					url: '/exam/category/category-list?page=plant'
				});
			},
			setDay(count) {
				console.log(count);
				if (count != null && count > 0) {
					this.selectCount = count;
					this.day = [];
					this.dayCount = []
					let item = Math.ceil((count / 10));
					for (let i = 1; i < item + 1; i++) {
						this.dayCount.push(i * 10);
						let dayitem = Math.ceil(count / (i * 10));

						if (this.addDayCount(dayitem) == 0) {
							this.day.push(dayitem);
						}
					}
				}
			},
			selectCateItem(count, index, cateId, id) {
				// console.log(count, index, cateId, id);
				this.plantId = id;
				this.selectCateId = cateId;
				this.selectIndex = index;
				this.endDate = this.plantList[index].endDate;
				this.newDayCount = this.plantList[index].dayCount;
				this.prNum = this.plantList[index].dayQuestionCount;
				this.questionCount = this.plantList[index].questionCount;
				this.selectCateName = this.plantList[index].cateName;
			},
			addDayCount(dayitem) {
				let ct = 0;
				this.day.forEach(tag => {
					if (dayitem == tag) {
						ct++;
					}
				})

				return ct;
			},
			getQuestionCount(cateId) {
				let count = 0;
				getPQuestionCount({
					pid: cateId
				}).then(ret => {
					count = count + parseInt(ret.result);
				});
				return count;
			},
			//添加计划
			addPlant() {
				if (this.endDate == '' || this.prNum == '' || this.newDayCount == '') {
					uni.showToast({
						title: '请完善信息',
						duration: 2000,
						icon: "none"
					});
					return;
				}
				let user = uni.getStorageSync("user");
				if (user != null && user != undefined) {
					let param = {
						member: user.userId,
						cateId: this.selectCateId,
						id: this.plantId,
						cateName: this.selectCateName,
						dayCount: this.newDayCount, //this.day[this.value[1]],
						dayQuestionCount: this.prNum, //this.dayCount[this.value[0]],
						endDate: this.endDate, //this.getEndDay(this.day[this.value[1]])
						questionCount: this.questionCount
					}
					if (!this.plantId) {
						newAddPlant(param).then(ret => {
							console.log("添加学习计划返回数据", ret)
							if (ret.result == true) {
								this.selectCateId = '';
								uni.showToast({
									title: '添加成功',
									duration: 2000,
									icon: "none"
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 500);
							}
						});
					} else {
						plantUpdate(param).then(ret => {
							if (ret.result == true) {
								uni.showToast({
									title: '继续该计划',
									duration: 2000,
									icon: "none"
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 500);
							}
						});
					}
				}
			},
			getEndDay(addDay) {
				var startTime = new Date().getTime() + parseInt(addDay) * 24 * 60 * 60 * 1000; //减去一天
				var startYear = new Date(startTime).getFullYear(); //获取新的日期的年份
				var startMonth = new Date(startTime).getMonth() + 1; //获取月份
				var startDay = new Date(startTime).getDate(); //获取天
				return startYear + '-' + Appendzero(startMonth) + '-' + Appendzero(startDay) //自定义日期格式，可以用字符串拼接成想要的
				function Appendzero(obj) { //添0操作
					{
						if (obj < 10) {
							return "0" + "" + obj;
						} else {
							return obj;
						}
					}
				}

			},

		}
	}
</script>

<style lang="scss" scoped>
	.swipes {
		width: 100%;
		height: 200upx;
		margin-top: 30upx;
	}

	.update-content {
		width: 90%;
		margin-left: 5%;
	}

	.clearfix::after {
		display: block;
		clear: both;
		content: '';
		overflow: hidden;
		height: 0;
	}

	.plant-btn {
		width: 80%;
		margin: 150rpx auto;
		height: 80rpx;
		text-align: center;
		border: 1rpx solid $u-button-color;
		border-radius: 50rpx;
		line-height: 80rpx;
	}

	.btn-start {
		color: #FFFFFF;
		background-color: $u-button-color;
	}

	.cate-item {
		width: 280upx;
		height: 200upx;
		position: relative;

		.item-info {
			width: 100%;
			height: 160upx;
			border-radius: 20upx;
			background-image: url(../../static/images/plant_c.png);
			color: #FFFFFF;
		}
	}

	.cate-item-right {
		display: flex;
		align-items: center;
		width: 100%;
		height: 160upx;
		border-radius: 20upx;
		margin-right: 20upx;
		background: rgba($color: $u-button-color, $alpha: .5);
		border: 1upx solid $u-button-color;
		color: $u-button-color;
		text-align: center;
	}

	.cate-item-eneter {
		width: 100%;
	}

	.select-item {
		width: 30upx;
		height: 30upx;
		margin-left: 40%;
		margin-top: 10upx;
	}

	.picker-view {
		width: 500upx;
		height: 300upx;
		margin-top: 20upx;
		margin: 0 auto;
	}

	.item {
		height: 70upx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.plant-title {
		text-align: center;
		width: 50%;
		height: 100upx;
		line-height: 100upx;
		float: left;
	}

	.one {
		display: flex;
		justify-content: space-between;
		margin-top: 50upx;

		.one-name {
			font-size: 32upx;
			font-weight: #00b7fd;
		}

		.one-btn {
			opacity: .8;

			image {
				position: relative;
				top: 7upx;
				right: 3upx;
				height: 36upx;
				width: 36upx;
			}
		}
	}

	.two {
		display: flex;
		margin-bottom: 50upx;
		margin-top: 10upx;

		.two-name {
			opacity: .5;
		}

		.two-right {
			font-weight: 700;
			color: $u-button-color;
		}
	}

	.three {
		display: flex;
		justify-content: space-between;
		margin-top: 30upx;

		.three-item {
			background-color: #f3f5f9;
			line-height: 60upx;
			text-align: center;
			border-radius: 10upx;
			width: 150upx;
			height: 60upx;
		}

		.item-active {
			background-color: $u-button-color;
			color: #FFFFFF;
			font-weight: 600;
		}
	}

	.fuor {
		margin-top: 20upx;
		border-bottom: 1upx solid #cbcac9;
	}
</style>
