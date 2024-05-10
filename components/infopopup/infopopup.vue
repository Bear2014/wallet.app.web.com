<template>
	 <transition name="move">
	      
	<view class="infopopup_bg"  >
		<view :class="['popup_mask']" @tap="clickMask"></view>
		<view class="infopopup_show" >
			<view class="infopopup_show_title">
				<view class="infopopup_show_title_re">
					<text @tap="returnPage">取消</text>
				</view>
				<text>选择银行</text>
			</view>
			<slot name="query"></slot>
			<scroll-view class="infopopup_content" scroll-y="true">
				<slot name="content"></slot>
			</scroll-view>
		</view>
	</view>
	</transition>
</template>

<script>
	export default {
		name:"infopopup",
		data() {
			return {
			};
		},
		methods: {
			// 点击了取消键，关闭选择层
			returnPage() {
				// 关闭了选择层
				this.$emit('closePopu', "false")
			},
			// 点击了Mask 遮罩层， 关闭弹出层
			clickMask() {
				this.$emit('closePopu', "false")
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		overflow: hidden;
	}
	// 离开的过程
	.move-leave-active {
		.popup_mask {
			background-color: transparent !important;
		}
		transform: translateY(100%) !important;
		transition: all 0.5s;
	}
	// .moveshow-leave-
	.infopopup_bg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		.popup_mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 3;
			background-color: rgba(0, 0, 0, .5);
		}
		.popup_mask_2 {
			background-color: transparent !important; 
		}
		.infopopup_show {
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 4;
			width: 750rpx;
			height: 850rpx;
			border-radius: 20rpx 20rpx 0 0 ;
			background: #001eca;
			animation: open 0.5s ease  forwards;
			.infopopup_show_title {
				position: relative;
				width: 750rpx;
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-size: 25rpx;
				.infopopup_show_title_re {
					position: absolute;
					top: 0;
					left: 0;
					width: 120rpx;
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 25rpx;
				}
			}
			.infopopup_content {
				width: 720rpx;
				height: 715rpx;
				margin: 0 auto;
				background-color: #FFFFFF;
				border-radius: 20rpx 20rpx 0 0;
				overflow: hidden;
				.box {
					width: 730rpx;
					height: 100rpx;
					background-color: gainsboro;
					margin-top: 10rpx;
				}
			}
		}
	}
	@keyframes open {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>