<template>
	<transition name="move">
		<view class="bullet" >
			<view class="bullet_box">
				<view class="bullet_box_text">
					<text>{{ versionText }}</text>
				</view>
				<view class="bullet_box_but" @click="goAuId">
					<text>立即更新</text>
				</view>
			</view>
		</view>
	</transition>
</template>

<script>
	export default {
		name:"bulletBoxPay",
        props: ['versionText'],
		data() {
			return {
			};
		},
		methods: {
			goAuId() {
				this.$emit('closePopuPay', "false")
			},
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
        z-index: 111111111;
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
            position: relative;
			width: 600rpx;
			height: 848rpx;
			border-radius: 25rpx;
            background-image: url(../../static/version.png);
            background-size: 100% 100%;
			.bullet_box_text {
                position: absolute;
				text-overflow: ellipsis;
    			word-wrap: break-word;
				width: 500rpx;
                bottom: 260rpx;
                left: 80rpx;
				line-height: 1.5;
				margin-top: 15rpx;
				font-size: 30rpx;
				color: #001eca;
			}
			.bullet_box_but {
                position: absolute;
                bottom: 80rpx;
                left: 50%;
                transform: translateX(-50%);
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