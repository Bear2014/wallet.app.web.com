<template>
	<view class="tradingbuy">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'购买'"></navigation>
		<view style="width: 100%;height: 120rpx; background: #001eca; border-radius: 0 0 10rpx 10rpx;"></view>
		<view class="tradingbuy_head">
			<view class="tradingbuy_head_icon">
<!-- 				<view class="tradingbuy_head_img">
					<image src="../../../static/logo.png" mode=""></image>
				</view> -->
				<text>{{userInfo.order_no}}</text>
			</view>
			<view class="tradingbuy_way">
				<text>收款方式</text>
				<image v-if="userInfo.pay_type.indexOf('1') !== -1" src="@/static/icon_Alipay.png" mode="heightFix"></image>
				<image v-if="userInfo.pay_type.indexOf('2') !== -1" src="@/static/icon_WeChat.png" mode="heightFix"></image>
				<image v-if="userInfo.pay_type.indexOf('3') !== -1" src="@/static/icon_UnionPay.png" mode="heightFix"></image>
			</view>
		</view>
		<view class="tradingbuy_number">
			<text class="tradingbuy_number_title">购买的数量:</text>
			<text class="tradingbuy_number_text">{{userInfo.amount}}</text>

		</view>
		<!-- 滑动模块 -->
<!-- 		<view class="tradingbuy_total">
			<text class="tradingbuy_total_title">购买数量</text>
			<view class="tradingbuy_total_sild">
				<text>{{org}}</text>
				<slider :value="mid" @changing="slidering" @change="sliderChange" :min="min" :max="max" activeColor="#e8a53c" backgroundColor="#282929" block-color="#e8a53c" block-size="15" />
			</view>
			<view class="tradingbuy_text">
				<text>{{ org + '/' + max}}</text>
			</view>
		</view> -->
		<view class="tradingbuy_pay">
			<text>支付方式</text>
			<view class="tradingbuy_pay_way">
				<view v-if="userInfo.pay_type.indexOf('1') !== -1" :class="['tradingbuy_pay_way_select', select.payWay == 1 ? 'tradingbuy_pay_way_select2' : '']" @tap="selectPayWay(1)">
					<image src="@/static/icons/icon_Alipay_order.png" mode="widthFix"></image>
					<text>支付宝</text>
				</view>
				<view v-if="userInfo.pay_type.indexOf('2') !== -1" :class="['tradingbuy_pay_way_select', select.payWay == 2 ? 'tradingbuy_pay_way_select2' : '']" @tap="selectPayWay(2)">
					<image src="@/static/icons/icon_WeChat_order.png" mode="widthFix"></image>
					<text>微信</text>
				</view>
				<view v-if="userInfo.pay_type.indexOf('3') !== -1" :class="['tradingbuy_pay_way_select', select.payWay == 3 ? 'tradingbuy_pay_way_select2' : '']" @tap="selectPayWay(3)">
					<image src="@/static/icons/icon_UnionPay.png" mode="widthFix"></image>
					<text>银行卡</text>
				</view>
			</view>
		</view>
		<view :class="['tradingbuy_but', select.payWay != 0 ? 'tradingbuy_but_2' : '']" @tap="goBuy">
			<text>购买</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				select: {
					total: 0, // 总数
					buyNumber: 0, // 购买数量
					payWay: 0, // 等待用户选择支付方式
				},
				userInfo: {} // 用户信息
				// mid: 30, //、居中值
				// min: 0,	// 设置最小值
				// max: 110,	// 设置最大值
				// org: 30, // 目前的值
			}
		},
		onLoad(option) {
			const item = JSON.parse(decodeURIComponent(option.item));
			// 获取到页面传输过来的数据
			this.userInfo = item
			
		},
		methods: {
			// 去购买1
			goBuy() {
				if (this.select.payWay == 0) {
					uni.showToast({
						title: '请选择支付方式！',
						icon: "none",
						duration: 1000
					});
					return
				}
				let that = this;
				let params = {
					order_no: this.userInfo.order_no, // 订单号
					// pay_type: this.select.payWay	// 用户选择的支付方式
				}; //参数
				that.$api.tokenTimeOut("/trade/v2/hellBuy", "POST", params).then(res => {
					if (res.code == 0) {
						
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1000
						});
						setTimeout(() => {
							uni.redirectTo({
								 url: `/pages/orderPage/orderinfo/orderinfo?to=1&order_no=${res.data.order.order_no}&order_no_sale=${res.data.order.order_no_sale}&type=${res.data.order.type}`,
							});
						}, 1000)
						
					}else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1000
						});
					}
					
				})
			},
			// 选择支付方式
			selectPayWay(index) {
				this.select.payWay = index
			}
			// 滑动按钮
			// sliderChange(e) {
			//     
			// },
			// slidering(e) {
			// 	this.org = e.detail.value
			// 	
			// }
		},
	}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	
	.tradingbuy {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.tradingbuy_head {
			margin: 40rpx 30rpx 0 30rpx;
			height: 175rpx;
			background: #D3DFFF;
			border-radius: 15rpx;
			margin-top: -100rpx;
			box-shadow: 0px 2px 5px 0px #00000040;
			.tradingbuy_head_icon {
				height: 115rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				color: #636363;
				.tradingbuy_head_img {
					width: 75rpx;
					height: 75rpx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 15rpx;
					>image {
						width: 75rpx;
						height: 75rpx;
					}
				}
			}
			.tradingbuy_way {
				height: 60rpx;
				font-size: 24rpx;
				color: #636363;
				line-height: 35rpx;
				display: flex;
				justify-content: center;
				>text {
					margin-right: 15rpx;
				}
				>image {
					height: 35rpx;
					margin-right: 10rpx;
				}
			}
		}
		.tradingbuy_number {
			background-color: #fff;
			margin: 30rpx 30rpx 0 30rpx;
			padding: 0 0 30rpx 0;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			padding-left: 25rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;
			.tradingbuy_number_title {
				font-size: 24rpx;
				color: #636363;
				line-height: 1;
				margin-top: 20rpx;
			}
			.tradingbuy_number_text {
				font-size: 32rpx;
				color: #001eca;
				font-weight: 600;
				line-height: 1;
				margin-top: 25rpx;
			}
			.tradingbuy_number_select {
				height: 40rpx;
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				line-height: 1;
				font-size: 24rpx;
				color: #fff;
			}
		}
		.tradingbuy_total {
			height: 210rpx;
			background-color: #fff;
			margin: 30rpx 30rpx 0 30rpx;
			border-radius: 10rpx;
			padding-left: 25rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;
			.tradingbuy_total_title {
				display: inline-block;
				margin-top: 20rpx;
				font-size: 22rpx;
				color: #636363;
				line-height: 1;
			}
			.tradingbuy_total_sild {
				text-align: center;
				line-height: 1;
				overflow: hidden;
				height: 115rpx;
				>text {
					display: inline-block;
					margin-top: 20rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #e9a63d;
				}
			}
			.tradingbuy_text {
				font-size: 18rpx;
				display: flex;
				justify-content: flex-end;
				color: #808080;
			}
		}
		.tradingbuy_pay {
			height: 210rpx;
			background-color: #fff;
			margin: 30rpx 30rpx 0 30rpx;
			border-radius: 10rpx;
			padding-left: 25rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;
			>text {
				display: inline-block;
				margin-top: 20rpx;
				font-size: 22rpx;
				color: #636363;
				line-height: 1;
			}
			.tradingbuy_pay_way {
				width: 400rpx;
				height: 120rpx;
				margin-top: 30rpx;
				justify-content: space-between;
				display: flex;
				flex-wrap: wrap;
				.tradingbuy_pay_way_select {
					width: 188rpx;
					height: 48rpx;
					border: 2rpx solid #cfcdcd;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					transition: all .2s; 
					>image {
						width: 35rpx;
					}
					>text {
						color: #636363;
						font-size: 22rpx;
						margin-left: 10rpx;
					}
				}
				.tradingbuy_pay_way_select2 {
					border: 2rpx solid #001eca;
					background-color: rgba(59,97,196, .3);
					>text {
						margin-left: 18rpx;
						color: #001eca;
					}
				}
			}
		}
		.tradingbuy_but {
			width: 650rpx;
			height: 60rpx;
			background: #001eca;
			border-radius: 30rpx;
			margin: 90rpx auto 0 auto;
			text-align: center;
			line-height: 60rpx;
			color: #fff;
			font-size: 22rpx;
		}
		.tradingbuy_but_2 {
			background: #001eca;
		} 
	}
</style>