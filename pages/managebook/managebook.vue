<template>
	<view class="merchant">
		<view class="changepaw_top_state"></view>
		<view class="navigationTitle">
			<text>商户通讯录</text>
			<view class="merchant_add" @tap="addFriends = !addFriends">
				<image src="@/static/icons/icon_merchant_add.png" mode=""></image>
			</view>
		</view>
		<view class="merchant_search" v-if="addFriends">
			<view class="merchant_search_frame">
				<view class="merchant_search_icon">
					<image src="@/static/icons/icon_search.png" mode="widthFix"></image>
				</view>
				<input type="text" placeholder="请输入商户编号或钱包地址查询" v-model="search">
			</view>
			<view class="merchant_search_but" @tap="clickSearch">
				<text>搜索</text>
			</view>
		</view>
		<view class="merchant_search_title" v-if="searchInfo.is_friend == 1 && addFriends">
			<text  class="merchant_search_title_text" >对方已是好友</text>
		</view>
		<view class="merchant_search_info" v-if="addFriends">
			
			<view class="merchant_search_left">

				<view class="merchant_search_left_info" >
					<view class="merchant_search_left_title">
						<text>商户编号</text>
					</view>
					<text>{{searchInfo.merchant_code}}</text>
				</view>
				<view class="merchant_search_left_info" >
					<view class="merchant_search_left_title">
						<text>钱包地址</text>
					</view>
					<text>{{searchInfo.wallet_addr}}</text>
				</view>
				<!-- <view class="merchant_search_left_info">
					<view class="merchant_search_left_title">
						<text>商户二维码</text>
					</view>
					<image v-if="searchInfo.wallet_addr !== ''" src="@/static/icons/icon_QR code_merchant.png" mode="widthFix"></image>
				</view> -->
				<!-- <view class="merchant_search_left_info" v-if="searchInfo.wallet_addr !== ''">
					<view class="merchant_search_left_title" style="color: red;">
						<text>游戏账号</text>
					</view>
					<input type="text" v-model="inputAccount" class="inputgame">
				</view> -->
			</view>
			<view class="merchant_search_right">
				<image v-if="searchInfo.wallet_addr == ''"  src="@/static/icons/icon_add friend_gray_merchant.png" mode="widthFix"></image>
				<!-- <image v-else @tap="addFriendsSub(searchInfo.id, true)" src="@/static/icons/icon_add friend_gray_merchant.png" mode="widthFix"></image> -->
				<image v-else @tap="addFriendsSub(searchInfo.id, true)" src="@/static/icons/icon_add friend_gray_merchant.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="merchant_tab">
			<view @tap="selectPage(0)" :class="['merchant_tab_text', select == 0 ? 'merchant_tab_text2' : '']">
				<text>最近</text>
			</view>
			<view @tap="selectPage(1)" :class="['merchant_tab_text', select == 1 ? 'merchant_tab_text2' : '']">
				<text>好友</text>
			</view>
		</view>
		<swiper @touchstart="addFriends = false" :style="{height: `calc(100vh - ${scrollHeight})`}" class="merchant_swiper"  :current="select"  :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration" disable-touch="false" >
			<swiper-item >
				<scroll-view class="scroll_y" :style="{height: `calc(100vh - ${scrollHeight})`}" scroll-y="true">
					<scroll-view class="merchant_swiper_scroll" scroll-x="true" v-for="item in lastList" :key="item.id">
						<view class="scroll_view">
							<view class="merchant_tab_list" scroll-x="true">
								<view class="merchant_tab_list_head">
									<view class="merchant_tab_list_img">
										<!-- <image src="../../../static/logo.png" mode=""></image> -->
										<image src="@/static/logo.png" mode=""></image>
									</view>
								</view>
								<view class="merchant_tab_list_info">
									<text class="merchant_text_user">{{item.merchant_code}}</text>
									<text class="merchant_text_address">钱包地址：{{item.wallet_addr}}</text>
								</view>
								<view class="merchant_tab_list_icon">
									<image @tap="transAccounts(item)" src="@/static/icons/icon_transfer_merchant.png" mode="widthFix"></image>
									<image v-if="item.is_friend == 0" @tap="addFriendsSub(item.id, false)" src="@/static/icons/icon_add friend_merchant.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
						
					</scroll-view>
					<view class="void_box" v-if="lastList.length == 0">
						<image src="@/static/icons/empty_33.png" mode=""></image>
						<!-- <view class="void_box_text">
							<text>空空如也~</text>
						</view> -->
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item >
				<scroll-view class="scroll_y" :style="{height: `calc(100vh - ${scrollHeight})`}" scroll-y="true">
					<scroll-view class="merchant_swiper_scroll" scroll-x="true" v-for="item in friendsList" :key="item.id">
						<view class="scroll_view">
							<view class="merchant_tab_list" scroll-x="true">
								<view class="merchant_tab_list_head">
									<view class="merchant_tab_list_img">
										<image src="@/static/logo.png" mode=""></image>
									</view>
								</view>
								<view class="merchant_tab_list_info">
									<text class="merchant_text_user">{{item.merchant_code}}</text>
									<text class="merchant_text_address">钱包地址：{{item.wallet_addr}}</text>
								</view>
								<view class="merchant_tab_list_icon">
									<image @tap="transAccounts(item)" src="@/static/icons/icon_transfer_merchant.png" mode="widthFix"></image>
									<image @tap="delFriends(item)" src="@/static/icons/icon_delf.png" mode="widthFix"></image>
								</view>
							</view>
						</view>
						
					</scroll-view>
					<view class="void_box" v-if="friendsList.length == 0">
						<image src="@/static/icons/empty_33.png" mode=""></image>
						<!-- <view class="void_box_text">
							<text>空空如也~</text>
						</view> -->
					</view>
				</scroll-view>
				
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setScrollHeight() {
					let height =  this.addFriends? '700rpx' : '180rpx' 
					return {height: `calc(100vh - ${height} - env(safe-area-inset-bottom))`}
				},
				background: ['color1', 'color2', 'color3'],
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				select: 1, //0是最近页， 1是好友页
				addFriends: false, // 展示加好友面板
				friendsList: [], // 朋友列表
				lastList: [], //最近列表
				scrollHeight: '380rpx',
				search: '',	// 搜索
				searchInfo: {
					id: '',
					merchant_code: '',
					wallet_addr: ''
				}, //搜索出来在信息
				inputAccount: null, // 玩家游戏账号
			}
		},
		watch: {
			addFriends(newVal, oldVal) {
				this.scrollHeight =  this.addFriends? '700rpx' : '380rpx'
			}
		},
		onLoad() {
			// 获取好友列表
			this.friends()
		},
		methods: {
			// 点击转账
			transAccounts(item) {
				
				uni.navigateTo({
					url:'/pages/indexPage/transaccounts/transaccounts?walletAddr=' + item.wallet_addr
				})
			},
			// 添加好友按钮
			addFriendsSub(id, type) {
				
				let that = this;
				let params = {
					merchant_id: id		,//商户id
					bc_account: this.inputAccount
				}; //参数
				if (!type) {
					params = {
						merchant_id: id
					}
				}
				// }else {
				// 	var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
				// 	if(this.inputAccount == null || this.inputAccount == '' || !reg.test(this.inputAccount)) {
				// 		uni.showToast({
				// 			title: '请输入正确的游戏账号',
				// 			icon: "none",
				// 			duration: 1000
				// 		});
				// 		return
				// 	}
				// }
				that.$api.tokenTimeOut("/merchant/addContact", "POST", params).then(res => {
					this.search = ''
					for ( let i in this.searchInfo ) {
						this.searchInfo[i] = ''
					}
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1000
					});
					// 刷新最近好友
					if(that.select == 0) {
						that.lastFriends()
					} else {
						that.friends()
					}
				})
			},
			// 提交搜索
			clickSearch() {
				if(this.search != '' ) {
					this.inputAccount = null
					let that = this;
					let params = {
						addr_code: this.search
					}; //参数
					that.$api.tokenTimeOut("/merchant/search", "POST", params).then(res => {
						if (res.code !== 0) {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1000
							});
							that.searchInfo = {
								merchant_code: '',
								wallet_addr: '',
								id: ''
							}
							return
						}
						if (res.data.is_friend == 1) {
							that.inputAccount = res.data.bc_account
							uni.showToast({
								title: '对方已是好友！',
								icon: "none",
								duration: 1000
							});
						}
						
						that.searchInfo = res.data
						
					})
				}
			},
			selectPage(e) {
				this.select = e
				if (e == 0) {
					// 获取最近好友
					this.lastFriends()
				}else {
					// 获取好友列表
					this.friends()
				}
			},
			friends() {
				// 获取用户好友列表
				let that = this;
				that.$api.tokenTimeOut("/merchant/contact", "GET").then(res => {
					that.friendsList = res.data
				})

				
			},
			lastFriends() {
				// 获取到最近好友
				let that = this;
				that.$api.tokenTimeOut("/merchant/lastestLog", "GET").then(res => {
					that.lastList = res.data
					
				})
			},
			delFriends(item) {
				let params = {
					merchant_id: item.id
				}
				this.$api.tokenTimeOut("/merchant/delContact", "POST", params).then(res => {
					if (res.code === 0) {
						uni.showToast({
							title: '删除成功!',
							icon: "none",
							duration: 1000
						});
						this.friends()
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F3F3;
	}
	.merchant {
		.navigationTitle {
			position: relative;
			height: 100rpx;
			background-color: #001eca;
			text-align: center;
			font-size: 24rpx;
			color: #FFFFFF;
			line-height: 105rpx;
			.merchant_add {
				position: absolute;
				top: 32rpx ;
				right: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.merchant_search {
			height: 110rpx;
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			transition: all .3s; 
			.merchant_search_frame {
				width: 555rpx;
				height: 60rpx;
				// border: 1rpx solid #2b2b2b;
				background-color: #D9D9D9;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				.merchant_search_icon {
					width: 80rpx;
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						width: 25rpx;
					}
				}
				input {
					width: 450rpx;
					height: 24rpx;
					font-size: 24rpx;
					color: #5e5e5e;
				}
			}
			.merchant_search_but {
				width: 135rpx;
				height: 60rpx;
				background-color: #001eca;
				border-radius: 30rpx;
				color: #fff;
				font-size: 24rpx;
				text-align: center;
				line-height: 60rpx;
			}
		}
		.merchant_search_title {
			width: 710rpx;
			height: 50rpx;
			background-color: #F4F3F3;
			text-align: center;
			line-height: 50rpx;
			font-size: 24rpx;
			.merchant_search_title_text {
				color: red;
			}
		}
		.merchant_search_info {
			position: relative;
			height: 160rpx;
			margin: 50rpx 20rpx;
			padding: 20rpx 0;
			padding-right: 20rpx;
			background-color: #1a1a1a;
			border-radius: 15rpx;
			display: flex;
			transition: all .3s;
			
			margin: 0 20rpx;
			background-color: #fff;
			border-radius: 15rpx;
			display: flex;
			transition: all .3s;
			box-shadow: 0 2px 5px 0 #0000001A;
			.merchant_search_left {
				width: 590rpx;
				height: 160rpx;
				padding: 0 50rpx;
				display: flex;
				flex-direction: column;
				.merchant_search_left_info {
					flex: 1;
					border-bottom: 1rpx solid #07070780;
					display: flex;
					font-size: 22rpx;
					color: #cecece;
					align-items: center;
					.merchant_search_left_title {
						width: 195rpx;
						font-size: 22rpx;
						color: #cecece;
					}
					image {
						width: 25rpx;
					}
					.inputgame {
						font-size: 22rpx;
						color: red;
					}
				}
			}
			.merchant_search_right {
				width: 120rpx;
				height: 160rpx;
				background-color: #001eca;
				border-radius: 0 15rpx 15rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 45rpx;
				}
			}
		}
		.merchant_tab {
			height: 85rpx;
			padding-left: 20rpx;
			display: flex;
			
			.merchant_tab_text {
				width: 120rpx;
				height: 85rpx;
				text-align: center;
				line-height: 85rpx;
				font-size: 24rpx;
				color: #636363;
			}
			.merchant_tab_text2 {
				color: #001eca;
			}
		}
		.merchant_swiper {
			// height: calc(100vh - 700rpx - env(safe-area-inset-bottom));
			padding: 0 20rpx;
			.scroll_y {
				// height: calc(100vh - 700rpx - env(safe-area-inset-bottom));
				.merchant_swiper_scroll {
					// height: 105rpx;
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
								.merchant_text_user{
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
								display: flex;
								align-items: center;
								image {
									width: 40rpx;
									margin-right: 30rpx;
								}
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
			}
			
			
		}
	}
</style>