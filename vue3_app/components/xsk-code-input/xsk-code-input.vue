<template>
	<view>
		<view class="xskcodeinput">
			<view class="box" :style="{'width':width+'rpx','height':height+'rpx',backgroundColor:backgroundColor}" @click="focus=true" v-for="(item,index) in length" :key="index">
				<text v-if="password.length>index" :style="{'bold':bold?'bold':'normal'}">{{showVal?password[index]:'*'}}</text>
				<text class="line" v-if="password.length==index&&focus" style="font-weight: normal;">|</text>
			</view>
			
			<input class="input" type="number" :focus="focus" v-model="password" maxlength="6" @focus="focus=true" @blur="focus=false" @input="userinput"/>
		</view>
	</view>
</template>

<script>
	/**
	 * 自定义输入框
	 * @description 主要用于输入密码或输入验证码
	 * @property {Number} width 输入块宽度
	 * @property {Number} height 输入块高度
	 * @property {String} backgroundColor 输入框块背景色
	 * @property {Boolean} bold 输入是加粗
	 * @property {Boolean} showVal 是否显示输入内容
	 * @property {Nmuber} length 输入框长度
	 * @event {Function} confirm 输入内容达到最大长度时触发此事件
	 */
	
	export default {
		name:"xskCodeInput",
		data() {
			return {
				focus:false,
				password:''
			};
		},
		props:{
			width:{
				type:[Number, String],
				default:84,
			},
			height:{
				type:[Number, String],
				default:84,
			},
			backgroundColor: {
				type: String,
				default: "#EDEDED"
			},
			bold:{
				type:Boolean,
				default:true
			},
			showVal:{
				type:Boolean,
				default:false
			},
			length:{
				type:Number,
				default:6
			},
		},
		methods: {
			userinput(e){
				this.$emit('update:value',this.password);
				if(e.detail.value.length==this.length){
					this.focus = false
					this.$emit('confirm')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.xskcodeinput{
		display: flex;
		position: relative;
		align-items: center;
		justify-content: center;
		margin-top: 160rpx;
		.box{
			border-radius: 8rpx;
			margin-right: 12rpx;
			text-align: center;
			line-height: 84rpx;
			font-size: 38rpx;
			&:last-child{
				margin-right: 0;
			}
			.line{
				opacity: 0;
				animation-name: donghua;
				animation-timing-function: linear;
				animation-iteration-count: infinite;
				animation-duration: .5s;
				animation-direction: alternate;
			}
			@keyframes donghua{
				0%{
					opacity: 1;
				}
				100%{
					opacity: 0;
				}
			}
		}
		
		.input{
			position: absolute;
			top: 0;
			left: -1000%;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
</style>
