<template>
    <view class="customer">
        <view class="customer_top_state"></view>

        <navigation :navigationText="`客服${connected ? '在线' :'离线' }`" style="height: 100rpx;"></navigation>

        <scroll-view :style="{ height: `${windowHeight - inputHeight - 100 - 88}rpx` }" ref="scrollView" id="scrollview" scroll-y="true" :refresher-enabled="hosity && youkefuid" refresher-background="transparent" @refresherrefresh="gethiost"
        :refresher-triggered="triggered"
            :scroll-top="scrollTop" class="scroll-view" @tap="showTool = false" style="z-index: 99999;">
            <!-- <view @click="offbut()" style="width: 100%;background-color: rebeccapurple;height: 30prx;">关闭</view> -->

            <view v-if="hosity && !youkefuid" style="width: 100%;padding: 20rpx 0;display: flex;align-items: center;justify-content: center;">
                <view  style="padding: 6rpx 18rpx;background-color: #f2f2f2;font-size: 24rpx;">下拉查询历史消息</view>
            </view>
            <view class="chat-body" id="chatBody">
                <!-- 历史记录 -->
                <view v-for="(item, index) in hoslist" :key="index">
                    <!-- 自己发的消息 -->
                    <view class="item self" v-if="!checkFromNameContainsCustomer(item.from_name)">
                        <!-- 文字内容 -->
                        <view class="content right" v-if="item.content.content_type == 'text'">
                            {{ item.content ? item.content.content : '' }}
                            <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content right"
                            v-if="item.content.content_type == 'pic'">
                            <img style="width: 100%;" :src="item.content ? item.content.content : ''" alt="">
                            <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view  style="display: flex;align-items: center;justify-content: center;" class="content right"
                            v-if="item.content.content_type == 'video'">
                            <!-- {{item.content ?item.content.content : ''}} -->
                            <!-- <video :src="item.content ? item.content.content : ''"
                                :poster="item.content ? item.content.content : ''" controls></video> -->
                                <Video  :onloadCode="item.content ? `const url='${item.content.content}'${newzz} `: '' " />  
                                <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <!-- 头像 -->
                        <view class="avatar">
                            <image src="@/static/avatar19.png" mode=""></image>
                        </view>
                    </view>

                    <!-- 机器人发的消息 -->
                    <view class="item Ai" v-if="checkFromNameContainsCustomer(item.from_name)">
                        <!-- 头像 -->
                        <view class="avatar">
                            <image src="@/static/logo.png" mode=""></image>
                        </view>
                        <!-- 文字内容 video-->
                        <view class="content left" v-if="item.content.content_type == 'text'">
                            {{ item.content ? item.content.content : '' }}
                            <view class="left-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content left"
                            v-if="item.content.content_type == 'pic'">
                            <img style="width: 100%;" :src="item.content ? item.content.content : ''" alt="">
                            <view class="left-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content left"
                            v-if="item.content.content_type == 'video'">
                            <!-- {{item.content ?item.content.content : ''}} -->
                            <!-- <video :src="item.content ? item.content.content : ''"
                                :poster="item.content ? item.content.content : ''" controls></video> -->
                                <Video  :onloadCode="item.content ? `const url='${item.content.content}'${newzz} `: '' " />  
                                <view class="left-small-font">{{ item.time  || ''}}</view>
                        </view>
                    </view>
                </view>
            </view>

                 <view v-if=" hoslist.length>0" style="width: 100%;padding: 20rpx 0;display: flex;align-items: center;justify-content: center;">
                        <view  style="padding: 6rpx 18rpx;font-size: 24rpx;color: #999;">以上是历史记录</view>
                    </view>




            <!-- 聊天主体 -->
            <view id="msglistview" class="chat-body">
                <!-- 聊天记录 -->
                <view v-for="(item, index) in msgList" :key="index">
                    <!-- 自己发的消息 -->
                    <view class="item self" v-if="!checkFromNameContainsCustomer(item.from_name)">
                        <!-- 文字内容 -->
                        <view class="content right" v-if="item.content.content_type == 'text'">
                            {{ item.content ? item.content.content : '' }}
                            <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content right"
                            v-if="item.content.content_type == 'pic'">
                            <img style="width: 100%;" :src="item.content ? item.content.content : ''" alt="">
                            <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view  style="display: flex;align-items: center;justify-content: center;" class="content right"
                            v-if="item.content.content_type == 'video'">
                            <!-- {{item.content ?item.content.content : ''}} -->
                            <!-- <video :src="item.content ? item.content.content : ''"
                                :poster="item.content ? item.content.content : ''" controls></video> -->
                                <Video  :onloadCode="item.content ? `const url='${item.content.content}'${newzz} `: '' " />  
                                <view class="right-small-font">{{ item.time || '' }}</view>
                        </view>
                        <!-- 头像 -->
                        <view class="avatar">
                            <image src="@/static/avatar19.png" mode=""></image>
                        </view>
                    </view>

                    <!-- 机器人发的消息 -->
                    <view class="item Ai" v-if="checkFromNameContainsCustomer(item.from_name)">
                        <!-- 头像 -->
                        <view class="avatar">
                            <image src="@/static/logo.png" mode=""></image>
                        </view>
                        <!-- 文字内容 video-->
                        <view class="content left" v-if="item.content.content_type == 'text'">
                            {{ item.content ? item.content.content : '' }}
                            <view class="left-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content left"
                            v-if="item.content.content_type == 'pic'">
                            <img style="width: 100%;" :src="item.content ? item.content.content : ''" alt="">
                            <view class="left-small-font">{{ item.time || '' }}</view>
                        </view>
                        <view style="display: flex;align-items: center;justify-content: center;" class="content left"
                            v-if="item.content.content_type == 'video'">
                            <!-- {{item.content ?item.content.content : ''}} -->
                            <!-- <video :src="item.content ? item.content.content : ''"
                                :poster="item.content ? item.content.content : ''" controls></video> -->
                                <Video  :onloadCode="item.content ? `const url='${item.content.content}'${newzz} `: '' " />  
                                <view class="left-small-font">{{ item.time  || ''}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部消息发送栏 -->
        <!-- 用来占位，防止聊天消息被发送框遮挡 -->
        <view class="chat-bottom" :style="{ height: `${inputHeight}rpx` }">
            <view class="send-msg" :style="{ bottom: `${keyboardHeight}rpx` }">
                <view class="send_box">

                    <view class="uni-textarea">
                        <textarea v-model="chatMsg" maxlength="300" confirm-type="send" @confirm="handleSend"
                            :show-confirm-bar="false" :adjust-position="false" @linechange="sendHeight" @focus="focus"
                            @blur="blur" auto-height></textarea>
                    </view>
                    <button @click="handleSend" class="send-btn">发送</button>
                    <view class="add_icon">
                        <image src="@/static/add.png" mode="" @tap="showTool = !showTool"></image>
                    </view>
                </view>
                <view class="select_tool" v-if="showTool">
                    <view class="select_tool_photo" @tap="selectPhoto">
                        <image src="@/static/photo.png" mode=""></image>
                    </view>
                    <view class="select_tool_photo" @tap="selectVideo">
                        <image src="@/static/Videotape-1.png" mode=""></image>
                    </view>
                </view>
            </view>


        </view>
    </view>
</template>
<script>
import { StartWebsocket, CloseWebsocket, } from '@/common/api/webSockt.js'
import Video from './video/index.vue'
export default {
    components: {  
            Video  
        },
    data() {
        return {
            newzz:`\n this.contentWindow.document.body.innerHTML = '<video style="width: 100%;height: 100%" controls="controls" src="'+url+'"></video>';  
                const iframe = top.document.getElementsByTagName('iframe')[0]  
                var evObj = document.createEvent('MouseEvents');  
                evObj.initEvent( 'event1', true, false );  
                iframe.dispatchEvent(evObj)`,
            currentDate:'20231103',
            //键盘高度
            keyboardHeight: 0,
            //底部消息发送高度
            bottomHeight: 0,
            //滚动距离
            scrollTop: 0,
            userId: '',
            //发送的消息
            chatMsg: "",

            msgList: [
                {
                    "type": "text",
                    "from_name": "客服1",
                    "from_id": "7",
                    "to_id": "5",
                    "to_name": "测试1",
                    "content": {
                        "content_type": "text",
                        "content": "hello，请问我有什么可以帮助你的吗？"
                    },
                    "time": "2023-10-17 17:15:55"
                },
                {
                    "type": "text",
                    "from_name": "测试1",
                    "from_id": "5",
                    "to_id": "7",
                    "to_name": "客服1",
                    "content": {
                        "content_type": "text",
                        "content": "你好呀我想问你一件事"
                    },
                    "time": "2023-10-17 17:15:55"
                }
            ],
            phone: uni.getStorageSync("user_info_1_H5").phone,
            showTool: false, // 显示工具栏
            uploadFile1: '',
            connected:false, //判断玩家是否在线
            page:1,//历史记录请求
            hosity:true,//控制是否有历史记录 默认请求一次
            triggered:false,//控制下拉状态
            _freshing:false,
            hoslist:[],//历史记录列表
            totl:'', //历史记录的长度

            youkefuname:'',
            youkefuid:'',//游客来对用的客服
        }
    },
    updated() {
        //页面更新时调用聊天消息定位到最底部
        // this.scrollToBottom();
    },
    computed: {
        windowHeight() {
            return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
        },
        // 键盘弹起来的高度+发送框高度
        inputHeight() {
            return this.bottomHeight + this.keyboardHeight
        }
    },
    onLoad(options) {
        this.msgList.forEach(msg => {
          msg.time = this.getCurrentTime();
        });
        
        this.myid = options.niid
        this.myname = options.niname

        this.youkefuid = options.xxid || ''
        this.youkefuname = options.xxname || ''

        this.currentDate = this.getCurrentDate();
        // uni.onKeyboardHeightChange(res => {
        //     //这里正常来讲代码直接写
        //     //this.keyboardHeight=this.rpxTopx(res.height)就行了
        //     //但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
        //     this.keyboardHeight = this.rpxTopx(res.height - 30)
        //     if (this.keyboardHeight < 0) this.keyboardHeight = 0;
        // })


        // uni.setStorageSync('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC84LjIxNy4xNzguNDY6ODhcL2FwaVwvbG9naW4iLCJpYXQiOjE3MDAwMTU4MjAsImV4cCI6MTcwMTIyNTQyMCwibmJmIjoxNzAwMDE1ODIwLCJqdGkiOiJHRGRZeHpLTTJKZmFPY3pkIiwic3ViIjozLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.wlA9snhs-Di3lNZUWcWxdxLg1hX_Z53Pyv8voda1dmI')
   
        // this.getBucker()  // 获取到：  http:\/\/192.168.5.20:9000\/20231120
    },
    onShow() {
        uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
        // let that = this
        // setTimeout(() => {
        // 	uni.onSocketMessage((res) => {
        // 		let obj = JSON.parse(res.data)
        // 		
        // 		// that.onMessageHandle(obj)
        // 	});
        // },1000)

        // 这里初始化
        StartWebsocket( this.myname ,this.myid )
        let that = this
        uni.$off('getMsg');
        uni.$on('getMsg', (event) => {
            let message = event
            // if(kefulist.length == 0 &&  JSON.parse(res.data).type == "connect"){
            //         let jssrt = JSON.parse(res.data).content.content
            //         kefulist = JSON.parse(jssrt)
            //         

            //     }
            // 先获取客服列表 再进行登录  当是游客的时候就不再返回客服了
            if(message.type == 'connect'){
                        // 获取创建的对象

                let jssrt = JSON.parse(message.content.content)
                // 
                // return
             
                        let servicelist = jssrt.custcare_online
                        let  service = uni.getStorageSync('service')
						// 在这里拿到了客服的id  并且用了之后做缓存 在判断缓存中的ID有没有uni.setStorageSync('storage_key', 'hello');
				
						// 如果客服没有
						if(servicelist.length == 0){
							// 直接返回  客服不在线 返回到上一层
							uni.showToast({
								title: "暂未找到客服",
								mask:true
							})
							setTimeout(() => {
								uni.navigateBack({
									delta:1
								})
							}, 1000)

							return
						}
						if(service){
							let fefe = servicelist.filter(ent => ent.uid == service); //根据数组的长度去判断有没有对应的
                            
							if(fefe.length > 0){
								// 客服在这个对象里面
								that.kfuid = fefe[0].uid
								that.kename =  fefe[0].nickname
							}else{
								// 没有缓存对用的客服在线  做缓存
								that.kfuid = servicelist[0].uid
								that.kename =  servicelist[0].nickname
								uni.setStorageSync('service',servicelist[0].uid)  //缓存了id
							}
						}else{
								// 没有缓存对用的客服在线  做缓存
								that.kfuid = servicelist[0].uid
								that.kename =  servicelist[0].nickname
								uni.setStorageSync('service',servicelist[0].uid)  //缓存了id
						}
                        // uni.showLoading({
                        //     title: "连接中",
                        //     mask: true
                        // });
                        
                            let  logdata={
                                "type":"login",
                                "from_name":that.myname,
                                "from_id":that.myid,
                                "to_id":that.kfuid,
                                "to_name":that.kename,
                                "phone": that.phone,
                                "content":{
                                    "content_type":"text",
                                    "content":"玩家呼叫客服"
                                },
                                "time":that.getCurrentTime()
                            }
                            if(that.youkefuid){
                                logdata.user_type = 1
                            }
                            uni.sendSocketMessage({
                                data: JSON.stringify(logdata),
                                success: (res) => {
                                    // 
                                },
                                fail: (err) => {
                                }
                            });
                        // 再进行登录
            }else  if(message.type == 'login' ){
                if(message.type == 'login' && message.code == -1 ){
                    uni.showToast({
                        title: '请求登录用户不存在',
                        icon: 'error'
                    });
                    
                    setTimeout(() => {
                        uni.navigateBack({
                            delta:1
                        })
                    }, 1000);

                }
            }else  if (message.type == 'login_end') {
                that.connected = true
                uni.hideLoading()
                return
            } else if (message.type == 'custcare_off') {
                // 客服断掉连接 给遮罩 只能重新联系客服或者退出
                
                uni.showToast({
                    title: "客服下线，继续发送或退出重新联系其他客服",
                    icon: 'title',
                    mask:true,
                    success: (res) => {
                     this.exeRet = "success:" + JSON.stringify(res) + new Date()
                    },
                    fail: (res) => {
                     this.exeRet = "fail:" + JSON.stringify(res)
                    },
                })
                return
            } else if ( message.type == 'ping' || message.type == 'pong') {

                return
            } else if (message.type == 'off-say') {
                // 离线消息
                let lixian = JSON.parse(message.content)
                lixian.content = that.decodeUnicode(lixian.content)
                message.content = lixian
                this.msgList.push(message)
            } else if (message.type == 'say') {
                // 在线消息
                // let lixian = JSON.parse(message.content)
                // lixian.content = that.decodeUnicode(lixian.content)
                // message.content= lixian
                this.msgList.push(message)
            } else if (message.type == 'play_off' && message.content.content.uid == that.myid) {
                // // 监听玩家下线
                // uni.showToast({
                //     title: "由于您长时间没有联系，已经断开连接",
                //     icon: 'title',
                //     mask:true,
                //     success: (res) => {
                //     //  this.exeRet = "success:" + JSON.stringify(res) + new Date()
                //     },
                //     fail: (res) => {
                //     //  this.exeRet = "fail:" + JSON.stringify(res)
                //     },
                // })
                
                that.connected = false
            }
            if (!this.youkefuid) {
                this.gethiost('1')
            }
            // 置底
            this.scrollToBottom()
            // 其他逻辑操作...
        });
        
    },
    onHide() {
    //    this.offbut()
    },
    onUnload() {
        this.offbut()
        // 移除所有监听函数
        uni.offKeyboardHeightChange()
    },
    methods: {
        // 获取历史记录 传入页码
        gethiost(num){
            let that = this
            if (that._freshing) return;  
            that._freshing = true;  

            if (!that.triggered){
                that.triggered = true;  
            let data={
                from_uid:that.myid,
                to_uid:that.kfuid,
                page:that.page,
                page_size:5,
				frist_time: num ? num : undefined
            }
         
            if  (!num) {
				uni.showLoading({
				    title: '加载中',
				    mask:true
				})
			}
            that.$api.WSRequest('/v1/message/history', 'POST', data).then(res => {
                that.totl = res.data.count
                let nowlist = res.data.messages
                nowlist.forEach((element) => element.content = JSON.parse(element.content));
                // that.hoslist.unshift(nowlist)
                let  result = [...nowlist, ...that.hoslist];
                that.hoslist = result
                
                if( that.totl > that.hoslist.length){
                    that.page ++ 
                }else{
                    that.hosity = false
                }
                
                // this.$refs.scrollViewRef.scrollTo(0, 0, 0);
                that.triggered = false;//触发onRestore，并关闭刷新图标  
                that._freshing = false;  
                uni.hideLoading()
            }).catch(err => {
                console.error(err);
                that.hosity = false
                that.triggered = false;//触发onRestore，并关闭刷新图标  
                // this.$refs.scrollViewRef.scrollTo(0, 0, 0);
                that._freshing = false;  
                uni.hideLoading()
            })
            // uni.request({
            //     url: 'http://13.212.94.231:8787/v1/message/history',
            //     // url: '/ggb/v1/message/history',
            //     method: 'POST',
            //     data:data,
            //     header: {
            //         'content-Type': 'application/json'
            //     },
            //     success: (res) => {
            //       
            //         that.totl = res.data.data.count
            //         let nowlist = res.data.data.messages
            //         nowlist.forEach((element) => element.content = JSON.parse(element.content));
            //         // that.hoslist.unshift(nowlist)
            //         let  result = [...nowlist, ...that.hoslist];
            //         that.hoslist = result
            //         
            //         if( that.totl > that.hoslist.length){
            //             that.page ++ 
            //         }else{
            //             that.hosity = false
            //         }

            //         // this.$refs.scrollViewRef.scrollTo(0, 0, 0);
            //         that.triggered = false;//触发onRestore，并关闭刷新图标  
            //         that._freshing = false;  
            //         uni.hideLoading()
            //     },
            //     fail: err => {
            //         console.error(err);
            //         that.hosity = false
            //         that.triggered = false;//触发onRestore，并关闭刷新图标  
            //         // this.$refs.scrollViewRef.scrollTo(0, 0, 0);
            //         that._freshing = false;  
            //         uni.hideLoading()
            //     }
            // });
      
      

            }//界面下拉触发，triggered可能不是true，要设为true  

        },
        getCurrentTime() {
            let now = new Date();
            
            let year = now.getFullYear();
            let month = String(now.getMonth() + 1).padStart(2, '0');
            let day = String(now.getDate()).padStart(2, '0');
            
            let hours = String(now.getHours()).padStart(2, '0');
            let minutes = String(now.getMinutes()).padStart(2, '0');
            let seconds = String(now.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        onKeyboardHeightChange(res) {
            // 这里是键盘高度变化时的处理逻辑
            this.keyboardHeight = this.rpxTopx(res.height);
            if (this.keyboardHeight < 0) this.keyboardHeight = 0;
        },

        // 模拟官迷websocket
        offbut() {
            // socket.close()
            
            CloseWebsocket()
        },
        //  http://192.168.1.201:8787
        // getBucker() {
        //     try {
        //         uni.request({
        //             url: '/api/v1/minio/createBk/20231120',
        //             method: 'GET',
        //             data: {
        //                 // bucket: 'value1'
        //                 // param2: 'value2'
        //             },
        //             header: {
        //                 // 'custom-header': 'application/json'
        //             },
        //             success: (res) => {
        //                 
        //             },
        //             fail: (err) => {
        //                 
        //             }
        //         });

        //         
        //         // 在成功回调中处理返回的数据
        //     } catch (err) {
        //         
        //         // 在失败回调中处理错误信息
        //     }
        // },
        decodeUnicode(str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        },
        toLast() {
            uni.nextTick(() => {
                // 获取消息列表容器元素
                let container = uni.createSelectorQuery().select('#msglistview');

                // 调用滚动到底部的 API
                container.fields({ size: true }, data => {
                    container.scrollOffset({ behavior: 'smooth', scrollTop: data.scrollHeight });
                }).exec();
            });
        },
        getCurrentDate() {
            let today = new Date();
            let year = today.getFullYear();
            let month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份需要加1，同时确保两位数格式
            let day = today.getDate().toString().padStart(2, '0'); // 确保两位数格式
        
            let formattedDate = year + month + day;
            return formattedDate;
        },
        // 选择图片
        selectPhoto() {
            let that = this
            uni.chooseImage({
                count: 1, //最多可以选择的图片张数，默认9
                sourceType: ['album'], //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
                sizeType: ['original'],//original 原图，compressed 压缩图，默认二者都有
                success(res) {
                    uni.showLoading({
                        title: "正在努力上传",
                        mask: true
                    })
                    // #ifdef H5
                    let url = res.tempFiles[0].name   //域名
                    // #endif
                    // #ifdef APP-PLUS || MP
                    let url = res.tempFiles[0].path
                    // #endif
                    let index = url.lastIndexOf(".");
                    let jpgUrl = url.substr(index + 1);
                    if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg" && jpgUrl != "gif" && jpgUrl != "JPG" && jpgUrl != "JPEG" && jpgUrl != "PNG" && jpgUrl != "GIF" && jpgUrl != "HEIC" && jpgUrl != "heic" ) {
                        return uni.showToast({
                            icon: "none",
                            title: "请上传格式为jpg,png,jpeg,gif"
                        });
                    }
                    let params = {
                        'bucket': 'chat',
                        'uid': that.myid,
                        'bucket_path':that.currentDate
                    }
                    that.$api.WSRequestUpload('/v1/minio/putObj', url, params).then(res => {
                        uni.hideLoading();
                        const { data } = JSON.parse(res)
                        let jpg = data.download_URL
                        console.log(jpg)
                        that.fileSend('pic', jpg)
                    }).catch(err => {
                        uni.hideLoading();
                        uni.showToast({
                            title: err.msg || '上传失败',
                            icon: 'error',
                        })
                    })
                },
                fail(err) {
                    
                },
            })
        },
        // 选择视频
        selectVideo() {
            let that = this;
            uni.chooseVideo({
                sourceType: ['camera', 'album'],
                success: function (res) {
                    let tempFilePath = res.tempFilePath;
                    // that.fileSend('video',res.tempFilePath)
                    uni.showLoading({
                        title: "正在努力上传",
                        mask: true
                    })
                    let params = {
                        'bucket': 'chat',
                        'uid': that.myid,
                        'bucket_path':that.currentDate
                    }
                    that.$api.WSRequestUpload('/v1/minio/putObj', tempFilePath, params).then(res => {
                        uni.hideLoading();
                        if (typeof res === 'string') {
                            const { data } = JSON.parse(res);  
                            let jpg = data.download_URL //回显的和上传的东西
                            that.fileSend('video', jpg)
                        }
                    }).catch(err => {
                        uni.hideLoading();
                        uni.showToast({
                            title: err.msg || '上传失败',
                            icon: 'error',
                        })
                    })
                },
            })
        },
        // 文件发送成功之后的上传websocket
        fileSend(type, link) {
            let logdata1 = {
                "type": "say",
                "from_name": this.myname,
                "from_id":  this.myid,
                "to_id":this.kfuid,
                "to_name": this.kename ,
                "role": '1',
                "phone":  this.phone,
                "content": {
                    "content_type": type,
                    "content": link
                },
                "time": this.getCurrentTime()
            }
            
            uni.sendSocketMessage({
                data: JSON.stringify(logdata1),
                success: (res) => {
                    
                },
                fail: (err) => {
                    
                    // 发送失败处理  重新建立连接先提示 加个loading  然后 在重新建立链接之后吧loading去掉
                    
                    StartWebsocket()
                }
            });
            this.msgList.push(logdata1);
            
            // this.chatMsg = '';
            this.scrollToBottom()
        },


        focus() {
            this.scrollToBottom()
        },
        blur() {
            this.scrollToBottom()
        },
        checkFromNameContainsCustomer(item) {
            // 
            return item ? JSON.stringify(item).includes('客服') : '';
        },
        // px转换成rpx
        rpxTopx(px) {
            let deviceWidth = wx.getSystemInfoSync().windowWidth
            let rpx = (750 / deviceWidth) * Number(px)
            return Math.floor(rpx)
        },
        // 监视聊天发送栏高度
        sendHeight() {
            setTimeout(() => {
                let query = uni.createSelectorQuery();
                query.select('.send-msg').boundingClientRect()
                query.exec(res => {
                    this.bottomHeight = this.rpxTopx(res[0].height)
                })
            }, 10)
        },
        // 滚动至聊天底部
        scrollToBottom(e) {
			let that = this
            let query = uni.createSelectorQuery()
            query.select('#scrollview').boundingClientRect()
            query.select('#msglistview').boundingClientRect()
			query.select('#chatBody').boundingClientRect()
            setTimeout(() => {
				query.exec((res) => {
				    if(res[1].height > res[0].height){
				        that.scrollTop = res[1].height - res[0].height + 150
				    }
					if ((res[1].height + res[2].height) > res[0].height) {
                        that.scrollTop = res[1].height + res[2].height - res[0].height + 150
                    }
				})
			}, 50)
        },
        // 发送消息后处理的方法（可自己重写）
        sendMessageHandle(msg) {
            // 根据自己业务逻辑重写
            
        },
        // 发送消息
        handleSend() {
            //如果消息不为空
            if (this.chatMsg && !/^\s+$/.test(this.chatMsg)) {
                // let obj = {
                // 	botContent: "",
                // 	recordId: 0,
                // 	titleId: 0,
                // 	userContent: this.chatMsg,
                // 	userId: 0
                // }
                let logdata1 = {
                    "type": "say",
                    "from_name": this.myname,
                    "from_id": this.myid,
                    "to_id": this.kfuid,
                    "to_name": this.kename,
                    "phone":  this.phone,
                    "content": {
                        "content_type": "text",
                        "content": `${this.chatMsg}`
                    },
                    "role": '1',
                    "time": this.getCurrentTime()
                }
                uni.sendSocketMessage({
                    data: JSON.stringify(logdata1),
                    success: (res) => {
                        
                        // setTimeout(() => {
                        // 		// json转对象
                        // 	let param = JSON.parse(msg)
                        // 	that.sendMessageHandle(param)
                        // }, 300)
                    },
                    fail: (err) => {
                        
                        // 发送失败处理  重新建立连接先提示 加个loading  然后 在重新建立链接之后吧loading去掉
                        
                        StartWebsocket()
                    }
                });
                this.msgList.push(logdata1);
                
                this.chatMsg = '';
                this.scrollToBottom()
            } else {
                // this.$modal.showToast('不能发送空白消息')
                
            }
        },

        onSocketMessage() {
            let that = this
            uni.onSocketMessage((res) => {
                let obj = JSON.parse(res.data)
                
                that.onMessageHandle(obj)
            });
        },

        // 接收到事件后处理的方法（可自己重写）
        onMessageHandle(obj) {
            // 根据自己业务逻辑重写
            
        },

    }
}
</script>
<style lang="scss" scoped>
$chatContentbgc: #C2DCFF;
$sendBtnbgc: #4F7DF5;

page {
    // background-color: #111111;
    height: 100%;
    overflow: hidden;
}

.customer {
    .customer_top_state{
        height: var(--status-bar-height);
        background: #001eca;
    }

    .scroll-view {
        ::-webkit-scrollbar {
            display: none;
            width: 0 !important;
            height: 0 !important;
            -webkit-appearance: none;
            background: transparent;
            color: transparent;
        }

        // background-color: orange;
        background-color: #F6F6F6;

        .chat-body {
            display: flex;
            flex-direction: column;
            padding-top: 23rpx;
            // background-color:skyblue;

            .self {
                justify-content: flex-end;
            }

            .item {
                display: flex;
                padding: 23rpx 30rpx;
                // background-color: greenyellow;

                .right {
                    background-color: $chatContentbgc;
                }

                .left {
                    background-color: #FFFFFF;
                }

                // 聊天消息的三角形
                .right::after {
                    position: absolute;
                    display: inline-block;
                    content: '';
                    width: 0;
                    height: 0;
                    left: 100%;
                    top: 10px;
                    border: 12rpx solid transparent;
                    border-left: 12rpx solid $chatContentbgc;
                }

                .left::after {
                    position: absolute;
                    display: inline-block;
                    content: '';
                    width: 0;
                    height: 0;
                    top: 10px;
                    right: 100%;
                    border: 12rpx solid transparent;
                    border-right: 12rpx solid #FFFFFF;
                }

                .content {
                    position: relative;
                    max-width: 486rpx;
                    border-radius: 8rpx;
                    word-wrap: break-word;
                    padding: 24rpx 24rpx;
                    margin: 0 24rpx;
                    border-radius: 5px;
                    font-size: 32rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 42rpx;
                    .right-small-font{
                        white-space:nowrap;
                        position: absolute;top: -42rpx;
                        right: 0;
                        font-size: 24rpx;color: #999;
                    }
                    .left-small-font{
                        white-space:nowrap;
                        position: absolute;top: -42rpx;
                        left: 0;
                        font-size: 24rpx;color: #999;
                    }
                }

                .avatar {
                    display: flex;
                    justify-content: center;
                    width: 78rpx;
                    height: 78rpx;
                    background: $sendBtnbgc;
                    border-radius: 8rpx;
                    overflow: hidden;

                    image {
                        width: 80rpx;
                        height: 80rpx;
                        align-self: center;
                    }

                }
            }
        }
    }

video{
    z-index: -1;
    position: relative !important;
}
.uni-video-container{
    position: relative;
    .uni-video-cover{
        z-index: -999 !important;
        position: absolute;
    }
}

    /* 底部聊天发送栏 */
    .chat-bottom {
        width: 100%;
        background: #F4F5F7;
        transition: all 0.1s ease;

        .send-msg {
            display: flex;
            flex-direction: column;
            // padding: 16rpx 30rpx;
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #EDEDED;
            transition: all 0.1s ease;

            .add_icon {
                width: 60rpx;
                height: 75rpx;
                display: flex;
                justify-content: center;
                align-items: center;

                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }

        .send_box {
            display: flex;
            align-items: center;
            padding: 30rpx;
        }

        .select_tool {
            height: 120rpx;
            border-top: 1rpx solid #707070;
            display: flex;
            align-items: center;
            margin-left: 40rpx;

            .select_tool_photo {
                width: 100rpx;
                height: 100rpx;
                border-radius: 20rpx;
                background-color: #FFFFFF;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 25rpx;

                image {
                    width: 60rpx;
                    height: 60rpx;
                }
            }
        }

        .uni-textarea {
            flex: 1;
            textarea {
                width: 100%;
                max-height: 500rpx;
                background: #FFFFFF;
                border-radius: 8rpx;
                font-size: 32rpx;
                font-family: PingFang SC;
                color: #333333;
                line-height: 43rpx;
                padding: 5rpx 8rpx;
            }
        }

        .send-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 25rpx;
            width: 128rpx;
            height: 75rpx;
            background: #001eca;
            border-radius: 8rpx;
            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 28rpx;
        }

    }


}
</style>