<template>
	<view class="orderinfo">
		<view class="changepaw_top_state">
			<view @tap="goCustomer()" class="orderinfo_trade">
				<image src="@/static/icons/icon_information.png"></image>
				<text>交易纠纷</text>
			</view>
		</view>
		<navigation :to="to" navigationText="订单信息"></navigation>

		<scroll-view scroll-y="true" refresher-enabled="true" refresher-background="#F4F3F3"
			:refresher-triggered="triggered" @refresherrefresh="refreshData" :refresher-threshold="70">
			<!-- <template #refresher>
      <loding/>
    </template> -->

			<view class="orderinfo_card">
				<view class="orderinfo_card_text">
					<view class="orderinfo_card_left">
						<text v-if="orderInfo.progress == 5">已暂停</text>
						<text v-else-if="orderInfo.progress == 6">已完成</text>
						<text v-else-if="orderInfo.progress == 7">已取消</text>
						<text v-else>进行中</text>
					</view>
				</view>
				<view class="orderinfo_card_number">
					<text class="orderinfo_card_number_text">出售数量</text>
					<text class="orderinfo_card_number_money">{{orderInfo.amount}}</text>
				</view>
				<view class="orderinfo_card_address">
					<text style="font-size: 20rpx;">订单号</text>
					<text>{{orderInfo.order_no}}</text>
					<image @tap="copy(orderInfo.order_no)" src="@/static/icons/icon_copy.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="orderinfo_step">
				<view class="orderinfo_step_title">
					<text>交易进度: {{getHMS(textTimeCount)}}</text>
				</view>
				<view class="orderinfo_step_info">
					<view class="orderinfo_step_line">
						<view style="margin-left: 30rpx;"
							:class="['orderinfo_step_line_view',orderInfo.progress2_time ? 'orderinfo_step_line_view2' : '']">
						</view>
						<view
							:class="['orderinfo_step_line_view',orderInfo.progress3_time ? 'orderinfo_step_line_view2' : '']">
						</view>
						<view
							:class="['orderinfo_step_line_view',orderInfo.progress4_time ? 'orderinfo_step_line_view2' : '']">
						</view>
						<!-- <view :class="['orderinfo_step_line_view',orderInfo.progress4_time ? 'orderinfo_step_line_view2' : '']"></view> -->
						<view class="orderinfo_step_line_box">
							<text class="orderinfo_step_line_get">发起订单</text>
							<view
								:class="['orderinfo_step_line_round',orderInfo.progress1_time ? 'orderinfo_step_line_round2' : '']">

							</view>
							<text v-if="orderInfo.progress1_time"
								class="orderinfo_step_line_moon">{{getLastNChars(orderInfo.progress1_time)}}</text>
						</view>
						<view class="orderinfo_step_line_box orderinfo_step_line_box2">
							<text class="orderinfo_step_line_get">卖家确认</text>
							<view
								:class="['orderinfo_step_line_round',orderInfo.progress2_time ? 'orderinfo_step_line_round2' : '']">

							</view>
							<text v-if="orderInfo.progress2_time"
								class="orderinfo_step_line_moon">{{getLastNChars(orderInfo.progress2_time)}}</text>
						</view>
						<view class="orderinfo_step_line_box orderinfo_step_line_box3">
							<text class="orderinfo_step_line_get">买家已转账</text>
							<view
								:class="['orderinfo_step_line_round',orderInfo.progress3_time ? 'orderinfo_step_line_round2' : '']">

							</view>
							<text v-if="orderInfo.progress3_time"
								class="orderinfo_step_line_day">{{getLastNChars(orderInfo.progress3_time)}}</text>
						</view>
						<view class="orderinfo_step_line_box orderinfo_step_line_box4">
							<text class="orderinfo_step_line_get">卖家已收款</text>
							<view
								:class="['orderinfo_step_line_round',orderInfo.progress4_time ? 'orderinfo_step_line_round2' : '']">

							</view>
							<text v-if="orderInfo.progress4_time"
								class="orderinfo_step_line_moon">{{getLastNChars(orderInfo.progress4_time)}}</text>
						</view>
						<!-- <view class="orderinfo_step_line_box orderinfo_step_line_box5">
            <text class="orderinfo_step_line_get">卖家已打币</text>
            <view :class="['orderinfo_step_line_round',orderInfo.progress4_time ? 'orderinfo_step_line_round2' : '']">

            </view>
            <text v-if="orderInfo.step_6_tm" class="orderinfo_step_line_moon">{{nowTime(orderInfo.step_6_tm, 5)}}</text>
            <text v-if="orderInfo.step_6_tm" class="orderinfo_step_line_day">{{nowTime(orderInfo.step_6_tm, 4)}}</text>
          </view> -->
					</view>
					<view class="orderinfo_step_tip">
						<text>{{orderInfo.tips}}</text>

					</view>
				</view>
				<view>
					<view class="orderinfo_img" v-if="orderInfo.imgUrl!= ''">
						<image @click.stop="previewImg(orderInfo.imgUrl)" :src="orderInfo.imgUrl" mode="heightFix">
						</image>
					</view>

				</view>
				<view class="orderinfo_up_certificate"
					v-if="orderInfo.progress == 2 && newPayScreen ==''&& orderInfo.btn !=''" @tap="upPayScreen">
					<text style="color: #fff;" v-if="newPayScreen == ''">买家上传支付凭证</text>
					<text v-if="newPayScreen == ''">（转账时请核对卖家收款信息）</text>
					<text v-else>已上传截图！</text>
				</view>
				<view @tap="upPayScreen" class="orderinfo_img" v-if="orderInfo.progress == 2 &&newPayScreen != ''">
					<image @click.stop="previewImg(newPayScreen)" :src="newPayScreen" mode="heightFix"></image>
					<text>重新上传</text>
				</view>
				<view class="orderinfo_up_but"
					v-if="orderInfo.progress !=4 && orderInfo.btn !== undefined && orderInfo.btn!='' ">
					<view class="orderinfo_but_close" @tap="clcikClose(orderInfo.progress)">
						<text v-if="orderInfo.btn[0] === 'saleCancelTrade'">取消交易</text>
						<text v-else-if="orderInfo.progress == 2">取消交易</text>
						<text v-else-if="orderInfo.progress == 3 " @tap="suspendOrder">未收到,暂停交易</text>
						<!-- <text v-else-if="orderInfo.progress == 4">未收到</text>
          <text v-else-if="orderInfo.progress == 5" @tap="suspendOrder">未收到,暂停交易</text> -->
					</view>
					<view class="orderinfo_but_confirm" @tap="clickAccept(orderInfo.progress)">
						<text v-if="orderInfo.btn[1] === 'saleConfirmTrade'">请点击，确认交易</text>
						<text v-else-if="orderInfo.progress == 2">请点击，我已转账</text>
						<text v-else-if="orderInfo.progress == 3">确认收款并转币</text>
					</view>
				</view>


				<view v-if="orderInfo.progress == 2 && orderInfo.btn !== undefined && orderInfo.btn!='' ">
					<!-- <view class="orderinfo_img" v-if="orderInfo.progress == 2 && this.buyImg != ''">
						<image @click.stop="previewImg(buyImg)" :src="buyImg" mode="heightFix"></image>
					</view> -->
					<view class="opt_pay_way" @tap="obtSellInfo">
						<view class="opt_pay_way_text">点击获取卖家收款信息</view>
					</view>

				</view>

			</view>
			<view class="orderinfo_payment"
				v-if="!orderInfo.progress3_time && orderInfo.progress != 5 && orderInfo.progress != 6 && orderInfo.progress != 7 && JSON.stringify(collInfo) != '{}'">
				<view class="orderinfo_payment_head">
					<view @tap="selectPay('支付宝')"
						:class="['orderinfo_payment_pay', nowPay == '支付宝' ? 'orderinfo_payment_pay2' : '']"
						v-if="orderInfo.pay_type === '1'">
						支付宝
					</view>
					<view @tap="selectPay('微信')"
						:class="['orderinfo_payment_pay', nowPay == '微信' ? 'orderinfo_payment_pay2' : '']"
						v-if="orderInfo.pay_type === '2'">
						微信
					</view>
					<view @tap="selectPay('银行卡')"
						:class="['orderinfo_payment_pay', nowPay == '银行卡' ? 'orderinfo_payment_pay2' : '']"
						v-if="orderInfo.pay_type === '3'">
						银行卡
					</view>
					<view @tap="selectPay('USDT')"
						:class="['orderinfo_payment_pay', nowPay == 'USDT' ? 'orderinfo_payment_pay2' : '']"
						v-if="orderInfo.pay_type === '4'">
						USDT
					</view>
				</view>
				<view class="orderinfo_payment_title">
					<text>卖家收款信息</text>
					<image src="@/static/icon_Alipay.png" mode="" v-if="nowPay == '支付宝'"></image>
					<image src="@/static/icon_WeChat.png" mode="" v-if="nowPay == '微信'"></image>
					<image src="@/static/icons/icon_UnionPay.png" mode="" v-if="nowPay == '银行卡'"></image>
					<image src="@/static/icons/icon_usdt.png" mode="" v-if="nowPay == 'USDT'"></image>
				</view>
				<swiper class="order_swiper" style="height: 260rpx;" :current="org" :indicator-dots="indicatorDots"
					:autoplay="autoplay" :interval="interval" :duration="duration" @change="swiperChange">
					<swiper-item v-if="orderInfo.pay_type === '1'">
						<view class="orderinfo_payment_img">
							<image @click="previewImg(collInfo.account_url)" :src="collInfo.account_url" mode="">
							</image>
							<text>姓名：{{collInfo.account_name}}</text>
						</view>
					</swiper-item>
					<swiper-item v-if="orderInfo.pay_type === '2'">
						<view class="orderinfo_payment_img">
							<image @click="previewImg(collInfo.account_url)" :src="collInfo.account_url" mode="">
							</image>
							<text>姓名：{{collInfo.account_name}}</text>
						</view>
					</swiper-item>
					<swiper-item v-if="orderInfo.pay_type === '3'">
						<view class="orderinfo_payment_info">
							<view class="orderinfo_payment_icon">
								<image @click="previewImg(collInfo.account_url)" :src="collInfo.account_url"
									mode="widthFix"></image>
							</view>
							<view class="orderinfo_payment_right">
								<view class="orderinfo_payment_info_list">
									<text>名字</text>
									<view class="orderinfo_payment_info_bg" @tap="copy(collInfo.account_name)">
										<text>{{collInfo.account_name}}</text>
										<view class="orderinfo_payment_info_copy">
											<image src="@/static/icons/icon_copy.png" mode=""></image>
										</view>
									</view>
								</view>
								<view class="orderinfo_payment_info_list" style="margin: 30rpx 0;">
									<text>银行</text>
									<view class="orderinfo_payment_info_bg">
										<text>{{bankList[collInfo.bank_code]}}</text>
									</view>
								</view>
								<view class="orderinfo_payment_info_list">
									<text>卡号</text>
									<view class="orderinfo_payment_info_bg" scroll-x="true"
										@tap="copy(collInfo.account_number)">
										<text>{{collInfo.account_number}}</text>
										<view class="orderinfo_payment_info_copy">
											<image src="@/static/icons/icon_copy.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>

				</swiper>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		formatTime
	} from '@/common/api/timeConversion.js'
	import backData from '@/common/bank'
	
	export default {
		data() {
			return {
				orderType: 0, //1 是买单类型， 2是卖单类型
				orderNumber: '', // 订单号
				orderSaleNumber: '', // 卖单号
				orderInfo: {}, //获取到这笔订单信息
				timer: null,
				triggered: false, // 控制是否是刷新状态
				org: 0, // 默认页面显示的收款信息
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				collInfo: {}, // 保存收款信息
				collInfoData: [], // 保存已有的收款信息顺序
				nowPay: "", // 用户选择的支付方式
				buyImg: "", // 买方支付截图
				bankList: {}, // 存储银行卡列表
				textTimeCount: '0', //剩余时间
				timeCount: {}, // 保存倒计时
				optOrderTime: {}, // 保存倒计时
				payScreen: "", // 保存用户上传的支付截图（服务器传输过来的）
				newPayScreen: "", // 保存用户上传的支付截图（服务器传输过来的）
				newTimer: null,
				flag: true, // 控制按钮
				to: undefined
			}
		},
		onLoad(options) {
			this.bankList = backData

			this.orderNumber = options.order_no
			this.orderSaleNumber = options.order_no_sale
			this.to = options.to ? options.to : undefined
			// 获取订单交易信息

			this.getWs()
			// this.otpOrderInfo()

			// this.$router.go(0)
			// this.upOrderState()

		},
		onShow() {

			this.otpOrderInfo()
			// this.upOrderState()
		},
		// 上线后要清除
		onHide() {
			// clearInterval(this.timeCount)
			clearInterval(this.timer)
		},
		// 上线后要清除
		onUnload() {
			//this.getWs()
			clearInterval(this.timer)
			// clearInterval(this.newTimer)
			// clearInterval(this.timeCount)
		},
		computed: {
			nowTime() {
				return (time, type) => {
					return formatTime(parseInt(time + '' + '000'), type)
				}
			}
		},
		onBackPress(options) {
			if (this.to) {
				uni.navigateTo({
					url: `/pages/indexPage/tradingfloor/tradingfloor?to=${this.to}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
				return true
			}
		},
		methods: {
			getLastNChars(str) {
				// 使用 slice 方法获取字符串的最后 n 个字符
				return str.slice(-8);
			},
			refreshPage() {
				// 使用uni.reLaunch重新加载当前页面
				uni.reLaunch({
					url: '/pages/currentPage/currentPage' // 替换为你当前页面的路径
				});
			},
			getWs() {

				let that = this
				this.timer = setInterval(() => {
					that.otpOrderInfo();
				}, 6000)

				return false;


				// // 假设用户uid为1
				// var user_no = uni.getStorageSync('user_no');
				// // 浏览器监听user-1频道的消息，也就是用户uid为1的用户消息
				// var user_channel = this.$ws.subscribe('user-' + user_no);
				// // 当user-1频道有message事件的消息时
				// user_channel.on('message', function(data) {
				// 	console.log('338338338', data);
				// 	if (data.childEvent === "saleProgressPush") {
				// 		console.log('end');
				// 		console.log('that.orderInfo.order_no', that.orderInfo.order_no);
				// 		console.log('end');
				// 		that.otpOrderInfo()
				// 		// data.childEvent = ''
				// 		console.log('开始加载--------------------------');
				// 	} else {
				// 		console.log('nonono------------------nono');
				// 	}
				// 	// data里是消息内容

				// });
			},
			goCustomer() {
				uni.navigateTo({
					url: `/pages/indexPage/chatServer/chatServer`
				})
			},
			// 更新订单状态
			// upOrderState() {
			// 	this.newTimer = setInterval(() => {
			// 		this.otpOrderInfo()
			// 		console.log('定时器275');
			// 	}, 30000)
			// },
			// 图片预览
			previewImg(url) {
				const arr = [url]
				uni.previewImage({
					current: 0,
					urls: arr
				});
			},
			// 上传支付截图
			upPayScreen() {
				let that = this
				uni.chooseImage({
					count: 1, //最多可以选择的图片张数，默认9
					sourceType: ['album'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
					sizeType: ['original'], //original 原图，compressed 压缩图，默认二者都有
					success(res) {
						uni.showLoading({
							title: '验证中'
						});


						// #ifdef H5
						let url = res.tempFiles[0].name //域名
						// #endif
						// #ifdef APP-PLUS || MP
						let url = res.tempFiles[0].path
						// #endif
						let index = url.lastIndexOf(".");
						let jpgUrl = url.substr(index + 1);
						if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg" && jpgUrl != "gif" && jpgUrl !=
							"JPG" && jpgUrl != "JPEG" && jpgUrl != "PNG" && jpgUrl != "GIF" && jpgUrl != "HEIC" &&
							jpgUrl != "heic") {
							uni.showToast({
								icon: "none",
								title: "请上传格式为jpg,png,jpeg,gif"
							});
						} else {
							that.upPicture(res.tempFilePaths)
						}
					},
					fail() {

					},
				})
			},
			// 上传图片到服务器
			upPicture(address) {
				let that = this
				let params = {
					upload_type: 'transfer_bank', // 上传类型
					order_no: this.orderInfo.order_no,
					filePath: address, // 上传的图片地址
					name: 'file'
				}; //参数

				that.$api.flieUpload("/v2/uploadImg", params).then(res => {

					// 存储用户上传的图片，服务器传过来的截图
					const {
						code,
						data,
						msg
					} = JSON.parse(res)
					if (code == 0) {
						that.newPayScreen = data.thumb_url
						that.payScreen = data.url
						uni.hideLoading();
						uni.showToast({
							title: '成功上传截图！',
							icon: "none",
							duration: 1500
						});
						clearInterval(this.timer)
						that.getWs() 
						return
					} else {
						uni.showToast({
							icon: "none",
							title: msg
						})
						uni.hideLoading();
					}
				})
			},
			// const uploadTask = uni.request({
			//            url: that.$api+'/v2/uploadImg', // 服务器上传接口地址
			//            filePath: address[0],
			// 		upload_type: 'transfer_bank', // 上传类型
			//            name: 'file', // 必须填写，后台用来接收文件
			// 		 method: 'POST',
			// 		  header: {
			// 		    'content-type': 'multipart/form-data',
			// 		    'origin': 'http://localhost' // 注意替换为你的前端域名
			// 		  },
			//            formData: {
			//              order_no:this.orderInfo.order_no, // 其他要上传的参数
			//            },
			//            success: (uploadFileRes) => {
			//              console.log('upload success:', uploadFileRes);
			//            },
			//            fail: (uploadFileErr) => {
			//              console.error('upload fail:', uploadFileErr);
			//            }
			//          });
			// 暂停订单
			suspendOrder() {
				// if(!this.flag) {
				// 	return
				// }
				// this.flag = false
				if (this.orderInfo.progress == 3) {
					if (this.orderInfo.progress == 5) {
						uni.showToast({
							title: "订单已被暂停，请联系客服！",
							icon: "none",
							duration: 1500
						});
						return
					}
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no, //单号
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/salerHalt", "POST", params).then(res => {

						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 清除、暂停倒计时
						clearInterval(that.timeCount)
						this.flag = true
					})
				}

			},
			// 选择收款方式
			selectPay(payType) {
				// 改变收款显示页
				this.org = this.collInfoData.indexOf(payType)
				// 改变点击显示
				this.nowPay = payType
			},
			//获取卖家收款信息
			obtSellInfo() {

				let that = this;
				let params = {
					order_no: this.orderInfo.order_no, // 卖单号
				}; //参数
				that.$api.tokenTimeOut("/trade/v2/orderPayType", "POST", params).then(res => {
					this.buyImg = res.data.account_url

					if (res.code == 0) {
						// 存储数据
						this.collInfo = res.data
						if (this.orderInfo.pay_type === '1') {
							this.collInfoData.push('支付宝')
						}
						if (this.orderInfo.pay_type === '2') {
							this.collInfoData.push('微信')
						}
						if (this.orderInfo.pay_type === '3') {
							this.collInfoData.push('银行卡')
						}
						if (this.orderInfo.pay_type === '4') {
							this.collInfoData.push('USDT')
						}
						const pay = {
							'1': '支付宝',
							'2': '微信',
							'3': '银行卡',
							'4': 'USDT'
						}

						// 改变目标数字
						this.org = this.collInfoData.indexOf(pay[this.orderInfo.pay_type])
						// 改变目标名字
						this.nowPay = pay[this.orderInfo.pay_type]
					}
				})
			},
			//选择器改变
			swiperChange(e) {

				this.org = e.detail.current // 将选中类型更换
				this.nowPay = this.collInfoData[e.detail.current]

			},
			// 下拉刷新被触发
			refreshData() {
				// 开启下拉刷新样式
				this.triggered = true
				setTimeout(() => {
					// 刷新信息
					this.newOtpOrderInfo()
					// 关闭下拉刷新
					this.triggered = false
					uni.showToast({
						title: "刷新订单成功！",
						icon: "none",
						duration: 1500
					});
				}, 1000)
			},
			// 点击确认
			clickAccept(step) {
				// console.log(this.flag);
				// if(!this.flag) {

				// 	return
				// }
				// this.flag = false

				const saleStep = {
					'SALE': 0, //挂单
					'LOCKED': 1, //发起订单
					'SALER_CONFIRM': 2, //卖家确认
					'BUYER_TRANSFERED': 3, //买家已转账
					'SALER_PAIED': 4, //卖家已收款
					'SALER_HALT': 5, //卖家暂停打币
					'SALER_TRANSFERED': 6, //卖家打币
				};
				// 卖家确认交易
				if (step == saleStep['LOCKED']) {

					// *************************走订单确认接口 ***************************
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no, //买单号
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/salerConfirm", "POST", params).then(res => {
						// 拿到结果可以再次点击
						// this.flag = true

						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 重新获取订单信息
						this.newOtpOrderInfo()
						console.log('卖家确认加载--------------------------');
					})

				} else if (step == saleStep['SALER_CONFIRM']) { // 买家确认转账
					if (this.payScreen == '') {
						uni.showToast({
							title: '请上传支付截图！',
							icon: "none",
							duration: 1500
						});
						this.flag = true
						return
					}

					// *************************走订单确认接口 ***************************
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no, //买单号
						order_no_sale: this.orderInfo.order_no_sale, // 卖单号
						img_url: this.payScreen // 用户上传的图片地址
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/buyerTransfered", "POST", params).then(res => {

						// this.flag = true
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 重新获取订单信息

						this.newOtpOrderInfo()
						console.log('买家确认转账加载--------------------------');
					})
				} else if ((step == saleStep['BUYER_TRANSFERED'] || step == saleStep['SALER_HALT']) && this.orderInfo
					.progress == 3) { // 卖家确认收款

					// *************************走订单确认接口 ***************************
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no, //单号
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/salerPaied", "POST", params).then(res => { // 卖家确认收款

						// this.flag = true
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 重新获取订单信息

						this.newOtpOrderInfo()
						console.log('卖家收款加载--------------------------');
					})
				}
			},
			// 点击取消交易
			clcikClose(step) {
				// if(!this.flag) {
				// 	return
				// }
				// this.flag = false
				if (step == 1 && this.orderInfo.progress == 1) { // 卖家取消交易

					// *************************走订单确认接口 ***************************
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no, //买单号
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/salerCancel", "POST", params).then(res => { // 卖家确认阶段-取消交易

						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 重新获取订单信息
						that.newOtpOrderInfo()
						console.log('卖家取消加载--------------------------');
					})
				} else if (step == 2 && this.orderInfo.progress == 2) { // 买家取消购买

					// *************************走订单确认接口 ***************************
					let that = this;
					let params = {
						order_no: this.orderInfo.order_no,
					}; //参数
					that.$api.tokenTimeOut("/trade/v2/buyerCancel", "POST", params).then(res => { // 卖家确认收款

						// this.flag = true
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 重新获取订单信息
						this.newOtpOrderInfo()
						console.log('买家取消加载--------------------------');
					})
				}
			},
			// 获取订单交易信息
			// ==============================================================================================·
			newOtpOrderInfo() {
				let that = this;
				let params = {
					order_no: this.orderNumber, //买单号
				}; //参数
				that.$api.tokenTimeOut("/order/v2/saleDetail", "POST", params).then(res => {
					if (res.code == 0) {
						// 存储订单数据
						that.orderInfo = res.data
						if (!that.flag) {
							that.flag = true
						}
					}

				})
			},
			otpOrderInfo() {
				// 买单数据
				// clearInterval(this.newTimer)
				let that = this;
				let params = {
					order_no: this.orderNumber, //买单号
				}; //参数
				that.$api.tokenTimeOut("/order/v2/saleDetail", "POST", params).then(res => {
					if (res.code == 0) {
						// 存储订单数据
						that.orderInfo = res.data
						if (res.data.progress == '4') {
							this.textTimeCount = 0
						}
						if (res.data.sale_status == 'trade_cancel' || res
							.data.sale_status == 'trade_finish') {
							clearInterval(this.timer)
						}

						that.countdown(that.orderInfo)

						if (!that.flag) {
							that.flag = true
						}
					}

				})
				// 卖单数据
			},
			// 交易超时

			countdown(item) {

				// 先清除定时器
				clearInterval(this.timeCount)
				if (item.progress != 4) {
					// let time = parseInt(new Date().getTime() / 1000) + '';//获取10位时间戳
					let time = item.timeRemaining; //获取10位时间戳

					if (time - item.timeRemaining <= item.timeRemaining) {
						// 存储剩余时间
						this.textTimeCount = item.timeRemaining - (time - item.timeRemaining)

						this.timeCount = setInterval(() => {
							this.textTimeCount--
							if (this.textTimeCount <= 0) {
								// 交易超时接口
								clearInterval(this.timeCount)
								this.textTimeCount = 0;
							}
						}, 1000)
					} else {
						this.textTimeCount = 0
						this.otpOrderInfo()
						// 交易超时接口

					}
				}

			},
			// 复制函数
			copy(value) {
				uni.setClipboardData({
					showToast: false,
					data: value,
					success: function() {
						//调用方法成功

						uni.showToast({
							title: "复制成功！",
							icon: "none",
							duration: 1000
						});
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
		// background-color: #111111;
	}

	.orderinfo {
		scroll-view {
			height: 1224rpx;
		}

		.changepaw_top_state {
			position: relative;
			height: 1rpx;
			margin-top: var(--status-bar-height);
			background-color: #001eca;

			.orderinfo_trade {
				position: absolute;
				z-index: 999;
				top: 10rpx;
				right: 35rpx;
				width: 120rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 20rpx;
				color: #FFFFFF;

				image {
					width: 60rpx;
					height: 60rpx !important;
				}
			}
		}

		.orderinfo_card {
			height: 170rpx;
			background: #001eca;
			margin: 45rpx 30rpx 0 30rpx;
			border-radius: 15rpx;
			overflow: hidden;

			.orderinfo_card_text {
				height: 48rpx;

				.orderinfo_card_left {
					width: 140rpx;
					height: 35rpx;
					background-color: #E24537;
					border-radius: 0rpx 0 15rpx 0;
					text-align: center;
					line-height: 35rpx;
					font-size: 20rpx;
					color: #fff;
				}
			}

			.orderinfo_card_address {
				width: 585rpx;
				height: 55rpx;
				background-color: #fff;
				margin: 25rpx auto 0 auto;
				border-radius: 27.5rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 1;
				padding: 0 30rpx 0 35rpx;
				font-size: 28rpx;
				color: #636363;

				image {
					width: 30rpx;
				}
			}

			.orderinfo_card_number {
				height: 32rpx;
				display: flex;
				justify-content: space-between;
				line-height: 32rpx;

				.orderinfo_card_number_text {
					font-size: 22rpx;
					margin-left: 40rpx;
					color: #fff;
				}

				.orderinfo_card_number_money {
					font-size: 32rpx;
					margin-right: 35rpx;
					font-weight: 600;
					color: #fff;
				}
			}
		}

		.orderinfo_step {
			margin: 0 26rpx;
			padding: 0 30rpx 20rpx 30rpx;
			margin-top: 50rpx;
			background-color: #fff;
			box-shadow: 0px 2px 5px 0px #0000001A;
			border-radius: 10rpx;

			.orderinfo_step_title {
				margin-left: -10rpx;
				height: 80rpx;

				>text {
					font-size: 24rpx;
					color: #636363;
				}
			}

			.orderinfo_step_info {
				height: 220rpx;
				padding: 0 30rpx;

				.orderinfo_step_line {
					position: relative;
					height: 150rpx;
					display: flex;

					.orderinfo_step_line_view {
						margin-top: 55rpx;
						flex: 0.3;
						height: 8rpx;

						background-color: #C9C7C7;
					}

					.orderinfo_step_line_view2 {
						background-color: #001eca;
					}

					.orderinfo_step_line_box {
						top: 0;
						left: 20rpx;
						transform: translateX(-50%);
						position: absolute;
						width: 140rpx;
						height: 150rpx;
						display: flex;
						flex-direction: column;
						align-items: center;

						.orderinfo_step_line_get {
							white-space: nowrap;
							font-size: 24rpx;
							line-height: 44rpx;
							color: #636363;
						}

						.orderinfo_step_line_round {
							width: 30rpx;
							height: 30rpx;
							background-color: #C9C7C7;
							border-radius: 15rpx;
						}

						.orderinfo_step_line_round2 {
							background-color: #001eca;
						}

						.orderinfo_step_line_moon {
							font-size: 28rpx;
							color: #636363;
							margin-left: 26rpx;
							margin-top: 14rpx;
							text-align: center;
						}

						.orderinfo_step_line_day {
							font-size: 26rpx;
							color: #636363;
							margin-left: 26rpx;
							margin-top: 14rpx;
							text-align: center;
						}
					}

					.orderinfo_step_line_box2 {
						top: 0;
						left: 35%;
						transform: translateX(-50%);
					}

					.orderinfo_step_line_box3 {
						top: 0;
						left: 65%;
						transform: translateX(-50%);
					}

					.orderinfo_step_line_box4 {
						top: 0;
						left: 92%;
						transform: translateX(-50%);
					}

					.orderinfo_step_line_box5 {
						top: 0;
						left: 100%;
						transform: translateX(-50%);
					}
				}

				.orderinfo_step_tip {
					height: 70rpx;
					line-height: 1.1;

					>text {
						font-size: 24rpx;
						color: #E24537;
					}

					.orderinfo_step_tip_finish {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #659E37;
						font-size: 24rpx !important;

						image {
							width: 36rpx;
							height: 36rpx;
							margin-right: 10rpx;
						}
					}
				}
			}

			.orderinfo_up_certificate {
				width: 525rpx;
				height: 70rpx;
				margin: 0 auto;
				// border: 1rpx solid #e9a63d;
				background-color: #001eca;
				border-radius: 15rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 18rpx;
				color: #cccccc;
				font-weight: 600;
			}

			.orderinfo_img {
				width: 525rpx;
				height: 205rpx;
				margin: 0 auto;
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				font-size: 20rpx;
				color: #001eca;

				image {
					height: 165rpx;
					margin-bottom: 20rpx;
				}
			}

			.orderinfo_up_but {
				width: 527rpx;
				height: 70rpx;
				margin: 25rpx auto 0 auto;
				display: flex;
				justify-content: space-around;
				font-size: 24rpx;
				font-weight: 600;
				color: #fff;
				text-align: center;
				line-height: 70rpx;

				.orderinfo_but_close {
					flex: 1;
					height: 70rpx;
					background-color: #C9C7C7;
					border-radius: 10rpx;
					margin-right: 30px;
					color: #636363;
				}

				.orderinfo_but_confirm {
					flex: 1;
					height: 70rpx;
					background-color: #001eca;
					border-radius: 10rpx;
				}
			}

			.opt_pay_way {
				width: 100%;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20rpx;

				.opt_pay_way_text {
					border-radius: 20rpx;
					background-color: #001eca;
					width: 320rpx;
					text-align: center;
					height: 50rpx;
					color: #fff;
					font-size: 28rpx;
					line-height: 50rpx;
				}
			}
		}

		.orderinfo_payment {
			background-color: #fff;
			border-radius: 15rpx;
			margin: 50rpx 30rpx 0 30rpx;
			box-shadow: 0px 2px 5px 0px #0000001A;

			.orderinfo_payment_head {
				height: 50rpx;
				display: flex;
				border-bottom: 1rpx solid #7b7b7b;

				.orderinfo_payment_pay {
					width: 100rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					font-size: 26rpx;
					color: #001eca;
					transition: all .2s;
				}

				.orderinfo_payment_pay2 {
					background-color: #001eca;
					color: #fff;
				}
			}

			.orderinfo_payment_title {
				height: 65rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #636363;

				image {
					margin-left: 10rpx;
					width: 26rpx;
					height: 26rpx;
				}
			}

			.orderinfo_payment_info {
				height: 225rpx;
				display: flex;

				.orderinfo_payment_icon {
					width: 220rpx;
					height: 225rpx;
					display: flex;
					justify-content: center;

					image {
						width: 160rpx;
						// margin-top: 40rpx;
					}
				}

				.orderinfo_payment_right {
					.orderinfo_payment_info_list {
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						line-height: 1;
						font-size: 24rpx;
						color: #cccccc;

						>text {
							margin-right: 20rpx;
						}

						.orderinfo_payment_info_bg {
							position: relative;
							width: 350rpx;
							height: 40rpx;
							background-color: #e1e1e1;
							border-radius: 8rpx;
							text-align: center;
							line-height: 40rpx;
							color: #000;

							.orderinfo_payment_info_copy {
								position: absolute;
								top: 50%;
								right: -10rpx;
								transform: translate(100%, -50%);
								width: 30rpx;
								height: 30rpx;

								image {
									width: 30rpx;
									height: 30rpx;
								}
							}
						}
					}
				}
			}

			.orderinfo_payment_img {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #636363;
				font-size: 26rpx;

				image {
					width: 200rpx;
					height: 200rpx;
				}
			}
		}
	}
</style>