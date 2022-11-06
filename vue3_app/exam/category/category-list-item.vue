<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar title="行业详细"></u-navbar>
		<view class="page-box" v-if="childList.length<=0">
			<view>
				<NoState :isPage="true" type="article">
					<template #text>
						<view>暂无数据
							<view class="tips">可以去看看其他内容</view>
						</view>
					</template>
				</NoState>
			</view>
		</view>
		<uni-list-item v-else @click="selectItem(item)" v-for="(item,index) in childList" :key="index"
			:title="item.name" clickable="true" :show-badge="true" badge-text=">"></uni-list-item>
	</view>

</template>

<script>
	import {
		getChild,
		newPlantList
	} from "@/common/questionApi.js"
	import NoState from '@/components/NoState.vue'
	export default {
		data() {
			return {
				childList: [],
				userIofo: {},
				showAfterPages: false,
				keys: "",
				plantList: [],
				cateId: ""
			}
		},
		components: {
			NoState
		},
		onLoad(option) {
			this.userIofo = uni.getStorageSync("user") || {};
			this.keys = option.page || 'home';
			this.cateId = option.cateId
			console.log(option)
			this.getList();
			if (this.keys == "plant") {
				this.getAllPlnt();
			}
		},
		methods: {
			getList() {
				getChild({
					pid: this.cateId
				}).then(ret => {
					this.showAfterPages = true;
					this.childList = ret.result;
				});
			},
			getAllPlnt(id) {
				let that = this;
				let user = uni.getStorageSync("user");
				var param = {
					userId: user.userId
				}
				newPlantList(param).then(ret => {
					if (ret.result.length > 0) {
						for (let i = 0; i < ret.result.length; i++) {
							that.plantList.push(ret.result[i].cateId)
						}
					}
				});
			},
			returnPage() {
				debugger
				if (this.keys == 'plant') {
					uni.setStorageSync("routerCateId", 'routerCateId');
					uni.navigateBack({
						delta: 2
					});
				} else {
					// uni.reLaunch({
					// 	url: 'pages/question/index'
					// })
					uni.navigateBack({
						delta: 2
					});
				}
			},
			//选择分类
			selectItem(item) {
				if (this.keys == "plant") {
					if (this.plantList.indexOf(item.id) != -1) {
						uni.showToast({
							title: '该计划已添加',
							duration: 2000,
							icon: "none"
						});
						return
					}
				}
				this.userIofo = JSON.stringify(this.userIofo)
				this.userIofo = JSON.parse(this.userIofo)
				if (this.userIofo != null) {
					this.userIofo.cId = item.id;
					this.userIofo.cName = item.name;
					if (this.keys == 'plant') {
						uni.setStorageSync("plant", {
							cId: item.id,
							cName: item.name
						});
					} else {
						uni.setStorageSync("user", this.userIofo);
					}

				}
				if (this.keys == 'course') {
					uni.$emit('courseCate', item.id)
				}
				this.returnPage();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
</style>
