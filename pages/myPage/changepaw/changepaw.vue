<template>
	<view class="changepaw">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'修改登入密码'"></navigation>
		<view class="changepaw_bg">
			<view class="changepaw_input">
				<image class="changepaw_input_img" src="../../../static/icon_login password.png" mode="widthFix"></image>
				<input type="text" @input="fpNumInput" v-model="user.paw" placeholder="请输入旧密码" :password="!change_look.oldPaw" maxlength="20">
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.oldPaw = !change_look.oldPaw" v-if="change_look.oldPaw" src="../../../static/icons/eye_1.png" mode=""></image>
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.oldPaw = !change_look.oldPaw"  v-else src="../../../static/icons/eye_2.png" mode=""></image>
			</view>
			<view class="changepaw_input">
				<image class="changepaw_input_img" src="../../../static/icon_login password.png" mode="widthFix"></image>
				<input type="text" @input="fpNumInput2" v-model="user.newPaw" placeholder="请再次输入新密码" :password="!change_look.newPaw" maxlength="20">
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.newPaw = !change_look.newPaw" v-if="change_look.newPaw" src="../../../static/icons/eye_1.png" mode=""></image>
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.newPaw = !change_look.newPaw"  v-else src="../../../static/icons/eye_2.png" mode=""></image>
			</view>
			<view class="changepaw_input" >
				<image class="changepaw_input_img" src="../../../static/icon_login password.png" mode="widthFix"></image>
				<input type="text" @input="fpNumInput3" v-model="user.reNewPaw" placeholder="请再次输入新密码" :password="!change_look.newPaw" maxlength="20">
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.newPaw = !change_look.newPaw" v-if="change_look.newPaw" src="../../../static/icons/eye_1.png" mode=""></image>
				<image style="margin:0 0 15rpx 50rpx;" @tap="change_look.newPaw = !change_look.newPaw"  v-else src="../../../static/icons/eye_2.png" mode=""></image>
			</view>
		</view>
		<view class="change_sub">
			<view :class="['sub_but', user.paw && user.newPaw && user.reNewPaw ? 'sub_but2' : '']" @tap="determinePaw">
				<text>确认</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				change_look: {
					oldPaw: true, // 查看旧密码
					newPaw: false ,// 查看新密码
					
				},
				user: {
					paw:"", // 保存用户旧密码
					newPaw: "", // 保存用户新密码
					reNewPaw: "", // 保存用户再次输入的新密码
				}
			};
		},
		onLoad() {
		},
		methods: {
			// 旧密码输入规则
			fpNumInput(e) {
					const o = e.target;
					const inputRule =/[^\w.]/g
					this.$nextTick(function() {
						this.user.paw = o.value.replace(inputRule , '');
					})
					
			},
			// 新密码输入规则
			fpNumInput2(e) {
					const o = e.target;
					const inputRule =/[^\w.]/g
					this.$nextTick(function() {
						this.user.newPaw = o.value.replace(inputRule , '');
					})
			},
			// 再次输入新密码输入规则
			fpNumInput3(e) {
					const o = e.target;
					const inputRule =/[^\w.]/g
					this.$nextTick(function() {
						this.user.reNewPaw = o.value.replace(inputRule , '');
					})
			},
			// 验证用户输入规则是否正确
			determinePaw() {
				
				if(this.user.paw.length == 0 || this.user.newPaw.length == 0 || this.user.reNewPaw.length == 0) {
					uni.showToast({
						title: "请完整输入密码！",
						icon: "none",
						duration: 1500
					});
					return 
				}
				// 旧密码 = 新密码 提示用户更改！
				if(this.user.paw.length < 8) {
					uni.showToast({
						title: "旧密码小于8位！",
						icon: "none",
						duration: 1500
					});
					return 
				}else if(this.user.newPaw.length < 8 || this.user.reNewPaw.length < 8 ) {
					uni.showToast({
						title: "新密码小于8位！",
						icon: "none",
						duration: 1500
					});
					return 
				}
				if(this.user.paw == this.user.newPaw) {
					uni.showToast({
						title: "新密码与旧密码一致！",
						icon: "none",
						duration: 1500
					});
					return 
				}else if(this.user.newPaw != this.user.reNewPaw) {
					uni.showToast({
						title: "新密码两次输入不一致！",
						icon: "none",
						duration: 1500
					});
					return
				}
				// 调用修改密码
				this.subChange()
			},
			// 提交修改密码
			subChange() {
				let that = this
				let params = {
					old_password: this.user.paw, // 传入旧密码
					new_password: this.user.newPaw, // 传入新密码
					type:"pass" //修改登入密码类型
				}
				// 提交修改信息
				that.$api.tokenTimeOut("/user/resetLoginPwd", "POST", params).then(res => {
					
					// 提示修改是否成功！
					uni.showToast({
						title: res.msg,
						icon: "none",
						duration: 1500
					});
					// 修改成功后数据清空
					that.user = {
						paw: "",
						newPaw: "",
						reNewPaw: ""
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background-color: #111111;
	}
	.changepaw_top_state {
		height: 1rpx;
		padding-top: var(--status-bar-height);
		background-color: #001eca;
	}
	.changepaw_bg {
		height: 273rpx;
		padding: 0 60rpx;
		.changepaw_input {
			height: 90rpx;
			// border-bottom: 1rpx solid #333333;
			border-bottom: 1px solid #07070780;
			display: flex;
			align-items: flex-end;
			font-size: 32rpx;
			color: #8E8E8E;
			.changepaw_text {
				width: 180rpx;
				margin-left: 20rpx;
				
			}
			>input {
				width: 470rpx;
				margin-bottom: 15rpx;
				font-size: 22rpx;
			}
			>image {
				width: 30rpx;
				height: 30rpx;
				
			}
			.changepaw_input_img {
				width: 30rpx;
				margin: 0 12rpx 18rpx 20rpx;
			}
		}
		
		
	}
	.change_sub {
		position: absolute;
		bottom: 250rpx;
		width: 100%;
		height: 60rpx;
		margin-top: 35rpx;
		display: flex;
		justify-content: center;
		.sub_but {
			width: 650rpx;
			height: 60rpx;
			background: #001eca;
			border-radius: 30rpx;
			text-align: center;
			line-height: 60rpx;
			color: #fff;
			font-size: 23rpx;
		}
		.sub_but2 {
			background: #001eca;
		}
	}
</style>