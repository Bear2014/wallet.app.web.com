<template>
	<view class="setup">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'设置'"></navigation>
		<view class="setup_list">
			<text @tap="setNow">关于我们</text>
			<view>
				<view class="navigation_arrow"></view>
			</view>
		</view>
		<view class="setup_list">
			<text @tap="setNow">清理内存</text>
			<view>
				<view class="navigation_arrow"></view>
			</view>
		</view>
		<view class="bottomBox">
			<view class="bottomReturn" @tap="exit_login">
				<text>退出登录</text>
			</view>
			<view class="version">
				<text>版本号：v{{ version }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: ''
			};
		},
		onLoad() {
			const systemInfo = uni.getAppBaseInfo()
			this.version = systemInfo.appVersion
		},
		methods: {
			exit_login() {
				let that = this
				// 提交修改信息
				that.$api.tokenTimeOut("/user/logout", "GET").then(res => {
					if (res.code == 0) {
						// 加载动画
						uni.showLoading({
						        title: '退出登入'
						    });
						
						setTimeout(()=> {
							try {
								// 1.删除用户token信息
								uni.removeStorageSync('token');
								// 2.删除用户存储信息
								uni.removeStorageSync('user_info_1');
								uni.removeStorageSync('rmd_code');
							} catch (e) {
								// error
							}
							//隐藏加载框
							uni.hideLoading();
							
							 // 3.关闭当前页面，跳转到登入页
							uni.reLaunch({
								url: '/pages/login/login',
							});
							
							//隐藏加载框
							uni.hideLoading();
						}, 1000)
					}
					
				})
			},
			setNow() {
				uni.showToast({
					title: '预留功能！',
					icon: "error",
					duration: 1000
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	.setup {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.bottomBox {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 750rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.bottomReturn {
				width: 700rpx;
				height: 80rpx;
				border-radius: 50rpx;
				background: #001eca;
				color: #fff;
				font-size: 36rpx;
				text-align: center;
				line-height: 80rpx;
				
			}
			.version {
				width: 750rpx;
				height: 140rpx;
				font-size: 16rpx;
				color: #636363;
				text-align: center;
				line-height: 140rpx;
			}
		}
		.setup_list {
			height: 105rpx;
			margin: 0 60rpx;
			border-bottom: 1rpx solid #07070780;
			color: #636363;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			.navigation_arrow {
				width: 0;
				height: 0;
				border: solid #070707;
				border-width: 0rpx 1rpx 1rpx 0rpx;
				display: inline-block;
				padding: 8rpx;
				transform: rotate(-45deg) ;
				-webkit-transform: rotate(-45deg);
			}
		}
	}
</style>