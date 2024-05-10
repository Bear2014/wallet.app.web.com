<template>
	<view class="fasttrack" @tap.native="lookText">
		<!-- <view v-if="showSelectList" @tap.native="offPageList" style="position: absolute;z-index: 2; top: 0; left: 0; width: 100vw; height: 100vh; background-color: saddlebrown;"></view> -->
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'快速买入'"></navigation>
		<swiper class="fasttrack_swiper"  :current="select"  :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration" >
			<swiper-item>
				<view class="fasttrack_item">
					<view class="fasttrack_item_conversion">
						<view class="item_conversion_money">
							<input type="number" @input="moneyInput" v-model="amountMoney.money" placeholder="请输入代币数量">
						</view>
						<view class="item_conversion_symbol">
							<text>=</text>
						</view>
						<view class="item_conversion_money">
							<input type="number" @input="commissionInput" v-model="amountMoney.commission" placeholder="请输入金额">
						</view>
						
					</view>
					<!-- <view class="fasttrack_input" >
						<input type="number" @input="commissionInput" v-model="amountMoney.commission" placeholder="请输入金额">
					</view>
					<view class="fasttrack_input" style="margin-top: 5rpx;">
						<input type="number" @input="moneyInput" v-model="amountMoney.money" placeholder="请输入代币数量">
					</view> -->
					<view class="fasttrack_tip">
						<text>提示：快速通道，平台扣取1.5%手续费，建议使用普通通道耐心等待！</text>
					</view>
					<view class="listing_title">
						<text>请选择交易员</text>
					</view>
					<view class="listing_address">
						<view class="listing_address_input">
							<view class="listing_address_input_title">
								<text>交易员：</text>
							</view>
							<!-- <input @input="addressInput" v-model="moneyaddress" maxlength="20" type="text" placeholder="请输入商户钱包地址"> -->
							<view class="listing_address_select">
								 <text @tap.stop="selectAdder">{{selectValue.name}}</text>
								 <view :class="['navigation_arrow', showSelectList ? 'navigation_arrow_two' : '']"></view>
									 <view class="select_list" v-if="showSelectList">
									 	<scroll-view class="select_list_scroll" scroll-y="true"  scroll-with-animation="true">
											<view class="select_list_user" @tap="selectUserName(item)" style="" v-for="item in range" :key="item.id">
												<text>{{item.username}}</text>
											</view>
										</scroll-view>
									 </view>
								 
							</view>
							<image src="@/static/icons/icon_homepage_bottom_right.png" mode=""></image>
						</view>
					</view>
					<view class="listing_address" style="margin-top: 20rpx;" v-if="userShow">
						<view class="listing_address_input" style="width: 460rpx;">
							<view class="listing_address_input_title">
								<text>游戏账号：</text>
							</view>
							<input  v-model="userInput"  maxlength="20" type="text" :disabled="gameUser.bc_account !== ''" placeholder="请输入游戏账号" style="width: 300rpx; text-align: center;">
						</view>
					</view>
					<view class="fasttrack_title_way">
						<text>选择支付方式</text>
					</view>
<!-- 					<view class="fasttrack_way_icon" @tap="clickSelect('wx')">
						<image  v-if="way.platform != 'wx'" class="fasttrack_round" src="@/static/icons/icon_unselected.png" mode=""></image>
						<image v-else class="fasttrack_round" src="@/static/icons/icon_select.png" mode=""></image>
						<image class="fasttrack_pay_icon" src="@/static/icons/icon_WeChat_order.png" mode="widthFix"></image>
						<text>微信</text>
					</view>
					<view class="fasttrack_way_icon" @tap="clickSelect('zfb')">
						<image  v-if="way.platform != 'zfb'" class="fasttrack_round" src="@/static/icons/icon_unselected.png" mode=""></image>
						<image v-else class="fasttrack_round" src="@/static/icons/icon_select.png" mode=""></image>
						<image class="fasttrack_pay_icon" src="@/static/icons/icon_Alipay_order.png" mode="widthFix"></image>
						<text>支付宝</text>
					</view> -->
					<view class="fasttrack_way_icon" @tap="clickSelect('bank')">
						<image  v-if="way.platform != 'bank'" class="fasttrack_round" src="@/static/icons/icon_unselected.png" mode=""></image>
						<image v-else class="fasttrack_round" src="@/static/icons/icon_select.png" mode=""></image>
						<image class="fasttrack_pay_icon" src="@/static/icons/icon_UnionPay_bank.png" mode="widthFix"></image>
						<text>银行卡</text>
					</view>
					<view :class="['tradingbuy_but', amountMoney.money != '' ? 'tradingbuy_but_2' : '']" @tap="subBuy">
						<text>购买</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="order_mask" v-if="JSON.stringify(countdownData) !== '{}'">
			<view class="order_tip">
				<view class="order_up">
					<text>有一笔订单，正在进行中。</text>
					<view>
						<text style="color: red;">{{countdown}}</text>
						<text>秒后自动进入订单页</text>
					</view>
				</view>
				<view class="order_down">
					<view class="order_down_left" @tap="returnIndex">
						<text>返回首页</text>
					</view>
					<view class="order_down_right" @tap="goOrderDetail">
						<text>前往订单页</text>
					</view>
				</view>
			</view>
		</view>
		<view class="order_mask" v-if="showInfo">
			<view class="downTime">
				<text>提示</text>
				<view class="downTimeInfo">
					<view class="downTimeInfo_left">
						<text>实付金额：</text>
					</view>
					<view class="downTimeInfo_right">
						<text>{{amountMoney.commission}}</text>
					</view>
				</view>
				<view class="downTimeInfo">
					<view class="downTimeInfo_left">
						<text>代币数量：</text>
					</view>
					<view class="downTimeInfo_right">
						<text>{{amountMoney.money}}</text>
					</view>
				</view>
				<view class="downTimeInfo">
					<view class="downTimeInfo_left">
						<text>手续费：</text>
					</view>
					<view class="downTimeInfo_right">
						<text>{{(amountMoney.commission - amountMoney.money ).toFixed(2)}}</text>
					</view>
				</view>
				<view style="margin-top: 20rpx;"><text style="color: red;">{{countdown}}</text><text>秒后进入订单页面</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moneyaddress: "",// 输入地址
				gameUser: {
					bc_account: ""
				}, // 游戏账号
				userInput: "", // 用户的游戏用户名
				userShow: false, // 默认情况下不展示用户游戏名栏目
				select: 0, // 默认情况下是0快速购买， 1快速出售
				background: ['color1', 'color2', 'color3'],
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				way: {
					platform: 'bank',  // 默认是选择微信， 
					sellPlatform: ['wx', 'zfb', 'bank']
				},
				userImg: {
					wxUrl: "",		// 用户绑定的微信收款图片
					zfbUrl: "",		// 用户绑定的支付宝收款图片
					banUrl: "",		// 用户绑定的银行卡收款图片
				},
				amountMoney: {
					money: "", //代币数量
					commission: "", // 包括手续费在金额
				},
				countdown: '', // 倒计时自动跳转
				countdownData: {}, // 保存对象
				timedown: '', // 保存定时函数
				showInfo: false, // 提示信息
				selectValue: {
					id: 0, // 商户id
					name: '请选择' // 商户名称
				},
				range: [],
				showSelectList: false, // 是否展示选择列表
			}
		},
		onLoad() {
			// 检测是否有正在进行中的订单
			
			// 选择商户列表
			this.obtSelectList()
		},
		onShow() {
			this.queryOrdering()
			
		},
		onHide() {
			
			// 清除定时器
			this.countdownData = {}
			clearInterval(this.timedown)
		},
		onUnload() {
			
			clearInterval(this.timedown)
			// 数据初始化
			this.countdownData = {}
		},
		methods: {
			lookText() {
				
				// 关闭列表
				this.showSelectList = false 
			},
			offPageList() {
				
			},
			// 选择商户
			selectUserName(user) {
				
				// 选择商户后，更新选择商户的id
				this.selectValue.id = user.id
				this.selectValue.name = user.username
				// 选择完成后关闭显示列表页
				this.showSelectList = false 
			},
			// 获取用户选择列表
			obtSelectList() {
				let that = this;
				that.$api.tokenTimeOut("/quickTrade/selectTrader", "GET").then(res => {
					
					if (res.code == 0) {
						// 更新列表数据
						this.range = res.data
					}
				})
			},
			// 选择地址
			selectAdder() {
				// 请求列表数据
				
				// 展示选择页面
				this.showSelectList = !this.showSelectList
			},
			// 倒计时处理
			countDownTime() {
				clearInterval(this.timedown)
				// 重新赋值
				this.countdown = 10
				this.timedown =  setInterval(() => {
					this.countdown--
					if(this.countdown <= 0) {
						
						// 跳转到订单详情页
						this.goOrderDetail() 
						clearInterval(this.timedown)
					}
					
				}, 1000)
			},
			// 前往订单详情页
			goOrderDetail() {
				uni.navigateTo({
					 url: `/pages/indexPage/fasttrackdetail/fasttrackdetail?item=${encodeURIComponent(JSON.stringify(this.countdownData))}`,
				});
			},
			// 返回首页
			returnIndex() {
				clearInterval(this.timedown)
				uni.navigateBack({
					delta: 1
				});
			},
			// 检测是否有正在进行中的订单
			queryOrdering() {
				let that = this;
				var text = {}
				// 数据初始化
				this.countdownData = {}
				that.$api.tokenTimeOut("/quickTrade/unfinishOrder", "GET").then(res => {
					if (res.code == 0 && res.data != null) {
						
						this.countdownData = res
						// 有正在进行中的订单， 进行倒计时
						this.countDownTime()
					}
				})
			},
			// 输入地址
			addressInput(e) {
				
				if(e.detail.value.length >= 20) {
					// 显示二维码
					let that = this;
					let params = {
						wallet_addr: e.detail.value
					}; //参数
					// 数据初始化
					this.gameUser = {
						bc_account: ""
					}
					this.userInput = ""
					that.$api.tokenTimeOut("/merchant/accountInfo", "POST", params).then(res => {
						
						if (res.code == 0) {
							if(res.data.bc_account !== null) {
								
								this.gameUser = res.data
								this.userInput = res.data.bc_account
								this.userShow = true
								uni.showToast({
									title: "成功获取游戏账号！",
									icon: "none",
									duration: 1500
								});
							} else {
								uni.showToast({
									title: "未绑定游戏账号！",
									icon: "none",
									duration: 1500
								});
								this.userShow = true
							}
						}else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							});
						}
					})
				}else {
					this.userShow = false
					this.gameUser = { // 清空数据
						bc_account: ""
					}
					this.userInput = ""
				}
			},
			// 提交拦截器
			subBuy() {
				// this.showSelectList = false 
				if(this.amountMoney.money == "") {
					uni.showToast({
						title: "请输入代币数量",
						icon: "none",
						duration: 2000
					});
					return
				}else if (this.amountMoney.money < 100) {
					uni.showToast({
						title: "最小购买数量为100",
						icon: "none",
						duration: 2000
					});
					return
				}else if(this.amountMoney.commission == "") {
					uni.showToast({
						title: "请输入金额",
						icon: "none",
						duration: 2000
					});
					return 
				}else if(this.selectValue.id == 0) {
					uni.showToast({
						title: "请选择交易员",
						icon: "none",
						duration: 2000
					});
					return 
				}
				this.showInfo = true
				// 显示二维码
				let that = this;
				let params = {
					// wallet_addr: this.moneyaddress, 		// 商户地址
					trader_id: this.selectValue.id,
					pay_amount: this.amountMoney.commission,	// 支付金额
					charge_amount: this.amountMoney.money,	// 买入数量
					// bc_account: this.userInput		// 用户游戏账号
				}; //参数
				that.$api.tokenTimeOut("/quickTrade/overbooking", "POST", params).then(res => {
					
					clearInterval(this.timedown)
					this.countdown = 3 // 倒计时自动跳转时间
					this.timedown = setInterval(() => {
						this.countdown--
						
						if(this.countdown <= 0) {
							clearInterval(that.timedown)
							// 查看下单是否成功
							if (res.code == 0) {
								let paramsData = {
									order_no: res.data.order_no // 订单号
								}; //参数
								//去拿卡数据
								that.$api.tokenTimeOut("/quickTrade/confirmOrder", "POST", paramsData).then(resThree => {
									// 订单确定交易， 获取成功！
									if (resThree.code == 0) {
										that.showInfo = false
										this.countdownData = {
											data: {
												order_no: resThree.data.order.order_no,
												order_type: resThree.data.order.type,
												order_ym: resThree.data.order.order_no.slice(0, 6)
											}
										}
										// 跳转过去
										this.goOrderDetail()
										
										// 开发中 准备跳转
									} else {
										that.showInfo = false
										uni.showToast({
											title: resThree.msg,
											icon: "none",
											duration: 1500
										});
									}
								})
							}else {
								this.showInfo = false 
								clearInterval(that.timedown)
								uni.showToast({
									title: res.msg,
									icon: "none",
									duration: 1500
								});
							}
						}
					}, 1000)
				})
				
				
			},
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			// 选择出售方式
			clickSelectSell(e){
				// 查看是否已经有这个选择，有的情况下，就删除，没有就添加
				if(this.way.sellPlatform.includes(e))  {
					this.way.sellPlatform =  this.way.sellPlatform.filter(item => item != e);
				}else {
					this.way.sellPlatform.push(e)
				}
			},
			// 选择支付方式
			clickSelect(e) {
				this.way.platform = e
			},
			//输入代币数量
			moneyInput(e) {
				let a = e.target.value
				
				this.amountMoney.commission = parseFloat(a)  + parseFloat(a*0.015)
			},
			// 监控输入金额input
			commissionInput(e) {
				let a = e.target.value
				
				
				this.amountMoney.money = (parseFloat(a)  / (1 + 0.015) ).toFixed(2)
			},
			// 选择是购买还是 出售页面
			switchSelect(e) {
				this.select = e // 更新选择
				this.amountMoney.money = ""
				this.amountMoney.commission = ""
			},
			

		},
	}
</script>

<style lang="scss">
	page {
		background-color: #111111;
	}
	.fasttrack {
		.order_mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, .3);
			z-index: 4;
			.downTime {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				border-radius: 8rpx;
				width: 470rpx;
				height: 270rpx;
				background-color: #fff;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 15rpx;
				font-size: 30rpx;
				color: #111111;
				.downTimeInfo {
					width: 470rpx;
					height: 35rpx;
					display: flex;
					margin-top: 15rpx;
					.downTimeInfo_left {
						width: 160rpx;
						height: 35rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-size: 28rpx;
						line-height: 1;
					}
					.downTimeInfo_right {
						width: 310rpx;
						height: 35rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						line-height: 1;
						border-bottom: .5rpx solid #cacaca;
					}
				}
			}
			.order_tip {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 500rpx;
				height: 230rpx;
				border-radius: 8rpx;
				background-color: #2f2e2a;
				.order_up {
					height: 120rpx;
					font-size: 28rpx;
					padding: 15rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #ededed;
				}
				.order_down {
					height: 80rpx;
					display: flex;
					font-size: 28rpx;
					text-align: center;
					line-height: 80rpx;
					.order_down_left {
						flex: 1;
						background-color: #606060;
						color: #1f1f1f;
						border-radius: 0 0 0 8rpx;
					}
					.order_down_right {
						flex: 2;
						background-color: #e8a53d;
						color: #fff;
						font-size: 30rpx;
						border-radius: 0 0 8rpx 0;
					}
				}
			}
		}
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.fasttrack_select {
			height: 60rpx;
			margin: 5rpx 30rpx 0 30rpx;
			background-color: #2d2b2a;
			border-radius: 10rpx;
			display: flex;
			
			.fasttrack_select_buy {
				flex: 1;
				border-radius: 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: all .3s; 
				>text {
					line-height: 1;
					font-size: 22rpx;
					color: #cacaca;
				}
			}
			.fasttrack_select_buy_light {
				background-color: #d49d46;
				>text {
					color: #2d2b2a;
				}
			}
		}
		.fasttrack_swiper {
			position: relative;
			z-index: 3;
			height: 1174rpx;
			.fasttrack_item {
				height: 1174rpx;
				.listing_title {
					height: 50rpx;
					padding-left: 25rpx;
					font-size: 20rpx;
					line-height: 50rpx;
					color: #cdcdcd;
				}
				.listing_address {
					position: relative;
					height: 80rpx;
					background-color: #161616;
					margin: 0 25rpx;
					border-radius: 10rpx;
					padding: 30rpx 40rpx 0 40rpx;
					.listing_address_input {
						height: 40rpx;
						border-bottom: 1rpx solid #252525;
						// margin-top: 30rpx;
						display: flex;
						font-size: 24rpx;
						justify-content: space-between;
						color: #cdcdcd;
						.listing_address_select {
							flex: 1;
							text-align: center;
							position: relative;
							height: 40rpx;
							z-index: 3;
							.select_list {
								position: absolute;
								bottom: -310rpx;
								left: 50%;
								transform: translateX(-50%);
								border-radius: 8rpx;
								width: 430rpx;
								height: 300rpx;
								background-color: #2f2e2a;
								z-index: 3;
								.select_list_scroll {
									width: 400rpx;
									height: 300rpx;
									padding: 0 15rpx;
									.select_list_user {
										height: 50rpx;
										border-bottom: 1rpx solid #8b8c8c;
										text-align: center;
										line-height: 50rpx;
										color: #fff;
									}
								}
							}
							.navigation_arrow {
								margin-left: 20rpx;
								width: 0;
								height: 0;
								border: solid #8b8c8c;
								border-width: 0rpx 0px 1px 1rpx;
								display: inline-block;
								padding: 8rpx;
								transform: rotate(-45deg) ;
								-webkit-transform: rotate(-45deg);
								transition: all .3s; 
							}
							.navigation_arrow_two {
								transform: rotate(135deg) ;
							}
						}
						.listing_address_input_title {
							width: 170rpx;
							display: flex;
						}
						input {
							width: 340rpx;
							height: 24rpx;
							font-size: 24rpx;
						}
						image {
							width: 27rpx;
							height: 27rpx;
						}
						.navigation_arrow {
							width: 0;
							height: 0;
							border: solid #8b8c8c;
							border-width: 0rpx 0px 1px 1rpx;
							display: inline-block;
							padding: 8rpx;
							transform: rotate(-45deg) ;
							-webkit-transform: rotate(-45deg);
						}
					}
					
				}
				.fasttrack_item_conversion {
					height: 80rpx;
					margin: 45rpx 30rpx 0 30rpx;
					border-radius: 8rpx;
					display: flex;
					justify-content: space-between;
					.item_conversion_symbol{
						width: 50rpx;
						height: 80rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						line-height: 1;
						font-size: 22rpx;
						color: #fff;
					}
					.item_conversion_money {
						width: 320rpx;
						height: 80rpx;
						background-color: #161616;
						border-radius: 8rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						>input {
							width: 320rpx;
							height: 22rpx;
							font-size: 22rpx;
							text-align: center;
							color: #fff;
						}
					}
				}
				.fasttrack_input {
					height: 80rpx;
					margin: 45rpx 30rpx 0 30rpx;
					background-color: #1f1f1f;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					>input {
						width: 250rpx;
						height: 22rpx;
						font-size: 22rpx;
						text-align: center;
						color: #fff;
					}
				}
				.fasttrack_tip {
					height: 75rpx;
					padding-left: 22rpx;
					margin: 0 30rpx;
					line-height: 1.2;
					color: #d6301a;
					font-size: 18rpx;
					display: flex;
					align-items: center;
				}
				.fasttrack_title_way {
					height: 80rpx;
					margin: 0 30rpx;
					padding-left: 22rpx;
					color: #d4d4d4;
					display: flex;
					align-items: center;
					line-height: 1;
					font-size: 24rpx;
				}
				
				
				.fasttrack_way_icon {
					height: 80rpx;
					margin: 0 30rpx;
					padding-left: 22rpx;
					display: flex;
					align-items: center;
					.fasttrack_round {
						width: 25rpx;
						height: 25rpx;
					}
					.fasttrack_pay_icon {
						width: 40rpx;
						margin-left: 60rpx;
					}
					>text {
						margin-left: 35rpx;
						font-size: 24rpx;
						color: #d4d4d4;
						line-height: 1;
					}
				}
			}
			.tradingbuy_but {
				position: absolute;
				left: 50%;
				bottom: 185rpx;
				transform: translateX(-50%);
				width: 650rpx;
				height: 60rpx;
				background: #a58a56;
				border-radius: 30rpx;
				text-align: center;
				line-height: 60rpx;
				color: #fff;
				font-size: 22rpx;
			}
			.tradingbuy_but_2 {
				background: linear-gradient( #ffdf7c, #c27e2a);
			}
		}
		
	}
</style>