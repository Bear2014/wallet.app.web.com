# liu-calendar-date适用于uni-app项目的精美日期选择组件
### 介绍：本组件常用于日期选择，组件代码清晰，注释全，非常适合自己DIY或学习
### 本组件兼容小程序、H5
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用示例
``` 
<template>
	<view class="page-main">
		<view @click="openCalendar" class="btn">单个日期选择器</view>
		<liu-calendar-date ref="calendar1" @checked='getDate1'></liu-calendar-date>
		<view class='text'>选中后的日期：{{ checkDay1 }}</view>

		<view @click="openCalendar2" class="btn">日期区间选择器</view>
		<liu-calendar-date ref="calendar2" isRange @checked='getDate2'></liu-calendar-date>
		<view class='text'>选中后的日期：{{ checkDay2 }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkDay1: '',
				checkDay2: '',
			}
		},
		methods: {
			//打开选择器
			openCalendar() {
				this.$refs.calendar1.open()
			},
			//打开选择器
			openCalendar2() {
				this.$refs.calendar2.open()
			},
			//单个日期选择成功
			getDate1(e) {
				this.checkDay1 = e.value
			},
			//日期区间选择成功
			getDate2(e) {
				this.checkDay2 = e.value
			}
		}
	}
</script>

<style lang="scss">
	.btn {
		width: 686rpx;
		height: 88rpx;
		background: #2182FE;
		border-radius: 8rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #FFFFFF;
		margin-top: 20rpx;
	}

	.text {
		padding: 24rpx;
		font-size: 28rpx;
		color: #999999;
	}
</style>
```
### 属性说明
| 名称                         | 类型            | 默认值                | 描述             |
| ----------------------------|--------------- | ---------------------- | ---------------|
| isRange                     | Boolean        | false            | 是否选择日期区间
| color                       | String         | #3A86FA          | 主题色
| range                       | Array          | []               | 可选择的日期范围
| animation                   | Boolean        | true             | 是否开启动画
| safeArea                    | Boolean        | true             | 是否开启安全条
| isMask                      | Boolean        | true             | 是否点击阴影关闭
| @checked                    | Function       |                  | 选择完日期回调事件
