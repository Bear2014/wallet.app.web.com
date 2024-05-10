<template>
	<view class="marquee_box" @touchstart='touchstartFn' @touchend='touchendFn'>
		<block v-show="isShow">
			<view class="" v-if="direction == 'right' || direction == 'left'">
				<view v-if="broadcastType == 'text'" class="marquee_container" @click="goToAnnouncement"
					:style="'background:' + broadcastStylees.back_color + ';'">
					<view v-if="broadcastIconIsDisplay" class="broadIcon"
						:style="'background:' + broadcastStylees.back_color + ';font-size:28rpx;'">
						<image src='@/static/icons/gg.png' class="iconfont"></image>
						<text style="margin-left:12rpx;">{{ broadcast_tit }}:</text>
					</view>
					<view ref="left_rig" class="boradcast_text_left_rig"
						:class='[direction == "left" ? "marquee_text_left" : direction == "right" ? "marquee_text_right" : "", animation_paused ? "animation_pausedcss" : ""]'
						:style="'--marqueeWidth--:' + (-broadcastStylees.width_mal) + 'px;--speed--:' + broadcastStylees.time + 's;width:' + broadcastStylees.width_mal + 'px;'">
						<view v-for="(item, index) in broadcastDataes" @click.stop="click_event(index)" :key="index"
							:style="'color:' + broadcastStylees.text_color + ';margin-left:' + (index != 0 ? item.starspos : 0) + 'px;font-size:' + broadcastStylees.font_size + 'rpx;'">
							{{ item.text }}
						</view>
					</view>
				</view>

				<view v-if="broadcastType == 'mould'" class="mould">
					<view class="" style="width: 100%;position: relative;overflow: hidden;"
						:style="'height:' + viewHeight + 'rpx;'">
						<view class="broadcastTopBtm dsf"
							:class="[direction == 'left' ? 'broadcastDataTopBtmDatacss_let' : direction == 'right' ? 'broadcastDataTopBtmDatacss_rig' : '', animation_paused ? 'animation_pausedcss' : '']"
							:style="'--scrollWidth--:' + (-(scrlloWidth / 2)) + 'px;--scrollSpeed2--:' + (scrlloWidth / broadcastStyle.speed) + 's;width:' + (scrlloWidth * 2) + 'px;'">
							<view ref="mouldRef" class="bml01" style="display: flex;justify-content: space-between;">
								<slot />
								<!-- <slot /> -->
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="direction == 'top' || direction == 'bottom'" class="broadcastTopBtm"
				:style="'font-size:' + broadcastStyle.font_size + 'rpx;color:' + broadcastStyle.text_color + ';background:' + broadcastStyle.back_color + ';height:' + viewHeight + 'rpx;--scrollHeight--:' + (-broadcastTopBtmHeight / 2) + 'px;--scrollSpeed--:' + ((broadcastTopBtmHeight / 2) / broadcastStyle.speed) + 's;'">
				<view v-if="broadcastType == 'text'"
					:class="[direction == 'top' ? 'broadcastDataTopBtmDatacss_top' : direction == 'bottom' ? 'broadcastDataTopBtmDatacss_bottom' : '', animation_paused ? 'animation_pausedcss' : '']">
					<view v-for="(item, index) in broadcastDataTopBtmDataes" :key="index" @click.stop="click_event()"
						class="bdbd_item">
						{{ item }}
					</view>
				</view>
				<view v-if="broadcastType == 'mould'"
					:class="[direction == 'top' ? 'broadcastDataTopBtmDatacss_top' : direction == 'bottom' ? 'broadcastDataTopBtmDatacss_bottom' : '', animation_paused ? 'animation_pausedcss' : '']">
					<slot />
					<!-- <slot /> -->
				</view>
			</view>

		</block>


	</view>
</template>

<script>
	/**
	 * author:G.bro
	 * date:20200513
	 * * **/
	export default {
		data() {
			return {
				broadcastDataes: [],
				broadcastDataTopBtmDataes: [],
				broadcastStylees: {},
				broadcastTopBtmHeight: 0,
				scrlloWidth: 0,
				animation_paused: false,
				qualifications: true,
				isShow: false
			}
		},
		props: {
			broadcastType: {
				type: String,
				default: 'text' //mould
			},
			imgdata: {
				type: Array
			},
			broadcastData: {
				type: Array
			},
			broadcastStyle: {
				type: Object,
				default () {
					return {
						speed: 90, //滚动速度，每秒3个字
						font_size: "28", //字体大小(rpx)
						text_color: "#fff", //字体颜色
						back_color: "#815CD4", //背景色

					}
				}
			},
			broadcastIconIsDisplay: { //图标是否显示
				type: Boolean,
				default: false
			},
			// broadcast_icon: {
			// 	type: String,
			// 	default: ''
			// },
			broadcast_tit: {
				type: String,
				default: '今日热点'
			},
			direction: {
				type: String,
				default: 'left'
			},
			viewHeight: {
				type: Number,
				default: 200
			},
			touchEvent: {
				type: true,
				default: false
			}

		},
		watch: {
			broadcastData(v) {

				if (v.length) {
					this.isShow = true;
					this.initialization();
				}



			},
			imgdata(v) {
				console.log(v, '---')
				this.isShow = true;
				this.initialization();


			}
		},
		created() {


		},
		mounted() {

			// if(this.broadcastType=='text'){有偏差
			// 	let assist = { ...this.broadcastStyle};
			// 	const querys = uni.createSelectorQuery().in(this)
			// 	querys.select('.boradcast_text_left_rig').boundingClientRect(rect => {
			// 		assist.width_mal = rect.width;
			// 			assist.time = rect.width/assist.speed;
			// 			that.broadcastStylees=assist;
			// 	}).exec()
			// }
		},
		methods: {
			goToAnnouncement() {
				uni.navigateTo({
					url: '/pages/indexPage/announcement/index',
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			initialization() {
				let that = this;

				if (that.broadcastType == "text") {
					if (that.direction == "right" || that.direction == "left") {
						that.initial_let_rig();
					} else {
						let arr = [...that.broadcastData];
						arr = arr.concat(arr);
						that.broadcastDataTopBtmDataes = arr;
					}
				}

				if (that.direction == "top" || that.direction == "bottom") {
					that.$nextTick(() => {
						let dir = `.broadcastDataTopBtmDatacss_${that.direction}`
						const query2 = uni.createSelectorQuery().in(that);
						query2.select(dir).boundingClientRect(rect => {
							that.broadcastTopBtmHeight = rect.height;
							if (that.viewHeight - rect.height > 10) {
								that.qualifications = false;
								that.animation_paused = true;
								that.broadcastDataTopBtmDataes.splice(that.broadcastDataTopBtmDataes
									.length / 2, that.broadcastDataTopBtmDataes
									.length - 1);
							}

						}).exec();
					})

				}
				if (that.direction == "left" || that.direction == "right") {
					this.$nextTick(() => {
						try {
							if (that.broadcastType == 'mould') {
								const query = uni.createSelectorQuery().in(that)
								query.select('.bml01').boundingClientRect(rect => {
									that.scrlloWidth = rect.width;
								}).exec()
							}
						} catch (e) {
							that.scrlloWidth = that.$refs.mouldRef.$el.clientWidth * 2
						}
					})
				}



			},
			touchendFn(e) {
				if (this.touchEvent && this.qualifications) {
					this.animation_paused = false;
				}
			},
			touchstartFn(e) {
				if (this.touchEvent && this.qualifications) {
					this.animation_paused = true;
				}
			},
			initial_let_rig() {
				let broadcastData = [...this.broadcastData];
				if (this.direction == "right") {
					broadcastData.reverse();
				}

				let ititdata = broadcastData.map((item) => {
						return {
							"text": item,
							"starspos": uni.getSystemInfoSync().windowWidth - 103
						}
					}),
					assist = {
						...this.broadcastStyle
					},
					this_width = 0,
					spacing = 0,
					speed = (assist.speed * assist.font_size); //m每秒行走的距离

				for (let i in ititdata) {
					this_width += ititdata[i].text.length * assist.font_size;
					if (i != ititdata.length - 1) {
						spacing += ititdata[i].starspos
					}
				}
				let total_length = (this_width / 2) + spacing - 300; //总长
				assist.time = 15; /**滚动时间*/
				assist.width_mal = total_length;
				this.broadcastDataes = ititdata;
				this.broadcastStylees = assist;
			},
			click_event(index) {
				this.goToAnnouncement()
			}

		}
	}
</script>

<style>
	/* app端有可能要加上 */
	/* page {
		overflow: hidden;
		width: 100%;
	} */

	.marquee_box {
		width: 100%;
		overflow: hidden;
		position: inherit;
		height: auto;
	}

	.mould {
		width: 750rpx;
		overflow: hidden;
		position: inherit;
	}

	.dsf {
		display: flex;
		justify-content: space-between;
	}

	.broadIcon {
		/* width: 60rpx; */
		padding: 0 22rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		color: #001eca;
		z-index: 1;
		line-height: 60rpx;

	}





	.marquee_container {
		position: relative;
		width: 100%;
		height: 60rpx;

	}

	.marquee_text_left {
		display: flex;
		white-space: nowrap;
		animation-name: around_left;
		animation-duration: var(--speed--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		-webkit-animation: around_left var(--speed--) linear infinite;
		line-height: 60rpx;
		margin-left: -200rpx;
		position: absolute;

	}

	@keyframes around_left {
		from {
			left: 100%;
		}

		to {
			left: var(--marqueeWidth--);
		}
	}

	.marquee_text_right {
		display: flex;
		white-space: nowrap;
		/* animation-name: around_right; */
		animation-duration: var(--speed--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		line-height: 60rpx;
		position: absolute;

	}

	@keyframes around_right {
		from {
			right: 100%;
		}

		to {
			right: var(--marqueeWidth--);
		}
	}

	.marquee_tit {
		height: 60rpx;
		line-height: 60rpx;

	}

	.broadcastTopBtm {
		padding: 12rx;
		overflow: hidden;
		position: relative;
	}

	.broadcastDataTopBtmDatacss_top {
		width: 100%;
		animation-name: around_top;
		animation-duration: var(--scrollSpeed--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		left: 0;
	}

	@keyframes around_top {
		from {
			top: 0%;
		}

		to {
			top: var(--scrollHeight--);
		}
	}

	.broadcastDataTopBtmDatacss_bottom {
		width: 100%;
		animation-name: around_Bottom;
		animation-duration: var(--scrollSpeed--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		left: 0;
	}

	@keyframes around_Bottom {
		from {
			bottom: 0%;
		}

		to {
			bottom: var(--scrollHeight--);
		}
	}

	.broadcastDataTopBtmDatacss_let {
		width: 100%;
		animation-name: around_let;
		animation-duration: var(--scrollSpeed2--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		left: 0;
		top: 0;
	}

	.broadcastDataTopBtmDatacss_rig {

		width: 100%;
		animation-name: around_rig;
		animation-duration: var(--scrollSpeed2--);
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		right: 0%;
		top: 0;
		display: flex;
		justify-content: flex-end;
	}

	.animation_pausedcss {
		animation-play-state: paused;
	}

	@keyframes around_let {
		from {
			left: 0%;
		}

		to {
			left: var(--scrollWidth--);
		}
	}

	@keyframes around_rig {
		from {
			right: 0%;
		}

		to {
			right: var(--scrollWidth--);
		}
	}

	.bdbd_item {
		padding: 0 12rpx;
		line-height: 60rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.iconfont {
		width: 32rpx;
		height: 32rpx;
	}
</style>