// const WsUrl = "ws://13.229.216.5::8282?role=py"//线上 第一套
const WsUrl = "ws://wdqcawqdqx.com:8282?role=py"//线上 hk
// const WsUrl = "ws://47.128.252.36:8282?role=py" // 测试

export var socket = null
export function StartWebsocket(name,id,token = uni.getStorageSync('token')) {
    return new Promise((resolve, reject) => {
        if (!socket ) {
            socket = uni.connectSocket({
                url: WsUrl + '&token=' + encodeURIComponent(token) ,
                // success:(res)=>{
                //     
                // },
                complete: (res) => {
                    // 
                 }
            });


            // let  logdata={
            //     "type":"login",
            //     "from_name":name,
            //     "from_id":id,
            //     "to_id":"7",
            //     "to_name":"客服2",
            //     "content":{
            //         "content_type":"text",
            //         "content":"玩家呼叫客服"
            //     },
            //     "time":"2023-10-17 17:15:55"
            // }
            socket.onOpen(() => {
                handleSocketOpen(name,id)
				// socket.send(JSON.stringify(logdata))
                // uni.sendSocketMessage({
                //     data: JSON.stringify(logdata),
                //     success: (res) => {
                //         

                //     },
                //     fail(err) {
                //         // 发送失败处理
                //     }
                // });
                resolve(1)
				// 
            })
            // 在这里拿到数据
            socket.onMessage((res) => {
                // 
                // resolve(res.data)
                handleMessage(res.data);

            })
            socket.onError((error) => {
                handleSocketError(error)
                
            })
            socket.onClose((res) => {
                handleSocketClose()
                resolve(1)
            })

        } else {
            resolve(1)
        }
    })
    // uni.onSocketOpen(function (res) {
    // 	handleSocketOpen()
    // });
    // uni.onSocketError(function (error) {
    // 	handleSocketError(error)
    // });
    // uni.onSocketClose(function (res) {
    // 	handleSocketClose()
    // 	
    // });
    uni.onSocketMessage(function (res) {
    	// getMessage(res)
        
    });
}
function handleMessage(message) {
    // 将消息传递给a页面
    let newdata = JSON.parse(message)
    // 
    // return
    uni.$emit('getMsg', newdata);
  }
// 监听WebSocket连接打开事件
function handleSocketOpen(name,id) {
    
    startHeartbeat(name,id); // 连接成功后开启心跳定时器
}
// 开启心跳定时器
let heartbeatTimer = null; // 心跳定时器
function startHeartbeat(name,id) {
    heartbeatTimer = setInterval(() => {
        sendHeartbeat(name,id);
    }, 3000); // 每3秒发送一次心跳消息
}
// 发送心跳消息
function sendHeartbeat(name,id) {
    uni.sendSocketMessage({
        // data: "heartbeat"
        data:JSON.stringify({
            "type":"pong",
            "from_name":name,
            "from_id":id,
            "to_id":"6",
            "to_name":"客服1",
            // "content":{
            //     "content_type":"text",
            //     "content":`heartbeat`
            // },
            // "time":"2023-10-17 17:15:55" 
        })
    });
}
//关闭websocket
export function CloseWebsocket() {
    
    if (socket) {
        socket.close();
    }
}
// 监听WebSocket连接关闭事件
function handleSocketClose() {
    
    socket = null
    clearInterval(heartbeatTimer); // 连接关闭时清除心跳定时器
}
// 监听WebSocket连接错误事件
function handleSocketError(error) {
    
    if (socket) {
        socket.close();
        socket = null
        clearInterval(heartbeatTimer);
    }
    setTimeout(() => {
        
        StartWebsocket();
    }, 3000);
}
// const uploadFile = (options = {}) => {
//     // if (uni.getStorageSync('token') !== '') {
//     //     options.header.WXAuthorization = 'Bearer ' + uni.getStorageSync('token');
//     // }
//     options.header['content-type'] = 'multipart/form-data;charset=utf-8';
//     return new Promise((resolve, reject) => {
//         // 
//         uni.uploadFile({
//             header: options.header,
//             url: options.url,
//             // filePath: options.data.filePath,
//             name: 'files',
//             formData: options.formData,
// 			// timeout:options.timeout,
//             success: (res) => {
//                 if (typeof res.data === 'string') res.data = JSON.parse(res.data);
//                 resolve(res);
//             },
//             fail: (err) => {
// 				uni.hideLoading();
// 				let errMsgs = err.errMsg.split(" ");
// 				if(errMsgs.includes("timeout")){
// 					uni.showToast({
// 					    title: '请求超时',
// 					    icon: 'error'
// 					});
// 				}else{
// 					 reject(err);
// 				}
//             }
//         });
//     });
// };
// export default uploadFile

