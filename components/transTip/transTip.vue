<template>
	<transition name="move">
		<view class="bullet" >
			<view class="bullet_box">
				<view class="bullet_box_text">
					{{popuTip}}
				</view>
				<view class="bullet_box_but" @tap="closePage">
					确认
				</view>
			</view>
		</view>
	</transition>
</template>

<script>
	export default {
		name:"transTip",
		props: ['popuTip'],
		data() {
			return {
			};
		},
		methods: {

			closePage() {
				// 关闭了选择层
				this.$emit('closePopu', "false")
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
			height: 320rpx;
			border-radius: 25rpx;
			background-color: #fff;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			.bullet_box_text {
				font-size: 30rpx;
				color: #001eca;
				display: flex;
				justify-content: center;
				margin-top: 100rpx;
			}
			.bullet_box_but {
				width: 300rpx;
				height: 60rpx;
				background-color: #001eca;
				border-radius: 30rpx;
				color: #fff;
				text-align: center;
				line-height: 60rpx;
				font-size: 30rpx;
				margin-top: 50rpx;
			}
		}

	}
</style>