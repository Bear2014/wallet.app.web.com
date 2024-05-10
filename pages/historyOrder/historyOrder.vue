<template>
	<view class="order_page">
		<view class="order_top">
			<navigation  navigationText="订单信息"></navigation>
		</view>
		<view class="order_tab">
			<view class="order_tab_select">
				<view :class="['order_tab_org',org == 0 ?  'tab_org' : '']"  @tap="reOrg(0)">
					<text>买单</text>
				</view>
				<view :class="['order_tab_org',org == 1 ?  'tab_org' : '']" @tap="reOrg(1)">
					<text>卖单</text>
				</view>
			</view>
			<view class="order_tab_screen">
				<view class="order_tab_screen_ord" >
					<text :style="{fontWeight: statics == 1 ? '600' : '500'}" @tap="reStatics(1)">全部</text>
				</view>
				<view class="order_tab_screen_ord">
					<text :style="{fontWeight: statics == 2 ? '600' : '500'}" @tap="reStatics(2)">进行中</text>
				</view>
				<view class="order_tab_screen_ord">
					<text :style="{fontWeight: statics == 3 ? '600' : '500'}" @tap="reStatics(3)">已完成</text>
				</view>
				<view class="order_tab_screen_ord">
					<text :style="{fontWeight: statics == 4 ? '600' : '500'}" @tap="reStatics(4)">已取消</text>
				</view>
			</view>
		</view>
		<swiper class="order_swiper"  :current="org"  :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration" @change="swiperChange" disable-touch="false">
			<swiper-item >
				<view class="swiper_bg" >
					<view class="order_date_select">
						<view class="date_select_show">
							<view class="date_select_show_left">
								<image src="@/static/icons/icon_calendar.png" mode="widthFix"></image>
							</view>
							<view class="date_select_show_right" >
								<text @tap="open">{{selectTime.slice(0, 4) + '年' + selectTime.slice(4, 6) + '月'}}</text>
								<view :class="['navigation_arrow', openShowDate ? 'navigation_arrow2' : '']"></view>
							</view>
						</view>
					</view>
					<view class="order_date_select">
						<view class="date_select_show">
							<view class="date_select_show_left">
								<image src="@/static/icons/icon_search.png" mode="widthFix"></image>
							</view>
							<input v-model="orderNumber" @input="orderInput" type="text" placeholder="请输入搜索的订单号">
						</view>
					</view>
					<scroll-view 
					class="order_scroll" 
					scroll-y="true" 
					@scrolltolower="scrollPage" 
					v-show="showDataPage"
					:refresher-threshold="70"
					:refresher-enabled="true"
					refresher-background="#F4F3F3"
					:refresher-triggered="triggered"
					@refresherrefresh="refreshData(1)">
					<!-- <view v-slot="refresher">
						<loding/>
					</view> -->
					<!-- <template #refresher>
						<loding/>
					</template> -->
						<view class="order_scroll_order" @tap="goOrderInfo(item)" v-for="(item,index) in dataList" :key="index">
							<view class="order_scroll_left">
								<view class="order_scroll_icon">
									<image src="@/static/icons/icon_cancelled_order.png" mode=""></image>
								</view>
							</view>
							<view class="order_scroll_center">
								<text class="scroll_center_order">{{item.order_no}}</text>
								<view class="order_scroll_center_icon">
									<view :class="['order_scroll_center_padding', item.sale_step == '6' ? 'order_scroll_center_padding4' : item.sale_step == '7' ? 'order_scroll_center_padding2' : item.sale_step == '5' ? 'order_scroll_center_padding3' : '']" >
										<text>{{deterStats(item.sale_step)}}</text>
									</view>
									<image v-if="item.pay_type.indexOf('1') != -1" src="@/static/icons/icon_Alipay_order_pagezfb.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('2') != -1" src="@/static/icons/icon_WeChat_order_pagewx.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('3') != -1" src="@/static/icons/icon_UnionPay_bank.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('4') != -1" src="@/static/icons/icon_usdt.png" mode=""></image>
								</view>
								<text class="scroll_center_time">{{nowTime(item.step_1_tm) }}</text>
							</view>
							<view class="order_scroll_right">
								<text>{{item.amount.toFixed(2)}}</text>
							</view>
						</view>
						<view style="height: 10rpx;"></view>
						<view class="void_box" v-if="dataList.length == 0">
							<image src="@/static/icons/empty_33.png" mode=""></image>
							<!-- <view class="void_box_text">
								<text>空空如也~</text>
							</view> -->
						</view>
					</scroll-view>

				</view>
			</swiper-item>
			<swiper-item >
				<view class="swiper_bg" >
					<view class="order_date_select">
						<view class="date_select_show">
							<view class="date_select_show_left">
								<image src="@/static/icons/icon_calendar.png" mode="widthFix"></image>
							</view>
							<view class="date_select_show_right" >
								<text @tap="open">{{selectTime.slice(0, 4) + '年' + selectTime.slice(4, 6) + '月'}}</text>
								<view :class="['navigation_arrow', openShowDate ? 'navigation_arrow2' : '']"></view>
							</view>
						</view>
					</view>
					<view class="order_date_select">
						<view class="date_select_show">
							<view class="date_select_show_left">
								<image src="@/static/icons/icon_search.png" mode="widthFix"></image>
							</view>
							<input v-model="orderNumber" @input="orderInput" type="text" placeholder="请输入搜索的订单号">
						</view>
					</view>
					<scroll-view 
					class="order_scroll" 
					scroll-y="true" 
					@scrolltolower="scrollPage" 
					v-show="showDataPage"
					:refresher-threshold="70"
					:refresher-enabled="true"
					refresher-background="#F4F3F3"
					:refresher-triggered="triggeredTwo"
					@refresherrefresh="refreshData(2)">
					<!-- <view v-slot="refresher">
						<loding/>
					</view> -->

					<!-- <template #refresher>
						<loding/>
					</template> -->
						<view class="order_scroll_order" @tap="goOrderInfo(item)" v-for="(item,index) in dataList" :key="index">
							<view class="order_scroll_left">
								<view class="order_scroll_icon">
									<image src="@/static/icons/icon_cancelled_order.png" mode=""></image>
								</view>
							</view>
							<view class="order_scroll_center">
								<text class="scroll_center_order">{{item.order_no}}</text>
								<view class="order_scroll_center_icon">
									<!-- #ifdef APP-PLUS -->
										<!-- <view class="order_scroll_center_padding">
											<text>进行中</text>
										</view> -->
									<!-- #endif -->
									<!-- #ifdef H5 -->
										<!-- <view :class="['order_scroll_center_padding', item.sale_step == '6' ? 'order_scroll_center_padding4' : item.sale_step == '7' && item.sale_status != 0 ? 'order_scroll_center_padding2' : item.sale_step == '5' ? 'order_scroll_center_padding3' : '']" >
											<text>{{item.sale_step == '7' ? item.sale_status == 0 ? '挂单中' : '取消交易' : deterStats(item.sale_step)}}</text>
										</view> -->
									<!-- #endif -->
									<view :class="['order_scroll_center_padding', item.sale_step == '6' ? 'order_scroll_center_padding4' : item.sale_step == '7' && item.sale_status != 0 ? 'order_scroll_center_padding2' : item.sale_step == '5' ? 'order_scroll_center_padding3' : '']" >
										<text>{{item.sale_step == '7' ? item.sale_status == 0 ? '挂单中' : '取消交易' : deterStats(item.sale_step)}}</text>
									</view>
									<image v-if="item.pay_type.indexOf('1') != -1" src="@/static/icons/icon_Alipay_order_pagezfb.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('2') != -1" src="@/static/icons/icon_WeChat_order_pagewx.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('3') != -1" src="@/static/icons/icon_UnionPay_bank.png" mode=""></image>
									<image v-if="item.pay_type.indexOf('4') != -1" src="@/static/icons/icon_usdt.png" mode=""></image>
								</view>
								<text class="scroll_center_time">{{nowTime(item.sale_tm) }}</text>
							</view>
							<view class="order_scroll_right">
								<text>{{item.amount.toFixed(2)}}</text>
							</view>
						</view>
						<view style="height: 10rpx;"></view>
						<view class="void_box" v-if="dataList.length == 0">
							<image src="@/static/icons/empty_33.png" mode=""></image>
							<!-- <view class="void_box_text">
								<text>空空如也~</text>
							</view> -->
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		<!-- <view class="example_body">
			<uni-datetime-picker     v-model="range" type="daterange" @maskClick="maskClick" />
		</view> -->
		 <uv-datetime-picker ref="datetimePicker" :maxDate="Date.now()" v-model="value" mode="year-month" @confirm="confirm" @close="closeSelect">
		 </uv-datetime-picker>
	</view>
	
</template>

<script>
	import {formatTime} from '@/common/api/timeConversion.js'
	export default {
	        data() {
	            return {
					// range: ['2023-09-1', '2023-9-7'],	// 日期保存
					 background: ['color1', 'color2', 'color3'],
					indicatorDots: false,
					autoplay: false,
					interval: 2000,
					duration: 500,
					org: 0, // 默认页面显示买单页
					statics: 1, // 状态1 = 全部， 2 = 进行中， 3 = 已完成， 4 = 已取消
					value: Number(new Date()),
					openShowDate: false,
					selectTime: '' ,
					dataList: [], // 存储数据
					page: 1, // 显示页数
					flag: true, // 控制是否可以滑到底部继续请求api
					orderNumber: '', // 用户输入的订单号
					showDataPage: false,
					triggered: false, // 控制是否是刷新状态
					triggeredTwo: false, // 控制是否是刷新状态
	            }
	        },
			onLoad() {
				
				this.dataList = []
				this.obtTime() // 获取当前年月
				// this.otpList() // 获取订单列表
			},
			onShow() {
				this.page = 1
				this.flag = true
				this.dataList = []
				this.otpList() // 获取订单列表
				
			},
			onHide() {
				// 隐藏清除数据
				this.page = 1
				this.flag = true
				this.dataList = []
			},
			computed: {
				// 转换时间戳
				nowTime(){
				  return (time)=>{
					  // 
				    return formatTime(parseInt(time + '' + '000') , 1)
				  }
				},
				// 转换订单实际状态
				deterStats() {
					return (step) => {
						if(step == 0) {
							return '挂单中'
						}else if (step <= 4) {
							return '进行中'
						} else if (step == '5') {
							return '暂停中'
						} else if (step == '6') {
							return '已完成'
						} else if (step == '7') {
							return '取消交易'
						} else if (step == '8') {
							return '订单超时'
						}
					} 
				}
			},
			methods: {
				// 下拉刷新被触发
				refreshData(type) {
					
					// 开启下拉刷新样式
					if (type == 1) {
						this.triggered = true
					}else if(type == 2) {
						this.triggeredTwo = true
					}
					this.page = 1
					this.flag = true
					this.dataList = []
					setTimeout(() =>{
						
						// 刷新信息
						this.otpList()
						// 关闭下拉刷新
						if (type == 1) {
							this.triggered = false
						}else if(type == 2) {
							this.triggeredTwo = false
						}
						uni.showToast({
							title: "刷新订单成功！",
							icon: "none",
							duration: 1500
						});
					}, 1000)
				},
				reOrg(type) {
					
					if (this.org == type) {
						return 
					}
					// 初始化数据
					this.page = 1
					this.flag = true
					this.statics = 1
					this.dataList = []
					this.orderNumber = ""
					// 重新获取当前年月
					this.obtTime() // 获取当前年月
					// 切换订单类型
					this.org = type

					// 获取订单列表
					this.otpList()

				},
				// 输入订单号
				orderInput(e) {
					if (e.target.value.length >= 20) {
						// 初始化数据
						this.dataList = []
						// 获取筛选后的数据
						this.otpList()
					} else if (e.target.value.length == 0) {
						// 初始化数据
						this.dataList = []
						// 获取筛选后的数据
						this.otpList()
					}
					
				},
				// 修改筛选状态
				reStatics(states) {
					// 修改订单筛选状态
					this.statics = states
					// 初始化数据
					this.dataList = []
					// 获取筛选后的订单数据
					this.otpList()
				},
				// 获取列表
				otpList() {
					// this.showDataPage = false // 隐藏页面
					uni.showLoading({
					  title: '加载中...',
					  mask: true
					})
					let that = this;
					let params = {
						type: this.statics, // 订单筛选
						ym: this.selectTime, // 订单时间
						page: this.page, // 订单分页
						order_no: this.orderNumber, // 用户输入的订单号
					}; //参数
					// 走买单订单接口
					if (this.org == 0) {
						
						that.$api.tokenTimeOut("/order/buy", "POST", params).then(res => {
							
							if (res.code == 0) {
								// 存储数据
								
								if (res.data.data) {
									that.dataList.push(...res.data.data)
									if (res.data.current_page >= res.data.last_page) {
										this.flag = false // 到最后一页了，不能再请求了
									}
								}else {
									that.dataList = [
										{
											...res.data
										}
									]
									if (JSON.stringify(that.dataList) == '[{}]') {
										that.dataList = []
									}
									
								}
								
							}
							setTimeout(() => {
								uni.hideLoading() // 关闭加载
								this.showDataPage = true // 展示页面
							}, 500)
						})
					} else {		// 走卖单订单接口
						that.$api.tokenTimeOut("/order/sale", "POST", params).then(res => {
							
							if (res.code == 0) {
								// 存储数据
								if (res.data.data) {
									that.dataList.push(...res.data.data)
									if (res.data.current_page >= res.data.last_page) {
										this.flag = false // 到最后一页了，不能再请求了
									}
								}else {
									that.dataList = [
										{
											...res.data
										}
									]
									if (JSON.stringify(that.dataList) == '[{}]') {
										that.dataList = []
									}
								}
							}
							setTimeout(() => {
								uni.hideLoading() // 关闭加载
								this.showDataPage = true // 展示页面
							}, 500)
						})
					}
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
				closeSelect() {
					// 控制指向动画
					this.openShowDate = false
				},
				open() {
					// 打开选择器
					this.$refs.datetimePicker.open();
					// 控制指向动画
					this.openShowDate = true
				},
				confirm(e) {
					
					var time = new Date(e.value)
					var y = time.getFullYear() // 获得年份
					var m = (time.getMonth() + 1) >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)// 获得月份
					this.selectTime = y + '' + m
					//数据初始化， 筛选条件不变
					this.page = 1
					this.dataList = []
					this.flag = true
					// 重新拿数据
					this.otpList()
				},
				// 获取年月
				obtTime() {
					var time = new Date(Date.now())
					var y = time.getFullYear() // 获得年份
					var m = (time.getMonth() + 1) >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)// 获得月份
					this.selectTime = y + '' + m
				},
				// 去订单详情页面
				goOrderInfo(item) {
					if (item.sale_step == 0 || item.sale_status == 0) {
						uni.showToast({
							title: '请等待交易！',
							icon: "none",
							duration: 1500
						});
						return 
					}
					uni.navigateTo({
						 url: `/pages/orderPage/orderinfo/orderinfo?order_no=${item.order_no}&order_no_sale=${item.order_no_sale}&type=${item.type}`,
					});
				},
				//选择器改变
				swiperChange(e) {
					
					this.org = e.detail.current // 将选中类型更换
					// 将订单筛选状态默认 调回全部
					this.statics = 1
				},
				  //打开选择器
				openCalendar2() {
				    this.$refs.calendar2.open()
				},
				// maskClick(e){
				// 	
				// }
			},
		}
</script>

<style lang="scss" scoped>
	page {
		// background-color: #111111;
	}
	.order_page {
		.order_top {
			height: 105rpx;
			background-color: cadetblue;
			line-height: 105rpx;
			text-align: center;
			font-size: 26rpx;
			color: #FFFFFF;
			background-color: #001eca;
			padding-top: var(--status-bar-height);
		}
		.order_tab {
			height: 150rpx;
			background-color: #001eca;
			border-radius: 0 0 10rpx 10rpx;
			.order_tab_select {
				height: 60rpx;
				margin: 0 30rpx;
				background-color: #C0BFBF;
				border-radius: 10rpx;
				display: flex;
				.order_tab_org {
					flex: 1;
					border-radius: 10rpx;
					text-align: center;
					line-height: 60rpx;
					font-size: 26rpx;
					color: #FFFFFF;
					transition: all .2s; 
				}
				.tab_org {
					background-color: #fff;
					color: #363636;
				}
			}
			.order_tab_screen {
				height: 90rpx;
				display: flex;
				.order_tab_screen_ord {
					flex: 1;
					text-align: center;
					line-height: 90rpx;
					font-size: 26rpx;
					color: #fff;
					>text {
						transition: all 0.2s; 
					}
				}
			}
		}
			.order_swiper {
				height:  calc(100vh - 355rpx - env(safe-area-inset-bottom));;
				
				.swiper_bg {
					height:  calc(100vh - 355rpx - env(safe-area-inset-bottom));;
					// background-color: cadetblue;
					display: flex;
					flex-direction: column;
					.order_date_select {
						padding: 0 25rpx;
						margin: 10rpx 0;
						width: 700rpx;
						height: 60rpx;
						.date_select_show {
							height: 58rpx;
							border-radius: 30rpx;
							border: 1px solid #6B6A6A;
							display: flex;
							align-items: center;
							.date_select_show_left {
								display: flex;
								justify-content: flex-end;
								align-items: center;
								height: 58rpx;
								width: 60rpx;
								margin-right: 30rpx;
								>image {
									width: 30rpx;
								}
							}
							.date_select_show_right {
								width: 535rpx;
								height: 58rpx;
								display: flex;
								align-items: center;
								line-height: 1;
								color: #8E8E8E;
								font-size: 24rpx;
								.navigation_arrow {
									border: solid #f6f6f6;
									border-width: 0rpx 0px 1px 1rpx;
									display: inline-block;
									padding: 6rpx;
									margin-left: 30rpx;
									transition: all .3s;
									transform: rotate(-45deg) ;
									-webkit-transform: rotate(-45deg);
								}
								.navigation_arrow2 {
									transform: rotate(135deg) ;
									-webkit-transform: rotate(135deg);
								}
							}
							>input {
								font-size: 26rpx;
								color: #fff
							}
						}
					}
					.order_scroll {
						width: 750rpx;
						height:  calc(100vh - 495rpx - env(safe-area-inset-bottom));;
						.order_scroll_order {
							width: 700rpx;
							height: 100rpx;
							margin: 10rpx 25rpx;
							background-color: #fff;
							border-radius: 10rpx;
							display: flex;
							box-shadow: 0px 1px 4px 0px #00000040;
							.order_scroll_left {
								width: 95rpx;
								height: 100rpx;
								display: flex;
								justify-content: flex-end;
								align-items: center;
								.order_scroll_icon {
									width: 40rpx;
									height: 40rpx;
									background-color: #cb690b;
									border-radius: 10rpx;
									display: flex;
									justify-content: center;
									align-items: center;
									>image {
										width: 25rpx;
										height: 25rpx;
									}
								}
							}
							.order_scroll_center {
								flex: 1;
								padding-left: 20rpx;
								display: flex;
								flex-direction: column;
								justify-content: space-around;
								.scroll_center_order {
									font-size: 26rpx;
									color: #414141;
									line-height: 1;
								}
								.order_scroll_center_icon {
									width: 300rpx;
									height: 25rpx;
									display: flex;
									.order_scroll_center_padding {
										height: 25rpx;
										padding: 0 5rpx;
										border-radius: 6rpx;
										background-color: #d49d46;
										text-align: center;
										line-height: 25rpx;
										font-size: 20rpx;
										color: #e4e4e4;
										margin-right: 5rpx;
										
									}
									.order_scroll_center_padding2 {
										background-color: #626262;
									}
									.order_scroll_center_padding3 {
										background-color: red;
									}
									.order_scroll_center_padding4 {
										background-color: limegreen;
									}
									>image {
										width: 25rpx;
										height: 25rpx;
										margin: 0 5rpx;
									}
								}
								.scroll_center_time {
									font-size: 24rpx;
									color: #626262;
									line-height: 1;
								}
							}
							.order_scroll_right {
								width: 155rpx;
								height: 100rpx;
								font-size: 32rpx;
								font-weight: 600;
								line-height: 100rpx;
								color: #001eca;
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

			}
		
		// .example_body {
		// 	width: auto;
		// 	margin: 0 25rpx;
		// 	font-size: 24rpx;
		// }
		
	}
</style>