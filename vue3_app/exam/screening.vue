<template>
	<view class="container">
		<u-navbar  title="练习筛选"></u-navbar>
	<view class="sc-title">
		<view class="sc-title-name u-m-l-30">试题分类</view>
		<view class="sc-title-clean">
			<u-icon name="trash-fill" color="#00B7FD" size="30"></u-icon>
			<label @click="cleanRecord">清除练习记录</label>
		</view>
	
	</view>
	<view class="sc-cate">
		<view @click="changeCate(index)" v-for="(item,index) in btnCate" :key="index" class="sc-cate-item" :class="activeCateClass ==index?'sc-cate-select':''">{{item.name}}</view>
	</view>
	<view class="sc-title">
		<view class="sc-title-name u-m-l-30">题目分类</view>
	</view>
	<view class="sc-cate">
		<view @click="changeQuCate(item.queston_type)" v-for="(item,index) in btnQuCate" :key="index" class="sc-cate-qu-item" :class="activeQestions ==item.queston_type?'sc-cate-select':''">{{item.name}}({{item.count}})</view>
	</view>
	<view class="sc-title">
		<view class="sc-title-name u-m-l-30">做题数量</view>
	
	</view>
	<view class="sc-cate">
		<view @click="changeQuCount(item.value)" v-for="(item,index) in quCount" :key="index" class="sc-cate-item" :class="activeQeCount == (item.value || allCount)?'sc-cate-select':''">{{item.name}}</view>
		 <u-input v-model="inputValue" @mouseover="showClean" @input="confirm" :clearable="true" type="number" input-align="center"  class="sc-cate-item" placeholder="输入数量"></u-input>
	</view>
	<view class="sc-btn-list">
		<view @click="btnLx(1)" class="sc-btn-item btn-lx">练习模式</view>
		<view @click="btnKs(1)" class="sc-btn-item btn-ks">考试模式</view>
	</view>
	
	<u-modal v-model="ispayment"  :show-cancel-button="true" content="需要开通会员"
		@confirm="submitispayment" @cancel="ispayment=false"></u-modal>
	</view>
</template>

<script>
	import {getQuestionCount,cleanRecord} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				userId:"",
				cId:"",
				chapterId:"",
				sectionId:"",
				recordType:0,
				activeCateClass: 0,// 0为默认选择第一个，-1为不选择
				activeQestions:0,
				activeQeCount:5,
				allCount: ' ',  
				inputValue: '', 
				page:'',
				ispayment:false,
				btnCate:[
					{name:"全部",value:0},
					{name:"未作",value:1},
					{name:"已做",value:2},
					{name:"错误",value:3}
				],
				btnQuCate:[
					{name:"全部",count:0,queston_type:0},
					{name:"单选题",count:0,queston_type:1},
					{name:"多选题",count:0,queston_type:2},
					{name:"问答题",count:0,queston_type:3},
					{name:"不定项题",count:0,queston_type:4},
					{name:"填空题",count:0,queston_type:5},
					{name:"判断题",count:0,queston_type:6}
				],
				quCount:[
					{name:"全部",value:0},
					{name:"5",value:5},
					{name:"10",value:10},
					{name:"20",value:20}
				],
				
				}
			
		},
		onLoad(option) {
			this.userId=option.userId;
			this.cId=option.cId;
			this.chapterId=option.chapterId;
			this.sectionId=option.sectionId;
			this.getCount();
			this.page= option.page;
		
		},
		methods: {
			showClean() {
				// this.showDelete = true;
			},
			confirm(e) {
				if(Number(e)>this.btnQuCate[0].count){
					this.inputValue = this.btnQuCate[0].count;
					uni.showToast({
						title: '不可大于总题数',
						duration: 2000,
						icon: "none"
					});
				}else{
					this.inputValue = e;
				}
				this.activeQeCount = this.inputValue;
			},
			changeCate(index){
				this.activeCateClass = index;
				this.inputValue = '';
				this.recordType= index;
				this.getCount();
			},
			changeQuCate(index){
				this.activeQestions = index;
				this.inputValue = '';
				
			},
			changeQuCount(index){
				if(index==0){
					index = this.allCount 
				}
				this.activeQeCount = index;
			},
			btnLx(type){
				if(this.$appUtils.ispay()){
					this.ispayment=true
					return
				}else{
					this.ispayment=false
				}
				if(this.btnQuCate[this.activeQestions].count<=0){
					uni.showToast({
						title: '暂无试题信息',
						duration: 2000,
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: '/exam/practice?nxType='+type+"&cateId="+this.cId+"&chapterId="+this.chapterId+"&sectionId="+this.sectionId+"&userId="+this.userId+"&recordType="+this.recordType+"&pageSize="+this.activeQeCount+"&questonType="+this.activeQestions+"&errorType=error"
				})
			},
			submitispayment(){
				this.ispayment=false
				uni.navigateTo({
					url:"/exam/center/open-vip"
				})
			},
			btnKs(type){
				uni.navigateTo({
					url: '/exam/exam?ksType='+type+"&cateId="+this.cId+"&chapterId="+this.chapterId+"&sectionId="+this.sectionId+"&userId="+this.userId+"&recordType="+this.recordType+"&pageSize="+this.activeQeCount+"&questonType="+this.activeQestions
				})
			},
			getCount(){
				this.btnQuCate.forEach(itemQ => {
						itemQ.count= 0;
				});
				var param={
					cateId:this.cId,
					chapterId:this.chapterId,
					sectionId:this.sectionId,
					userId:this.userId,
					recordType:this.recordType
				}
				getQuestionCount(param).then(ret => {
					if (ret.result != null && ret.result.length > 0) {
						let allCount=0;
						ret.result.forEach(item=>{
							this.btnQuCate.forEach(itemQ => {
								if(itemQ.queston_type==item.queston_type){
									itemQ.count= item.queston_count;
									allCount+=item.queston_count;
								}
							});
							
						})
						this.btnQuCate[0].count= allCount;
						this.allCount = allCount;
					}else{
						this.btnQuCate.forEach(itemQ => {
								itemQ.count= 0;
						});
					}
				
				});
			},
			cleanRecord(){
				var param={
					cateId:this.cId,
					chapterId:this.chapterId,
					sectionId:this.sectionId,
					userId:this.userId
				};
				cleanRecord(param).then(ret => {
					if(ret.result==true){
						this.getCount();
						uni.showToast({
							title: '操作成功',
							duration: 2000,
							icon: "none"
						});
					}else{
						uni.showToast({
							title: '操作失败',
							duration: 2000,
							icon: "none"
						});
					}
					
				});
			}
		
			
		}
	}
</script>

<style lang="scss">
	.sc-title{
		height: 80upx;
		width: 100%;
        margin-top: 30upx;
		float: left;
	}
	.sc-title .sc-title-name{
		float: left;
		font-size: 32upx;
		font-weight: 600;
		height: 80upx;
		line-height: 80upx;
	}
	.sc-title .sc-title-clean{
		float: right;
		font-size: 24upx;
		margin-right: 30upx;
		height: 80upx;
		line-height: 80upx;
		color:#00B7FD;
	}
	.sc-cate{
		width: 100%;
		height: auto;

	}
	.sc-cate-item{
		width: 25%;
		float: left;
		text-align: center;
		margin-left: 5%;
		height: 70upx;
		border-radius: 50upx;
		background-color: #F3F5F9;
		text-align: center;
		line-height: 70upx;
		margin-top: 20upx;
	}
	.num-item  {
		// height: 80upx;
		// width: 100%;
		// text-align: center;
		// line-height: 80upx;
		color: #FFFFFF;
	}
	.sc-cate-qu-item{
		width: 40%;
		float: left;
		text-align: center;
		margin-left: 5%;
		height: 70upx;
		border-radius: 50upx;
		background-color: #F3F5F9;
		text-align: center;
		line-height: 70upx;
		margin-top: 25upx;
	}
	.sc-cate-select{
		border:1upx solid #00B7FD;
		background-color: #EBF9FF;
		color:#00B7FD;
	}
	.sc-btn-list{
		width: 100%;
		line-height: 100upx;
		height: 100upx;
		z-index: 9;
		background-color: #FFFFFF;
		position: fixed;
		bottom:30upx;
	}
	.sc-btn-list .sc-btn-item{
		width: 40%;
		margin-left: 5%;
		height: 80upx;
		border-radius: 20upx;
		line-height: 80upx;
		text-align: center;
		color: #FFFFFF;
		float: left;
		font-size: 32upx;
	
	}
	.sc-btn-list .btn-lx{
			background-color: #00B7FD;
	}
	.sc-btn-list .btn-ks{
			background-color: #FF9C0F;
			}
	
	
</style>
