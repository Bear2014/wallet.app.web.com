<template>
	<view class="sellcoins">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText="'卖币'"></navigation>
		<view class="sell_money">
			<text>可售数量：{{ myInfo.tradable || 0 }}</text>
		</view>
		<view class="sell_input">
			<input @input="moneyInput" v-model="way.money" type="number" placeholder="输入出售金额">
		</view>
		<!-- 		<view class="sell_select">
			<text>是否拆分</text>
			<view class="sell_select_box">
				<view @tap="way.split = 0" :class="['sell_select_open', way.split == 0 ? 'sell_select_open_2' : '']">
					<text>不拆分</text>
				</view>
				<view @tap="way.split = 1" :class="['sell_select_open', way.split == 1 ? 'sell_select_open_2' : '']">
					<text>拆分</text>
				</view>
			</view>
		</view> -->
		<view class="sell_select_pay">

			<view class="sell_select_pay_text">
				<view style="margin-bottom: 10rpx; font-size: 28rpx;">iPay提醒</view>
				为了C2C交易保持顺畅，请您在交易过程中保持在线，如有疑问请联联系客服，谢谢！！！
			</view>
		</view>
		<view class="sell_select_pay">
			<text>收款方式</text>
			<view class="sell_pay_way">
				<view v-for="(item, index) in payList" :key="index" @tap="selectPay(item, index)"
					:class="['sell_pay_way_box', item.type === payIndex ? 'sell_pay_way_box2' : '']">
					<image
						:src="item.type == 'alipay' ? '../../../static/icons/icon_Alipay.png' : '../../../static/icons/icon_UnionPay.png'" mode="widthFix"></image>
					<!-- <text>{{ item.type == 'wechat' ? '微信' : item.type == 'alipay' ? '支付宝' : item.type == 'bank' ? '银行卡' :
						'USDT' }}</text> -->
					<text>{{ item.type == 'alipay' ? '支付宝' : '银行卡' }}</text>
				</view>
			</view>
			<view  v-if="payIndex !== null" class="sell_pay_way"  style="margin-top: 20px;">
				<view v-for="item in childList" :key="item.id" @tap="selectChild(item)" style="margin-right: 40rpx;"
					:class="['sell_pay_way_box3', item.id === childIndex ? 'sell_pay_way_box2' : '']">
					<image
						:src="payIndex == 'alipay' ? '../../../static/icons/icon_Alipay.png' : '../../../static/icons/icon_UnionPay.png'" mode="widthFix"></image>
					<text>{{ item.account_number }}</text>
				</view>
			</view>
		</view>


		<view :class="['listing_but', way.pay !== '' && way.money !== '' ? 'listing_but_2' : '']" @tap="goSell">
			<text>出售</text>
		</view>
		<transTip v-show="showPupu" :popuTip="tipText" @closePopu="closePopuPage"></transTip>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			way: {
				oldMoney: '', // 上一次输入
				money: '', // 金额
				pay: '', // 1.支付宝 2.微信 3.银行卡 4.usdt\
				id: ''
			},
			myInfo: {}, // 存储用户个人信息
			payList: [], // 存放用户绑定的收款方式
			showPupu: false, // 控制弹窗提示
			tipText: '',
			isTrue: true,
			payIndex: null,
			childList: [],
			childIndex: null
		}
	},
	onLoad() {
		// 获取用户个人信息
		this.obtMyInfo()
		// 获取支付方式
		this.obtPay()
	},
	methods: {
		// 关闭弹出层
		closePopuPage(res) {

			// 关闭弹出层
			this.showPupu = false
			uni.switchTab({
				url: '/pages/index/index'
			})
		},
		//金额输入
		moneyInput(e) {
			if (e.target.value > this.myInfo.tradable) {
				this.$nextTick(function () {
					uni.showToast({
						title: "可出售数量不足！",
						icon: "none",
						duration: 1000
					});
					this.way.money = this.way.oldMoney
				})
				return
			}
			this.way.oldMoney = e.target.value
			this.way.money = this.way.money.replace(/^0+/, '').replace(/\./g, '')
		},
		// 确认卖币
		goSell() {
			const pattern = /^[1-9]\d*$/;
			if (this.way.money === '') {
				uni.showToast({
					title: "请输入出售数量！",
					icon: "none",
					duration: 1000
				});
				return
			} else if (!pattern.test(this.way.money)) {
				uni.showToast({
					title: "请输入整数！",
					icon: "none",
					duration: 1000
				});
				return
			} else if (this.way.money < 100) {
				uni.showToast({
					title: "最低出售数量100！",
					icon: "none",
					duration: 1000
				});
				return
			} else if (!this.way.pay) {
				uni.showToast({
					title: "请选择收款方式！",
					icon: "none",
					duration: 1000
				});
				return
			} else if (!this.way.id) {
				uni.showToast({
					title: "请选择收款账户",
					icon: "none",
					duration: 1000
				});
				return
			}
			if (!this.isTrue) {
				return uni.showToast({
					title: "正在建立连接请稍后",
					icon: "none",
					duration: 1000
				});
			}
			this.isTrue = false
			// 卖币
			let that = this;
			let params = {
				amount: this.way.money,
				pay_type: this.way.pay,
				payment_id: this.way.id
			}; //参数
			that.$api.tokenTimeOut("/trade/v2/sale", "POST", params).then(res => {
				that.isTrue = true
				if (res.code == 0) {
					that.tipText = res.msg
					that.showPupu = true
					// 数据初始化
					that.way = {
						oldMoney: '', // 上一次输入
						money: '',	// 金额
						pay: []	// 1.支付宝， 2.微信 3.银行卡 4.usdt
					}
					// 刷新个人信息（余额）
					that.obtMyInfo()
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1000
					});
				}
			})
		},
		// 选择支付方式
		selectPay(item, index) {
			this.payIndex = item.type
			this.way.pay = item.type == 'alipay' ? '1' : item.type == 'wechat' ? '2' : '3'
			this.childList = item.child
			if (this.payList.length > 1) {
				this.childIndex = null
				this.way.id = ''
			}
		},
		selectChild(item) {
			this.childIndex = item.id
			this.way.id = item.id
		},
		obtPay() {
			// 获取绑定接口
			let that = this;
			that.$api.tokenTimeOut("/trade/paymentType", "GET").then(res => {
				let arr = []
				let newArr = []
				for (let item in res.data) {
					let obj = {
						type: item,
						child: res.data[item]
					}
					arr.push(item)
					newArr.push(obj)
				}
				this.payList = newArr
				if (arr.length == 1) {
					this.way.pay = arr[0]
				}
			})
		},
		obtMyInfo() {
			// 获取个人信息接口
			let that = this;
			that.$api.tokenTimeOut("/user/detail", "GET").then(res => {
				if (res.code == 0) {
					this.myInfo = res.data

				}
			})
		}
	},
}
</script>

<style lang="scss">
page {
	// background-color: #111111;
}

.sellcoins {
	.changepaw_top_state {
		height: 1rpx;
		padding-top: var(--status-bar-height);
		background-color: #001eca;
	}

	.sell_money {
		height: 85rpx;
		margin-top: 25rpx;
		text-align: center;
		line-height: 85rpx;
		color: #636363;
		font-size: 22rpx;
	}

	.sell_input {
		height: 80rpx;
		margin: 0 30rpx;
		background-color: #C9C7C7;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		>input {
			width: 190rpx;
			height: 24rpx;
			font-size: 24rpx;
			color: #636363;
			text-align: center;
		}
	}

	// .sell_select {
	// 	height: 160rpx;
	// 	margin: 25rpx 30rpx 0 30rpx;
	// 	background-color: #fff;
	// 	border-radius: 10rpx;
	// 	padding-left: 25rpx;
	// 	overflow: hidden;
	// 	>text {
	// 		display: inline-block;
	// 		margin-top: 25rpx;
	// 		color: #636363;
	// 		font-size: 22rpx;
	// 	}

	// 	.sell_select_box {
	// 		width: 290rpx;
	// 		height: 40rpx;
	// 		margin-top: 35rpx;
	// 		display: flex;
	// 		justify-content: space-between;
	// 		.sell_select_open {
	// 			width: 128rpx;
	// 			height: 38rpx;
	// 			border: 1rpx solid #e9a63d;
	// 			font-size: 22rpx;
	// 			text-align: center;
	// 			line-height: 38rpx;
	// 			color: #fff;
	// 			border-radius: 8rpx;
	// 			transition: all .3s; 
	// 		}
	// 		.sell_select_open_2 {
	// 			background-color: #e9a63d;
	// 		}
	// 	}
	// }
	.sell_select_pay {
		margin: 25rpx 30rpx 0 30rpx;
		padding: 25rpx;
		background-color: #fff;
		border-radius: 10rpx;

		>text {
			display: inline-block;
			margin-top: 20rpx;
			color: #636363;
			font-size: 22rpx;
		}

		.sell_pay_way {
			width: 100%;
			margin-top: 40rpx;
			display: flex;
			flex-wrap: wrap;

			.sell_pay_way_box {
				width: 190rpx;
				height: 48rpx;
				border: 2rpx solid #cfcdcd;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				line-height: 1;
				font-size: 22rpx;
				margin-bottom: 15rpx;
				transition: all .2s;
				margin-right: 30rpx;

				>image {
					width: 35rpx;
				}

				>text {
					margin-left: 18rpx;
					color: #636363;
				}
			}

			.sell_pay_way_box3 {
				padding: 0 30rpx;
				height: 48rpx;
				border: 2rpx solid #cfcdcd;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				line-height: 1;
				font-size: 22rpx;
				margin-bottom: 15rpx;
				transition: all .2s;
				margin-right: 30rpx;

				>image {
					width: 35rpx;
				}

				>text {
					margin-left: 18rpx;
					color: #636363;
				}
			}

			.sell_pay_way_box2 {
				border: 2rpx solid #001eca;
				background-color: rgba(59, 97, 196, .3);

				>text {
					margin-left: 18rpx;
					color: #001eca;
				}
			}
		}
		.sell_pay_way_box:last-child {
			margin-right: 0;
		}
		.sell_pay_way_box3:last-child {
			margin-right: 0;
		}

		.sell_select_pay_text {
			padding: 20rpx 0;
			text-align: center;
			font-size: 26rpx;
			color: red;
		}
	}

	.listing_but {
		position: absolute;
		left: 50%;
		bottom: 185rpx;
		transform: translateX(-50%);
		width: 650rpx;
		height: 60rpx;
		background: #001eca;
		border-radius: 30rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		font-size: 22rpx;
	}

	.listing_but_2 {
		background: #001eca;
	}
}
</style>