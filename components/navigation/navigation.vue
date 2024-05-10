<template>
	<view class="navigation_bg">
		<view  :style="{'background': navigationText === '帮助中心' ? '#fff' : '#001eca'}" class="navigation">
			<view :style="{'border': navigationText === '帮助中心' ? 'solid #001eca' : 'solid #fff', 'border-width': '2rpx 0px 0px 2rpx'}" class="navigation_arrow" @tap="returnPage">
				
			</view>
			<text>{{navigationText}}</text>
			<!-- <view v-if="navigationText === '转账'"  class="navigation_right" @tap="saoMa">
				<image src="../../static/icons/icon_saoma1.png" />
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		name:"navigation",
		props: ['navigationText', 'to'],
		data() {
			return {
			};
		},
		methods: {
			returnPage() {
				this.back()
			},
			back() {
				if (this.to && this.navigationText === '订单信息') {
					uni.reLaunch({
						url: `/pages/indexPage/tradingfloor/tradingfloor`,
						animationType: 'pop-in',
						animationDuration: 300
					})
					return
				}
				if (this.navigationText === '交易大厅') {
					uni.reLaunch({
						url: "/pages/index/index"
					})
					return
				}
				const pages = getCurrentPages()
				// 有可返回的页面则直接返回，uni.navigateBack  默认返回失败之后会自动刷新页面 ，无法继续返回
				if (pages.length >= 1) {
					uni.navigateBack(1)
				return;
				} else {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}
				// // vue router 可以返回uni.navigateBack失败的页面 但是会重新加载 
				// let a = this.$router.go(-1)
				// // router.go失败之后则重定向到首页 
				// if (a == undefined) {
				//  uni.reLaunch({
				//   url: "/pages/index/index"
				//  })
				// }
				// return;
			},
			saoMa() {
				
				let self = this
					uni.scanCode({
						success: function (res) {
							
							self.$emit("returnDate",res.result)
						}
					});
			}

		}
	}
</script>

<style lang="scss">
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
				top: 40rpx;
				left: 50rpx;
				border: solid #fff;
				border-width: 2rpx 0px 0px 2rpx;
				display: inline-block;
				padding: 12rpx;
				transform: rotate(-45deg) ;
				-webkit-transform: rotate(-45deg);
			}
			.navigation_right {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				width: 60rpx;
				height: 60rpx;

				image{
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
	
</style>