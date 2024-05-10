<template>
	<view class="authentic">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'实名认证'"></navigation>
		<view class="authentic_tip">
			<text>为保证您的账户安全，请先完成实名认证</text>
			
		</view>
		<view class="authentic_step">
			<view :class="['authentic_step_line', userState.status >= 3 ? 'authentic_step_line_light': '' ]"></view>
			<view :class="['authentic_step_line', userState.status >= 5 ? 'authentic_step_line_light': '' ]"></view>
			<view class="authentic_step_state">
				<view :class="['step_state', userState.status >= 1 || userState.status == 0 ? 'step_state_light': '' ]" >
					1
				</view>
				<text>提交审核</text>
			</view>
			<view class="authentic_step_state_2" >
				<view :class="['step_state', userState.status >= 3 ? 'step_state_light': '' ]">
					2
				</view>
				<text>视频认证</text>
			</view>
			<view class="authentic_step_state_3">
				<view :class="['step_state', userState.status >= 5 ? 'step_state_light': '' ]">
					3
				</view>
				<text>完成认证</text>
			</view>
		</view>
		<view class="authentic_info" v-if="userState.status == 0">
			用户信息
		</view>
		<view class="authentic_input" v-if="userState.status == 0">
			<view class="authentic_input_box">
				<text>姓名</text>
			</view>
			<input style="width: 400rpx;" type="text" v-model="user.name" placeholder="请输入身份证上的姓名">
		</view>
		<view class="authentic_input" v-if="userState.status == 0 ">
			<view class="authentic_input_box" >
				<text>身份证号</text>
			</view>
			<input style="width: 400rpx;" type="text" @input="cardIdInput" placeholder="请输入真实的身份证号"  maxlength="18" v-model="user.cardId">
		</view>
		<view class="authentic_info_2" v-if="userState.status == 0 ">
			用户信息
		</view>
		<view class="authentic_card" v-if="userState.status == 0">
			<view class="authentic_card_front" @tap="selectAuthentic(true)">
				<image :src="newFront || user.front" mode=""></image>
				<view class="card_front_camera"></view>
			</view>
			<view class="authentic_card_front" @tap="selectAuthentic(false)">
				<image :src="newBehind || user.behind" mode=""></image>
				<view class="card_front_camera"></view>
			</view>
		</view>
		<view class="card_text" v-if="userState.status == 0">
			<text>身份证人像面</text>
			<text>身份证国徽面</text>
		</view>
		<view v-if="userState.status == 0" :class="['authentic_sub', user.name && user.cardId ? 'authentic_sub_2': '' ]"  @tap="subIntercept">
			<text>确认</text>
		</view>
		<!-- 进入审核步骤 -->
		<view class="order_examine" v-if="userState.status == 1">
			<text>身份证信息已提交，请耐心等待，正在审核！</text>
		</view>
		<!-- 进入身份证审核失败页 -->
		<view class="audit_failed" v-if="userState.status == 2">
			<text>身份证信息有误，请重新提交！</text>
			<view class="reSub" @tap="userState.status = 0">
				重新提交
			</view>
		</view>
		
		<!-- 进入步骤 2 -->
		<view class="authentic_info_step2" v-if="userState.status == 3 && userState.video_url == null">
			自拍视频
		</view>
		<view class="authentic_step2_tip" v-if="userState.status == 3 && userState.video_url == null">
			<text>请自拍一段视频，并大声读取下面的号码，从</text>
			<text style="color: red;">相册</text>
			<text>上传视频</text>
		</view>
		<view class="authentic_step2_but" v-if="userState.status == 3 && userState.video_url == null">
			<view class="authentic_step2_number">
				<text>{{ random }}</text>
			</view>
			<view class="authentic_step2_transcribe" @tap="videoRecording" v-if="!user.video_url">
				<text>立即上传</text>
			</view>
			<view class="authentic_step2_transcribe" @tap="videoRecording" v-else>
				<text>重新上传</text>
			</view>
		</view>
		<view class="authentic_step2_state" v-if="userState.status == 3 && userState.video_url == null" >
			<text v-if="!user.video_url">未上传</text>
			<text v-else style="color: #659E37;">已上传</text>
		</view>
		<view v-if="userState.status == 3 && userState.video_url == null" :class="['authentic_sub', user.video_url ? 'authentic_sub_2': '']"  @tap="subVideoIns">
			<text>确认</text>
		</view>
		<!-- 进入审核步骤 -->
		<view class="order_examine" v-if="userState.status == 3 && userState.video_url != null">
			<text>视频认证信息已提交，请耐心等待，正在审核！</text>
			
		</view>
		<!-- 进入身份证审核失败页 -->
		<view class="audit_failed" v-if="userState.status == 4">
			<text>录制视频不符合要求，请重新提交！</text>
			<view class="reSub" @tap="reSubVideo">
				重新提交
			</view>
		</view>
		<!-- 进入身份证审核失败页 -->
		<view class="audit_failed" v-if="userState.status == 5">
			<text>已完成实名认证！</text>
		</view>
		
	</view>
</template>

<script>
	import idCardNumberVerify from '@/common/api/idCard.js'
	export default {
		data() {
			return {
				user:{
					name: "", // 姓名
					cardId: "", // 身份证号
					front: '../../../static/icon_identity card1.png', // 存放身份证前脸照
					behind: '../../../static/icon_national emblem1.png' ,// 存放身份证国徽照
					video_url: "",	// 存放用户上传视频地址
				},
				newFront: "", // 正面缩略图
				newBehind: "",// 反面缩略图
				userState: {
					// status: 0,
					video_url: null
				},  // 用户实名状态
				random: '',
				// getws: '777',
				sourceIosAnd: '',
				
				
			};
		},
		onLoad() {
			// 调用获取用户实名认证
			this.obtainRealInfo()
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'android') {
			    this.sourceIosAnd= ['camera', 'album']
			} else{
			    this.sourceIosAnd= ['album']
			}
			var regex = new RegExp(',', 'g');
			this.random = this.generateSingleDigitStrings().toString().replace(regex, '')
		},
		onPullDownRefresh() {
			this.obtainRealInfo()
		},
		methods: {
			generateSingleDigitStrings() {
				const singleDigitStrings = [];

				while (singleDigitStrings.length < 4) {
					const randomInt = Math.floor(Math.random() * 10); // 生成0到9之间的随机整数
					const randomString = randomInt.toString(); // 将整数转换为字符串
					if (!singleDigitStrings.includes(randomString)) {
						singleDigitStrings.push(randomString);
					}
				}
		
				return singleDigitStrings;
			},
			// 重新提交视频
			reSubVideo() {
				// 状态变为3， 提交录制视频页面
				this.userState.status = 3
				// 用户存储的视频地址 变为空
				this.user.video_url = null
				this.userState.video_url = null
			},
			
			// 点击录制视频
			videoRecording() {
				console.log('208',this.sourceIosAnd)
				// // #ifdef H5
				// 	uni.showToast({
				// 		title: "请在APP端录制",
				// 		icon: 'none'
				// 	})
				// 	return
				// // #endif
			    let that = this;
			       //弹出提示框
			    uni.showModal({
			        content: '视频最长录制15s',
			        showCancel: false,
			        success: () => {
			            uni.chooseVideo({
			                count: 1,//只录制一个视频
			                sourceType: this.sourceIosAnd,
			                maxDuration: 15,//时长30s
			                mediaType: ['video'],//类型为视频
							
			                success: res => {
								
								const arr = [res.tempFilePath]
			                    //录制成功
								uni.showLoading({
									title: '验证中'
								});         
								this.getws = res
								console.log('res2211',res.tempFilePath);
								console.log('res2200',res);
								// 上传视频到服务器
								that.upVideo(arr)
								
			                    //存储到本地
			                fail: (err) => {
			　　　　　　　　　　　　//提示
			                    uni.showToast({
			                        title: '视频录制失败！',
			                        duration: 2000
			                    });
			                }
			            
			                       }
								   })
			            }
			    });
			
			},
			// 提交视频拦截检查
			subVideoIns() {
				if(!this.user.video_url) {
					uni.showToast({
						title: "请先录制视频",
						icon: 'none'
					})
					return
				}
				// 请求提交视频
				this.subVideo()
			},
			// 提交视频
			subVideo() {
				// 提交用户信息接口
				let that = this;
				let params = {
					apply_step: '2',			// 步骤 ， 第2步
					video_url: this.user.video_url		//上传视频地址
				}; //参数
				// 提交身份证实名信息
				that.$api.tokenTimeOut("/user/saveIdentify", "POST", params).then(res => {
					
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					// 调用获取用户最新实名信息函数，判断用户是否已经有视频地址在服务器，有地址，就跳到审核状态
					this.obtainRealInfo()
				})
			},
			// 限制身份证输入规则
			cardIdInput(e) {
				const o = e.target;
				const inputRule = /[\W]/g  //修改inputRule 的值
				this.$nextTick(function() {
					this.user.cardId = o.value.replace(inputRule , '');
				})
			},
			//提交身份证信息拦截器
			subIntercept() {
				// 姓名和密码都是空的情况下
				if(!this.user.cardId  || !this.user.name) {
					uni.showToast({
						title: "请填写完整信息",
						icon: 'none'
					})
					return 
				}
				// 判断一下身份证是否合规
				var idCardMsg = idCardNumberVerify.identityIDCard(this.user.cardId);
				if (!idCardMsg.isPass) {
					uni.showToast({
						title: idCardMsg.errorMsg,
						icon: 'none'
					})
					return;
				}
				if(this.user.front.indexOf('http') == -1 || this.user.behind.indexOf('http') == -1) {
					uni.showToast({
						title: '请上传身份证证件照！',
						icon: 'none'
					})
					return;
				}
				// 调用提交身份证信息函数
				this.subUserInfo()
				
			},
			// 提交用户信息
			subUserInfo() {
				// 提交用户信息接口
				let that = this;
				let params = {
					apply_step: 1,
					id_card_front:  this.user.front, 	//  身份证正面
					id_card_back: this.user.behind, 		// 身份证反面
					real_name: this.user.name,		// 姓名
					id_number: this.user.cardId		// 身份证号
				}; //参数
				// 提交身份证实名信息
				that.$api.tokenTimeOut("/user/saveIdentify", "POST", params).then(res => {
					
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					// 立即刷新用户信息
					this.obtainRealInfo()
					
				})
			},
			// 获取实名信息函数
			obtainRealInfo() {
				let that = this
				// 获取用户实名状态
				that.$api.tokenTimeOut("/user/identifyInfo", "GET").then(res => {
					if(res.code == 0) {
						uni.stopPullDownRefresh()
						// 判断是否实名
						if (res.data.is_identify == 3) {
							that.$set(this.userState, 'status', 5)
							return
						}
						
						// 判断一下data里面有没有数据，如果没有数据就不进行赋值操作
						if(res.data && res.data.is_identify != 0) {
							that.userState = res.data
						} else {
							that.$set(this.userState, 'status', 0)
						}
					}
					
				})
			},
			// 上传身份证正反面
			selectAuthentic(clickRes) {
				
				let that = this 
				uni.chooseImage({
					count: 1, 
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: function (res) {
						uni.showLoading({
							title: '验证中'
						});
						let strList = res.tempFilePaths
						// const formData = new FormData({ flie: res})let url = res.tempFiles[0].name;
						// #ifdef H5
						let url = res.tempFiles[0].name   //域名
						// #endif
						// #ifdef APP-PLUS || MP
						let url = res.tempFiles[0].path
						// #endif
						let index = url.lastIndexOf(".");
						let jpgUrl = url.substr(index + 1);
						if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg" && jpgUrl != "gif" && jpgUrl != "JPG" && jpgUrl != "JPEG" && jpgUrl != "PNG" && jpgUrl != "GIF" && jpgUrl != "HEIC" && jpgUrl != "heic" ) {
							uni.showToast({
								icon: "none",
								title: "请上传格式为jpg,png,jpeg,gif"
							});
						} else {
							if(clickRes) {
								that.upPicture(clickRes, strList)
								// that.upPicture(clickRes, strList)
								// let strList = res.tempFilePaths[0].split('\"')
								//   strList = strList[0].split('file:\/\/') 
								//  // 
								// // 
								// that.user.front = strList[1]; 
							}else {
								that.upPicture(clickRes, strList)
								// let strList = res.tempFilePaths[0].split('\"')
								//   strList = strList[0].split('file:\/\/') 
								// //  
								// // 
								// that.user.behind = strList[1]; 
							}
						}
					}
				});
				// // #ifdef H5
				// 		uni.showToast({
				// 			title: "请在APP端进行实名认证",
				// 			icon: "none",
				// 			duration: 2000
				// 		});
				// // #endif
			},
			// 上传图片到服务器
			upPicture(type, address) {
				// const fildData = new FormData()
				// fildData.push()
				let that = this
				let upType = '' // 上传类型
				// 身份证前面
				if (type) {
					upType = 'id_card_front'
				}else {
					upType = 'id_card_back'
				}
				let params = {
					upload_type: upType, // 上传类型
					filePath: address // 上传的图片地址
				}; //参数
				that.$api.flieUpload("/uploadImg", params).then(res => {
					
					const {code, data, msg} = JSON.parse(res) 
					if (code == 0) {
						if (type) {
							that.newFront = data.thumb_url
							that.user.front = data.url
						}else {
							that.newBehind = data.thumb_url
							that.user.behind = data.url
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
			// 上传视频到服务器
			upVideo(address) {
				let that = this
				let params = {
					upload_type: 'video', // 上传类型
					filePath: address // 上传的图片地址
				}; //参数
				that.$api.flieUpload("/uploadImg", params).then(res => {
					uni.hideLoading();
					const {code, data} = JSON.parse(res)
					if (code == 0) {
						that.user.video_url = data.url
					}
					// if (res.code == 0) {
					// 	that.user.video_url = res.data.path
					// }
				})
			}
		},
		}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	.authentic {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.authentic_tip {
			height: 45rpx;
			padding-left: 35rpx;
			line-height: 1.1;
			display: flex;
			align-items: flex-end;
			color: #636363;
			font-size: 24rpx;
		}
		.authentic_step {
			position: relative;
			width: 540rpx;
			height: 135rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			.authentic_step_line {
				flex: 1;
				height: 5rpx;
				background-color: #C9C7C7;
			}
			.authentic_step_line_light {
				background-color: #3D63C5 !important;
			}
			.authentic_step_state,
			.authentic_step_state_2,
			.authentic_step_state_3{
				position: absolute;
				
				width: 100rpx;
				height: 80rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.step_state {
					width: 40rpx;
					height: 40rpx;
					background-color: #C9C7C7;
					border-radius: 50%;
					text-align: center;
					line-height: 40rpx;
					color: #fff;
				}
				.step_state_light {
					background-color: #3D63C5;
				}
				>text { 
					font-size: 22rpx;
					color: #636363;
				}
			}
			.authentic_step_state {
				top: 50%;
				left: 0;
				transform: translate(-50%, -25rpx);
				
			}
			.authentic_step_state_2 {
				top: 50%;
				left: 50%;
				transform: translate(-50%, -25rpx);
			}
			.authentic_step_state_3 {
				top: 50%;
				right: 0;
				transform: translate(50%, -25rpx);
			}
		}
		.authentic_info {
			padding-left: 35rpx;
			margin-top: 90rpx;
			height: 25rpx;
			font-size: 24rpx;
			line-height: 25rpx;
			color: #636363;
		}
		.authentic_input {
			height: 115rpx;
			margin: 0 35rpx;
			display: flex;
			align-items: flex-end;
			border-bottom: 1rpx solid #3f3f3f;
			>input {
				font-size: 24rpx;
				margin-bottom: 30rpx;
				color: #636363;
			}
			.authentic_input_box {
				width: 150rpx;
				height: 115rpx;
				display: flex;
				align-items: flex-end;
				>text {
					font-size: 24rpx;
					color: #636363;
					margin-bottom: 30rpx;
				}
			}
		}
		.authentic_info_2 {
			padding-left: 35rpx;
			margin-top: 80rpx;
			height: 25rpx;
			font-size: 24rpx;
			line-height: 25rpx;
			color: #636363;
		} 
		.authentic_card {
			margin-top: 30rpx;
			height: 200rpx;
			display: flex;
			.authentic_card_front {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				>image {
					width: 227rpx;
					height: 144rpx;
				}
				.card_front_camera {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 280rpx;
					height: 190rpx;
					background-size: 280rpx 190rpx;
				}
			} 
		}
		.card_text {
			height: 30rpx;
			font-size: 21rpx;
			line-height: 1;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-around;
			color: #636363;
		}
		.authentic_sub{
			width: 650rpx;
			height: 60rpx;
			margin: 95rpx auto 0 auto;
			background-color: #001eca;
			border-radius: 30rpx;
			font-size: 22rpx;
			line-height: 60rpx;
			text-align: center;
			color: #fff;
		}
		.authentic_sub_2 {
			background: #001eca;
		}
		// 提交身份证等待审核
		.order_examine {
			padding: 0 35rpx;
			margin-top: 80rpx;
			height: 25rpx;
			text-align: center;
			font-size: 30rpx;
			line-height: 25rpx;
			color: #636363;
			
		}
		// 身份证审核失败
		.audit_failed {
			padding: 0 35rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			>text {
				margin-top: 80rpx;
				color: #636363;
				line-height: 1;
			}
			.reSub {
				width: 650rpx;
				height: 60rpx;
				border-radius: 30rpx;
				background: #001eca;
				text-align: center;
				font-size: 22rpx;
				line-height: 60rpx;
				color: #fff;
				margin-top: 95rpx;
			}
		}
		// 进入提交录像 state = 3
		.authentic_info_step2 {
			padding-left: 35rpx;
			margin-top: 90rpx;
			height: 25rpx;
			font-size: 22rpx;
			line-height: 25rpx;
			color: #636363;
		}
		.authentic_step2_tip {
			padding-left: 35rpx;
			margin-top: 25rpx;
			height: 25rpx;
			font-size: 25rpx;
			line-height: 25rpx;
			color: #636363;
		}
		.authentic_step2_but {
			height: 75rpx;
			margin-top: 25rpx;
			padding: 0 35rpx;
			display: flex;
			justify-content: space-between;
			.authentic_step2_number {
				width: 410rpx;
				height: 75rpx;
				background-color: #C9C7C7;
				border-radius: 10rpx;
				text-align: center;
				line-height: 75rpx;
				font-size: 36rpx;
				color: #fff;
			}
			.authentic_step2_transcribe {
				width: 240rpx;
				height: 75rpx;
				background-color: #3D63C5;
				border-radius: 10rpx;
				text-align: center;
				line-height: 75rpx;
				font-size: 21rpx;
				color: #fff;
			}
		}
		.authentic_step2_state {
			height: 25rpx;
			margin-top: 25rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			line-height: 1;
			color: #636363;
		}
	}
</style>