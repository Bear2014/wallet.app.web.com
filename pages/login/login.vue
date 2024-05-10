<template>
	<view class="login" :style="{ 'margin-top': marginTop + 'px' }">
		<view class="changepaw_top_state"></view>
		<view class="login_log">
			<!-- <view class="login_lang">
				<image src="../../static/icons/icon_lang.png" mode="widthFix"></image>
				<text>Language</text>
			</view> -->
			<view class="login_log_img">
				<image src="@/static/iPay.png" mode=""></image>
			</view>
		</view>
		<view class="login_information">
			<view class="login_user">
				<image src="../../static/icons/icon_my_bottom_right.png" mode="widthFix"></image>
				<input id="input1" confirm-type="next" class="focus" type="number" @blur="blur" @focus="($event) => focus($event, 'input1')"
					@input="fpNumInput" placeholder="请输入账号" maxlength="11" v-model="user.name">
				<input class="clearFlicker" />
			</view>
			<view class="login_user">
				<image src="../../static/icons/icon_lock.png" mode="widthFix"></image>
				<input id="input2" confirm-type="done" :password="!lookPassword" @blur="blur" @focus="($event) => focus($event, 'input2')"
					placeholder="输入密码" maxlength="20"  v-model="user.password">
				<image v-if="lookPassword" @tap="lookPassword = !lookPassword" class="look"
					src="../../static/icons/eye_1.png" mode="widthFix"></image>
				<image v-else class="look" @tap="lookPassword = !lookPassword" src="../../static/icons/eye_2.png"
					mode="widthFix"></image>
			</view>
			<view class="login_select">

				<text @click="goTo()">在线客服</text>
				<text @click="goToResetPwd">忘记密码</text>
			</view>

		</view>

		<view class="login_but" @tap="gologin">
			<text>登入</text>
		</view>
		<view class="go_register">
			<text @tap="goRegister">注册</text>
		</view>
		<version v-show="isUpload" :versionText="versionText" @closePopuPay="openUpload"></version>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lookPassword: false, // 是否查看密码
				user: {
					name: null, // 账号
					password: null // 密码
				},
				marginTop: 0,
				windowHeight: 0,
				cid: '',
				isUpload: false,
				versionText: '',
				platform: '',
				devices_model: ''
			}
		},
		onLoad() {
			
			uni.getSystemInfo({
				success(res) {
					this.devices_model = res.brand + '-' + res.model
				}
			})
			let that = this
			// 1.获取用户token 直接进入首页
			uni.getStorage({
				key: 'token',
				success: function(res) {

					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			});
			uni.getStorage({
				key: 'password_key',
				success: function(res) {

					that.user.password = res.data // 保存密码
				}
			})
			//获取存储值
			// const value = uni.getStorageSync('storage_key');
			uni.getStorage({
				key: 'user_info_1',
				success: function(res) {
					// 
					that.user.name = res.data.phone
				}
			})
		},
		onShow() {
			this.getVersion()
		},
		methods: {
			getVersion() {
				const systemInfo = uni.getAppBaseInfo()
				// #ifdef H5
				const appWgtVersion = systemInfo.appVersion 
				// #endif
			
				// #ifdef APP-PLUS || MP
				const appWgtVersion = systemInfo.appWgtVersion
				let that = this
				uni.request({
					// url: 'http://16.163.94.68:10006/api/version.json',  // 测试服
					url: 'http://18.167.42.12:10006/api/version.json',  // 正式服
					method: 'GET',
					success(res) {
						const { data } = res
						if (data.version != appWgtVersion) {
							that.versionText = data.desc[0]
							that.isUpload = true
							// uni.hideTabBar()
						}
					}
				})
				// #endif
				// that.$api.getVersion('/version.json', 'GET').then(res => {
				
				// })
			},
			openUpload() {
				// #ifdef APP-PLUS || MP
				this.isUpload = false
				// uni.showTabBar()
				plus.runtime.openURL('https://www.ipay22.com');
				// #endif
			},
			focus(e, dom) {
				// let that = this
				// const height = uni.getSystemInfoSync().windowHeight
				// const liuhai = uni.getSystemInfoSync().safeArea.top
				// const keyHeight = e.detail.height
				// this.marginTop = keyHeight / 2
				// const query = uni.createSelectorQuery().in(that);
				// query
				// 	.select(`#${dom}`)
				// 	.boundingClientRect((data) => {
				// 		// this.marginTop = keyHeight - 100
				// 		const isTrue = height - data.bottom - keyHeight - liuhai
				// 		console.log(data.height)
				// 		// if (isTrue > 0) {
				// 			// this.marginTop = isTrue - data.height
				// 		// }
				// 	})
				// 	.exec();
			},
			blur() {
				this.marginTop = 0 
			},
			goTo() {
				uni.navigateTo({
					url: `/pages/indexPage/chatServer/chatServer`
				})
				// this.$api.WSRequest('/v1/guest/guestAll', 'GET').then(res => {
				// 	let kefulist = res.data.admin
				// 	let wanjialist = res.data.guest

				// 	uni.navigateTo({
				// 		url: '/pages/indexPage/customer/customer?niname=' + wanjialist[0].nickname +
				// 			'&niid=' + wanjialist[0].user_no + '&xxid=' + kefulist[0].user_no +
				// 			'&xxname=' + kefulist[0].nickname,
				// 	})
				// }).catch(err => {

				// 	uni.showToast({
				// 		title: err.msg || '暂未找到客服'
				// 	})
				// })
			},
			// 限制手机号输入的数据
			fpNumInput(e) {
				const o = e.target;
				const inputRule = /[^\d]/g //修改inputRule 的值
				this.$nextTick(function() {
					this.user.name = o.value.replace(inputRule, '');
				})
			},
			// 限制密码输入的数据 
			// fpNumInputPaw(e) {
			// 	const o = e.target;
			// 	const inputRule =/[^\w.]/g  //修改inputRule 的值
			// 	this.$nextTick(function() {
			// 		this.user.password = o.value.replace(inputRule , '');
			// 	})
			// },
			gologin() {
				if (!this.user.name && !this.user.password) {
					uni.showToast({
						title: "请输入账号和密码",
						icon: "none",
						duration: 2000
					});
					return false
				} else if (!this.user.name) {
					uni.showToast({
						title: "请输入账号",
						icon: "none",
						duration: 2000
					});
					return false
				} else if (!this.user.password) {
					uni.showToast({
						title: "请输入密码",
						icon: "none",
						duration: 2000
					});
					return false
				} else if (this.user.name.length < 11) {
					uni.showToast({
						title: "请输入有效账号",
						icon: "none",
						duration: 2000
					});
					return
				} else if (this.user.password.length < 8) {
					uni.showToast({
						title: "请输入有效密码！",
						icon: "none",
						duration: 2000
					});
					return
				}
				let that = this;

				uni.getSystemInfo({
					success: (res) => {
						this.platform = res.platform
					}
				});
				let params = {
					phone: this.user.name,
					password: this.user.password,
					cid: this.cid,
					devices: this.platform,
					devices_model: this.devices_model,
				}; //参数

				// #ifdef APP-PLUS
				uni.getStorage({
					key: 'cid',
					success: function(res) {
						params.cid = res.data;

						that.toLogin(params);
						return res.data;
					},
					fail() {
						that.toLogin(params);
					}
				});
				// #endif
				// #ifdef H5
				this.toLogin(params);
				// #endif


			},
			goRegister() {
				uni.navigateTo({
					url: "/pages/register/register",
				});
			},
			goToResetPwd() {
				uni.navigateTo({
					url: "/pages/resetPwd/resetPwd",
				});
			},

			toLogin(params) {
				this.$api.tokenTimeOut("/login", "POST", params, this.tokens).then(res => {

					if (res.code == 0) {
						// 存储用户 token 到本地
						uni.setStorage({
							// bearer_token: res.data.bearer_token,
							key: 'token',
							data: res.data.bearer_token,
							success: function() {

							}
						});
						//存储对象
						uni.setStorage({
							key: 'user_info_1',
							data: {
								phone: res.data.user_info.phone, //储存用户手机号
								wallet_addr: res.data.user_info.wallet_addr, // 存储用户钱包地址
							}
						});
						// 进入首页
						uni.switchTab({
							url: '/pages/index/index'
						});
						// 未能成功拿到数据
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}

				});
			}
		}
	}
</script>

<style lang="scss">
	.login {
		// // margin-top: -200rpx;
		// height: 100vh;
		padding: 0rpx 50rpx 0 50rpx;
		background-color: #F4F3F3;
		overflow: hidden;
		color: #636363;

		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			// background-color: #001eca;
		}

		.login_log {
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			height: 600rpx;
			display: flex;
			justify-content: center;
			align-items: flex-end;

			.login_lang {
				position: absolute;
				top: 5rpx;
				right: 0;
				width: 100rpx;
				height: 75rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 28rpx;
					height: 28rpx;
				}

				text {
					font-size: 18rpx;
					color: #001eca;

				}
			}

			.login_log_img {
				width: 462rpx;
				height: 400rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 438rpx;
					height: 200rpx;
				}
			}
		}

		.login_information {
			height: 242rpx;
			margin-top: 165rpx;
			// background-color: $uni-bg-color;
			>view {
				width: 100%;
				height: 80rpx;
				// background-color: #ba965e;
				display: flex;
				align-items: flex-end;
				// border-bottom: #2d2d2b solid 1rpx;
				border-bottom: 1px solid #070707B2;
				line-height: 1;

				>image {
					width: 30rpx;
					margin: 0 30rpx 20rpx 30rpx;
				}

				>input {
					width: 470rpx;
					height: 44rpx;
					font-size: 22rpx;
					margin-bottom: 10rpx;
				}

				.look {
					width: 35rpx;
					margin-bottom: 20rpx;
				}
			}


			.login_select {
				width: 570rpx;
				height: 80rpx;
				// background-color: #ba965e;
				justify-content: space-between;
				padding: 0 35rpx 0 20rpx;
				font-size: 24rpx;
				border: 0;
			}

			.clearFlicker{
				height: 0 !important;
				width: 0 !important;
				min-height: 0 !important;
				overflow: hidden !important;
			}
		}

		.login_but {
			width: 655rpx;
			height: 60rpx;
			margin-top: 50rpx;
			border-radius: 43rpx;
			background: #001eca;
			color: #fff;
			font-size: 26rpx;
			line-height: 60rpx;
			text-align: center;
		}

		.go_register {
			width: 100%;
			height: 55rpx;
			color: #001eca;
			font-size: 22rpx;
			display: flex;
			line-height: 1;
			justify-content: flex-end;
			align-items: flex-end;
		}
	}
</style>