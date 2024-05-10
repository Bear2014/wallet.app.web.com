<template>
	<view class="addpay_page">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'添加收付款'"></navigation>
		<view class="addpay_page_title">
			<text>选择收款方式</text>
		</view>
		<view class="addpay_page_select">
			<view class="addpay_page_platform" @tap="selectPay(1)">
				<image v-if="target == 1" class="select_icon" src="@/static/icons/icon_select.png" mode=""></image>
				<image v-else  class="select_icon" src="@/static/icons/icon_unselected.png" mode=""></image>
				<image class="platform_icon" src="@/static/icons/icon_Alipay.png" mode="widthFix"></image>
				<text :style="{color: (target == 1 ? '#001eca' : '')}">支付宝</text>
			</view>
			<!-- <view class="addpay_page_platform" @tap="selectPay(2)">
				<image v-if="target == 2" class="select_icon" src="@/static/icons/icon_select.png" mode=""></image>
				<image v-else  class="select_icon" src="@/static/icons/icon_unselected.png" mode=""></image>
				<image class="platform_icon" src="@/static/icons/icon_WeChat.png" mode="widthFix"></image>
				<text :style="{color: (target == 2 ? '#001eca' : '')}">微信</text>
			</view> -->
			<view class="addpay_page_platform" @tap="selectPay(3)">
				<image v-if="target == 3" class="select_icon" src="@/static/icons/icon_select.png" mode=""></image>
				<image v-else  class="select_icon" src="@/static/icons/icon_unselected.png" mode=""></image>
				<image class="platform_icon" src="@/static/icons/icon_UnionPay.png" mode="widthFix"></image>
				<text :style="{color: (target == 3 ? '#001eca' : '')}">银行卡</text>
			</view>
		</view>
		<view class="addpay_page_title">
			<text>填充信息</text>
		</view>
		<view class="addpay_page_name">
			<text style="width: 160rpx;">姓名</text>
			<input v-model="user.name" type="text" placeholder="请输入真实姓名">
		</view>
		<view class="addpay_page_name" v-if="target == 1">
			<text style="width: 160rpx;">支付宝收款账号</text>
			<input style="width: 400rpx;" v-model="user.account_number" type="text" placeholder="请输入支付宝收款账号">
		</view>
		<!-- <view class="addpay_page_name" v-if="target == 2">
			<text style="width: 160rpx;">微信收款账号</text>
			<input style="width: 400rpx;" v-model="user.account_number" type="text" placeholder="请输入微信收款账号">
		</view> -->
		<view class="addpay_page_cardid" v-if="target == 3">
			<view class="addpay_page_cardid_left">
				<text>银行卡号</text>
			</view>
			<input style="margin-left: 20rpx;" v-model="user.bankId" type="number" placeholder="请输入银行卡号">
		</view>
		<view class="addpay_page_cardid_select" v-if="target == 3" @tap="returnPage">
			<view class="addpay_page_cardid_left">
				<text>所属银行</text>
			</view>
			<view class="addpay_page_cardid_right">
				<text v-if="selectBankName == ''">请选择</text>
				<text v-else>{{selectBankName}}</text>
				<view class="navigation_arrow" >
					
				</view>
			</view>
			
		</view>
		<view class="addpay_page_title" v-if="target == 1 || target == 2" >
			<text>上传收款码</text>
		</view>
		<view class="addpay_page_qr" v-if="target == 1 || target == 2">
			<image v-if="payUrl == ''" @tap="uploadRq" src="@/static/icons/icon_QR code.png" mode=""></image>
			<image v-else  :src="newPayUrl" @click="previewImg(payUrl)" mode=""></image>
			<text v-if="payUrl == ''" @tap="uploadRq">上传我的二维码</text>
			<text v-else @tap="uploadRq">重新上传</text>
		</view>
		<view class="upbank_picture" v-if="target == 3">
			<image v-if="showBankUrl == ''" @tap="upbank" src="@/static/icons/up_bank.png" mode=""></image>
			<image v-else @click="previewImg(showBankUrl)" :src="newShowBankUrl" mode=""></image>
			<text  @tap="upbank">点击上传银行卡</text>
		</view>
		<view class="addpay_page_tip" >
			<text>*请录入本人真实信息，否则造成的一切损失，由会员自行承担，</text>
			<text>本人不负担任何责任</text>
		</view>
		
		<view :class="['addpay_page_sub',user.name != '' && user.rqUrl != '' ?  'addpay_page_sub_light' : '']" @tap="subIns">
			添加
		</view>
		<!-- 导入弹出层 -->
		<infopopup v-show="atOpenPup" @closePopu="closePopuPage">
			<template v-slot:query>
				<view class="query_bank">
					<input type="text" v-model="queryBank" @input="inputQueryBank"  placeholder="搜索银行" maxlength="15" placeholder-style="color:#ececfd;">
				</view>
			</template>
			<template v-slot:content>
				<view class="bank_list" v-for="(item,index) in bankList" :key="index" @tap="selectBank(item)">
					<view class="bank_page_list">
						<text>{{item}}</text>
					</view>
				</view>
			</template>
	
		</infopopup>
	</view>
</template>

<script>
	import backData from '@/common/bank'
	export default {
		data() {
			return {
				target: 1, // 现在选中的目标
				user: {
					name: "" , // 用户姓名
					account_number: "", // 绑定账号
					rqUrl: "" , // 二维码收款地址
					bankId:"",	// 银行卡号
					bankUrl: "", // 银行选择图片地址
					code: "", 	// 银行卡code
				},
				payUrl: "", // 用于动态展示用户收款图片
				newPayUrl: "", // 收款缩率图
				atOpenPup:false,
				bankList: {}, // 用于存储所有银行
				selectBankName: "", // 用于存储选择银行的名字 
				showBankUrl: "", // 用于展示银行卡
				newShowBankUrl: "", // 用于展示银行卡缩略图
				queryBank: "", // 搜索的银行
				isTrue: true,
			}
		},
		onLoad() {
			// 获取所有银行列表
			this.bankList = backData
			
		},
		methods: {
			// 图片预览
			previewImg(url) {
				const arr = [url]
				uni.previewImage({
					current: 0,
					urls: arr
				});
			},
			// 银行卡搜索
			inputQueryBank(e) {
				
				var bankItem = e.target.value
				var dataBank = {}
				for(let item in backData) {
					// 
					if (backData[item].indexOf(bankItem) !== -1) {
						
						dataBank[item] = backData[item]
					}
				}
				
				this.bankList = dataBank
				// 
			},
			// 上传银行卡图片
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
				// const appAuthorizeSetting = uni.getAppAuthorizeSetting()
				// 
				uni.chooseImage({
						count: 1, //最多可以选择的图片张数，默认9
						sourceType: ['album'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
						sizeType: ['original'],//original 原图，compressed 压缩图，默认二者都有
						success(res) {
							uni.showLoading({
								title: '验证中'
							});
							
							that.user.bankUrl = res.tempFilePaths;  // 用于上传的地址，保存这个完整的地址
							// let strList = res.tempFilePaths[0].split('\"')
							//   strList = strList[0].split('file:\/\/') 
							 
							// that.showBankUrl = strList[1];  // 用户展示用户二维码的图片
							// 
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
								that.upPicture()
							}
						},
						fail(err) {
							
						},
					})
			},
			// 用户选择了银行
			selectBank(item) {
				
				// 拿到用户所选的银行 code 和 名字
				const result = Object.entries(this.bankList).find(([key, val]) => val === item);
				
				// 将用户选择的名字赋值过去
				this.user.code = result[0]
				this.selectBankName = result[1]
				// 并关闭弹出层
				this.atOpenPup = false
			},
			// 关闭弹出层
			closePopuPage(res) {
				
				// 关闭弹出层
				this.atOpenPup = false
			},
			// 打开弹出层
			returnPage() {
				this.atOpenPup = true
			},
			// 提交绑定收款信息 
			subPayInfo() {
				
				// 提交用户绑定收款方式信息
				if(this.target == 2) {
					
					// 目标为 1 时选中的是微信
					var userType = "wechat"
					var userJson = {
						account_name: this.user.name, 	// 用户姓名
						account_number: this.user.account_number, // 账号
						account_url: this.payUrl,	// 二维码收款地址
					}
				}else if(this.target == 1) {
					
					var userJson = {
						account_name: this.user.name, 	// 用户姓名
						account_number: this.user.account_number, // 账号
						account_url: this.payUrl,	// 二维码收款地址
					}
					// 目标为 2 时选中的是支付宝
					var userType = "alipay"
				}else if(this.target == 3) {
					
					// 目标为 3 时选中的是银行
					var userType = "bank"
					var userJson = {
						account_name: this.user.name, 	// 用户姓名
						account_url: this.showBankUrl,	// 银行卡图片地址
						bank_code: this.user.code,		// 银行卡代码
						account_number: this.user.bankId, // 银行卡账号
					}
				}
				let that = this;
				let params = {
					type: userType, 		// 绑定类型
					account_info: JSON.stringify(userJson) , 		// 绑定的信息 json
				}; //参数 
				// 提交用户绑定收款方式信息
				that.$api.tokenTimeOut("/user/bindPayment", "POST", params).then(res => {
					this.isTrue = true
					if(res.code == 0) {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 1500
						});
						// 数据初始化
						that.user = {
							name: '',
							rqUrl: '',
							bankId: '',
							bankUrl: '',
							code: ''
						}
						that.payUrl = ''
						that.showBankUrl = ''
						that.selectBankName = ''
						setTimeout(() => {
							uni.navigateBack({
							delta: 1,
							animationType: 'pop-out',
							animationDuration: 200
						});
						}, 1000)
						return
					}
				})
			},
			// 提交绑定信息拦截检查
			subIns() {
				if (!this.isTrue) {
					uni.showToast({
						title: "正在绑定请稍后！",
						icon: "none",
						duration: 1500
					});
					return
				}
				this.isTrue = false
				if(this.user.name == "") {
					uni.showToast({
						title: "请先填写真实姓名",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}else if (this.target != 3 && this.user.account_number == "") {
					uni.showToast({
						title: "请输入绑定账号",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}else if(this.target <= 2 &&this.user.rqUrl == ""  ) {
					uni.showToast({
						title: "请先上传二维码截图",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}else if(this.target == 3 && this.user.bankId == ""){
					uni.showToast({
						title: "请输入银行卡号",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}else if(this.target == 3 && this.user.code == "") {
					uni.showToast({
						title: "请选择归属银行",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}else if(this.target == 3 && this.user.bankUrl == "") {
					uni.showToast({
						title: "请上传银行卡正面",
						icon: "none",
						duration: 1500
					});
					this.isTrue = true
					return
				}
				this.subPayInfo()
			},
			// 提交二维码
			uploadRq() {
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
							uni.showLoading({
								title: '验证中'
							});
							
							that.user.rqUrl = res.tempFilePaths;  // 用于上传的地址，保存这个完整的地址
							// let strList = res.tempFilePaths[0].split('\"')
							//   strList = strList[0].split('file:\/\/') 
							 
							// that.payUrl = strList[1];  // 用户展示用户二维码的图片
							// 
							// 图片上传服务器
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
								that.upPicture()
							}
						},
						fail() {
							
						},
					})
			},
			// 上传图片到服务器
			upPicture() {
				let that = this
				let upType = '' // 上传类型
				let upAddres = '' // 上传地址 
				if (this.target == 1) {
					upType = 'payment_zfb'
					upAddres = this.user.rqUrl
				}else if (this.target == 2) {
					upType = 'payment_wechat'
					upAddres = this.user.rqUrl
				}else if (this.target == 3) {
					upType = 'payment_bank'
					upAddres = this.user.bankUrl
				}
				let params = {
					upload_type: upType, // 上传类型
					filePath: upAddres // 上传的图片地址
				}; //参数
				// uni.uploadFile({
				//   url:'http://192.168.1.201:8080/api/uploadImg',		//post请求的地址
				//   filePath: this.user.rqUrl,
				//   name:'avatar',	
				//   formData: {
				//     upload_type: upType  //upload_type是指除了图片以外，额外加的字段
				//   },
				//   success: (uploadFileRes) => {
				//     //这里要注意，uploadFileRes.data是个String类型，要转对象的话需要JSON.parse一下
				//     var obj = JSON.parse(uploadFileRes.data)
				//   }
				// })
				that.$api.flieUpload("/uploadImg", params).then(res => {
					
					const { code, data, msg } = JSON.parse(res)
					if (code == 0) {
						if (that.target == 3) {
							that.newShowBankUrl = data.thumb_url
							that.showBankUrl = data.url
						}else {
							that.newPayUrl = data.thumb_url
							that.payUrl = data.url
						}
						uni.hideLoading();
					} else {
						uni.showToast({
							icon: "none",
							title: msg
						})
						uni.hideLoading();
					}
				})
			},
			// 更新用户选择的信息
			selectPay(res) {
				// 将点击的数字赋值更新
				this.target = res
				// 如果更换收款方式会把图片二维码数据清空
				this.user.rqUrl = ""
				this.user.account_number = ""
				this.user.bankId = ""
				this.user.code = ""
				this.selectBankName = ""
				this.payUrl = ""
			}
		},
	}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	.addpay_page {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.addpay_page_title {
			height: 25rpx;
			margin:60rpx 0 0  55rpx;
			line-height: 1;
			color: #636363;
			font-size: 25rpx;
		}
		.addpay_page_select {
			height: 160rpx;
			padding-left: 55rpx;
			display: flex;
			flex-direction: column;
			.addpay_page_platform {
				flex: 1;
				display: flex;
				align-items: center;
				font-size: 22rpx;
				color: #636363;
				line-height: 1;
				.select_icon {
					width: 25rpx;
					height: 25rpx;
				}
				.platform_icon{
					width: 40rpx;
					margin-left: 60rpx;
				}
				>text {
					margin-left: 35rpx;
				}
			}
		}
		.addpay_page_name {
			margin: 20rpx 55rpx 0 55rpx;
			height: 80rpx;
			border-bottom: 1rpx solid #000;
			display: flex;
			align-items: center;
			line-height: 1;
			font-size: 22rpx;
			color: #636363;
			>input {
				font-size: 22rpx;
				color: #8E8E8E;
				margin-left: 20rpx;
			}
		}
		.addpay_page_cardid {
			margin: 0 55rpx;
			height: 80rpx;
			border-bottom: 1rpx solid #3a3a3a;
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #636363;
			.addpay_page_cardid_left {
				width: 160rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
			
			>input {
				font-size: 22rpx;
				color: #8E8E8E;
			}
		}
		.addpay_page_cardid_select {
			margin: 0 240rpx 0 55rpx;
			height: 80rpx;
			border-bottom: 1rpx solid #3a3a3a;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			color: #636363;
			.addpay_page_cardid_left {
				width: 160rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
			.addpay_page_cardid_right {
				margin-left: 20rpx;
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				>text {
					color: #8E8E8E;
					line-height: 1;
				}
				.navigation_arrow {
					width: 0;
					height: 0;
					border: solid #8b8c8c;
					border-width: 0rpx 0px 1px 1rpx;
					display: inline-block;
					padding: 8rpx;
					transform: rotate(-45deg) ;
					-webkit-transform: rotate(-45deg);
					margin-right: 30rpx;
				}
			}
			
		}
		.addpay_page_qr {
			height: 280rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			>image {
				width: 170rpx;
				height: 170rpx;
			}
			>text {
				margin-top: 20rpx;
				font-size: 25rpx;
				color: #001eca;
				line-height: 1;
			}
		}
		.upbank_picture {
			width: 640rpx;
			height: 300rpx;
			margin: 10rpx  auto 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 25rpx;
			color: #001eca;
			>image {
				width: 367rpx;
				height: 275rpx;
			}
		}
		.addpay_page_tip {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 20rpx;
			color: #d5301a;
			line-height: 1.5;
		}
		.addpay_page_sub {
			width: 650rpx;
			height: 60rpx;
			background-color: #001eca;
			margin: 45rpx auto 0 auto;
			border-radius: 30rpx;
			text-align: center;
			line-height: 60rpx;
			color: #fff;
			font-size: 22rpx;
		}
		.addpay_page_sub_light {
			background: #001eca;
		}
		.query_bank {
			position: relative;
			width: 720rpx;
			height: 65rpx;
			margin: auto;
			align-items: center;
			>input {
				width: 720rpx;
				height: 65rpx;
				font-size: 24rpx;
				color: #fff;
				text-align: center;
			}
			
		}
		.bank_list {
			width: 720rpx;
			height: 110rpx;
			display: flex;
			justify-content: center;
			border-bottom: 1.5px solid #001eca;
			.bank_page_list {
				width: 400rpx;
				height: 110rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #001eca;
			}
		}
	}
</style>