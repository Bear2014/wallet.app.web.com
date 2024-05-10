<template>
	<view class="manage_pay">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText="'收付款管理'"></navigation>
		<view class="manage_pay_add" @tap="goAddPay">
			<image src="../../../static/icons/icon_merchant_add.png" mode="widthFix"></image>
			<text>添加收款方式</text>
		</view>
		<view class="manage_pay_add_center" style="margin-top: 20rpx;padding: 0 36rpx;">
			<uni-collapse v-if="aliPayList.length > 0" style="border-radius: 22rpx; margin-bottom: 20rpx;">
				<uni-collapse-item open :show-animation="true" title="支付宝收款账户">
					<view style="background-color: #F4F3F3; margin-bottom: 10rpx;" v-for="(item, index) in aliPayList"
						:key="item.id">
						<liu-swipe-action :btnList="btnList1" style="background-color: #F4F3F3;"
							@clickItem="event => clickItem(event, item)">
							<view
								:class="['manage_pay_list', item.status == 3 ? 'manage_pay_list_zfb' : 'manage_pay_list_zfb_apply']">
								<view class="manage_pay_icon">
									<view class="manage_pay_icon_box">
										<image :src="item.icons" mode="widthFix"></image>
									</view>
								</view>
								<view class="manage_pay_text">
									<text>{{ item.name }}</text>
									<text style="margin: 20rpx 0;">账号：{{ JSON.parse(item.account_info).account_number }}</text>
									<text >姓名：{{ JSON.parse(item.account_info).account_name
									}}</text>
								</view>
								<view class="account_number"></view>
								<image v-if="item.status == 3" class="manage_pay_BG" :src="item.iconBGs"></image>

								<view class="defPay" v-if="item.is_default == 1">默认支付</view>
								<view v-if="item.status != 3" class="cardState">
									<text v-if="item.status == 1">审核中</text>
									<text v-if="item.status == 2">已驳回</text>
								</view>
							</view>
						</liu-swipe-action>
					</view>
				</uni-collapse-item>
			</uni-collapse>

			<uni-collapse v-if="wxPayList.length > 0" style="border-radius: 22rpx; margin-bottom: 20rpx;">

				<uni-collapse-item open :show-animation="true" title="微信收款账户">
					<view style="background-color: #F4F3F3; margin-bottom: 10rpx;" v-for="(item, index) in wxPayList" :key="item.id">
						<liu-swipe-action :btnList="btnList1" style="background-color: #F4F3F3;"
							@clickItem="event => clickItem(event, item)">
							<view
								:class="['manage_pay_list', item.status == 3 ? 'manage_pay_list_wx' : 'manage_pay_list_wx_apply']">
								<view class="manage_pay_icon">
									<view class="manage_pay_icon_box">
										<image :src="item.icons" mode="widthFix"></image>
									</view>
								</view>
								<view class="manage_pay_text">
									<text>{{ item.name }}</text>
									<text style="margin: 20rpx 0;">账号：{{ JSON.parse(item.account_info).account_number }}</text>
									<text>姓名：{{ JSON.parse(item.account_info).account_name
									}}</text>
								</view>
								<image v-if="item.status == 3" class="manage_pay_BG" :src="item.iconBGs"></image>
								<view class="defPay" v-if="item.is_default == 1">默认支付</view>
								<view v-if="item.status != 3" class="cardState">
									<text v-if="item.status == 1">审核中</text>
									<text v-if="item.status == 2">已驳回</text>
								</view>
							</view>
						</liu-swipe-action>
					</view>
				</uni-collapse-item>
			</uni-collapse>

			<uni-collapse v-if="bankList.length > 0" style="border-radius: 22rpx; margin-bottom: 20rpx;">

				<uni-collapse-item open :show-animation="true" title="银行卡收款账户">
					<view style="background-color: #F4F3F3; margin-bottom: 10rpx;" v-for="(item, index) in bankList"
						:key="item.id">
						<liu-swipe-action :btnList="btnList2" style="background-color: #F4F3F3;"
							@clickItem="event => clickItem(event, item)">
							<view
								:class="['manage_pay_list', item.status == 3 ? 'manage_pay_list_bank' : 'manage_pay_list_bank_apply']">
								<view class="manage_pay_icon">
									<view class="manage_pay_icon_box">
										<image :src="item.icons" mode="widthFix"></image>
									</view>
								</view>
								<view class="manage_pay_text">
									<text>{{ item.name }}</text>
									<text style="margin: 20rpx 0;">账号：{{ JSON.parse(item.account_info).account_number }}</text>
									<text>姓名：{{ JSON.parse(item.account_info).account_name
									}}</text>
								</view>
								<image v-if="item.status == 3" class="manage_pay_BG" :src="item.iconBGs"></image>
								<view class="defPay" style="color: #fff" v-if="item.is_default == 1">默认支付</view>
								<view v-if="item.status != 3" class="cardState">
									<text v-if="item.status == 1">审核中</text>
									<text v-if="item.status == 2">已驳回</text>
								</view>
							</view>
						</liu-swipe-action>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>






	</view>
</template>

<script>
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue"
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue"
export default {
	components: {
		uniCollapse,
		uniCollapseItem
		/* 其它组件定义 */
	},
	data() {
		return {
			aliPayList: [],
			wxPayList: [],
			bankList: [],
			btnList1: [
				{
					id: '2',
					name: '删除',
					width: '120rpx',
					bgColor: '#e21836',
					color: '#FFFFFF',
					fontSize: '28rpx'
				}
			],
			btnList2: [{
				id: '2',
				name: '删除',
				width: '120rpx',
				bgColor: '#e21836',
				color: '#FFFFFF',
				fontSize: '28rpx'
			}],
		}
	},
	onShow() {
		// 获取已经绑定的收款方式
		this.obtainPayment()
	},
	methods: {
		// 获取已经绑定的收款方式
		obtainPayment() {
			// 获取绑定接口
			let that = this;
			that.$api.tokenTimeOut("/user/paymentInfo", "GET").then(res => {
				
				if (res.code == 0) {
					const { data } = res
					if (!data.length) return
					this.aliPayList = []
					this.wxPayList = []
					this.bankList = []
					data.forEach(res => {
						if (res.payment_type === 'alipay') {
							res.name = '支付宝'
							res.icons = '../../../static/icons/icon_Alipay_1.png'
							res.iconBGs = '../../../static/icons/icon_bgZFB.png'
							this.aliPayList.push(res)
						}

						if (res.payment_type === 'wechat') {
							res.name = '微信'
							res.icons = '../../../static/icons/icon_UnionPay_wx.png'
							res.iconBGs = '../../../static/icons/icon_bgWX.png'
							this.wxPayList.push(res)
						}

						if (res.payment_type === 'bank') {
							res.name = '银行卡'
							res.icons = '../../../static/icons/icon_bank card.png'
							res.iconBGs = '../../../static/icons/icon_bgYHK.png'
							this.bankList.push(res)
						}
					})
				}
			})
		},
		// 去添加新的收付款方式
		goAddPay() {
			uni.navigateTo({
				url: '/pages/indexPage/addpay/addpay',
				animationType: 'pop-in',
				animationDuration: 300
			})
		},
		clickItem(e, data) {
			let url = e.id === '2' ? '/user/delPayment' : '/user/setDefaultPayment'
			let params = {
				record_id: data.id
			}
			this.$api.tokenTimeOut(url, "POST", params).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: e.id === '2' ? '删除成功' : '设置成功',
						icon: "none",
						duration: 1000
					});
				}
				let arr = data.payment_type == 'alipay' ? this.aliPayList : data.payment_type == 'wechat' ? this.wxPayList : this.bankList
				arr.forEach((res, index) => {
					if (res.id === data.id) {
						if (e.id == '2') {
							arr.splice(index, 1)
						}
						res.is_default = 1
					} else {
						res.is_default = 0
					}
				})
				if (data.payment_type == 'alipay') {
					this.aliPayList = arr
				} else if (data.payment_type == 'wechat') {
					this.wxPayList = arr
				} else {
					this.bankList = arr
				}
			})

		}
	},
}
</script>

<style lang="scss">
page {
	// background-color: #111111;
	height: 100vh;
	overflow: hidden;
}

.manage_pay {
	.changepaw_top_state {
		height: 1rpx;
		padding-top: var(--status-bar-height);
		background-color: #001eca;
	}

	.manage_pay_add {
		width: 685rpx;
		height: 85rpx;
		background-color: #001eca;
		margin: 30rpx auto 0 auto;
		margin-bottom: 10rpx;
		border-radius: 15rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		>image {
			width: 33rpx;
		}

		>text {
			font-size: 25rpx;
			line-height: 1;
			margin-left: 15rpx;
			color: #FFFFFF;
		}
	}

	.manage_pay_list {
		position: relative;
		width: 100%;
		height: 140rpx;
		background-color: #47a068;
		// margin: 20rpx auto 0 auto;
		display: flex;
		overflow: hidden;

		.cardState {
			height: 60rpx;
			position: absolute;
			top: 0;
			right: 10rpx;
			transform: translateY(50%);
			font-size: 24rpx;
			font-weight: 600;
			line-height: 60rpx;
			color: #fff;
		}

		.manage_pay_icon {
			width: 120rpx;
			height: 140rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.manage_pay_icon_box {
				width: 100rpx;
				height: 100rpx;
				background-color: #fff;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				>image {
					width: 80rpx;
				}
			}
		}

		.manage_pay_text {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			line-height: 1;
			font-size: 21rpx;
			color: #fff;
		}

		.manage_pay_BG {
			position: absolute;
			right: 0;
			top: 0;
			width: 232rpx;
			height: 100%;
		}
	}

	.manage_pay_add_center{
		height: calc(100vh - 1rpx - 124rpx - 120rpx - 70rpx);
		margin-bottom: 70rpx;
		overflow-y: scroll;
	}

	.manage_pay_list_zfb {
		background-color: #5190f9;
	}

	.manage_pay_list_zfb_apply {
		background: rgba(81, 144, 249, .5);
	}

	.manage_pay_list_wx {
		background-color: #47a068;
	}

	.manage_pay_list_wx_apply {
		background: rgba(71, 160, 104, .5);
	}

	.manage_pay_list_bank {
		background-color: rgb(249,156,45);
	}

	.manage_pay_list_bank_apply {
		background: rgba(249,156,45, .5);
	}

	.manage_pay_list_usdt {
		background-color: #00a77c;
	}

	.manage_pay_list_usdt_apply {
		background: rgba(0, 167, 124, .5);
	}

	/deep/ .uni-collapse {
		position: relative;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.collapse_position {
		position: absolute;
		z-index: 9999999999999999999999999;
	}

	/deep/ .uni-collapse-item__title-box {
		border-radius: 11px;
	}

	/deep/ .uni-collapse-item__wrap {
		border-radius: 11px;
		padding: 0 20px;
		margin-bottom: 20rpx;
	}

	/deep/ .uni-collapse-item__title.uni-collapse-item-border {
		border: 0px !important;
	}

	/deep/ .uni-collapse-item__wrap-content.uni-collapse-item--border {
		border: 0px !important;
	}

	.defPay {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		color: red;
	}
	.account_number{
		position: absolute;

	}
}
</style>