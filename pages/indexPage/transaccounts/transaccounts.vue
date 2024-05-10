<template>
	<view class="listing">
		<view>
			<view class="changepaw_top_state"></view>
		<navigation :navigationText="'充值'" @returnDate="returnDate"></navigation>
		<view class="listing_name">
			<text class="listing_name_user" v-if="myInfo.phone">用户{{ myInfo.phone.toString().slice(7, 11) }}</text>
			<text class="listing_name_money">余额：{{ myInfo.role == 2 ? (myInfo.untradable).toFixed(2) || 0 : (myInfo.tradable + myInfo.untradable).toFixed(2) || 0}}</text>
		</view>
		<view class="listing_title">
			<text>钱包地址</text>
		</view>

		<view class="listing_address">
			<view class="listing_address_input" style="justify-content: space-between;">
				<view class="listing_address_input_title" style="margin-right: 0rpx;"  v-model="moneyaddress">
					<view style="color: #636363;">{{ moneyaddress }}</view>
				</view>
				<!-- <input placeholder-style="color: #cfcdcd"  readonly v-model="moneyaddress" maxlength="20"
					type="text" placeholder="请输入商户钱包地址"> -->
				<!-- <image @tap="getMessage" src="@/static/icons/icon_my_bottom.png" mode=""></image> -->
			</view>
		</view>
		<!-- <view class="listing_address" style="margin-top: 20rpx;" v-if="userShow">
			<view class="listing_address_input" style="justify-content: left; color: red;">
				<view class="listing_address_input_title">
					<text>游戏账号：</text>
				</view> -->
		<!-- <input placeholder-style="color: #cfcdcd"  v-model="userInput"  maxlength="20" type="text" :disabled="gameUser.bc_account !== ''" placeholder="请输入游戏账号" style="width: 300rpx; text-align: center;"> -->
		<!-- <input placeholder-style="color: #cfcdcd"  v-model="userInput"  maxlength="20" type="text"  placeholder="请输入游戏账号" style="width: 300rpx; text-align: center;"> -->
		<!-- <text>请选择</text>
				<view class="navigation_arrow" @tap="returnPage"></view> -->
		<!-- 	</view>
		</view> -->
		<view class="listing_title">
				<text>存款金额</text>
			</view>
		<view class="listing_money">
			<view class="listing_money_input">
				<input placeholder-style="color: #cfcdcd" @input="moneyInput" v-model="money" type="number"
					placeholder="请输入存款金额">
			</view>
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
		<view class="listing_Merchant_title">
			<input placeholder-style="color: #cfcdcd" type="password" maxlength="6" placeholder="请输入支付密码" v-model="passWord">
		</view>
		</view>
		<!-- <view class="listing_Merchant_title">
			<text>商户二维码</text>
		</view>
		<view class="listing_rq" v-if="qrcode">
			<uqrcode  class="listing_rq_generate"  ref="uqrcode" size="100" canvas-id="qrcode" :value="moneyaddress" :options="{ margin: 10}"></uqrcode>
		</view> -->
		<button :disabled="isButtonDisabled" :style="{ backgroundColor: buttonColor }" class="listing_but" @tap="interceptSub">
			<text>确认</text>
		</button>
		<transTip v-show="showPupu" :popuTip="tipText" @closePopu="closePopuPage"></transTip>

		<uni-popup ref="popup" type="bottom">
			<view style="background-color: #fff;height: 400rpx; overflow-y: auto;">
				<view v-for="(item, index) in searchInfo" :key="index">
					<view class="scroll_view" @click="setAdd(item.wallet_addr)">
						<view class="merchant_tab_list" scroll-x="true">
							<view class="merchant_tab_list_head">
								<view class="merchant_tab_list_img">
									<image src="@/static/logo.png" mode=""></image>
								</view>
							</view>
							<view class="merchant_tab_list_info">
								<text class="merchant_text_user">{{ item.merchant_name }}</text>
								<text class="merchant_text_address">钱包地址：{{ item.wallet_addr }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="void_box" v-if="searchInfo.length == 0">
					<image src="@/static/icons/empty_33.png" mode=""></image>
					<!-- <view class="void_box_text">
						<text>空空如也~</text>
					</view> -->
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			moneyaddress: "",// 输入地址
			isButtonDisabled: false,// 禁止重复点击
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
			passWord: '',
			searchInfo: [],
			wallet_addr:'',
			buttonColor:'#001eca',
		}
	},
	onUnload() {
		uni.removeStorage('token_H5Platform')
	},
	onLoad(options) {
		window.addEventListener('popstate', this.preventBack);
		this.moneyaddress = uni.getStorageSync('wallet_addr')
		this.addressInput()
	
		// 获取用户个人信息
		this.obtMyInfo()
		// this.moneyaddress = options.walletAddr // 跳转过来的，获取对应的钱包地址
		// if (this.moneyaddress != undefined) {
		// 	this.qrcode = true
		// 	// this.userShow = true
		// 	this.addressInput({
		// 		detail: {
		// 			value: this.moneyaddress
		// 		}
		// 	})
		// }

	},
	
	beforeDestroy() {
	  window.removeEventListener('popstate', this.preventBack);
	},
	methods: {
		// 防止返回键返回上一页面的方法
		preventBack(event) {
		  history.pushState(null, null, document.URL); // 更新当前页面的历史记录
		  event.preventDefault(); // 阻止默认返回行为
		},
		// 关闭弹出层
		closePopuPage(res) {
			this.showPupu = false
			uni.switchTab({
				url: '/pages/index/index'
			})
		},
		addressInput(){
		const value = uni.getStorageSync('token_H5Platform');
			// console.log('143143',value)
					let that = this;
					let params = {
						game_platform_code: uni.getStorageSync('token_H5Platform')
					}; //参数
					that.$api.tokenTimeOut("/merchant/embedSearchMerchant", "POST", params).then(res => {
						
						this.moneyaddress =  res.data.wallet_addr
						// console.log(this.moneyaddress,'res151')
						// console.log(res,'res151')
						// if (true) {
							// console.log(this.moneyaddress,'gameUser160000')
							// 显示二维码
							let that = this;
							let params = {
								wallet_addr: this.moneyaddress
							}; //参数
							that.$api.tokenTimeOut("/merchant/accountInfo", "POST", params).then(res => {
								
								if (res.code == 0) {
									// if(res.data.bc_account !== null) {
									
									this.gameUser = res.data
									console.log(this.gameUser,'gameUser')
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
						// } else {
						// 	// 隐藏二维码
						// 	this.qrcode = false
						// }
						
					})
						
					
		},
		//金额输入
		moneyInput(e) {
			// 输出钱包输入
			
			if (e.target.value > this.myInfo.tradable + this.myInfo.untradable) {
				

				this.$nextTick(function () {
					uni.showToast({
						title: "可出售数量不足！",
						icon: "none",
						duration: 1000
					});
					this.money = this.oldMoney
				})
				return
			}
			this.money = this.money.replace(/^0+/, '').replace(/\./g, '')
			this.oldMoney = e.target.value
		},
		// 检查用户输入的是否正常
		
		interceptSub() {
			
			
			 
			  // 执行按钮点击事件的操作
			 
		
			  
			const pattern = /^[1-9]\d*$/;
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
			} else if (!pattern.test(this.money)) {
				uni.showToast({
					title: "请输入整数！",
					icon: "none",
					duration: 1500
				});
				return
			}
			if (this.myInfo.role !== this.gameUser.role) {
				uni.showToast({
					title: '对方状态与您不符',
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
			this.confirmBuy()
		},
		
		// 输入正在地址
		// addressInput(e) {
			
		
		// returnDate(data) {
		// 	this.moneyaddress = data
		// 	this.addressInput({
		// 		detail: {
		// 			value: this.moneyaddress
		// 		}
		// 	})
		// },
		// setAdd(data) {
		// 	this.moneyaddress = data
		// 	// 获取商户最新信息
		// 	this.addressInput({
		// 		detail: {
		// 			value: this.moneyaddress
		// 		}
		// 	})
		// 	this.$refs.popup.close()
		// },
		// 确认按钮
		confirmBuy() {
			 this.buttonColor='#c1c1c1',
			
			uni.showLoading({
				title: '充值中',
				mask: true, 
			});
			
			setTimeout(() => {
				
				let that = this;
				let data = {
					type: 'trans_pass',
					old_password: this.passWord
				}
				let params = {
					wallet_addr: this.moneyaddress,
					// bc_account: this.userInput.toString(),
					amount: parseInt(this.money),
					trans_pass:this.passWord
				}; //参数
				that.$api.tokenTimeOut("/user/confirmCipher", "POST", data).then(res => {
					if (res.code === 0) {
						that.$api.tokenTimeOut("/merchant/embedTransfer", "POST", params).then(res => {
							uni.hideLoading()
							// 金额初始化
							if (res.code === 0) {
								that.moneyaddress = ''
								that.money = ''
								that.passWord = ''
								that.tipText = res.msg
								that.showPupu = true
								// 数据请求完成后隐藏加载框
								etTimeout(() => {
								     uni.hideLoading();
								}, 2000);
								this.obtMyInfo()
							} else {
								that.money = ''
								that.passWord = ''
							}
							// 刷新个人信息
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						uni.hideLoading()
					}
				})
			}, 500)
				this.buttonColor='#001eca'
			
		},
		obtMyInfo() {
			// 获取个人信息接口
			let that = this;
			that.$api.tokenTimeOut("/user/detail", "GET").then(res => {
				if (res.code == 0) {
					this.myInfo = res.data
					console.log(this.myInfo,'myInfo')
				}
			})
		},
		getMessage() {
			// if (!this.moneyaddress) return uni.showToast({
			// 	title: '请输入商户钱包地址！！',
			// 	icon: "none",
			// 	duration: 1500
			// })
			this.$api.tokenTimeOut("/merchant/contact", "GET").then(res => {
				this.searchInfo = res.data
				
			})
			this.$refs.popup.open('bottom')
		},
	},
}
</script>

<style lang="scss">
page {
	// background-color: #111111;
	height: 100%;
}
uni-toast>>>.uni-mask{
	background: rgba(0,0,0,.5)!important;
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
			font-size: 26rpx;
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
		font-size: 26rpx;
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
			border-bottom: 1rpx solid #cfcdcd;
			margin-top: 30rpx;
			display: flex;
			font-size: 26rpx;
			justify-content: space-between;
			color: #636363;

			.listing_address_input_title {
				width: 190rpx;
				display: flex;
				margin-right: 30rpx;
				color: #cfcdcd;
			}

			input {
				width: 340rpx;
				height: 24rpx;
				font-size: 26rpx;
				color: #000;
			}

			image {
				width: 27rpx;
				height: 27rpx;
			}

			.navigation_arrow {
				width: 0;
				height: 0;
				border: solid #cfcdcd;
				border-width: 0rpx 0px 1px 1rpx;
				display: inline-block;
				padding: 8rpx;
				transform: rotate(-45deg);
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
		// bottom: 185rpx;
		// bottom: 80rpx;
		// transform: translateX(-50%);
		margin: 0 auto;
		// margin-top: 570rpx;
		width: 650rpx;
		height: 60rpx;
		background: #001eca;
		border-radius: 30rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		font-size: 24rpx;
	}
}

.scroll_view {
	background-color: #FFFFFF;
	// width: 710rpx;
	// height: 200rpx;
	border-radius: 15rpx;
	margin-top: 10rpx;

	.merchant_tab_list {
		height: 105rpx;
		display: flex;
		justify-content: space-between;
		box-shadow: 0 2px 5px 0 #0000001A;

		.merchant_tab_list_head {
			width: 125rpx;
			height: 105rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.merchant_tab_list_img {
				width: 70rpx;
				height: 70rpx;
				border-radius: 35rpx;
				overflow: hidden;

				image {
					width: 70rpx;
					height: 70rpx;
				}
			}
		}

		.merchant_tab_list_info {
			// width: 420rpx;
			height: 105rpx;
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;

			.merchant_text_user {
				font-size: 20rpx;
				color: #cecece;

			}

			.merchant_text_address {
				font-size: 16rpx;
				color: #5e5e5e;
				white-space: nowrap;
			}
		}

		.merchant_tab_list_icon {
			width: 166rpx;
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				margin-left: 30rpx;
			}
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
</style>