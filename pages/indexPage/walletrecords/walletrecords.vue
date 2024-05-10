<template>
	<view class="walletre">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'钱包记录'"></navigation>
		<view class="select_time">
			<view class="select_icon_time" @tap="open">
				<image src="@/static/icons/icon_calendar_time.png" mode=""></image>
			</view>
			<text @tap="open">{{selectTime.slice(0, 4) + '年' + selectTime.slice(4, 6) + '月'}}</text>
		</view>
		<scroll-view class="walletre_scroll" scroll-y="true" @scrolltolower="scrollPage">
			<view class="walletre_order" v-for="item in dataList" :key="item.id" @tap="lookDetail(item)">
				<view class="walletre_order_number">
					<text>订单编号：{{item.order_no}}</text>
					<image @tap.stop="copy(item.order_no)" src="@/static/icons/icon_copy.png" mode="heightFix"></image>
				</view>
				<view class="walletre_box">
					<view class="walletre_box_time">
						<text>创建时间：{{item.created_at}}</text>
						<text>完成时间：{{item.updated_at}}</text>
						<text>订单类型：{{orderType(item.type)}}</text>
					</view>
					<view class="walletre_box_money">
						<view class="ok_money" v-if="tradable(item.before_tradable, item.after_tradable)">
							<text>可售余额：</text><text :class="['money',tradable(item.before_untradable, item.after_untradable) ? '': 'money_size',  item.before_tradable < item.after_tradable ? 'money_color':'' ]">{{item.before_tradable < item.after_tradable ? '+':''}}{{(item.after_tradable - item.before_tradable).toFixed(2)}}</text>
						</view>
						<view class="ok_money" v-if="tradable(item.before_untradable, item.after_untradable)">
							<text>不可售余额：</text><text :class="['money',tradable(item.before_tradable, item.after_tradable) ? '': 'money_size', item.before_untradable < item.after_untradable ? 'money_color':'' ]">{{item.before_untradable < item.after_untradable ? '+':''}}{{(item.after_untradable - item.before_untradable).toFixed(2)}}</text>
						</view>
						<view class="residue">
							<text>可交易余额:{{item.after_tradable}}</text><text style="margin-left: 10rpx;"> 不可交易余额:{{item.after_untradable}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="void_box" v-if="dataList.length == 0">
				<image src="@/static/icons/empty_33.png" mode=""></image>
				<!-- <view class="void_box_text">
					<text>空空如也~</text>
				</view> -->
			</view>
		</scroll-view>
		<uv-datetime-picker ref="datetimePicker" :maxDate="Date.now()" v-model="value" mode="year-month" @confirm="confirm">
		</uv-datetime-picker>
	</view>
</template>

<script>
	import {formatTime} from '@/common/api/timeConversion.js'
	export default {
		data() {
			return {
				dataList: [],
				page: 1,
				flag: true, // 控制是否可以滑到底部继续请求api
				value: Number(new Date()),
				selectTime: '' ,
			}
		},
		onLoad() {
			this.obtTime() // 获取当前年月
			this.otpList() // 获取列表页面
		},
		computed:{
		    nowTime(){
		      return (time)=>{
		        return formatTime(+new Date(time), 1)
		      }
		    },
			// 判断订单类型
			orderType() {
				return (type) => {
					switch (type) {
						case 1: return '交易大厅买'
						case 2: return '交易大厅卖'
						case 3: return '财务给商户转账'
						case 4: return '快速交易买'
						case 5: return '用户给商户转账'
						case 6: return '商户给用户转账'
						case 7: return '财务给玩家转账'
						case 8: return '后台运营卖单'
						case 9: return '后台运营买单'
						case 10: return '取消交易-交易大厅卖'
						case 11: return '财务向老板申请加币'
						case 12: return '商户向财务转账'
						case 13: return '手续费-用户向商户转账'
						case 14: return '手续费-商户向用户转账'
						case 15: return '手续费-商户向财务转账'
						case 16: return '商户向商户转账'
						case 17: return '手续费-商户向商户转账'
						case 18: return '搬砖奖励'
						case 19: return '游戏充值订单'
						case 20: return '游戏提现订单'
						case 21: return '系统给用户加减币'
					}
					return '未知'
				}
			},
			// 看看是否余额改变
			tradable() {
				return (before, after) => {
					if (before == after) {
						// 没有改变
						return false
					}
					// 改变了
					return true
				}
			}
		},
		methods: {
			open() {
				this.$refs.datetimePicker.open();
			},
			confirm(e) {
				
				var time = new Date(e.value)
				var y = time.getFullYear() // 获得年份
				var m = (time.getMonth() + 1) >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)// 获得月份
				this.selectTime = y + '' + m
				// 数据初始化
				this.dataList = []
				this.page = 1
				this.flag = true
				this.otpList()
			},
			lookDetail(item) {
				// 暂时不跳转， 全部注释，代码保留
				
				// const orderData = {
				// 	data:{
				// 		order_no: item.order_no,
				// 		order_type: item.type,
				// 		order_ym: item.created_at.slice(0, 4) + item.created_at.slice(5, 7)
				// 	}
				// }
				// // 跳转到快速订单
				// if(item.type == 4) {
				// 	
				// 	uni.navigateTo({
				// 		 url: `/pages/indexPage/fasttrackdetail/fasttrackdetail?item=${encodeURIComponent(JSON.stringify(orderData))}`,
				// 	});
				// } else if(item.type == 5 || item.type == 6 || item.type == 7) {
				// 	
				// 	uni.navigateTo({
				// 		 url: `/pages/indexPage/walletredetail/walletredetail?item=${encodeURIComponent(JSON.stringify(orderData))}`,
				// 	});
				// }
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
			// 滑动到底部
			scrollPage () {
				
				if (this.flag) {
					this.page = this.page + 1
					this.otpList()
				}else {
					uni.showToast({
						title: "已经到底啦！",
						icon: "none",
						duration: 1500
					});
				}
			},
			// 获取年月
			obtTime() {
				var time = new Date(Date.now())
				var y = time.getFullYear() // 获得年份
				var m = (time.getMonth() + 1) >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)// 获得月份
				this.selectTime = y + '' + m
			},
			// 获取钱包记录列表
			otpList() {
				uni.showLoading({
				  title: '加载中...',
				  mask: true
				})
				let that = this;
				let params = {
					page: this.page,
					ym: this.selectTime
				}; //参数
				that.$api.tokenTimeOut("/wallet/log", "POST", params).then(res => {
					
					if (res.data != null) {
						that.dataList.push(...res.data.data)
						if (res.data.current_page >= res.data.last_page) {
							this.flag = false // 到最后一页了，不能再请求了
						}
						// 
					}
					uni.hideLoading()

				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	.walletre{
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.select_time {
			height: 50rpx;
			background-color: #001eca;
			padding: 0 30rpx;
			font-size: 24rpx;
			color: #fff;
			line-height: 50rpx;
			display: flex;
			align-items: center;
			.select_icon_time {
				width: 30rpx;
				height: 30rpx;
				display: flex;
				margin-right: 10rpx;
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		.walletre_scroll {
			width: 100%;
			height: calc(100vh - 150rpx - env(safe-area-inset-bottom));;
			.walletre_order {
				// height: 190rpx;
				background-color: #fff;
				margin: 15rpx 30rpx;
				border-radius: 15rpx;
				padding: 0 25rpx 20rpx 25rpx;
				display: flex;
				flex-direction: column;
				box-shadow: 0px 2px 5px 0px #0000001A;
				.walletre_order_number {
					height: 60rpx;
					display: flex;
					align-items: flex-end;
					>text {
						font-size: 24rpx;
						color: #636363;
						line-height: 27rpx;
					}
					>image {
						margin-left: 15rpx;
						height: 27rpx;
					}
				}
				.walletre_box {
					flex: 1;
					display: flex;
					margin-top: 20rpx;
					.walletre_box_time {
						width: 350rpx;
						height: 100%;
						display: flex;
						flex-direction: column;
						font-size: 20rpx;
						white-space:nowrap;
						// justify-content: flex-end;
						color: #636363;
					}
					.walletre_box_money {
						width: 290rpx;
						flex: 1;
						display: flex;
						flex-direction: column;
						// justify-content: flex-end;
						align-items: flex-end;
						.ok_money {
							font-size: 22rpx;
							color: #636363;
							.money {
								font-size: 24rpx;
								font-weight: 600;
								color: #636363;
							}
							.money_color {
								color: #d8a047;
							}
							.money_size {
								font-size: 32rpx;
							}
						}
						.residue {
							margin-top: 20rpx;
							color: #636363;
							font-size: 18rpx;
							white-space:nowrap;
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
					font-size: 26rpx;
					line-height: 30rpx;
					color: #c6c6c6
				}
			}
		}
	}
</style>