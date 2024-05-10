<template>
	<view class="listing">
		<view>
			<view class="changepaw_top_state"></view>
			<navigation :navigationText ="'转账订单'"></navigation>
			<view class="listing_name">
				<text class="listing_name_user" v-if="myInfo.phone">用户{{myInfo.phone.toString().slice(7, 11)}}</text>
				<text class="listing_name_money">余额：{{(myInfo.tradable + myInfo.untradable).toFixed(2) || 0}}</text>
			</view>
			<view class="listing_title">
				<text>商户钱包地址</text>
			</view>
			<view class="listing_address">
				<view class="listing_address_input" style="justify-content: flex-start;">
					<!-- <view class="listing_address_input_title">
						<text>商户钱包地址：</text>
					</view> -->
					<input :disabled="true" @input="addressInput" v-model="moneyaddress" maxlength="20" type="text" placeholder="请输入商户钱包地址">
					<!-- <image src="@/static/icons/icon_merchant.png" mode=""></image> -->
				</view>
			</view>
			<!-- <view class="listing_address" style="margin-top: 20rpx;" v-if="userShow">
				<view class="listing_address_input" style="justify-content: left; color: red;">
					<view class="listing_address_input_title">
						<text>游戏账号：</text>
					</view> -->
					<!-- <input  v-model="userInput"  maxlength="20" type="text" :disabled="gameUser.bc_account !== ''" placeholder="请输入游戏账号" style="width: 300rpx; text-align: center;"> -->
					<!-- <input  v-model="userInput"  maxlength="20" type="text"  placeholder="请输入游戏账号" style="width: 300rpx; text-align: center;"> -->
					<!-- <text>请选择</text>
					<view class="navigation_arrow" @tap="returnPage"></view> -->
			<!-- 	</view>
			</view> -->
			<view class="listing_title">
					<text>存款金额</text>
				</view>
			<view class="listing_money">
				<view  class="listing_money_input">
					<input :disabled="true" @input="moneyInput"  v-model="money" type="number"   placeholder="请输入存款金额">
				</view>
			</view>

			<view class="listing_Merchant_title">
				<input placeholder-style="color: #cfcdcd" type="password" maxlength="6" placeholder="请输入支付密码" v-model="passWord">
			</view>
	<!-- 		<view class="listing_address" style="margin-top: 10rpx;">
				<view class="listing_address_input" style="justify-content: left;">
					<view class="listing_address_input_title" style="margin: 0;">
						<text>手续费：</text>
					</view>
					<view  style="width: 300rpx; text-align: center;">
						<text>{{ gameUser.rate * money ? gameUser.rate * money : 0 }}</text>
					</view>
				</view>
			</view> -->
	<!-- 		<view class="listing_Merchant_title">
				<text>商户二维码</text>
			</view>
			<view class="listing_rq" v-if="qrcode">
				<uqrcode  class="listing_rq_generate"  ref="uqrcode" size="100" canvas-id="qrcode" :value="moneyaddress" :options="{ margin: 10}"></uqrcode>
			</view> -->
		</view>
		<view :class="['listing_but', money != '' && moneyaddress != '' ? 'listing_but_2' : '']" @tap="interceptSub">
			<text>确认</text>
		</view>
		<transTip v-show="showPupu" :popuTip="tipText" @closePopu="closePopuPage"></transTip>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moneyaddress: "",// 输入地址
				qrcode: false, // 控制是否显示二维码
				userShow: false, // 控制是否显示用户游戏账号
				money: "", //输入存款金额
				oldMoney: '', // 上一次输入的存款金额
				myInfo: {}, // 存储用户个人信息
				gameUser: {
					bc_account: ""
				}, // 游戏账号
				userInput: "", // 玩家游戏账号
				showPupu: false, // 控制弹窗提示
				tipText: '',
				order: '', //订单号
				objectData: {},
				passWord: '',
			}
		},
		onLoad(options) {
			// 获取用户个人信息
			this.obtMyInfo()
			let urlAddress = {} 
			urlAddress = JSON.parse(decodeURIComponent(options.urlData));
			this.order = urlAddress.data
			this.queryOrder(urlAddress.data)
			// 
			// let dataInfo = urlAddress.data.split('?')
			//  dataInfo = dataInfo[1].split('&')
			// this.objectData = {}
			// dataInfo.forEach((item, index) => {
			// 	let strorData = item.split('=')
			// 	this.objectData = {
			// 		...this.objectData,
			// 		[strorData[0]]: strorData[1]
			// 	}
			// })
			// this.moneyaddress = this.objectData.merchant_wallet_addr // 跳转过来的，获取对应的钱包地址
			// this.money = this.objectData.amount // 金额
			// if (this.moneyaddress != undefined) {
			// 	this.addressInput({
			// 		detail: {
			// 			value: this.moneyaddress
			// 		}
			// 	})
			// 	// this.qrcode = true
			// 	// // this.userShow = true
			// 	// this.addressInput({
			// 	// 	detail: {
			// 	// 		value: this.moneyaddress
			// 	// 	}
			// 	// })
			// }
			
		},
		onShow () {
		},
		methods: {

			// 查询订单
			queryOrder(order) {
				let that = this;
				let params = {
					order_no: order
				}; //参数
				that.$api.tokenTimeOut("/merchant/searchGameOrder", "POST", params).then(res => {
					
					this.objectData = res.data
					this.moneyaddress = this.objectData.merchant_wallet_addr // 商户地址
					this.money = this.objectData.total_amount // 金额
				})
			},
			// 关闭弹出层
			closePopuPage(res) {
				
				// 关闭弹出层
				uni.switchTab({
					url: '/pages/index/index'
				})
				this.showPupu = false
			},
			//金额输入
			moneyInput(e) {
				// 输出钱包输入
				
				if (e.target.value > this.myInfo.tradable + this.myInfo.untradable) {
					
			
					this.$nextTick(function() {
						uni.showToast({
							title: "可出售数量不足！",
							icon: "none",
							duration: 1000
						});
						this.money = this.oldMoney
					})
					return
				}
				this.oldMoney = e.target.value
			},
			// 检查用户输入的是否正常
			interceptSub() {
				
				if (this.moneyaddress == undefined || this.moneyaddress.length < 20) {
					uni.showToast({
						title: "请正确输入地址",
						icon: "none",
						duration: 1500
					});
					return 
				} else if (this.money == '') {
					uni.showToast({
						title: "请输入金额",
						icon: "none",
						duration: 1500
					});
					return 
				}
				if (!this.passWord) return uni.showToast({
					title: '请输入支付密码',
					icon: "none",
					duration: 1500
				});
				// if (this.myInfo.role !== this.gameUser.role) {
				// 	uni.showToast({
				//         title: '对方状态与您不符',
				// 		icon: "none",
				// 		duration: 1500
				//     });
				// 	return
				// }
				this.confirmBuy()
			},
			// 输入正在地址
			addressInput(e) {
				
				if(e.detail.value.length >= 20) {
					// 显示二维码
					let that = this;
					let params = {
						wallet_addr: e.detail.value
					}; //参数
					that.$api.tokenTimeOut("/merchant/accountInfo", "POST", params).then(res => {
						
						if (res.code == 0) {
							// if(res.data.bc_account !== null) {
								
								this.gameUser = res.data
								// this.userInput = res.data.bc_account
								// this.userShow = true
								this.qrcode = true
								uni.showToast({
									title: res.msg,
									icon: "none",
									duration: 1500
								})
							// } else {
							// 	uni.showToast({
							// 		title: "未绑定游戏账号!",
							// 		icon: "none",
							// 		duration: 1500
							// 	})
							// 	this.userShow = true
							// }
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							})
						}
						
					})
				}else {
					// 隐藏二维码
					this.qrcode = false
					// this.userShow = false
					this.gameUser = {
						bc_account: ""
					}
					this.userInput = ""
				}
			},
			// 确认按钮
			confirmBuy() {
				uni.showLoading({
				        title: '转账中'
				    });
					setTimeout(() => {
						
						let that = this;
						let params = {
							order_no: this.order,
							trans_pass: this.passWord
						}; //参数
						that.$api.tokenTimeOut("/merchant/gameTransfer", "POST", params).then(res => {
							
							uni.hideLoading()
							// 金额初始化
							// that.money = '' 
							// uni.showToast({
							// 	title: res.msg,
							// 	icon: "none",
							// 	duration: 1500
							// });
							that.tipText = res.msg
							that.showPupu = true
							// 刷新个人信息
							this.obtMyInfo()
						})
					}, 500)
				
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
		height: 100%;
	}
	.listing {
		height: 96%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.listing_name {
			height: 110rpx;
			margin: 0 25rpx;
			background-color: #FFFFFF;
			margin-top: 25rpx;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			box-shadow: 0px 2px 5px 0px #0000001A;
			.listing_name_user {
				font-size: 24rpx;
				color: #636363;
			}
			.listing_name_money {
				font-size: 20rpx;
				color: #636363;
			}
		}
		.listing_title {
			height: 50rpx;
			padding-left: 25rpx;
			font-size: 24rpx;
			margin: 10rpx 0;
			line-height: 50rpx;
			color: #636363;
		}
		.listing_address {
			height: 110rpx;
			background-color: #FFFFFF;
			margin: 0 25rpx;
			border-radius: 10rpx;
			padding: 0 40rpx;
			overflow: hidden;
			box-shadow: 0px 2px 5px 0px #0000001A;
			
			.listing_address_input {
				height: 40rpx;
				border-bottom: 1rpx solid #07070780;
				margin-top: 30rpx;
				display: flex;
				font-size: 24rpx;
				justify-content: space-between;
				color: #636363;
				.listing_address_input_title {
					width: 170rpx;
					display: flex;
					margin-right: 30rpx;
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
					border: solid #07070780;
					border-width: 0rpx 0px 1px 1rpx;
					display: inline-block;
					padding: 8rpx;
					transform: rotate(-45deg) ;
					-webkit-transform: rotate(-45deg);
				}
			}
			
		}
		
		.listing_money {
			margin: 20rpx 25rpx 0 25rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			padding: 20rpx 40rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;

			.listing_money_title {
				height: 70rpx;
				font-size: 26rpx;
				color: #cdcfcf;
			}

			.listing_money_input {
				height: 50rpx;
				border-bottom: 1rpx solid #cfcdcd;
				display: flex;
				justify-content: center;

				input {
					text-align: center;
					width: 420rpx;
					height: 32rpx;
					color: #000;
				}
			}
		}
		.listing_Merchant_title {
			height: 60rpx;
			margin: 0 25rpx;
			margin-top: 40rpx;
			font-size: 26rpx;
			color: #636363;
			display: flex;
			align-items: flex-end;

			input {
				border: 1px solid #cfcdcd;
				width: 100%;
				height: 100%;
				border-radius: 100rpx;
				padding-left: 30rpx;
				font-size: 26rpx;
				color: #000;
			}
		}
		.listing_rq {
			height: 320rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.listing_but {
			// position: absolute;
			// left: 50%;
			// // bottom: 185rpx;
			// bottom: 80rpx;
			// transform: translateX(-50%);
			margin: 0 auto;
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