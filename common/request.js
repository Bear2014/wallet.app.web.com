
import { addressApi, wsUrlTest } from "./address.js"

export const request = (url, method, params, foreAddress) => { //url接口，  method类型， params参数 ， tokens登录获取的token(可根据自己需要填写)
	return new Promise((resolve, reject) => {
		// #ifdef H5
		const baseUrl = "/api"   //域名
		// #endif

		// #ifdef APP-PLUS || MP
		const baseUrl = addressApi[foreAddress] + "/api"
		// #endif
		// params.devices = 'embed'
		if (params) {
			params = { ...params, devices :'embed'}
		} else {
			params = { devices :'embed' }
		}
		uni.request({
			//请求头
			method: method,
			url: baseUrl + url,
			data: params,
			header: {
				Authorization: 'Bearer ' + uni.getStorageSync('token_H5')
			}
		})
			.then((response) => {
				// 请求成功后的处理
				// log.console("您好进来了")
				
				if (response.data.code == 0) { //  用户登入状态正常情况下
					if (response.header.authorization !== undefined) {
						
						// 更新用户 token 到本地
						uni.setStorage({
							// bearer_token: res.data.bearer_token,
							key: 'token',
							data: response.header.authorization.split(' ')[1],
							success: function () {
								
							}
						});
					}
					resolve(response.data)
				} else if (response.data.code == 401) {  // 用户登入状态登入超时

					// 加载动画
					uni.showLoading({
						title: '加载中'
					});

					setTimeout(() => {
						try {
							// 1.删除用户token信息
							uni.removeStorageSync('token');
							// 2.删除用户存储信息
							uni.removeStorageSync('user_info_1');
						} catch (e) {
							// error
						}
						//隐藏加载框
						uni.hideLoading();

						// 3.关闭当前页面，跳转到登入页
						// uni.redirectTo({
						// 	url: '/pages/login/login',
						// });

						//隐藏加载框
						uni.hideLoading();
						uni.showToast({
							title: "登入超时！",
							icon: "none",
							duration: 1000
						});
					}, 1000)
				} else if (response.data.code == 50000){
					uni.showToast({
						title: response.data.msg,
						icon: "none",
						duration: 1500
					});
					resolve(response.data)
				} else { // 其他情况
					resolve(response.data)
				}
				// uni.hideLoading();
			}).catch((err) => {
				reject(err)
				// 请求失败后的处理
				setTimeout(() => {
					uni.showToast({
						title: "连接异常，请检查网络！",
						icon: "none",
						duration: 1000
					});
				}, 3000)
				
			})
	})
}

export const sendUploadFile = (url, params, foreAddress = "baseUrlTest") => {
	// #ifdef H5
	const baseUrl = "/api"   //域名
	// #endif

	// #ifdef APP-PLUS || MP
	const baseUrl = addressApi[foreAddress] + '/api'
	// #endif
	var token = uni.getStorageSync('token_H5') || '';
	
	
	return new Promise(function (resolve, reject) {
		uni.uploadFile({
			url: baseUrl + url, //仅为示例，非真实的接口地址
			filePath: params.filePath[0],
			header: {
				Authorization: 'Bearer ' + uni.getStorageSync('token_H5'),
			},
			name: 'file',
			formData: {
				upload_type: params.upload_type,
				order_no:params.order_no
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			}
		});
	})

	
}

// export const WSRequest = (url, method, params, tokens, foreAddress = "wsUrlTest") => {
// 	return new Promise((resolve, reject) => {
// 		// #ifdef H5
// 		const baseUrl = "/ggb"   //域名
// 		// #endif

// 		// #ifdef APP-PLUS || MP
// 		const baseUrl = addressApi[foreAddress] 
// 		// #endif
// 		uni.request({
// 			//请求头
// 			method: method,
// 			url: baseUrl + url,
// 			data: params,
// 			header: {
// 				'content-Type': 'application/json'
// 			},
// 		}).then(response => {
			
// 			if (response.data.code == 0) {
// 				resolve(response.data)
// 			}
// 		}).catch(err => {
// 			reject(err)
// 		})
// 	})
// }


// export const WSRequestUpload = (url,files, params, foreAddress = "wsUrlTest") => {
// 	return new Promise((resolve, reject) => {
// 		// #ifdef H5
// 		const baseUrl = "/ggb"   //域名
// 		// #endif

// 		// #ifdef APP-PLUS || MP
// 		const baseUrl = addressApi[foreAddress] 
// 		// #endif
// 		uni.uploadFile({
// 			url: baseUrl + url, //仅为示例，非真实的接口地址
// 			filePath: files,
// 			// header: {
// 			// 	Authorization: 'Bearer ' + uni.getStorageSync('token')
// 			// },
// 			name: 'files',
// 			formData: params,
// 			success: (res) => {
// 				resolve(res.data)
// 			},
// 			fail: err => {
// 				reject(err)
// 			}
// 		});
// 	})
// }