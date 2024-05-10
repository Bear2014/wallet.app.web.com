<template>
	<view class="bom-pos">
	<!-- <view class="text">
		
	</view> -->
	<view class="bom-outside">
		<view class="bom-list">
			<view @tap='toHome' class="icon-bom">
				<image v-if="isColor=='home'" src='@/static/icons/icon_homepage_bottom_right.png' class="iconfont"></image>
				<image v-else src='@/static/icons/icon_homepage_bottom.png' class="iconfont"></image>
			</view>
			<view :style="{color:isColor=='home'?'#001eca':''}" class="text-bom">
				首页
			</view>
		</view>
		<view @tap='toOrder' class="bom-list">
			<view class="icon-bom">
				<image v-if="isColor=='order'" src='@/static/icons/icon_dingdan_right.png' class="iconfont"></image>
				<image v-else src='@/static/icons/icon_dingdan.png' class="iconfont"></image>
			</view>
			<view :style="{color:isColor=='order'?'#001eca':''}" class="text-bom">
				订单
			</view>
		</view>
		<view @tap='toMe' class="bom-list">
			<view  class="icon-bom">
				<image v-if="isColor=='me'" src='@/static/icons/icon_my_bottom_right.png' class="iconfont"></image>
				<image v-else src='@/static/icons/icon_my_bottom.png' class="iconfont"></image>
			</view>
			<view :style="{color:isColor=='me'?'#001eca':''}" class="text-bom">
				我的
			</view>
		</view>
	</view>
	
	</view>
</template>

<script>
	export default {
		name:"web-bom",
		props: {
		              isColor: String
		         },
		data() {
			return {
				
			};
		},
		methods:{
			toHome() {
				uni.navigateTo({
					url: '/pages/index/index',
					// animationType: 'pop-in',
					// animationDuration: 300
				})
			},
			toOrder() {
				uni.navigateTo({
					url: '/pages/order/order',
					// animationType: 'pop-in',
					// animationDuration: 300
				})
			},
			toMe() {
				
				uni.navigateTo({
					url: '/pages/my/my',
					// animationType: 'pop-in',
					// animationDuration: 300
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.text{
		height: 100rpx;
		width: 500rpx;
		background-color: greenyellow;
	}
	.bom-pos{
		// display: flex;
		//     flex-direction: column;
		//     align-items: center;
			// width: 93%;
		position: absolute;
		top: 80%;
		z-index: 10000;
		// width: 24%;
	}
.bom-outside{
	display: flex;
	justify-content: space-around;
	margin:0 auto;
	padding: 10rpx 0;
	// width: 93%;
	width: 772rpx;
	border-radius: 100rpx;
	bottom: calc(env(safe-area-inset-bottom) / 2);
	z-index: 999;
	// background-color: hsla(0, 0%, 100%, .5);
	background-color: red;
	box-shadow: 0px 0px 30rpx 0px rgba(0, 0, 0, .07);
	
	.bom-list{
		display: flex;
		flex-direction: column;
		align-items: center;
		.text-bom{
			font-size: 22rpx;
			line-height: 34rpx;
			
		}
		.icon-bom{
			    width: 48rpx;
			    height: 48rpx;
				image{
					width: 100%;
					height: 100%;
				}
		}
		
	}
	
}


</style>