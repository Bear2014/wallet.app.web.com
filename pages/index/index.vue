<template>
	
		
	
	<view class="index_page">
		<view class="changepaw_top_state"></view>
		<view class="index_tools" style="text-align: right;">
			<view class="index_tools_menu">
				<!-- <view>
					<image src="../../static/icons/icon_tongzhi.png" mode=""></image>
					<view>消息</view>
				</view> -->
				<view @tap="goCustomer()" style="margin-left: 20rpx;">
					<image src="../../static/icons/icon_kefu.png" mode=""></image>
					<view>客服</view>
				</view>
			</view>
		</view>
		<!-- <view class="index_top">
			<image src="../../static/icons/icon_tongzhi.png" mode=""></image>
			<image src="../../static/icons/icon_kefu.png" mode=""></image>
		</view> -->
		<view class="index_wallet">
			<!-- <view class="index_wallet_top">
				
			</view> -->
			<view class="index_wallet_head">
				<view class="wallet_head_left">
					<view class="wallet_head_img">
						<image src="../../static/logo.png" mode=""></image>
					</view>
				</view>
				<view class="wallet_head_right">
					<view class="head_right_top">
						<text style="color: #282828;" v-if="userInfo.phone">用户{{userInfo.phone.toString().slice(7, 11)}}</text>
						<!-- <text @tap="goauthentication"  v-if="userInfo.is_identify != 3" style="margin-left: 35rpx; color: #001eca;">请先实名</text>
						<text  v-else style="margin-left: 35rpx; color: #001eca;">已实名</text>
						<image src="../../static/icons/icon_shimin111.png" mode=""></image> -->
						<text @tap="goauthentication"  v-if="userInfo.is_identify != 3" style="margin-left: 35rpx; color: #001eca;">请先实名</text>
						<text  v-else style="margin-left: 35rpx; color: #001eca;">已实名</text>
						<image style="width: 40rpx; height: 40rpx;" v-if="userInfo.is_identify != 3" src="@/static/icons/icon_shimin.png" alt=""></image>
						<image style="width: 40rpx; height: 30rpx;" v-else src="@/static/icons/icon_shimin1.png" alt=""></image>
					</view>
					<view class="head_right_bottom">
						<text class="head_right_text" style="color: #282828;font-weight: bold;">余额</text>
						<text class="head_right_money">{{(userInfo.tradable + userInfo.untradable || 0).toFixed(2) || 0}}</text>
					</view>
				</view>
			</view>
			<view class="index_address">
				<view class="index_address_detail">
					<view class="address_detail_text">
						<text style="margin-left: 15rpx;">钱包地址:</text>
						<text v-if="showAddress" style="margin-left: 95rpx;">{{userInfo.wallet_addr}}</text>
						<text v-else style="margin-left: 95rpx;">{{userInfo.wallet_addr.slice(0,4) + '***************' + userInfo.wallet_addr.slice(16,20)}}</text>
					</view>
					<view class="address_detail_img">
						<image @tap="showAddress = false" v-if="showAddress" src="@/static/icons/eye_1.png" mode=""></image>
						<image @tap="showAddress = true" v-else src="@/static/icons/eye_2.png" mode=""></image>
						<image @tap="copy(userInfo.wallet_addr)" style="width: 26rpx; height: 26rpx;" src="@/static/icons/icon_fuzhi.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="index_balance">
			<view class="index_balance_show">
					<text style="font-size: 24rpx;">可售余额</text>
					<text style="margin-top: 25rpx; font-size: 30rpx; font-weight: 600;">{{(userInfo.tradable || 0).toFixed(2) || 0}}</text>
			</view>
			<view class="index_balance_show">
					<text style="font-size: 24rpx;">不可售</text>
					<text style="margin-top: 25rpx; font-size: 30rpx; font-weight: 600;">{{(userInfo.untradable || 0).toFixed(2) ||0.00}}</text>
			</view>
			<view class="index_balance_show">
					<text style="font-size: 24rpx;">卖单余额</text>
					<text style="margin-top: 25rpx; font-size: 30rpx; font-weight: 600;">0.00</text>
			</view>
			<view class="index_balance_show">
					<text style="font-size: 24rpx;">交易中</text>
					<text style="margin-top: 25rpx; font-size: 30rpx; font-weight: 600;">{{(userInfo.sale || 0).toFixed(2) ||0.00}}</text>
			</view>
		</view>
		<view class="index_buy">
			<view class="index_buy_buy" @tap="getState">
				<image src="@/static/icons/icon_maibi 5.png" mode=""></image>
				<text style="margin-left: 20rpx; font-size: 27rpx;">我要买币</text>
			</view>
			<view class="index_buy_center">
				
			</view>
			<view class="index_buy_sell" @tap="goSellcoins">
				<image src="@/static/icons/icon_maibi_2 5.png" mode=""></image>
				<text style="margin-left: 20rpx; font-size: 27rpx;">我要卖币</text>
			</view>
		</view>
		<view class="index_manage">
			<view class="index_manage_select" @tap="gofasttrack">
				<view class="manage_select_icon" style="background-color: #71C3CB;">
					<image src="@/static/icons/help_center.png" mode=""></image>
				</view>
				<text style="margin-top: 13rpx; font-size: 20rpx;">帮助中心</text>
			</view>
			<view class="index_manage_select" @tap="goWalletre">
				<view class="manage_select_icon" style="background-color: #EF5A6E;">
					<image src="@/static/icons/icon_qianbao.png" mode=""></image>
				</view>
				<text style="margin-top: 13rpx; font-size: 20rpx;">钱包记录</text>
			</view>
			<view class="index_manage_select" @tap="goMerchant">
				<view class="manage_select_icon" style="background-color: #6E71F3">
					<image src="@/static/icons/icon_transfer_to_merchant.png" mode=""></image>
				</view>
				<text style="margin-top: 13rpx; font-size: 20rpx;">充值</text>
			</view>
			<view class="index_manage_select" @tap="goManagePay">
				<view class="manage_select_icon" style="background-color: #F0AB50">
					<image src="@/static/icons/icon_sfggl.png" mode=""></image>
				</view>
				<text style="margin-top: 13rpx; font-size: 20rpx;">收付款管理</text>
			</view>
		</view>
		
		<gbro-marquee broadcastType='text' :broadcast_tit="broadcast_tit" direction="left" :viewHeight="100"
					:broadcastIconIsDisplay="true" :broadcastData='broadcastData' :broadcastStyle='broadcastStyle'
					style="width: 100%">
				</gbro-marquee>
		<view class="index_title">
			<text>我的挂单</text>
			<image v-if="userSellInfo.length" @tap="refresh" src="@/static/icons/refresh.png" />
		</view>
		<swiper style="height: calc(100vh - 900rpx - env(safe-area-inset-bottom));" vertical="true">
			<swiper-item>
				<scroll-view class="index_order" scroll-y="true" scroll-with-animation="true">
					<view class="index_order_any" v-for="(item, index) in userSellInfo" :key="index"
						@tap="goTrans(item)">
						<view class="index_order_detail">
							<view class="order_detail_text">
								<text class="order_detail_text_title">{{item.order_no}}</text>
								<text class="order_detail_text_bottom">挂售时间：{{item.created_at}}</text>
							</view>
							<view class="order_detail_close">
								<text class="order_detail_text_title" v-if="item.sale_status == 'start'"
									@click.stop="orderClose(item.order_no, index)">取消挂单</text>
							</view>
							<view class="order_detail_state">
								<text class="order_detail_state_money">{{item.amount}}</text>
								<text>{{orderType(item.sale_status)}}</text>
							</view>
						</view>
						<view class="index_order_icon">
		
						</view>
					</view>
					<view class="void_box" v-if="userSellInfo.length == 0">
						<image src="@/static/icons/empty_33.png" mode=""></image>
						<!-- <view class="void_box_text">
							<text>空空如也~</text>
						</view> -->
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<bulletBox v-show="showId" @closePopu="closePopuPage"></bulletBox>
		<bulletBoxPay v-show="showPay" @closePopuPay="closePopuPagePay"></bulletBoxPay>
		<uni-popup class="updata-dialog" ref="popup1" type="dialog">
			<uni-popup-dialog title="绑定iPay账号" confirmText="立即绑定" :showClose="false" cancelText="稍候绑定" message="去绑定" :duration="2000"
				:before-close="true" @close="close" @confirm="confirm">
				<view style="display: flex;">请先绑定iPay账号、以便充值提现</view>
			</uni-popup-dialog>
		</uni-popup>
		<!-- <version v-show="isUpload" :versionText="versionText" @closePopuPay="openUpload"></version> -->
		<!-- <web-bom :isColor='pageName'>
		
	</web-bom> -->
	</view>
	
	
</template>

<script>
	import webBomVue from '../../components/web-bom.vue'
	import {formatTime} from '@/common/api/timeConversion.js'
	import gbroMarquee from '@/components/marquee/marquee.vue'
	
	export default {
		components: {
					'gbro-marquee': gbroMarquee,
					'web-bom': webBomVue,
				},
	        data() {
	            return {
					userInfo: {
						wallet_addr:""
					}, // 储存用户信息
					refresher: true, // 开启刷新
					showAddress: false , // 默认不可以查看地址
					userSellInfo: [], // 用户的挂单信息
					showId: false,	// 控制实名提现
					showPay: false, // 控制收款绑定提现
					triggered: false,
					isUpload: false,
					// versionText: ''
					flag: true,
					rechargeUrl: '',
					orderUrl: '',
					pageName: 'home',//传给子组件的值
					broadcast_tit: '系统公告',
					broadcastData: [],
					broadcastStyle: {
										speed: 1, //每秒3个字
										font_size: "26", //字体大小(rpx)
										text_color: "#333", //字体颜色
										back_color: "#F4F3F3", //背景色
									},
	            }
	        },
			onLoad(option) {
				// 第三方对接
				
				// console.log('189',(option.recharge_notify_url !='' && option.create_game_order_url!='') == true);
				// if(option.recharge_notify_url !='' && option.create_game_order_url !='' ){
				// 	this.rechargeUrl = option.recharge_notify_url
				// 	this.orderUrl = option.create_game_order_url
					
				// 	this.getGame()
				// }
				this.getUrlParm()
				if(option.t) {
					
					uni.setStorageSync('token_H5', option.t);
					uni.setStorageSync('token_H5Bc_account', option.bc_account);
					uni.setStorageSync('token_H5GameCode', option.game_platform_code);
					uni.setStorageSync('token_H5Platform', option.game_platform_code);
					console.log('option.t',uni.getStorageSync('token_H5Platform'))
					
				}
			},
			onShow() {
				// 调用获取用户信息函数
				this.obtainUser()
				// 获取用户的挂单
				this.obtainUserSell()
				// 检查版本号
				// this.getVersion()
			},
			computed:{
				// getGame(){
				// let that = this;
				// let params = {
				// 	recharge_notify_url:this.rechargeUrl, 
				// 	create_game_order_url:this.orderUrl, 
				// 	game_platform_code:uni.getStorageSync('token_H5Platform')
				// }; 
				// that.$api.tokenTimeOut("/merchant/embedSaveUrl", "POST",params)
				// },
			    nowTime(){
			      return (time)=>{
			        return formatTime(parseInt(time + '' + '000'), 1)
			      }
			    },
				// 判断订单类型
				orderType() {
					return (type) => {
						// console.log(type);
						switch (type) {
							case 'start':
								return '挂单中'
							case 'trade_ing':
								return '进行中'
							case 'trade_cancel':
								return '订单已被取消,请刷新页面'
							case 'trade_stop':
								return '订单已被暂停,请刷新页面'
							case 'trade_sfinsh':
								return '订单已完成,请刷新页面'
						}
						return '未知'
					}
				}
			},
			methods: {
				getUrlParm(){
				 
				          var pages = getCurrentPages() // 获取栈实例
				                        let currentRoute = pages[pages.length - 1].$route; // 获取当前页面路由
				                        console.log(currentRoute)
				                        let currentPage = pages[pages.length - 1]['$page']['address'] //当前页面路径(带参数)
				                        console.log("哈哈哈哈哈"+currentPage)
				 
				 
				},
				close() {
					this.$nextTick(() => {
						uni.showTabBar()
						this.$refs.popup1.close();
					})
				},
				confirm() {
					uni.showTabBar()
					this.close()
					uni.navigateTo({
						url: '/pages/register/register',
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				refresh() {
					this.obtainUserSell()
				},
				closePopuPagePay(res) {
					
					// 关闭弹出层
					this.showPay = false
				},
				// 关闭弹出层
				closePopuPage(res) {
					
					// 关闭弹出层
					this.showId = false
				},
				// 是否认证实名， 是否绑定支付信息
				isAuthentId() {
					
					if (this.userInfo.is_identify != 3) {
						this.showId = true
						// uni.showToast({
						// 	title: '账号未实名，请先实名！',
						// 	icon: "none",
						// 	duration: 1500
						// });
						return true
					}
				},
				isAuthentPay() {
					if(this.userInfo.payment_bind != 1) {
						// 开启绑定收款提醒
						this.showPay = true
						// uni.showToast({
						// 	title: '账号未绑定收款方式，请先绑定！',
						// 	icon: "none",
						// 	duration: 1500
						// });
						return true
					}
				},
				// 去交易详情页
				goTrans(item) {
					console.log('item', item);
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					if (item.sale_status == 'start') {
						uni.showToast({
							title: '请等待交易！',
							icon: "none",
							duration: 1500
						});
						return
					}
				
					uni.navigateTo({
						url: `/pages/orderPage/orderinfo/orderinfo?order_no=${item.order_no}`,
					});
				},
				flexBox() {
					this.refresher = false 
				},
				// 去钱包记录
				goWalletre() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					uni.navigateTo({
						url: '/pages/indexPage/walletrecords/walletrecords',
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				// 去商户通讯录
				goMerchant() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					uni.navigateTo({
						url: '/pages/indexPage/transaccounts/transaccounts',
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				// 去快速通道
				gofasttrack() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					uni.navigateTo({
						url: '/pages/indexPage/HelpCenter/HelpCenter',
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				// 去卖币
				goSellcoins() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					// 收款判断
					if (this.isAuthentPay()) {
						return
					}
					uni.navigateTo({
						url: '/pages/indexPage/sellcoins/sellcoins',
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				// 获取用户买单状态
				getState() {
					let that = this;
					// this.isState = false // 用户买单状态
					that.$api.tokenTimeOut("/trade/isHasBanBuy", "GET").then(res => {
						
						if (res.code == 50000) {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							});
						}else {
							that.goTrading()
						}
					})
				},
				// 去交易大厅 
				goTrading() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					uni.navigateTo({
						url: `/pages/indexPage/tradingfloor/tradingfloor`,
						animationType: 'pop-in',
						animationDuration: 300
					})
				},
				// 去收付款管理界面
				goManagePay() {
					// 实名判断
					if (this.isAuthentId()) {
						return
					}
					uni.navigateTo({
						url: '/pages/indexPage/managepayments/managepayments',
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
				// 获取用户挂单信息
				obtainUserSell() {
					let that = this;
					uni.showLoading({
						title: '获取挂单中'
					});
					that.$api.tokenTimeOut("/order/v2/saleInDay", "GET").then(res => {
						
						this.triggered = false
						if (res.code == 0) {
							uni.hideLoading()
							this.userSellInfo = res.data.data.filter(res => {
								return res.sale_status == 'start' || res.sale_status == 'trade_ing'
							})
						}
						uni.stopPullDownRefresh()
					})
				},
				goCustomer(){
					uni.navigateTo({
						url: `/pages/indexPage/chatServer/chatServer`
					})
				},
				// 获取用户信息
				obtainUser() {
					this.flag = false
					let params = {
						game_platform_code: uni.getStorageSync('token_H5GameCode')
					}
					let that = this;
					that.$api.tokenTimeOut("/user/embedDetail", "POST",params).then(res => {
						if(res.code == 0) {
							that.broadcastData = [res.data.announcement.content]

							// 更新存储对象
							uni.setStorage({
								key: 'user_info_1_H5',
								data: {
									phone: res.data.phone, //储存用户手机号
									wallet_addr: res.data.wallet_addr, // 存储用户钱包地址
									is_identify: res.data.is_identify, // 状态为0时未实名， 状态为1时，待处理， 2实名中， 3已实名
									payment_bind: res.data.payment_bind // 0,没有绑定   1已绑定
								}
							});
							that.userInfo = res.data //存储用户信息
							// console.log(res.data,'res.data')
							uni.setStorageSync('kefu_H5',res.data);
							// uni.removeStorageSync(rmd_code_H5)
							// if (res.data.rmd_code) {
							// 	uni.setStorageSync('rmd_code_H5', res.data.rmd_code)
							// }
							if (res.data.app_bind === 0) {
								uni.hideTabBar()
								that.$refs.popup1.open()
							}
						}else {
							// 加载动画
							uni.showLoading({
							        title: '加载中'
							    });
							setTimeout(()=> {
								try {
									// 1.删除用户token信息
									uni.removeStorageSync('token');
									// 2.删除用户存储信息
									uni.removeStorageSync('user_info_1');
								} catch (e) {
									// error
								}
								 // 3.关闭当前页面，跳转到登入页
								uni.redirectTo({
									url: '/pages/login/login',
								});
								//隐藏加载框
								uni.hideLoading();
							}, 1000)
							
						}
					})
				},
				// 复制函数
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
				// 取消挂单
				orderClose(id, index) {
					
					// if(!this.flag) {
					// 	return
					// }
					this.flag = false
					let params = {
						order_no: id
					}
					uni.showLoading({
						title: '取消中！！！'
					});
					this.$api.tokenTimeOut("/order/v2/cancelSale", "POST", params).then(res => {
						
						if (res.code === 0) {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1000
							});
							uni.hideLoading()
							this.userSellInfo.splice(index,1)
							this.obtainUser()
							// this.obtainUserSell()
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1000
							});
						}
						this.flag = true
					})
				}
			}
		}
</script>

<style lang="scss" scoped>
	// .out_side{
	// 	padding: 2% 37%;
	// }
	page-meta{
		height: 100%;
		overflow: hidden;
	}
	.index_page {
		.changepaw_top_state {
			height: 1rpx;
			margin: 0 -30rpx;
			padding-top: var(--status-bar-height);
			// background-color: #001eca;
		}
		padding: 0 30rpx;
		overflow: hidden;
		.index_tools{
			margin: 0 -30rpx;
			padding: 0 30rpx;
			height: 234rpx;
			background-color: #001eca;
			border-radius: 10rpx;
			&_menu{
				color: #fff;
				font-size: 18rpx;
				line-height: 20rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 80rpx;
			}
			image {
				width: 36rpx;
				height: 36rpx;
				margin-left: 17rpx;
			}
		}
		// .index_top {
		// 	height: 70rpx;
		// 	display: flex;
		// 	justify-content: flex-end;
		// 	align-items: flex-end;
		// 	margin-top: var(--status-bar-height);
		// 	image {
		// 		width: 40rpx;
		// 		height: 38rpx;
		// 		margin-left: 17rpx;
		// 	}
		// }
		.index_wallet {
			// position: relative;
			border-radius: 20rpx;
			// margin-top: 30rpx;
			margin-top: -150rpx;
			height: 260rpx;
			// background: linear-gradient(to right, #2f2114, #ffc561);
			background-color: #fff;
			.index_wallet_top {
				// position: absolute;
				top: -15rpx;
				left: 95rpx;
				width: 230rpx;
				height: 15rpx;
				background: linear-gradient(to right,#6f4d27 , #ffe07c);
				border-radius:12% / 100% 100% 0 0;;
			}
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
							height: 110rpx;
						}
					}
				}
				.wallet_head_right {
					flex: 1;
					.head_right_top {
						margin-top: 35rpx;
						height: 30rpx;
						font-size: 21rpx;
						line-height: 30rpx;
						display: flex;
						align-items: center;
						image {
							width: 40rpx;
							height: 34rpx;
							margin-left: 8rpx;
						}
					}
					.head_right_bottom {
						height: 40rpx;
						margin: 35rpx 0 20rpx 0;
						display: flex;
						justify-content: space-between;
						line-height: 1;
						.head_right_text {
							font-size: 26rpx;
							margin-left: 13rpx;
						}
						.head_right_money {
							font-size: 40rpx;
							margin-right: 30rpx;
							color: #001eca;
							font-weight: bold;
						}
					}
				}
			}
			.index_address {
				height: 100rpx;
				overflow: hidden;
				.index_address_detail {
					height: 55rpx;
					margin: 22.5rpx 20rpx 0 20rpx;
					border-radius: 20rpx;
					// background: linear-gradient(to left, #d1a55d, #604121, #332315);
					background-color: #F4F3F3;
					overflow: hidden;
					display: flex;
					align-items: center;
					.address_detail_text {
						width: 530rpx;
						height: 55rpx;
						// color: #b9834e;
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
		}
		.index_balance {
			height: 125rpx;
			display: flex;
			.index_balance_show {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				line-height: 1;
				color: #6E6E6E;
			}
		}
		.index_buy {
			height: 85rpx;
			display: flex;
			.index_buy_buy,
			.index_buy_sell {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 15rpx;
				color: #FFFFFF;
				font-size: 28rpx;
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
			.index_buy_buy {
				// background: linear-gradient(#1a1a1a, #121211);
				background: #E87F61;
			}
			.index_buy_sell {
				// background: linear-gradient( #121211, #1a1a1a);
				background: #50AD92;
			}
			.index_buy_center {
				width: 30rpx;
			}
			
		}
		.index_manage {
			height: 165rpx;
			display: flex;
			.index_manage_select {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #797979;
				.manage_select_icon {
					width: 80rpx;
					height: 80rpx;
					// background: linear-gradient(#ffdf7c, #c6802b);
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.index_title {
			background-color: #fff;
			padding: 0 18rpx;
			border-radius: 10rpx 10rpx 0 0;
			border-bottom: 1px solid #E7E5E5;
			display: flex;
			align-items: center;
			justify-content: space-between;
			>text {
				padding-left: 18rpx;
				display: block;
				font-size: 40rpx;
				font-weight: 600;
				line-height: 80rpx;
				color: #585757;
			}
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}
		.index_order {
			height: calc(100vh - 900rpx - env(safe-area-inset-bottom));
			.index_order_any{
				padding: 0 0 0 18rpx;
				height: 96rpx;
				display: flex;
				background-color: #fff;
				width: 100%;
				border-radius: 0 0 10rpx 10rpx;
				.index_order_detail {
					width: 590rpx;
					height: 95rpx;
					display: flex;
					.order_detail_text {
						width: 400rpx;
						height: 95rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						line-height: 1;
						border-bottom: 1px solid #E7E5E5;
						.order_detail_text_title {
							font-size: 22rpx;
							font-weight: 600;
							color: #6B6A6A;
						}
						.order_detail_text_bottom {
							font-size: 18rpx;
							margin-top: 18rpx;
							color: #9F9E9E;
							
						}
					}
					.order_detail_close{
						border-bottom: 1px solid #E7E5E5;
						font-size: 22rpx;
						font-weight: 600;
						color: #6B6A6A;
						height: 100%;
						width: 96rpx;
						line-height: 95rpx;
					}
					.order_detail_state {
						flex: 1;
						display: flex;
						flex-direction: column;
						// background-color: cadetblue;
						justify-content: center;
						align-items: center;
						.order_detail_state_money {
							font-size: 26rpx;
							font-weight: 600;
							color: #001eca;
						}
						text {
							font-size: 21rpx;
							color: #a0a0a0;
						}
					}
				}
				.index_order_icon {
					margin: 41.5rpx 0 0 45rpx ;
					width: 0;
					height: 0;
					border: solid #8b8c8c;
					border-width: 0rpx 1px 1px 0rpx;
					display: inline-block;
					padding: 6rpx;
					transform: rotate(-45deg) ;
					-webkit-transform: rotate(-45deg);
				}
			}
			.void_box {
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