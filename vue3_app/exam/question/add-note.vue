<template>
	<view class="container">
		<u-navbar  title="笔记"></u-navbar>
		<view>
			<u-form class="u-m-l-30" :model="form" ref="uForm">
				<u-form-item >
					<u-input placeholder="请输入笔记" type="textarea" :auto-height="true" v-model="noteContent" />
				</u-form-item>
				<u-form-item>
					<u-upload max-count="3" ref="uUpload" :action="uploadUrl" :file-list="fileList"></u-upload>
					
				</u-form-item>
			</u-form>
		</view>
		<view @click="addNote()" class="btn-quren">确定</view>
	</view>
</template>

<script>
	import {addNote} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				userId:"",
				cateId:"",
				chapterId:"",
				sectionId:"",
				questionsId:"",
				noteContent: '',
				form:{},
				uploadUrl: getApp().globalData.baseUrl + '/api/common/upload',
				fileList: [

				]

			}
		},
		onLoad(option) {
			this.userId = option.userId;
			this.cateId = option.cateId;
			this.chapterId = option.chapterId;
			this.sectionId = option.sectionId;
			this.questionsId = option.questionsId;
		},
		methods: {
			addNote(){
				let files =this.$refs.uUpload.lists;
				console.log(files);
				let param = {
					cateId: this.cateId,
					chapterId: this.chapterId,
					sectionId: this.sectionId,
					userId: this.userId,
					questionsId: this.questionsId,
					noteContent:this.noteContent,
					imgUrls:''
				};
				
				if(this.noteContent==null||this.noteContent==""){
					uni.showToast({
						title: '请输入笔记',
						duration: 2000,
						icon: "none"
					});
					return;
				}
				if(files!=null&&files.length>0){
					let fileUrls='';
						files.forEach(item => {
							fileUrls=fileUrls+item.response.message+",";
						});
						param.imgUrls= fileUrls;
				}
				addNote(param).then(ret => {
					console.log(ret);
					if (ret.result == true) {
						uni.showToast({
							title: '添加成功',
							duration: 2000,
							icon: "none"
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},500)		
					}
				
				});
				
				
			}

		}
	}
</script>

<style lang="scss">
	.btn-quren {
		width: 90%;
		height: 80upx;
		left: 5%;
		position: absolute;
		bottom: 10%;
		line-height: 80upx;
		text-align: center;
		font-size: 28upx;
		border-radius: 50upx;
		color: #FFFFFF;
		background-color: #00B7FD;
	}
</style>
