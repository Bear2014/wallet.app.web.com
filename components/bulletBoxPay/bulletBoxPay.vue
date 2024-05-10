<template>
	<transition name="move">
		<view class="bullet" >
			<view class="bullet_box">
				<view class="bullet_box_img">
					<image src="@/static/icons/bg_bindPay.png" mode=""></image>
				</view>
				<view class="bullet_box_title">
					<text>绑定收款方式</text>
				</view>
				<view class="bullet_box_text">
					<text>请先进行收款方式绑定</text>
				</view>
				<view class="bullet_box_but" @click="goAuId">
					<text>立即绑定</text>
				</view>
			</view>
			<view class="bullet_close" @tap="closePage">
				<image src="@/static/icons/icon_close.png" mode=""></image>
			</view>
		</view>
	</transition>
</template>

<script>
	export default {
		name:"bulletBoxPay",
		data() {
			return {
			};
		},
		methods: {
			// 去实名认证
			goAuId() {
				// 关闭了选择层
				this.$emit('closePopuPay', "false")
				uni.navigateTo({
					url: '/pages/indexPage/addpay/addpay',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			closePage() {
				// 关闭了选择层
				this.$emit('closePopuPay', "false")
			}
		}
	}
</script>

<style lang="scss">
	// 离开的过程
	.move-leave-active {
		opacity: 0;
		transform: scale(1.5) !important;
		transition: all 0.5s;
	}
	.bullet {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .3);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.bullet_box {
			width: 425rpx;
			height: 495rpx;
			border-radius: 25rpx;
			background-color: #fff;
			overflow: hidden;
			.bullet_box_img {
				width: 100%;
				height: 220rpx;
				background: linear-gradient(#161616, #262626);
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				image {
					width: 285rpx;
					height: 215rpx;
				}
			}
			.bullet_box_title {
				text-align: center;
				line-height: 1;
				margin-top: 30rpx;
				font-size: 24rpx;
				font-weight: 600;
				color: #001eca;
			}
			.bullet_box_text {
				text-align: center;
				line-height: 1;
				margin-top: 15rpx;
				font-size: 18rpx;
				color: #001eca;
			}
			.bullet_box_but {
				width: 285rpx;
				height: 70rpx;
				border-radius: 35rpx;
				background-color: #001eca;
				margin: 45rpx auto 0 auto;
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				line-height: 70rpx;
				font-weight: 600;
			}
		}
		.bullet_close {
			width: 80rpx;
			height: 80rpx;
			margin-top: 75rpx;
			background-color: #fff;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>