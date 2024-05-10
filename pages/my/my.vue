<template>
	<view class="my_page">
		<view class="my_set">
			<!-- <image @tap="goSetup" src="@/static/icons/icon_settings.png" mode="widthFix"></image> -->
		</view>
		<view class="my_card">
			<view class="index_wallet_head">
				<view class="wallet_head_left">
					<view class="wallet_head_img">
						<image src="../../static/logo.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="wallet_head_right">
					<text style="margin-bottom: 30rpx; font-size: 22rpx;">用户{{ userInfo.phone ? userInfo.phone.toString().slice(7, 11) : '未知号码'}}</text>
					<text style="margin-bottom: 45rpx; font-size: 22rpx;">{{userInfo.phone || '未获取到数据'}}</text>
				</view>
			</view>
			<view v-if="rmd_code" class="walletCode">
				<text>商户推荐码： {{ rmd_code }}</text>
			</view>
			<view class="my_card_address">
				<view class="my_card_text">
					<text style="margin-left: 15rpx;">钱包地址:</text>
					<text v-if="showAddress" style="margin-left: 95rpx;">{{userInfo.wallet_addr}}</text>
					<text v-else style="margin-left: 95rpx;">{{userInfo.wallet_addr ? userInfo.wallet_addr.slice(0,4) + '***************' + userInfo.wallet_addr.slice(16,20) : ''}}</text>
				</view>
				<view class="address_detail_img">
					<image @tap="showAddress = false" v-if="showAddress" src="@/static/icons/eye_1.png" mode=""></image>
					<image @tap="showAddress = true" v-else src="@/static/icons/eye_2.png" mode=""></image>
					<image @tap="copy(userInfo.wallet_addr)" style="width: 26rpx; height: 26rpx;" src="@/static/icons/icon_fuzhi.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="my_card_list">
			<!-- <view class="card_list" @tap="goChangePaw">
				<view class="card_list_left" >
					<view class="list_left_icon">
						<image src="@/static/icons/icon_loginPassword.png" mode="widthFix"></image>
					</view>
					<text>修改登录密码</text>
				</view> 
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view> -->
			<view class="card_list" @tap="goChangePay">
				<view class="card_list_left">
					<view class="list_left_icon">
						<image src="@/static/icons/icon_paymentPassword.png" mode="widthFix"></image>
					</view>
					<text>修改支付密码</text>
				</view>
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view>
			<view class="card_list" @tap="goauthentication">
				<view class="card_list_left">
					<view class="list_left_icon">
						<image src="@/static/icons/icon_authentication.png" mode="widthFix"></image>
					</view>
					<text>实名认证</text>
				</view>
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view>
			<view class="card_list" @tap="goBindIphone">
				<view class="card_list_left">
					<view class="list_left_icon">
						<image src="@/static/icons/bindIphone.png" mode="widthFix"></image>
					</view>
					<text>绑定iPay账号</text>
				</view>
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view>
			<!-- <view class="card_list">
				<view class="card_list_left">
					<view class="list_left_icon">
						<image src="@/static/icons/icon_suggestion.png" mode="widthFix"></image>
					</view>
					<text>意见反馈</text>
				</view>
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view>
			<view class="card_list">
				<view class="card_list_left">
					<view class="list_left_icon">
						<image src="@/static/icons/icon_updates.png" mode="widthFix"></image>
					</view>
					<text>检查更新</text>
				</view>
				<view class="card_list_right">
					<view class="my_arrow" ></view>
				</view>
			</view> -->
			
		</view>
		<!-- <web-bom :isColor='pageName'>
			
		</web-bom> -->
	</view>
</template>

<script>
	import webBomVue from '@/components/web-bom.vue'
	export default {
		components: {
					'web-bom': webBomVue,
				},
		data() {
			return {
				userInfo: {} , //存储用户信息
				showAddress: false , // 默认不可以查看地址
				rmd_code: '',
				pageName: 'me',//传给子组件的值
			};
		},
		onShow() {
			// 获取本地用户基础信息
			this.obtainUser()
			this.rmd_code = uni.getStorageSync('rmd_code_H5')
		},
		methods: {
			// 去设置页
			goSetup() {
				uni.navigateTo({
					url: '/pages/myPage/setup/setup',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			// 去实名认证
			goauthentication() {
				uni.navigateTo({
					url: '/pages/myPage/authentication/authentication',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			goBindIphone() {
				const app_bind = uni.getStorageSync('kefu_H5').app_bind
				if (app_bind !== 0) {
					return uni.showToast({
						title: "账号已绑定！",
						icon: "none",
						duration: 1000
					});
				}
				uni.navigateTo({
					url: '/pages/register/register',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			// 去修改登入密码
			goChangePaw() {
				uni.navigateTo({
					url: '/pages/myPage/changepaw/changepaw',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			goChangePay() {
				uni.navigateTo({
					url: '/pages/myPage/changepay/changepay',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			//获取本地存储用户信息
			obtainUser() {
				try {
					
				    const value = uni.getStorageSync("user_info_1_H5");
				    if(value) {
				        
						this.userInfo = value
				    }
				} catch(e){
				    //错误
					
				}
			},
			// 点击复制按钮
			copy(value) {
			 	uni.setClipboardData({
					showToast: false,
			 	    data: value,
			    	success: function () {
			    	//调用方法成功
			        
					uni.showToast({
						title: "复制成功！",
						icon: "none",
						duration: 1000
					});
			    }
			 	})
			 },
		},
	}
</script>

<style lang="scss">
	page {
		// background: linear-gradient(70deg, #080808, #282828);
	}
	.my_page {
		padding: 0 30rpx;
		.my_set {
			border-radius: 10rpx;
			text-align: right;
			margin: 0 -30rpx;
			padding: 0 30rpx;
			height: 234rpx;
			background-color: #001eca;
			// border-radius: 0 0 10rpx 10rpx;
			padding-top: var(--status-bar-height);
			// height: 100rpx;
			// display: flex;
			// justify-content: flex-end;
			// align-items: center;
			>image {
				margin-top: 30rpx;
				width: 40rpx;
			}
		}
		.my_card {
			position: relative;
			border-radius: 20rpx;
			margin-top: -150rpx;
			padding-bottom: 20rpx;
			// height: 260rpx;
			// background: linear-gradient(to right, #2f2114, #ffc561);
			background-color: #fff;
			box-shadow: 0px 2px 5px 0px #0000001A;
			.index_wallet_head {
				height: 160rpx;
				display: flex;
				.wallet_head_left {
					width: 150rpx;
					display: flex;
					align-items: center;
					.wallet_head_img {
						width: 110rpx;
						height: 110rpx;
						border-radius: 50%;
						margin-left: 30rpx;
						overflow: hidden;
						>image {
							width: 110rpx;
						}
					}
				}
				.wallet_head_right {
					flex: 1;
					display: flex;
					flex-direction: column;
					line-height: 1;
					justify-content: flex-end;
					>text {
						// margin-left: 35rpx;
						color: #282828;
					}
				}
			}
			.walletCode{
				font-size: 24rpx;
				padding-right: 30rpx;
				margin-left: 32rpx;
			}
			.my_card_address {
				height: 55rpx;
				margin: 22.5rpx 20rpx 0 20rpx;
				border-radius: 20rpx;
				background: #F4F3F3;
				overflow: hidden;
				display: flex;
				align-items: center;
				.my_card_text {
					width: 530rpx;
					height: 55rpx;
					color: #5C5B5B;
					text {
						font-size: 21rpx;
					}
				}
				.address_detail_img {
					flex: 1;
					display: flex;
					justify-content: space-around;
					image {
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
		}
		
		.my_card_list {
			// padding: 0 20rpx 0 5rpx;
			padding: 10rpx 20rpx 10rpx 5rpx;
			background-color: #fff;
			margin-top: 20rpx;
			border-radius: 15rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;
			.card_list{
				height: 90rpx;
				display: flex;
				.card_list_left {
					width: 400rpx;
					height: 90rpx;
					display: flex;
					align-items: center;
					.list_left_icon {
						// width: 45rpx;
						// height: 45rpx;
						border-radius: 50%;
						// background:linear-gradient( #4b3119, #332315);
						display: flex;
						justify-content: center;
						align-items: center;
						>image {
							width: 44rpx;
							margin: 0 26rpx
						}
					}
					>text {
						// margin-left: 35rpx;
						font-size: 24rpx;
						color: #5C5B5B;
					}
				}
				.card_list_right {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.my_arrow {
						width: 0;
						height: 0;
						border: solid #8b8c8c;
						margin-right: 35rpx;
						border-width: 0rpx 1px 1px 0rpx;
						display: inline-block;
						padding: 6rpx;
						transform: rotate(-45deg) ;
						-webkit-transform: rotate(-45deg);
					}
				}
			}
		}
	}
</style>