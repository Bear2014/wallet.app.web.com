<template>
	<view class="tradingfloor">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText="'交易大厅'"></navigation>
		<view style="width: 100%;height: 120rpx; background: #001eca; border-radius: 0 0 10rpx 10rpx;"></view>
		<view class="Notice">
			<text style="font-size: 24rpx; margin-bottom: 28rpx;">公告</text>
			<view style="margin-bottom: 10rpx; font-size: 28rpx; color: red;">iPay提醒</view>
			<text
				style="font-size: 32rpx;color: red; line-height: 40rpx;">当您买币时请使用iPay实名付款方式进行支付，如有不同姓名付款按照赃款处理！请共同净化绿色交易环境，遵守交易规则！</text>
		</view>
		<view class="Notice_select_way">
			<view class="Notice_select_number" @tap="reOpenShowDate">
				<text>数量</text>
				<view :class="['navigation_arrow', openShowDate ? 'navigation_arrow2' : '']"></view>
			</view>
			<text @tap="selectWay()" :style="{fontWeight: select.way == 'pay' ? '600' : ''}">支付方式</text>
			<!-- <text @tap="selectWay('sell')" :style="{color: select.way == 'sell' ? '#e9a63d' : ''}">出售方式</text> -->
		</view>
		<view class="Notice_select_way_select" v-if="select.way == 'pay'">
			<view class="select_way_select_box">
				<view @tap="clickPayWay(0)"
					:class="['select_way_select',select.payScreen == 0 ? 'select_way_select_lingth' : '']">
					<text>不限</text>
				</view>
			</view>
			<view class="select_way_select_box">
				<view @tap="clickPayWay(1)"
					:class="['select_way_select',select.payScreen == 1 ? 'select_way_select_lingth' : '']">
					<text>支付宝</text>
				</view>
			</view>
			<!-- <view class="select_way_select_box">
				<view @tap="clickPayWay(2)" :class="['select_way_select',select.payScreen == 2 ? 'select_way_select_lingth' : '']">
					<text>微信</text>
				</view>
			</view> -->
			<view class="select_way_select_box">
				<view @tap="clickPayWay(3)"
					:class="['select_way_select',select.payScreen == 3 ? 'select_way_select_lingth' : '']">
					<text>银行卡</text>
				</view>
			</view>
			<!-- <view class="select_way_select_box">
				<view @tap="clickPayWay(4)" :class="['select_way_select',select.payScreen == 4 ? 'select_way_select_lingth' : '']">
					<text>USDT</text>
				</view>
			</view> -->
		</view>
		<view class="Notice_select_way_select" v-if="select.way == 'sell'">
			<view class="select_way_select_box">
				<view @tap="clickSellWay(0)"
					:class="['select_way_select',select.screen == 0 ? 'select_way_select_lingth' : '']">
					<text>不限</text>
				</view>
			</view>
			<view class="select_way_select_box">
				<view @tap="clickSellWay(1)"
					:class="['select_way_select',select.screen == 1 ? 'select_way_select_lingth' : '']">
					<text>可拆售</text>
				</view>
			</view>
			<view class="select_way_select_box">
				<view @tap="clickSellWay(2)"
					:class="['select_way_select',select.screen == 2 ? 'select_way_select_lingth' : '']">
					<text>不可拆售</text>
				</view>
			</view>
		</view>
		<scroll-view class="tradingfloor_scroll" scroll-y="true" v-show="showList" @scrolltolower="scrollPage"
			refresher-enabled="true" refresher-background="#F4F3F3" :refresher-triggered="triggeredTwo"
			@refresherrefresh="refreshData" :refresher-threshold="70" @refresherrestore="refreshDataEnd">
			<!-- <template #refresher>
				<loding/>
			</template> -->
			<view class="tradingfloor_order" v-for="item in dataList" :key="item.order_no">
				<view class="tradingfloor_order_head_box">
					<view class="tradingfloor_header">
						<image src="@/static/logo.png" mode=""></image>
					</view>
				</view>
				<view class="tradingfloor_text">
					<text>{{(item.amount).toFixed(2)}}</text>
				</view>
				<view class="tradingfloor_icon">
					<image src="@/static/icon_Alipay.png" mode="" v-if="item.pay_type.indexOf('1') != -1"></image>
					<image src="@/static/icon_WeChat.png" mode="" v-if="item.pay_type.indexOf('2') != -1"></image>
					<image src="@/static/icon_UnionPay.png" mode="" v-if="item.pay_type.indexOf('3') != -1"></image>
					<image src="@/static/icons/icon_usdt.png" mode="" v-if="item.pay_type.indexOf('4') != -1"></image>
				</view>
				<view class="tradingfloor_buy">
					<!-- <text>可拆售</text> -->
					<view class="wujiaxing" v-if="item.icon">
						<image :src="item.icon" mode=""></image>
					</view>
					<view class="tradingfloor_buy_but" @tap="goBuy(item)">
						<text>购买</text>
					</view>
				</view>
			</view>
			<view class="void_box" v-if="dataList.length == 0">
				<image src="@/static/icons/empty_33.png" mode=""></image>

			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				select: {
					way: "", // pay支付方式， sell出售方式
					screen: 0, // 0 不限 ， 1可拆售， 2不可拆售
					payScreen: 0, // 0不限， 1支付宝， 2微信， 3银行卡， 4 USDT
				},
				userInfo: {
					user_no: "", // 用户的个人信息
					user_role: "", // 用户的账号角色
				},
				allDataList: [], // 存储旧数据
				dataList: [], // 存储数据
				showList: false, // 是否展示数据
				openShowDate: false, // 控制金额排序
				triggeredTwo: false, // 控制是否是刷新状态
				to: '',
				radioList: [{
					id: 1,
					icon: '../../../static/icons/fruit1.png'
				}, {
					id: 2,
					icon: '../../../static/icons/fruit2.png'
				}, {
					id: 3,
					icon: '../../../static/icons/fruit3.png'
				}, {
					id: 4,
					icon: '../../../static/icons/fruit4.png'
				}, {
					id: 5,
					icon: '../../../static/icons/fruit5.png'
				}, {
					id: 6,
					icon: '../../../static/icons/fruit6.png'
				}, {
					id: 7,
					icon: '../../../static/icons/fruit7.png'
				}, {
					id: 8,
					icon: '../../../static/icons/fruit8.png'
				}, {
					id: 9,
					icon: '../../../static/icons/fruit9.png'
				}, {
					id: 10,
					icon: '../../../static/icons/fruit10.png'
				}, {
					id: 11,
					icon: '../../../static/icons/xin.png'
				}, ]
			}
		},
		onLoad(options) {
			this.to = options.to
		},
		onBackPress(options) {
			if (this.to) {
				uni.switchTab({
					url: "/pages/index/index",
					animationType: 'pop-in',
					animationDuration: 300
				})
				return true
			}
		},
		onShow() {
			let user_no = uni.getStorageSync('kefu').user_no
			let role = uni.getStorageSync('kefu').role
			this.userInfo.user_no = user_no // 存储用户的编号
			this.userInfo.user_role = role // 存储用户的角色
			this.obtList()
		},
		methods: {
			// 下拉刷新结束
			refreshDataEnd() {

			},
			// 下拉刷新被触发
			refreshData() {

				// 开启下拉刷新样式
				this.triggeredTwo = true
				setTimeout(() => {

					// 刷新列表
					this.obtList()
					// 关闭下拉刷新
					this.triggeredTwo = false
					uni.showToast({
						title: "刷新订单成功！",
						icon: "none",
						duration: 1500
					});
				}, 1000)
			},
			// 滑动到底部
			scrollPage() {

			},
			// 筛选掉自己， 如果自己账号为内部账号时，筛选掉其他内部账号订单
			detAccount() {

				if (this.userInfo.user_role == '1') {
					this.allDataList = this.allDataList.filter(item => {
						if (item.user_no == this.userInfo.user_no) {
							return false
						}
						return true
					})
				} else if (this.userInfo.user_role == '2') {
					this.allDataList = this.allDataList.filter(item => {
						if (item.user_no == this.userInfo.user_no || item.user_role == this.userInfo.user_role) {
							return false
						}
						return true
					})
				}
			},
			// 筛选掉售卖时间距离当前时间小于300秒
			detTimeMin(setTime) {

				if (this.userInfo.user_role == '2') {
					let time = parseInt(new Date().getTime() / 1000) + ''; //获取10位时间戳

					this.allDataList = this.allDataList.filter(item => {
						let residueTime = time - item.sale_tm // 当前时间减去售卖时间，看看有没有过去300秒

						if (residueTime >= setTime) {
							return true
						}
						return false
					})
				}
			},
			// 点击排序切换
			reOpenShowDate() {
				// 切换排序方向
				this.openShowDate = !this.openShowDate
				// 金额排序
				this.moneySort()
			},
			// 金额排序
			moneySort() {
				if (this.openShowDate) {
					// 从高到低
					this.dataList.sort(function(a, b) {
						return b.amount - a.amount
					})
				} else {
					// 从低到高
					this.dataList.sort(function(a, b) {
						return a.amount - b.amount
					})
				}
			},
			// 筛选收款方式
			payMethod() {
				// 如果用户选择的是
				if (this.select.payScreen == 0) {
					this.dataList = this.allDataList
					return
				} else if (this.select.payScreen == 1) { // 用户选择只显示支付宝
					// 停在这**************************
					this.dataList = this.allDataList.filter(item => {

						// 包含支付宝收款方式的订单留下来
						if (item.pay_type.indexOf('1') !== -1) {
							return true
						}
						return false
					})

				} else if (this.select.payScreen == 2) { // 用户选择只显示微信
					// 停在这**************************
					this.dataList = this.allDataList.filter(item => {

						// 包含微信收款方式的订单留下来
						if (item.pay_type.indexOf('2') !== -1) {
							return true
						}
						return false
					})

				} else if (this.select.payScreen == 3) { // 用户选择只显示银行卡
					// 停在这**************************
					this.dataList = this.allDataList.filter(item => {

						// 包含银行卡收款方式的订单留下来
						if (item.pay_type.indexOf('3') !== -1) {
							return true
						}
						return false
					})

				} else if (this.select.payScreen == 4) { // 用户选择只显示银USDT
					// 停在这**************************
					this.dataList = this.allDataList.filter(item => {

						// 包含USDT收款方式的订单留下来
						if (item.pay_type.indexOf('4') !== -1) {
							return true
						}
						return false
					})

				}
			},
			//  // 此方法会在图片加载完成后触发
			// loadImg (e) {
			// 	setTimeout(() => {
			// 		uni.hideLoading()
			// 		this.showList = true
			// 	}, 300)
			//   
			//   
			// },
			// 去购买
			goBuy(item) {

				uni.navigateTo({
					url: `/pages/indexPage/tradingbuy/tradingbuy?item=${encodeURIComponent(JSON.stringify(item))}`,
				});
			},
			// 修改出售筛选
			clickSellWay(e) {
				this.select.screen = e
			},
			// 修改筛选方式
			selectWay() {
				if (this.select.way == '') {
					this.select.way = 'pay'
				} else {
					// 取消筛选，数据初始化
					this.select.way = ''
					this.select.payScreen = 0
					// 展示全部数据
					this.payMethod()
				}
			},
			clickPayWay(e) {
				// 修改收款筛选
				this.select.payScreen = e
				this.payMethod()
			},
			// 获取订单页数据
			obtList() {
				this.showList = false
				//开启加载
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let that = this;
				that.$api.tokenTimeOut("/trade/v2/order", "GET").then(res => {

					if (res.code == 0) {
						// 存储数据
						res.data.data.forEach(res => {
							res.icon = undefined
							this.radioList.forEach(ele => {
								if (ele.id == Number(res.saling_add_tag)) {
									res.icon = ele.icon
								}
							})

						})
						that.allDataList = res.data.data
						// 筛选掉自己的订单，当自己是内部账号时，筛选掉也是内部账号的订单
						//that.detAccount()
						// 当自己为内部账号时，筛选掉售卖时间小于300秒的订单
						//that.detTimeMin(res.data.delay_time)
						// 存储筛选过收款方式后的数据
						that.payMethod()
						// 存储筛选过金额排序后的数据

						setTimeout(() => {
							uni.hideLoading()
							this.showList = true
						}, 300)
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

	.tradingfloor {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}

		.Notice {
			width: 660rpx;
			// height: 168rpx;
			background-color: #D3DFFF;
			margin: 20rpx auto 0 auto;
			border-radius: 0 0 10rpx 10rpx;
			padding: 30rpx 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			color: #636363;
			font-size: 22rpx;
			box-shadow: 0px 2px 5px 0px #00000040;
			margin-top: -100rpx;
		}

		.Notice_select_way {
			height: 110rpx;
			padding: 0 60rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			color: #636363;
			font-size: 24rpx;

			.Notice_select_number {
				display: flex;
				line-height: 1;
				align-items: center;
				color: #636363;
				font-size: 24rpx;

				.navigation_arrow {
					margin-left: 10rpx;
					width: 0;
					height: 0;
					border: solid #636363;
					border-width: 0rpx 0px 1px 1rpx;
					display: inline-block;
					padding: 6rpx;
					transition: all .3s;
					transform: rotate(-45deg);
					-webkit-transform: rotate(-45deg);
				}

				.navigation_arrow2 {
					transform: rotate(135deg);
					-webkit-transform: rotate(135deg);
				}
			}
		}

		.Notice_select_way_select {
			height: 60rpx;
			display: flex;
			justify-content: space-around;

			.select_way_select_box {
				flex: 1;
				display: flex;
				justify-content: center;

				.select_way_select {
					width: 122rpx;
					height: 52rpx;
					background-color: #D3DFFF;
					border-radius: 5rpx;
					text-align: center;
					line-height: 52rpx;
					color: #fff;
					font-size: 24rpx;
					transition: all .3s;

				}

				.select_way_select_lingth {
					// width: 121rpx;
					// height: 44rpx;
					background-color: #001eca;
					transform: scale(1.1);
				}
			}

		}

		.tradingfloor_scroll {
			width: 750rpx;
			height: calc(100vh - 520rpx - env(safe-area-inset-bottom));

			// background-color: cadetblue;
			.tradingfloor_order {
				height: 95rpx;
				margin: 20rpx;
				background-color: #FFF;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				box-shadow: 0px 2px 5px 0px #0000001A;

				.tradingfloor_order_head_box {
					width: 115rpx;
					height: 95rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.tradingfloor_header {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;

						>image {
							width: 60rpx;
							height: 60rpx;
						}
					}
				}

				.tradingfloor_text {
					width: 120rpx;
					height: 95rpx;
					font-size: 26rpx;
					color: #636363;
					font-weight: 600;
					display: flex;
					align-items: center;
					line-height: 1;
				}

				.tradingfloor_icon {
					width: 245rpx;
					height: 95rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					>image {
						width: 40rpx;
						height: 40rpx;
						margin: 0 5rpx;
					}
				}

				.wujiaxing {
					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 40rpx;
					}
				}

				.tradingfloor_buy {
					width: 230rpx;
					height: 95rpx;
					display: flex;
					color: #a2a2a2;
					font-size: 20rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.tradingfloor_buy_but {
						width: 100rpx;
						height: 45rpx;
						margin-right: 25rpx;
						background-color: cadetblue;
						border-radius: 8rpx;
						text-align: center;
						line-height: 45rpx;
						font-size: 18rpx;
						color: #FFF;
						font-weight: 500;
						background: #001eca;
					}
				}
			}

			.void_box {
				width: 100%;
				height: 300rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 190rpx;
					height: 286rpx;
				}

				.void_box_text {
					margin-top: 10rpx;
					width: 100%;
					height: 30rpx;
					text-align: center;
					font-size: 24rpx;
					line-height: 30rpx;
					color: #c6c6c6
				}
			}
		}

	}
</style>