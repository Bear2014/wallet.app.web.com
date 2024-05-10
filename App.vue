
<script>
	export default {
		onLaunch: function() {
			this.noticePermissions();
			this.setCid()
			uni.onTabBarMidButtonTap(() => {

				uni.scanCode({
					success: function(res) {

						if (res.scanType == 'QR_CODE' && res.result.indexOf('order=') != -1) {
							let urlData = {
								data: res.result.split('=')[1]
							}

							uni.navigateTo({
								url: `/pages/indexPage/transOrder/transOrder?urlData=${encodeURIComponent(JSON.stringify(urlData))}`
							})
							return
						}
						if (res.scanType == 'QR_CODE' && res.result.length == 20) {
							uni.navigateTo({
								url: '/pages/indexPage/transaccounts/transaccounts?walletAddr=' +
									res.result
							})
						} else {
							uni.showToast({
								title: "请扫描正确二维码",
								icon: "none",
								duration: 2000
							});
						}

					}
				});

			});

		},
		onShow: function() {
			//  #ifdef APP-PLUS
		      setTimeout(function() {
		        plus.push.clear();
		      }, 1000);
			// #endif
		},
		onHide: function() {

		},
		methods: {
			setCid() {
				//  #ifdef APP-PLUS
				var clientid;
				var timer = setInterval(function() {
					if (clientid != null && clientid != "null") {
						clearInterval(timer);
						return;
					}
					clientid = plus.push.getClientInfo().clientid;
					uni.setStorage({
						key: 'cid',
						data: clientid
					});

				}, 500);

				// #endif
			},

			noticePermissions() {
				// #ifdef APP-PLUS
				if (plus.os.name == 'Android') { // 判断是Android
					var main = plus.android.runtimeMainActivity();
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute("uid");
					var NotificationManagerCompat = plus.android.importClass(
						"android.support.v4.app.NotificationManagerCompat");
					//android.support.v4升级为androidx
					if (NotificationManagerCompat == null) {
						NotificationManagerCompat = plus.android.importClass(
							"androidx.core.app.NotificationManagerCompat");
					}
					var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
					// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
					if (!areNotificationsEnabled) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
							showCancel: false,
							confirmText: '去设置',
							success: function(res) {
								if (res.confirm) {
									var Intent = plus.android.importClass('android.content.Intent');
									var Build = plus.android.importClass("android.os.Build");
									//android 8.0引导  
									if (Build.VERSION.SDK_INT >= 26) {
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
									} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra("app_package", pkName);
										intent.putExtra("app_uid", uid);
									} else { //(<21)其他--跳转到该应用管理的详情页  
										intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
										var uri = Uri.fromParts("package", mainActivity.getPackageName(),
											null);
										intent.setData(uri);
									}
									// 跳转到该应用的系统通知设置页  
									main.startActivity(intent);
								}
							}
						});
					}
				} else if (plus.os.name == 'iOS') { // 判断是ISO
				// this.initPush()
					var isOn = undefined;
					var types = 0;
					var app = plus.ios.invoke('UIApplication', 'sharedApplication');
					var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
					if (settings) {
						types = settings.plusGetAttribute('types');
						plus.ios.deleteObject(settings);
					} else {
						types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
					}
					plus.ios.deleteObject(app);
					plus.push.addEventListener("receive", function(msg) {
						//这里可以写跳转业务代码
						if (msg.type == "receive") // 这里判断触发的来源，否则一直推送。  
						{
								let content = 'iPay', option = {
									'cover': false,
									'when': new Date(),
									'title': msg.title
								}, body = {
									'id': 'id',
									'key': 'key'
								} ;
								let payLoad = JSON.stringify(body)
								plus.push.createMessage(msg.payload, payLoad, option)
						}
					}, false);
					isOn = (0 != types);
					if (isOn == false) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
							showCancel: false,
							confirmText: '去设置',
							success: function(res) {
								if (res.confirm) {
									var app = plus.ios.invoke('UIApplication', 'sharedApplication');
									var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
									plus.ios.invoke(app, 'openURL:', setting);
									plus.ios.deleteObject(setting);
									plus.ios.deleteObject(app);
								}
							}
						});
					}
				}
				// #endif
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F4F3F3;
		/* padding: 2% 37%; */
		/* background-color: rgba(255, 255, 255, 0.9); */
	}
	/*  #ifdef  H5  */
	body {
		/* padding-top: 3%; */
	  max-width: 828rpx;  //最大宽度自己可以调整
	  margin: auto !important;
	}
	.uni-tabbar{
		padding-bottom: 3%;
		width: 810rpx;
		margin: 0 auto;
	}
	/*  #endif  */
	
	
</style>