<template>
    <view class="loading-container">
        <view class="loding-animation-holder">
            <view class="loading-animator"></view>
            <view class="loading-animator"></view>
            <view class="loading-animator"></view>
            <view class="loading-animator"></view>
            <view class="middle-circle"></view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.loading-container {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 100;
    background: #F4F3F3;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-transition: opacity 1s cubic-bezier(.83, .01, .75, .71);
    -moz-transition: opacity 1s cubic-bezier(.83, .01, .75, .71);
    -ms-transition: opacity 1s cubic-bezier(.83, .01, .75, .71);
    -o-transition: opacity 1s cubic-bezier(.83, .01, .75, .71);
    transition: opacity 1s cubic-bezier(.83, .01, .75, .71);
}

.loding-animation-holder {
    width: 100rpx;
    height: 100rpx;
    transform: rotate(45deg);
    position: relative;
}

.loading-animator {
    width: 50%;
    height: 50%;
    float: left;
    background: #001eca;
    transform: rotate(0deg);
    position: relative;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    opacity: 1;
}

.loading-animator:nth-child(1) {
    transform-origin: bottom right;
    animation: loading 3s cubic-bezier(.46, -0.1, .2, 1.5) infinite;
}

.loading-animator:nth-child(2) {
    transform-origin: bottom left;
    animation: loading 3s 0.3s cubic-bezier(.46, -0.1, .2, 1.5) infinite;
}

.loading-animator:nth-child(4) {
    transform-origin: top left;
    animation: loading 3s 0.4s cubic-bezier(.46, -0.1, .2, 1.5) infinite;
}

.loading-animator:nth-child(3) {
    transform-origin: top right;
    animation: loading 3s 0.5s cubic-bezier(.46, -0.1, .2, 1.5) infinite;
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
        opacity: 1;
    }

    25% {
        transform: rotate(90deg);
        opacity: 0;
    }

    35% {
        transform: rotate(-90deg);
        opacity: 0;
    }

    65% {
        transform: rotate(0deg);
        opacity: 1;
    }
}

.middle-circle {
    width:10rpx;
    height: 10rpx;
    position: absolute;
    top: 47.5rpx;
    left: 47.5rpx;
    border-radius: 100%;
    border: 1px solid #5bffde;
    background: #3c4a5c;
}</style>