<template>
	<view class="walletredetail">
		<view class="changepaw_top_state"></view>
		<navigation :navigationText ="'订单明细'"></navigation>
		<view class="walletredetail_box">
			<view class="walletredetail_text">
				<text class="title">订单号</text><text class="content">{{dataList.order_no}}</text>
			</view>
			<view class="divider"></view>
			<view class="walletredetail_text">
				<text class="title">订单类型</text><text class="content">{{dataList.type}}</text>
			</view>
			<view class="walletredetail_text">
				<text class="title">订单金额</text><text class="content">{{dataList.amount}}</text>
			</view>
			<view class="walletredetail_text" v-if="transOrder.order_type == 5">
				<text class="title">收款平台</text><text class="content">{{dataList.payee}}</text>
			</view>
			<view class="walletredetail_text" v-if="transOrder.order_type == 5">
				<text class="title">游戏账户</text><text class="content">{{dataList.bc_account}}</text>
			</view>
			<view class="walletredetail_text" v-if="transOrder.order_type == 7">
				<text class="title">备注</text><text class="content">{{dataList.remark}}</text>
			</view>
			<view class="divider"></view>
			<view class="walletredetail_text">
				<text class="title">转账账户</text><text class="content">{{dataList.transfer}}</text>
			</view>
			<view class="divider"></view>
			<view class="walletredetail_text">
				<text class="title">创建时间</text><text class="content">{{dataList.created_at}}</text>
			</view>
			<view class="walletredetail_text">
				<text class="title">完成时间</text><text class="content">{{dataList.updated_at}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {formatTime} from '@/common/api/timeConversion.js'
	export default {
		data() {
			return {
				dataList: {},
				transOrder: {
					order_no: '', // 订单号
					order_type: ''	// 订单类型
				},
			}
		},
		onLoad(option) {
			const item = JSON.parse(decodeURIComponent(option.item));
			// 获取到页面传输过来的数据
			this.transOrder = item.data
			this.otpList() // 获取订单详细数据
		},
		computed:{
		    nowTime(){
		      return (time)=>{
		        return formatTime(+new Date(time), 1)
		      }
		    }
		},
		methods: {
			// 获取订单详细信息
			otpList() {
				let that = this;
				let params = {
					order_no: this.transOrder.order_no,
					order_type: this.transOrder.order_type,
				}; //参数
				that.$api.tokenTimeOut("/wallet/orderDetail", "POST", params).then(res => {
					
					if(res.code == 0) {
						// 获取列表数据
						this.dataList = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #111111;
	}
	.walletredetail {
		.changepaw_top_state {
			height: 1rpx;
			padding-top: var(--status-bar-height);
			background-color: #001eca;
		}
		.walletredetail_box {
			border-radius: 15rpx;
			margin: 25rpx 30rpx 0 30rpx;
			padding: 25rpx 25rpx;
			background-color: #161616;
			.walletredetail_text {
				padding: 5px 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title {
					font-size: 22rpx;
					color: #a5a5a5;
					white-space: nowrap;
					overflow: hidden;
				}
				.content {
					width: 150px;
					font-size: 20rpx;
					color: #d0d0d0;
				}
			}
			.divider {
				height: 2rpx;
				border-bottom: 1rpx solid #242424;
			}
		}
	}
</style>