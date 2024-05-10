<template>
	<view class="index_page">
		<view class="customer_top_state"></view>
		<view class="navigation_bg">
			<view style="background: #001eca" class="navigation">
				<view style="background: #001eca" class="navigation_arrow" @click="returnPage">

				</view>
				<text>iPay客服</text>
				<!-- <view v-if="navigationText === '转账'"  class="navigation_right" @tap="saoMa">
					<image src="../../static/icons/icon_saoma1.png" />
				</view> -->
			</view>
		</view>
		<web-view src="https://lwesoes.g8tf5zdthj.com/2a13ad1f7d06a06c5jkfle-kelia9127106a8665a19c620e14644add47988ebd0cfa6988c81327500c2b56973f5"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				myid: '',
				myname: '',
				youkefuid: '',
				youkefuname: '',
				barHeight: 0
			};
		},
		onLoad(options) {
			uni.showLoading({
				title: '正在连接客服'
			});
			setTimeout(() => {
				uni.hideLoading()
			}, 1000)
		},
		methods: {
			returnPage() {
				uni.navigateBack()
			}
		},
		onReady() {
			var height = 0;
			var statusbar = 0
			uni.getSystemInfo({
				success: (sysinfo) => {
					height = sysinfo.windowHeight;
					statusbar = sysinfo.statusBarHeight
				},
				complete: () => {}
			});
			var currentWebview = this.$scope.$getAppWebview();
			setTimeout(() => {
				this.barHeight = plus.navigator.getStatusbarHeight();
				var wv = currentWebview.children()[0];
				wv.setStyle({
					top: statusbar + uni.upx2px(100),
					height: height - statusbar - uni.upx2px(100),
					scalable: true,
				})
				uni.hideLoading()
			}, 500);
		}
	}
</script>

<style lang="scss">
	.index_page {
		height: 100%;

		.customer_top_state {
			margin-top: var(--status-bar-height);
			background: #001eca;
		}

		.navigation_bg {
			height: 100rpx;

			.navigation {
				position: relative;
				height: 100rpx;
				background-color: #001eca;
				text-align: center;
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 105rpx;

				.navigation_arrow {
					position: absolute;
					z-index: 99999;
					top: 40rpx;
					left: 50rpx;
					border: solid #fff;
					border-width: 2rpx 0px 0px 2rpx;
					display: inline-block;
					padding: 12rpx;
					transform: rotate(-45deg);
					-webkit-transform: rotate(-45deg);
				}

				.navigation_right {
					position: absolute;
					top: 20rpx;
					right: 20rpx;
					width: 60rpx;
					height: 60rpx;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}
			}
		}
	}
</style>