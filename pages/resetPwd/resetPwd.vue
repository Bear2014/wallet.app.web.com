<template>
	<view class="login">
		<view class="changepaw_top_state"></view>
		<view class="navigation_arrow" @click="goBack">
		</view>
		<view class="login_log">
			<view class="login_log_img">
				<image src="@/static/iPay.png" mode=""></image>
			</view>
		</view>
		<view class="login_information_bg">
			<view class="login_information">
				<view class="login_user">
					<image style="width: 30rpx;" src="../../static/icons/icon_phone.png" mode="widthFix"></image>
					<input @input="phoneInput"  type="number" v-model="user.phone" placeholder="输入手机号" maxlength="11">
				</view>
				<view class="login_code">
					<input @input="codeInput" maxlength="5" class="login_code_input" v-model="user.code" type="text" placeholder="输入验证码">
					<view class="login_code_picture" @tap="obtionCode">
						<image v-if="strongCode" :src="strongCode.img" mode=""></image>
					</view>
				</view>
				<view class="login_code">
					<input class="login_code_input" v-model="user.phoneCode" type="text" placeholder="输入短信验证码">
					<!-- <text @tap="obtionPhoneCode"  :class="lockCode ? '' : 'lock'">获取短信验证码</text> -->
					<button :class="['custom-button', isButtonDisabled ? 'active' : '']" :disabled="isButtonDisabled" @tap="obtionPhoneCode">发送短信 <span v-if="isButtonDisabled" style="margin-left: 10rpx;">{{ times }}</span></button>
				</view>
				<view class="login_user">
					<image src="../../static/icons/icon_lock.png" mode="widthFix"></image>
					<input type="text" v-model="user.paw" :password="!lookPassword" placeholder="输入密码" maxlength="20">
					<image v-if="lookPassword" @tap="lookPassword = !lookPassword" class="look" src="../../static/icons/eye_1.png" mode="widthFix" ></image>
					<image v-else class="look" @tap="lookPassword = !lookPassword" src="../../static/icons/eye_2.png" mode="widthFix" ></image>
				</view>
				<view class="login_user">
					<image src="../../static/icons/icon_lock.png" mode="widthFix"></image>
					<input type="text" v-model="user.rePaw" :password="!lookPassword" placeholder="再次输入密码">
					<image v-if="lookPassword" @tap="lookPassword = !lookPassword" class="look" src="../../static/icons/eye_1.png" mode="widthFix" ></image>
					<image v-else @tap="lookPassword = !lookPassword" class="look" src="../../static/icons/eye_2.png" mode="widthFix" ></image>
				</view>
				
			</view>
		</view>
		
	
		<view class="register" @tap="inspectSub">
			<text>重置</text>
		</view>
		
	</view>
</template>

<script>
	export default {
			data() {
				return {
					lookPassword: false, // 是否查看密码
					strongCode: null, //存储获取到的验证码信息
					lockCode: false, // 控制获取验证码
					user: {
						phone: "", // 用户填写的手机号
						code: "",  // 用户填写的验证码
						phoneCode: "", // 用户填写的短信验证码
						paw: "", // 用户填写的密码
						rePaw: "" // 用户再次填写密码
					},
					isButtonDisabled: false,
					times: 60,
					timer: null,
				}
			},
			onLoad() {
				this.obtionCode()
			},
			methods: {
				// 检查用户名的输入
				phoneInput(o) {
					
					if(o.detail.value.length == 11 &&  this.user.code.length >= 4) {
						this.lockCode = true  // 解锁 获取验证码高亮显示
					}else {
						this.lockCode = false
					}
				},
				// 检查短信验证码的输入
				codeInput(o) {
					
					if(o.detail.value.length >= 4 &&  this.user.phone.length == 11) {
						this.lockCode = true  // 解锁 获取验证码高亮显示
					}else {
						this.lockCode = false
					}
				},
				obtionCode() {
					let that = this
					
					that.$api.tokenTimeOut("/captcha","GET").then(res => {
						
						// 拿到验证码
						this.strongCode = res.data
					})
				},
				// 获取短信验证码
				obtionPhoneCode() {
					// 判断用户是否输入手机号
					if(this.user.phone.length < 11) {
						uni.showToast({
							title: "请输入完整手机号！",
							icon: "none",
							duration: 1500
						});
						return
						
					}else if(this.user.code.length < 4) { // 判断用户是否输入验证码
						uni.showToast({
							title: "请先输入验证码！",
							icon: "none",
							duration: 1500
						});
						return
					}
					
					
					let that = this
					let params = {
						phone: this.user.phone, // 用户手机号
						captcha: this.user.code, // 用户填写的防机器人验证码
						captcha_key: this.strongCode.key // 防机器人验证码Key
					}
					// 请求获取短信验证码 
					that.$api.tokenTimeOut("/sendSms", "POST", params).then(res => {
						
						if(res.code == 0) {
							uni.showToast({
								title: "验证码已发送！",
								icon: "none",
								duration: 1500
							});
							this.timer = setInterval(() => {
								this.isButtonDisabled = true
								if (this.times < 1) {
									this.times = 60
									this.isButtonDisabled = false
									clearInterval(this.timer)
								} else {
									this.times--
								}
							}, 1000)
							// uni.showToast({
							// 	title: "验证码是“" + res.data.sms_code + "”",
							// 	icon: "none",
							// 	duration: 3000
							// });
						}else {
							this.obtionCode()
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							});
						}
					})
				},
				// 注册提交，拦截检测函数
				inspectSub() {
					let reg =  /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/
					// 用户没有填写手机号 和 密码的情况下
					if(!this.user.phone && !this.user.paw) {
						uni.showToast({
							title: "请填写注册信息！",
							icon: "none",
							duration: 1500
						});
						return
					}else if(this.user.phone.length < 11) {
						uni.showToast({
							title: "请填写完整手机号！",
							icon: "none",
							duration: 1500
						});
						return 
					}else if(this.user.paw.length < 8) {
						uni.showToast({
							title: "密码不得小于8位！",
							icon: "none",
							duration: 1500
						});
						return 
					}else if(!reg.test(this.user.paw)){
						uni.showToast({
							title: "至少包含数字、字母和特殊字符",
							icon: "none",
							duration: 1500
						});
						return 
					}else if(this.user.paw != this.user.rePaw){
						uni.showToast({
							title: "密码输入不一致！",
							icon: "none",
							duration: 1500
						});
						return 
					}else if(!this.user.phoneCode) {
						uni.showToast({
							title: "请输入短信验证码！",
							icon: "none",
							duration: 1500
						});
						return 
					}
					// 调用注册函数
					this.subRegistration()
				},
				// 提交注册按钮
				subRegistration() {
					let that = this
					let params = {
						phone: this.user.phone, // 用户填写的手机号
						sms_code: this.user.phoneCode, //用户填写的短信验证码
						password: this.user.paw, // 用户填写的密码
						confirm_password: this.user.rePaw, // 用户再次确认的密码
						gender: 1
					}
					// 显示加载动画
					uni.showLoading({
					        title: '加载中'
					    });
					// 请求注册接口
					
					that.$api.tokenTimeOut("/resetPwd", "POST", params).then(res => {
						
						if(res.code == 0) {
							// 1.提示注册成功
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 500
							});
							// 2.关闭当前页面，0.5秒后跳转到登入页
							setTimeout(() => {
								//3.隐藏加载框
								uni.hideLoading();
								// 跳转登入页面
								uni.redirectTo({
									url: `/pages/login/login`,
								});
								
							}, 500)
						}else {
							// 1.提示错误信息
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1000
							});
							// 用户填写数据清空
							this.user = {
								phone: "",
								code: "",
								phoneCode: "",
								paw: "",
								rePaw: ""
							}
						}
					})
				},
				goBack() {
					
					const pages = getCurrentPages()
					// 有可返回的页面则直接返回，uni.navigateBack  默认返回失败之后会自动刷新页面 ，无法继续返回
					if (pages.length > 1) {
						uni.navigateBack(1)
						return;
					}
					// vue router 可以返回uni.navigateBack失败的页面 但是会重新加载 
					let a = this.$router.go(-1)
					// router.go失败之后则重定向到首页 
					if (a == undefined) {
						uni.reLaunch({
						url: "/pages/login/login"
					})
					}
				}
				
			},
			beforeDestroy() {
				clearInterval(this.timer)
			}
		}
</script>

<style lang="scss">
	.login {
		height: 100vh;
		padding: 0rpx 50rpx 0 50rpx;
		// background: linear-gradient(70deg, #080808, #282728);
		.navigation_arrow {
			z-index: 111111;
			position: absolute;
			top: var(--status-bar-height);
			left: 50rpx;
			border: solid #001eca;
			border-width: 1px 0px 0px 1px;
			display: inline-block;
			padding: 12rpx;
			transform: rotate(-45deg) ;
			-webkit-transform: rotate(-45deg);
		}
		// .changepaw_top_state {
		// 	height: 1rpx;
		// 	padding-top: var(--status-bar-height);
		// 	// background-color: #001eca;
		// }
		.login_log {
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			height: 600rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.login_log_img {
				width: 462rpx;
				height: 400rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 415.8rpx;
					height: 200rpx;
				}
			}
		}
		.login_information_bg {
			width: 100%;
			height: 410rpx;
			border-radius: 50rpx;
			display: flex;
			justify-content: center;
			.login_information {
				height: 410rpx;
				border-radius: 50rpx;
				// background-color: $uni-bg-color;
				>view {
					width: 100%;
					height: 80rpx;
					// background-color: #ba965e;
					display: flex;
					align-items: flex-end;
					border-bottom: 1px solid #070707B2;
					line-height: 1;
					>image {
						width: 30rpx;
						margin: 0 30rpx 20rpx 30rpx ;
					}
					>input {
						width: 470rpx;
						height: 45rpx;
						font-size: 22rpx;
						color: #000;
						margin-bottom: 10rpx;
					}
					.look {
						width: 35rpx;
						margin-bottom: 20rpx;
					}
				}
				.login_code {
						border: 0;
						border-bottom: 1px solid #070707B2;
						justify-content: space-between !important;
						// align-items: center !important;
					.login_code_input {
						margin-left: 30rpx;
						width: 250rpx !important;
					}
					.active{
						opacity: .7;
					}
					.custom-button{
						margin: 0;
						font-size: 24rpx;
						color: #fff;
						background-color: #001eca;
						margin-bottom: 10rpx;
						margin-right: 32rpx;
					}
					.custom-button::after{
						border: none !important;
					}
					.login_code_picture {
						margin-right: 30rpx;
						width: 130rpx;
						height: 80rpx;
						// background-color: #e7b66e;
						display: flex;
						align-items: center;
						image {
							width: 130rpx;
							height: 70rpx;
						}
					}
					>text {
						line-height: 80rpx;
						margin-right: 30rpx;
						font-size: 22rpx;
						font-weight: bold;
						color: #001eca;
					}
					.lock {
						color: #8E8E8E;
					}
				}
			}
		}
		
		.register {
			width: 655rpx;
			height: 60rpx;
			margin-top: 90rpx;
			border-radius: 43rpx;
			background: #001eca;
			font-size: 26rpx;
			line-height: 60rpx;
			color: #fff;
			text-align: center;
		}
		
	}
</style>