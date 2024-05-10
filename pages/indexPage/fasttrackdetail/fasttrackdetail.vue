<template>
	<view class="fasttrackdetail">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'订单详情'"></navigation>
		<view class="order">
			<view class="orderinfo">
				<view class="orderlist">
					<text class="ordertext">订单号</text>
					<text class="ordernumber">{{dataList.order_no}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">商户</text>
					<text class="ordernumber">{{dataList.payee}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">游戏账号</text>
					<text class="ordernumber">{{dataList.bc_account}}</text>
				</view>
				<view class="orderlist" style="border-bottom: 1rpx solid #222222; height: 25rpx;"></view>
				<view class="orderlist">
					<text class="ordertext">付款金额</text>
					<text class="ordernumber">{{dataList.pay_amount}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">手续费</text>
					<text class="ordernumber">{{dataList.fee}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">到账数量</text>
					<text class="ordernumber">{{dataList.charge_amount}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">创建时间</text>
					<text class="ordernumber">{{dataList.created_at}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">更新时间</text>
					<text class="ordernumber">{{dataList.updated_at}}</text>
				</view>
			</view>
			<view class="orderinfo" v-if="dataList.pay_res == 0">
				<view class="orderlist">
					<text class="ordertext">银行卡类型</text>
					<text class="ordernumber">{{bankType(dataList.pay_card_type)}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">开户人姓名</text>
					<text class="ordernumber">{{dataList.pay_card_account}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">银行卡号</text>
					<text class="ordernumber">{{dataList.pay_card_number}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">开户行号</text>
					<text class="ordernumber">{{dataList.pay_card_ifsc || ''}}</text>
				</view>
				<view class="orderlist">
					<text class="ordertext">开户行地址</text>
					<text class="ordernumber">{{dataList.pay_card_location}}</text>
				</view>
			</view>
			<view class="orderinfo" v-if="dataList.pay_res == 0">
				<view class="orderlist">
					<text class="ordertext">上传支付成功截图</text>
					<text class="ordernumber"> </text>
				</view>
				<view class="orderimg" @tap="upbank">
					<image v-if="showScreen == ''" src="@/static/icons/icon_Payment receipt.png" mode="heightFix"></image>
					<image v-else @click="previewImg(newShowScreen)" :src="newShowScreen" mode="heightFix"></image>
				</view>
				<view class="orderUp" @tap="upbank">
					<text v-if="showScreen == ''">上传支付凭证 {{getHMS(textTimeCount)}}</text>
					<text v-if="showScreen != '' && dataList.img_url == null">重新上传 {{textTimeCount}}</text>
					<text v-if="dataList.img_url != null">请耐心等待，订单正在审核！</text>
				</view>
			</view>
			<view class="submitorder" v-if="dataList.pay_res == 0 && dataList.img_url == null">
				<view @tap="subOrder" :class="['submitorder_ok', showScreen == '' ? '' : 'submitorder_ok_2']">
					<text>已上传凭证提交订单 </text>
				</view>
				<view class="submitorder_close" @tap="cancelTrans(false)">
					<text>取消</text>
				</view>
			</view>
			<view v-if="dataList.pay_res == 1" class="orderTip" style="color: red;">
				订单被暂停交易，请联系客服！
			</view>
			<view v-if="dataList.pay_res == 2" class="orderTip" style="color: #787878;">
				未付款！
			</view>
			<view v-if="dataList.pay_res == 3" class="orderTip" style="color: #41a863;">
				订单已完成
			</view>
			<view v-if="dataList.pay_res == 4" class="orderTip" style="color: #787878;">
				已取消交易！
			</view>
			<view v-if="dataList.pay_res == 5" class="orderTip" style="color: red;">
				无可用卡，终止交易，请联系客服！
			</view>
			<view v-if="dataList.pay_res == 6" class="orderTip" style="color: #787878;">
				支付超时！
			</view>
		</view>
	</view>
</template>

<script>
	import backData from '@/common/bank'
	// import {getHMS} from '@/common/api/timeConversion.js'
	export default {
		data() {
			return {
				dataInfo: {}, // 存储跳转传递来的信息
				dataList: {}, // 存储订单信息
				user: {
					screenshot: '', // 用户提供的截图
				},
				showScreen: '', // 展示用户截图
				newShowScreen: "", // 缩略图
				textTimeCount: 0, // 剩余时间 
				timeCount: {}, // 存储倒计时
			}
		},
		onLoad(option) {
			//开启加载
			const item = JSON.parse(decodeURIComponent(option.item));
			
			// 接下来就是你需要该对象数据做些什么，当然这里你可以直接赋值给data绑定的数据
			this.dataInfo = item.data;
			
			// 获取数据
			this.obtOrderInfo()
		},
		computed: {
			// 获取银行名称
			bankType() {
				return (res) => {
					return backData[res]
				}
			}
		},
		methods: {
			// 提交订单
			subOrder() {
				if (this.showScreen == '') {
					uni.showToast({
						title: '请上传支付截图！',
						icon: "none",
						duration: 1500
					});
					return
				}
				let that = this;
				let params = {
					order_no: this.dataList.order_no,
					img_url: this.showScreen
				}; //参数
				that.$api.tokenTimeOut("/quickTrade/saveQuickTradePaidImg", "POST", params).then(res => {
					// 清除定时器
					clearInterval(that.timeCount)
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1500
					});
				})
				this.obtOrderInfo()
			},
			// 取消交易
			cancelTrans(type) {
				
				let that = this;
				let params = {
					order_no: this.dataList.order_no,
					handle_type: type ? '6' : '4'
				}; //参数
				that.$api.tokenTimeOut("/quickTrade/cancelDeal", "POST", params).then(res => {
					
					if (res.code == 0) {
						clearInterval(this.timeCount)
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 刷新订单状态
						this.obtOrderInfo()
					}
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1500
					});
				})
			},
			// 上传银行卡凭证截图
			upbank() {
				// // #ifdef H5
				// uni.showToast({
				// 	title: "请使用APP端绑定",
				// 	icon: "none",
				// 	duration: 1500
				// });
				// return 
				// // #endif
				let that = this
				uni.chooseImage({
						count: 1, //最多可以选择的图片张数，默认9
						sourceType: ['album'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
						sizeType: ['original'],//original 原图，compressed 压缩图，默认二者都有
						success(res) {
							that.user.screenshot = res.tempFilePaths[0];  // 用于上传的地址，保存这个完整的地址
							// let strList = res.tempFilePaths[0].split('\"')
							//   strList = strList[0].split('file:\/\/') 
							 
							// that.showScreen = strList[1];  // 用户展示用户二维码的图片
							
							// #ifdef H5
							let url = res.tempFiles[0].name   //域名
							// #endif
							// #ifdef APP-PLUS || MP
							let url = res.tempFiles[0].path
							// #endif
							let index = url.lastIndexOf(".");
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg" && jpgUrl != "gif" && jpgUrl != "JPG" && jpgUrl != "JPEG" && jpgUrl != "PNG" && jpgUrl != "GIF" && jpgUrl != "HEIC" && jpgUrl != "heic") {
								uni.showToast({
									icon: "none",
									title: "请上传格式为jpg,png,jpeg,gif"
								});
							} else {
								that.upPicture(res.tempFilePaths[0])
							}
						},
						fail() {
							
						},
					})
			},
			// 图片预览
			previewImg(url) {
				const arr = [url]
				uni.previewImage({
					current: 0,
					urls: arr
				});
			},
			// 上传图片到服务器
			upPicture(address) {
				let that = this
				let params = {
					upload_type: 'transfer-bank', // 上传类型
					file: address // 上传的图片地址
				}; //参数
				that.$api.tokenTimeOut("/uploadImg", "POST", params).then(res => {
					const {code, data} = JSON.parse(res) 
					
					// 存储用户上传的图片，服务器传过来的截图

					if (code == 0) {
						that.showScreen = data.url
						that.newShowScreen = data.thumb_url
						
						uni.showToast({
							title: '成功上传截图！',
							icon: "none",
							duration: 1500
						});
						return
					}
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1500
					});
				})
			},
			countdown(item) {
				// 先清除定时器
				clearInterval(this.timeCount)
				
				if (item.pay_res == 0) {
					// let time = parseInt(new Date().getTime() / 1000) + '';//获取10位时间戳
					let orderTime = new Date(item.created_at).getTime() / 1000 // 订单创建时间
					let time = item.sys_tm;//获取10位时间戳
					
			
					if(time - orderTime <=  item.process_time) {
						// 存储剩余时间
						this.textTimeCount =  item.process_time - (time - orderTime)
						this.timeCount = setInterval(() => {
							
							this.textTimeCount -= 1
							if(this.textTimeCount <= 0) {
								// 取消交易接口
								this.cancelTrans(true)
								clearInterval(this.timeCount)
							}
						}, 1000)
					}else {
						this.textTimeCount = 0
						// // 取消交易接口
						this.cancelTrans(true)
					}
					
			
					
				}
			
			},
			obtOrderInfo() {
				uni.showLoading({
				  title: '加载中...',
				  mask: true
				})
				let that = this;
				let params = {
					order_no: this.dataInfo.order_no,
					order_type: JSON.stringify(this.dataInfo.order_type),
				}; //参数
				that.$api.tokenTimeOut("/wallet/orderDetail", "POST", params).then(res => {
					
					if (res.code == 0) {
						// 存储订单详细数据
						this.dataList = res.data
						if (this.dataList.img_url == null) {
							// 开启倒计时
							this.countdown(this.dataList)
						}else {
							this.showScreen = this.dataList.img_url
						}
						
							uni.hideLoading()
					}
				})
			},
			// 根据秒数转换成对应的时分秒
			getHMS(time) {
			  const hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600)
			  const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
			  const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
			  return hour + ':' + min + ':' + sec
			  }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #111111;
	}
	.fasttrackdetail {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.order {
			padding: 25rpx 30rpx 0 30rpx;
			.orderTip {
				height: 60rpx;
				// background-color: cadetblue;
				font-size: 30rpx;
				line-height: 60rpx;
				text-align: center;
				color: #fff;
			}
			.orderinfo {
				padding:0 25rpx 25rpx 25rpx;
				background-color: #161616;
				border-radius: 8rpx;
				margin-bottom: 25rpx;
				.orderlist {
					height: 50rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.ordertext {
						font-size: 24rpx;
						color: #cdcdcd;
					}
					.ordernumber {
						font-size: 20rpx;
						color: #d3d3d3;
					}
				}
				.orderimg {
					height: 220rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						height: 165rpx;
					}
				}
				.orderUp {
					text-align: center;
					color: #dea549;
					font-size: 24rpx;
				}
			}
			.submitorder {
				height: 60rpx;
				display: flex;
				justify-content: center;
				font-size: 24rpx;
				color: #d3d3d3;
				text-align: center;
				line-height: 60rpx;
				.submitorder_ok {
					width: 300rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background-color: #a58a56;
					margin-right: 15rpx;
				}
				.submitorder_ok_2 {
					background: linear-gradient( #ffdf7c, #c27e2a);
					color: #fff;
				}
				.submitorder_close {
					width: 150rpx;
					height: 60rpx;
					background-color: #322f2a;
					border-radius: 30rpx;
				}
			}
		}
	}
</style>