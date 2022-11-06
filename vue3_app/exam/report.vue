<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar  title="练习报告"></u-navbar>
		<view class="report-item u-m-t-20">
			<view class="report-item-title label-title">
				<image class="images" src="@/static/images/lei1.png" mode="widthFix"></image>
				<label class="forn700 u-font-36">练习类型</label>
			</view>
			<view class="item-value u-m-l-80">
				{{ksType==1?'章节练习题':"模拟考试"}}
			</view>
		</view>
		<view class="report-item">
			<view class="report-item-title label-title">
				<image class="images" src="@/static/images/lei2.png" mode="widthFix"></image>
				<label class="forn700 u-font-36">交卷时间</label>
			</view>
			<view class="item-value u-m-l-80">
				{{getKsData()}}
			</view>
		</view>
		<view class="report-df-content" v-if="ksType==2">
			<view class="">
				<view class="df-value-item forn700">{{reportApiData.max_exam_fraction?reportApiData.max_exam_fraction:0}}</view>
				<view class="df-title-item">试卷最高分</view>
			</view>
			<view class="">
				<view class="df-value-item forn700">{{(reportApiData.pj_value?reportApiData.pj_value:0).toFixed(2)}}</view>
				<view class="df-title-item">全站平均得分</view>
			</view>
			<view class="">
				<view class="df-value-item forn700">{{(reportApiData.exceed*100?reportApiData.exceed*100:0).toFixed(2)}}%</view>
				<view class="df-title-item">已击败考生</view>
			</view>
			<view class="">
				<view class="df-value-item">{{reportApiData.is_pass==1?'通过':'未通过'}}</view>
				<view class="df-title-item">是否及格</view>
			</view>
		</view>
		<view class="report-ks-count" v-if="ksType==2">
			<view class="report-ks-sum">
				<view class="count-sum-contnet">
					<view class="ks-count-item-a">{{reportApiData.exam_fraction||0}}</view>
					<view class="ks-count-item-b">共{{reportApiData.practiceCount}}题</view>
				</view>
			</view>
			<view class="report-ks-sum">
				<view class="count-sum-contnet">
					<view class="ks-count-item-a">{{reportApiData.difficulty||0}}</view>
					<view class="ks-count-item-b">难度</view>
				</view>
			</view>
		</view>
		<view class="report-df" v-if="ksType==2">得分</view>
		<view class="report-title u-p-l-30 u-font-40" style="font-weight: 700;" v-if="ksType==2">
			试卷得分分布图
		</view>
		<view class="report-title u-p-l-30 charts-box" v-if="ksType==2">
			<qiun-data-charts
				:opts="{legend:{show:false}}"
				type="area" :chartData="localdata" />
		</view>
		<view class="report-title u-p-l-30">
			考试情况
		</view>
		<view class="u-m-b-24" >
			<label class="u-m-l-15 u-p-l-20">共{{reportData.count}}道题</label>
			<label class="u-m-l-15">答对{{this.getOkCount()}}道题</label>
			<label class="u-m-l-15">答错{{this.getErrorCount()}}道题</label>
			<label class="u-m-l-15">未答{{this.getNoOk()}}道题</label>
		</view>
		<view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.dxCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">单选题</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.dxCount}}道,答对{{reportData.dxCounta}}道,正确率{{this.getzql(1)}}%</label>
				</view>
			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.duoxuanCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">多选题</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.duoxuanCount}}道,答对{{reportData.duoxuanCounta}}道,正确率{{this.getzql(2)}}%</label>
				</view>

			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.wdCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">问答题</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.wdCount}}道,答对{{reportData.wdCounta}}道,正确率{{this.getzql(3)}}%</label></view>

			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.pdCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">判断题</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.pdCount}}道,答对{{reportData.pdCounta}}道,正确率{{this.getzql(6)}}%</label></view>

			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.bdxCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">不定项</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.bdxCount}}道,答对{{reportData.bdxCounta}}道,正确率{{this.getzql(4)}}%</label></view>

			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.tkCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">填空题</label>
				</view>
				<view class="u-c-i-t-sum">
					<label>共{{reportData.tkCount}}道,答对{{reportData.tkCounta}}道,正确率{{this.getzql(5)}}%</label></view>

			</view>
			<view class="u-m-l-item u-m-l-30" v-if="reportData.wdCount>0">
				<view class="u-c-i-t">
					<view class="v-c-item">
						<u-icon name="checkmark" size="25" color="#FFFFFF"></u-icon>
					</view>
					<label class="v-c-title">问答题</label>
				</view>
				<view class="u-c-i-t-sum"><label>共{{reportData.wdCount}}道</label></view>

			</view>

		</view>
		<view class="report-title u-p-l-30">
			答题卡
		</view>
		<view class="listes">
			<view class="dtk-item" @click="dtkGoJx(index+1)" v-for="(item,index) in kslist" :key="index">
				{{index+1}}
			</view>
		</view>
		<view class="sc-btn-list">
			<view class="btn-list-item-a">

				<view class="btn-item-title" @click="goJs(1)">全部解析</view>
			</view>
			<view class="btn-list-item-b">
				<view class="btn-item-title-b" @click="goJs(2)">错题解析</view>
			</view>
		</view>
	<u-modal v-model="ispayment"  :show-cancel-button="true" content="需要开通会员"
		@confirm="submitispayment" @cancel="ispayment=false"></u-modal>
	</view>
</template>

<script>
	import {getReport} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				kslist: [],
				ksType: '',
				reportApiData: {},
				reportData: {},
				examId: '',
				localdataMax: 100,
				localdata: {},
				ispayment:false,
				examLogId:"",
				showAfterPages:false
			}
		},
		onLoad(option) {
			debugger
			console.log(option)
			this.ksType = option.ksType;
			this.examId = option.examId;
			this.userId = option.userId;
			this.examLogId = option.examLogId;
			let reportData = uni.getStorageSync("repData");
			let kslist = uni.getStorageSync("kslist");
			this.reportData = reportData;
			this.kslist = kslist;
			if (this.ksType == 2) {
				this.getReport()
			}else{
				this.showAfterPages=true
			}
		},
		methods: {
			getReport() {
				let user = uni.getStorageSync("user");
				var param = {
					memberId: user.userId,
					userId: user.userId,
					examLogId: this.examLogId,
					examId: this.examId, //'1423677479561654273'
				}
				getReport(param).then(ret => {
					if (ret.result != null) {
						this.reportApiData = ret.result;
						var categories=[]
						var datas=[]
						this.localdataMax = this.reportApiData.fraction_count || 100;
						for (let i = 0; i < this.reportApiData.reportList.length; i++) {
							categories.push(i)
							datas.push(this.reportApiData.reportList[i].exam_fraction || 0)
						}
							
						this.localdata={
							categories:categories,
							series:[{
								name:"",
								data:datas,
							}]
						}
						this.showAfterPages=true
					}
				})
			},
			returnPage() {
				if (this.ksType == 1) {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			},
			showReport() {

			},
			goJs(jxType) {
				if(this.$appUtils.ispay()){
					this.ispayment=true
					return
				}else{
					this.ispayment=false
				}
				uni.navigateTo({
					url: '/exam/report-exam?jxType=' + jxType + "&ksType=" + this.ksType
				})
			},
			submitispayment(){
				this.ispayment=false
				uni.navigateTo({
					url:"/exam/center/open-vip"
				})
			},
			dtkGoJx(index) {
				if(this.$appUtils.ispay()){
					this.ispayment=true
					return
				}else{
					this.ispayment=false
				}
				uni.navigateTo({
					url: '/exam/report-exam?jxType=1&ksType=' + this.ksType + "&dtk=" + index
				})
			},
			getzql(type) {
				if (type == 1) {

					return parseFloat((this.reportData.dxCounta / this.reportData.dxCount) * 100).toFixed();
				}
				if (type == 2) {

					return parseFloat((this.reportData.duoxuanCounta / this.reportData.duoxuanCount) * 100).toFixed();
				}
				if (type == 3) {

					return parseFloat((this.reportData.wdCounta / this.reportData.wdCount) * 100).toFixed();
				}
				if (type == 4) {

					return parseFloat((this.reportData.bdxCounta / this.reportData.bdxCount) * 100).toFixed();
				}
				if (type == 5) {

					return parseFloat((this.reportData.tkCounta / this.reportData.tkCount) * 100).toFixed();
				}
				if (type == 6) {
					if (this.reportData.pdCountc == 0) {
						return 0
					} else {
						return parseFloat((this.reportData.pdCounta / this.reportData.pdCountc) * 100).toFixed();
					}
				}
			},
			getKsData() {
				let xs = this.reportData.xs;
				let fz = this.reportData.fz;
				let ms = this.reportData.ms;
				let fzStr = "";
				let msStr = "";
				if (fz <= 9) {
					fzStr = "0" + fz;
				} else {
					fzStr = fz;
				}

				if (ms <= 9) {
					msStr = "0" + ms;
				} else {
					msStr = ms;
				}
				return xs + "小时" + fzStr + "分钟" + msStr + "秒";
			},
			getOkCount() {
				let reportData = this.reportData;
				return reportData.dxCounta +
					reportData.duoxuanCounta +
					reportData.wdCounta +
					reportData.pdCounta +
					reportData.tkCounta +
					reportData.bdxCounta;

			},
			getErrorCount() {
				let rd = this.reportData;
				return rd.dxCountb +
					rd.duoxuanCountb +
					rd.wdCountb +
					rd.pdCountb +
					rd.tkCountb +
					rd.bdxCountb;

			},
			getNoOk() {
				let reportData = this.reportData;
				return reportData.dxCountc +
					reportData.duoxuanCountc +
					reportData.wdCountc +
					reportData.pdCountc +
					reportData.tkCountc +
					reportData.bdxCountc;
			}
		}
	}
</script>

<style lang="scss">
	.images{
		width: 35upx;margin-right: 10upx;
	}
	.report-item {
		margin-bottom: 30upx;
	}

	.label-title {
		
		margin-left: 30upx;
		display: flex;
	}

	.item-value {
		margin-top: 10upx;
		color: #9C9C9E;
	}

	.report-df-content {
		height: 200upx;
		width: 90%;
		margin: 0 auto 30upx;
		border-radius: 10upx;
		box-shadow: 0upx 0upx 10upx 5upx #F3F5F9;
		display: flex;
		align-items: center;
		justify-content: space-around;
		text-align: center;
	}
	.forn700{
		font-weight: 700;
	}
	.df-value-item {
		font-size: 40upx;
	}

	.df-title-item {
		opacity: 0.5;
	}

	.report-ks-count {
		display: flex;
		align-items: center;
		padding-top: 30upx;
		margin: 0 auto 30upx;
	}

	.report-ks-sum {
		width: 50%;
	}

	.count-sum-contnet {
		width: 200upx;
		height: 200upx;
		border-radius: 50%;
		border: 4upx solid #F3F5F9;
		margin: 0 auto;
		text-align: center;
	}

	.ks-count-item-a {
		height: 100upx;
		line-height: 130upx;
		font-size: 40upx;
		font-weight: 600;
	}

	.ks-count-item-b {
		line-height: 60upx;
		color: #9C9C9E;
	}

	.report-df {
		width: 40%;
		height: 80upx;
		line-height: 80upx;
		color: #FFFFFF;
		background-color: #00B7FD;
		border-radius: 100upx;
		text-align: center;
		font-size: 28upx;
		margin: 0 auto 30upx;
	}

	.report-title {
		height: 80upx;
		width: 100%;
		line-height: 80upx;
		font-size: 32upx;
		font-weight: 600;
	}

	.charts-box {
		margin: 0 auto;
		width: 90%;
		height: 350upx;
	}

	.v-c-item {
		width: 30upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 100upx;
		text-align: center;
		background-color: #00B7FD;
		margin-right: 15upx;
	}

	.v-c-title {
		font-size: 32upx;
		font-weight: 600;
	}

	.u-m-l-item {
		margin-bottom: 25upx;
	}

	.u-c-i-t {
		display: flex;
		align-items: center;
		margin-bottom: 10upx;
	}

	.listes {
		padding-bottom: 120upx;
		display: flex;
		flex-wrap: wrap;
	}

	.dtk-item {
		width: 60upx;
		height: 60upx;
		text-align: center;
		margin-left: 10%;
		border-radius: 15upx;
		text-align: center;
		line-height: 60upx;
		background-color: #EEF1F5;
		color: #232529;
		margin-bottom: 20upx;

	}

	.dtk-select {
		background-color: #00B7FD;
		color: #FFFFFF;
	}

	.sc-btn-list {
		width: 100%;
		line-height: 100upx;
		height: 100upx;
		z-index: 10;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		border-top: 1upx solid #E3E5E9;
	}

	.btn-list-item {
		width: 50%;
		height: 100%;
		text-align: center;
		float: left;
		color: #898F9D;

	}

	.btn-list-item-a {
		width: 50%;
		height: 100%;
		text-align: center;
		float: left;
		color: #FFFFFF;
		background-color: #00B7FD;

	}

	.btn-list-item-b {
		width: 50%;
		height: 100%;
		text-align: center;
		float: left;
		color: #FFFFFF;
		background-color: #FF9C37;

	}

	.da-ts {
		color: #898F9D;
	}

	.btn-item-img {
		width: 100%;
		height: 30%;
		float: left;

		.item-image-a {
			width: 50upx;
			height: 50upx;
		}

		.item-image-b {
			width: 45upx;
			height: 45upx;
		}

		.item-image-c {
			width: 45upx;
			height: 45upx;
		}


	}
</style>
