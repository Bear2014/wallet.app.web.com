<template>
    <view class="helpCenter">
        <view class="helpCenter_top_state"></view>
        <navigation :navigationText="'帮助中心'"></navigation>
        <view class="helpCenter_header">
            <text
                style="margin-left: 20rpx; color: #fff; font-weight: 600; font-size: 50rpx; font-style: italic;">iPay</text>
        </view>
		
        <view class="help_content">
            <view class="help_content_title">七个教程带你了解iPay操作流程</view>
            <view style="width: 100%; display: flex; justify-content: center; margin-bottom: 20rpx;"><view class="help_content_hr"></view></view>
            <view class="help_content_tabs">
                <view :class="['help_content_tabs_items', active === item.active ? 'active' : '']"
                    @click="() => { active = item.active }" v-for="item in tabList" :key="item.active">
                    <view style="display: flex;align-items: center;justify-content: center;">
                        <text>{{ item.name }}</text>
                        <image style="width: 40rpx; height: 40rpx;"
                            :src="item.icon_on"></image>
                    </view>
                </view>
            </view>

            <view v-for="item in tabList[active].stepBG" :key="item.title" class="help_content_stepBG">
                <view class="help_content_stepBG_title">{{ item.title }}</view>
                <image class="help_content_stepBG_img" :src="item.image"></image>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            active: 0,
            tabList: [
                {
                    name: "实名认证",
                    active: 0,
                    icon_on: '../../../static/icon_on_1.png',
                    stepBG: [
                        {
                            title: "第一步: 点击图标",
                            image: '../../../static/step1-1.png'
                        }, {
                            title: "第二步: 完善信息",
                            image: '../../../static/step1-2.png'
                        }, {
                            title: "第三步: 实名成功",
                            image: '../../../static/step1-3.png'
                        },
                    ]

                }, {
                    name: "收付款",
                    active: 1,
                    icon_on: '../../../static/icon_on_2.png',
                    stepBG: [
                        {
                            title: "第一步: 添加收款码",
                            image: '../../../static/step2-1.png'
                        }, {
                            title: "第二步: 完善信息",
                            image: '../../../static/step2-2.png'
                        }
                    ]
                }, {
                    name: "卖币教程",
                    active: 2,
                    icon_on: '../../../static/icon_on_3.png',
                    stepBG: [
                        {
                            title: "第一步: 首页-卖币",
                            image: '../../../static/step3-1.png'
                        }, {
                            title: "第二步: 输入数量",
                            image: '../../../static/step3-2.png'
                        }, {
                            title: "第三步: 确认订单",
                            image: '../../../static/step3-3.png'
                        }, {
                            title: "第三步: 确认打币",
                            image: '../../../static/step3-4.png'
                        },
                    ]
                }, {
                    name: "买币教程",
                    active: 3,
                    icon_on: '../../../static/icon_on_4.png',
                    stepBG: [
                        {
                            title: "第一步: 首页-买币",
                            image: '../../../static/step5-1.png'
                        }, {
                            title: "第二步: 选择订单",
                            image: '../../../static/step5-2.png'
                        }, {
                            title: "第三步: 购买数量",
                            image: '../../../static/step5-3.png'
                        }, {
                            title: "第三步: 创建订单",
                            image: '../../../static/step5-4.png'
                        }, {
                            title: "第三步: 转账成功",
                            image: '../../../static/step5-5.png'
                        },
                    ]
                }, {
                    name: "充值教程",
                    active: 4,
                    icon_on: '../../../static/icon_on_5.png',
                    stepBG: [
                        {
                            title: "第一步: 输入金额",
                            image: '../../../static/step4-1.png'
                        }, {
                            title: "第二步: 打开iPay",
                            image: '../../../static/step4-2.png'
                        }, {
                            title: "第三步: 确认支付",
                            image: '../../../static/step4-3.png'
                        },
                    ]
                }, {
                    name: "提币教程",
                    active: 5,
                    icon_on: '../../../static/icon_on_6.png',
                    stepBG: [
                        {
                            title: "第一步: 添加钱包",
                            image: '../../../static/step6-1.png'
                        }, {
                            title: "第二步: 复制钱包地址",
                            image: '../../../static/step6-2.png'
                        }, {
                            title: "第三步: 粘贴钱包地址",
                            image: '../../../static/step6-3.png'
                        }, {
                            title: "第三步: 提币",
                            image: '../../../static/step6-4.png'
                        },
                    ]
                }, {
                    name: "商户存款",
                    active: 6,
                    icon_on: '../../../static/icon_on_7.png',
                    stepBG: [
                        {
                            title: "第一步: 首页-商户存款",
                            image: '../../../static/step7-1.png'
                        }, {
                            title: "第二步: 选择商户",
                            image: '../../../static/step7-2.png'
                        }, {
                            title: "第三步: 存款金额",
                            image: '../../../static/step7-3.png'
                        },{
                            title: "第三步: 添加商户",
                            image: '../../../static/step7-4.png'
                        },{
                            title: "第三步: 删除商户",
                            image: '../../../static/step7-5.png'
                        },
                    ]
                },
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
page {
    // background-color: #111111;
    height: 100%;
}

.helpCenter {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .helpCenter_top_state {
        height: 1rpx;
        padding-top: var(--status-bar-height);
        background-color: #ffffff;
    }

    &_header {
        height: 62rpx;
        padding: 12rpx 0;
        padding-left: 36rpx;
        display: flex;
        align-items: center;
        background-color: #001eca;

        // image{
        //     border-radius: 50%;
        //     width: 70rpx;
        //     height: 70rpx;
        // }
    }

    .help_content {
        flex: 1 !important;
        padding: 20rpx;
        overflow-y: scroll;

        &_title{
            text-align: center;
            color: #001eca;
            font-size: 40rpx;
            margin: 20rpx;
        }

        &_hr{
            text-align: center;
            height: 2px;
            width: 150rpx;
            background-color: #001eca;
        }
        
        &_tabs {
            display: flex;
            flex-flow: row wrap;

            &_items {
                margin-right: 20rpx;
                margin-bottom: 30rpx;
                width: 160rpx;
                text-align: center;
                line-height: 80rpx;
                background: rgba(0,30,202,.8);
                font-size: 24rpx;
                color: #fff;
                border-radius: 10rpx;
            }

            &_items:nth-child(4) {
                margin-right: 0;
            }

            .active {
                background-color: #001eca;
                color: #fff;
            }
        }

        &_stepBG {
            text-align: center;

            &_title {
                font-weight: 600;
                font-size: 28rpx;
            }

            &_img {
                height: 850rpx;
                width: 100%;
                margin-left: 20rpx;
            }

        }
    }
}</style>