<template>
	<view>
		<!-- 弹出层 -->
		<view :class="['scroll-popup', isShow ? 'scroll-open' : '', animation ? 'scroll-animation' : '']">
			<view class="calendar-box">
				<view class="calendar-top-box">
					<view class="calendar-left-title" @click="close">取消</view>
					<image class="calendar-img" @click="changeSub" :src="leftIcon"></image>
					<view class="calendar-top-title" :style="'color:'+color">{{formatMonth(todayMonth)}}</view>
					<image class="calendar-img" @click="changeAdd" :src="rightIcon"></image>
					<view class="calendar-right-title" :style="'color:'+color" @click="save">确定</view>
				</view>
				<view class="calendar-week-box">
					<view class="week-title" v-for="(item,index) in weekList" :key="index">{{item}}</view>
				</view>
				<view class="calendar-center-box">
					<view class="calendar-center-tiem" :style="[index == 0 && oneDayClass, item.bgColor] "
						v-for="(item,index) in monthArr" :key="index" @click="changeMonthIndex(index)">
						{{index + 1}}
					</view>
				</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view v-show="isShow" class="scroll-mask" @click="isMask ? close() : ''"></view>
	</view>
</template>
<script>
	import dayjs from './day.js'
	export default {
		components: {},
		props: {
			//是否选择日期区间
			isRange: {
				type: Boolean,
				default: false
			},
			//主题色
			color: {
				type: String,
				default: '#3A86FA'
			},
			//可选择的日期范围
			range: {
				type: Array,
				default () {
					return []
				}
			},
			//是否开启动画
			animation: {
				type: Boolean,
				default: true,
			},
			//是否点击阴影关闭
			isMask: {
				type: Boolean,
				default: true,
			},
			//是否开启安全条
			safeArea: {
				type: Boolean,
				default: true,
			},

		},
		data() {
			return {
				leftIcon: require('../../static/calendar-left.png'),
				rightIcon: require('../../static/calendar-right.png'),
				isShow: false,
				oneDay: 0,
				oneDayClass: '',
				tabIndex: 1,
				weekList: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
				monthArr: [],
				monthIndex: 0,
				todayMonth: dayjs().format("YYYY-MM-DD"), //当前月份
				dateArr: []
			};
		},
		created(option) {

		},
		methods: {
			ifRange(date) {
				if (this.range.length == 0) {
					return true
				}
				if (dayjs(date).valueOf() > dayjs(this.range?.[0]).valueOf() && dayjs(date).valueOf() < dayjs(this.range
						?.[1]).valueOf()) {
					return true
				}
				return false
			},
			open() {
				this.dateArr = []
				this.isShow = true;
				this.getDaysArrayByMonth()
			},
			close() {
				this.isShow = false;
			},
			save() {
				this.close()
				this.$emit('checked', {
					value: this.dateArr
				});
			},
			//日期大小比较
			compareDate(date1, date2) {
				var oDate1 = dayjs(date1).valueOf();
				var oDate2 = dayjs(date2).valueOf();
				if (oDate1 > oDate2) {
					return true;
				} else {
					return false;
				}
			},

			changeMonthIndex(e) {
				if (!this.ifRange(this.monthArr[e].date)) return
				if (this.dateArr.length == 2) {
					this.dateArr = []
					// if(this.compareDate(this.dateArr[1], this.monthArr[e].date)) {
					// 	this.dateArr[0] = this.monthArr[e].date
					// } 
					// if(this.compareDate(this.monthArr[e].date, this.dateArr[1])) {
					// 	this.dateArr[1] = this.monthArr[e].date
					// }
					// return this.drawing()
				}
				if (this.isRange) {
					if (this.dateArr.length == 1) {
						this.dateArr.push(this.monthArr[e].date)
						this.dateArr.sort((a, b) => {
							return dayjs(a).valueOf() - dayjs(b).valueOf()
						});
						return this.drawing()
					}
					if (this.dateArr.length < 2) {
						this.dateArr.push(this.monthArr[e].date)
						return this.drawing()
					}
					return
				} else {
					this.dateArr[0] = this.monthArr[e].date
					return this.drawing()
				}
				this.monthIndex = e
			},
			//渲染层
			drawing() {
				var monthArr = this.monthArr
				monthArr.forEach((item, index) => {
					monthArr[index].bgColor = this.getDayBgColor(monthArr[index].date)
					if (dayjs(monthArr[index].date).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) this
						.monthIndex = index
				});
				this.monthArr = monthArr
			},
			//切换tab
			changeTab(e) {
				this.tabIndex = e
			},
			//获取获取上个月
			changeSub(e) {
				this.todayMonth = dayjs(this.todayMonth).add(-1, 'month').startOf('month').format('YYYY-MM-DD')
				this.monthIndex = 0
				this.getDaysArrayByMonth()
			},
			//获取获取下个月
			changeAdd(e) {
				this.todayMonth = dayjs(this.todayMonth).add(1, 'month').startOf('month').format('YYYY-MM-DD')
				this.monthIndex = 0
				this.getDaysArrayByMonth()
			},
			//月份格式化
			formatMonth() {
				return dayjs(this.todayMonth).format('YYYY年MM月')
			},
			//获取当前月份包含的天数
			getDaysArrayByMonth() {
				//获取当前月份包含的天数
				var daysInMonth = dayjs(this.todayMonth).daysInMonth();
				var start = 1
				var monthArr = []
				//循环获取月份里的日期
				while (daysInMonth >= start) {
					var current = dayjs(this.todayMonth).date(start);
					monthArr.push({
						date: current
					});
					start++;
				}
				monthArr.forEach((item, index) => {
					monthArr[index].date = item.date.format("YYYY-MM-DD")
					monthArr[index].bgColor = this.getDayBgColor(monthArr[index].date)
					if (dayjs(monthArr[index].date).format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD")) this
						.monthIndex = index
					// background: linear-gradient(to bottom, aquamarine 0%, aquamarine 50%, yellow 51%, yellow 100%);
				});
				this.getDaysWeek(monthArr[0].date)
				this.monthArr = monthArr

			},
			//获取当前星期几
			getDaysWeek(e) {
				var oneDay = dayjs(e).day() + 1 || 0
				this.oneDayClass = {
					'grid-column-start': oneDay
				}
			},
			//获取背景色
			getDayBgColor(date) {
				if (!this.ifRange(date)) {
					return {
						"background": "#f8f8f8",
						"text-decoration": "line-through"
					}
				}

				//是否区间选择
				if (this.isRange) {
					if (date == this.dateArr[0]) {
						return {
							"color": "#FFFFFF",
							"background": this.color
						}
					}
					if (this.dateArr.length == 2) {
						if (date == this.dateArr[1]) {
							return {
								"color": "#FFFFFF",
								"background": this.color
							}
						}
						if (dayjs(date).valueOf() > dayjs(this.dateArr[0]).valueOf() && dayjs(date).valueOf() < dayjs(this
								.dateArr[1]).valueOf()) {
							return {
								"color": "#FFFFFF",
								"background": this.color,
								"opacity": 0.3
							}
						}
					}
				} else {
					if (date == this.dateArr[0]) {
						return {
							"color": "#FFFFFF",
							"background": this.color
						}
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 弹出层默认样式 */
	.scroll-popup {
		width: 100%;
		position: fixed;
		bottom: -100%;
		z-index: 999;
	}

	/* 点击按钮是将盒子 bottom 值归零即可实现弹出效果,
  同理，如需更改弹出方向只需将bottom改成top、left、right即可
  (默认样式的方向也需一起更改哦) */
	.scroll-open {
		bottom: 0px !important;
	}

	.scroll-animation {
		transition: all 0.25s linear;
	}

	/* 遮罩层样式 */
	.scroll-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 998;
	}

	.calendar-box {
		overflow: hidden;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 6rpx 0px rgba(0, 0, 0, 0.04);
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding: 20rpx 0 32rpx 0;

		.calendar-top-box {
			display: flex;
			justify-content: center;
			margin: 16rpx 0;
			position: relative;

			.calendar-left-title {
				position: absolute;
				left: 32rpx;
				top: 0;
				bottom: 0;
				margin: auto;
				height: 64rpx;
				font-size: 32rpx;
				color: #8c8c8c;
				line-height: 64rpx;
			}

			.calendar-right-title {
				position: absolute;
				right: 32rpx;
				top: 0;
				bottom: 0;
				margin: auto;
				height: 64rpx;
				font-size: 32rpx;
				line-height: 64rpx;
			}

			.calendar-top-title {
				width: 240rpx;
				text-align: center;
				height: 64rpx;
				font-size: 34rpx;
				font-weight: 500;
				line-height: 64rpx;
				margin: 0 64rpx;
			}

			.calendar-img {
				height: 32rpx;
				width: 32rpx;
				margin: 16rpx 0;
			}
		}

		.calendar-week-box {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
			margin: 0 40rpx;
			grid-gap: 24rpx;

			.week-title {
				width: 64rpx;
				text-align: center;
				height: 42rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #C5C5C5;
				line-height: 42rpx;
			}
		}

		.calendar-center-box {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
			margin: 24rpx 40rpx;
			grid-gap: 36rpx;

			.week-title {
				text-align: center;
				height: 42rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #C5C5C5;
				line-height: 42rpx;
			}

			.calendar-center-tiem {
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				line-height: 56rpx;
				text-align: center;
				font-size: 32rpx;
				color: #666666;
			}
		}
	}
</style>