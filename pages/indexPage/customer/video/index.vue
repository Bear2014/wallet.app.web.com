<template>  
    <iframe @event1="event1" @event2="event2" :onload="onloadCode " src="about:blank" style="border:1px solid;height: 300px;width: 100%"></iframe>  
</template>  

<script>  
    export default {  
        props: {
            onloadCode: {
				type: String,
				default: ''
			},
        },
        data() {  
            return {  
                // onloadCode: `  
                // const url = 'https://vd3.bdstatic.com/mda-mja2qsy47mbyh1xc/sc/cae_h264_clips/1633918903861514556/mda-mja2qsy47mbyh1xc.mp4?auth_key=1634030413-0-0-7898726f7bd328302e2119fdf694fd5e&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest='  
                // this.contentWindow.document.body.innerHTML = '<video style="width: 100%;height: 100%" controls="controls" src="'+url+'"></video>';  
                // const iframe = top.document.getElementsByTagName('iframe')[0]  
                // var evObj = document.createEvent('MouseEvents');  
                // evObj.initEvent( 'event1', true, false );  
                // iframe.dispatchEvent(evObj)  
                // `  ,
                newzz:`this.contentWindow.document.body.innerHTML = '<video style="width: 100%;height: 100%" controls="controls" src="'+url+'"></video>';  
                const iframe = top.document.getElementsByTagName('iframe')[0]  
                var evObj = document.createEvent('MouseEvents');  
                evObj.initEvent( 'event1', true, false );  
                iframe.dispatchEvent(evObj)`
            }   
        },  
        onShow() {  
            // const url=http://192.168.1.224:9000/202311/202312111609256576c3b5c089b.mp4?response-cache-control=private%2C%20max-age%3D1200&response-content-type=video%2Fmpeg4&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=HQ2P9WDwx8zbq7SoHXmU%2F20231211%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231211T080925Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=5f29abbf9238805dbe9ef3d61bb8c03fbf4bf2a8138a523a6fe945b59b7101e8
            // this.contentWindow.document.body.innerHTML = '<video style=&quot;width: 100%;height: 100%&quot; controls=&quot;controls&quot; src=&quot;'+url+'&quot;></video>';  
            //     const iframe = top.document.getElementsByTagName('iframe')[0]  
            //     var evObj = document.createEvent('MouseEvents');  
            //     evObj.initEvent( 'event1', true, false );  
            //     iframe.dispatchEvent(evObj)
        },  

        methods: {  
            event1(a) {  
                
            },  
            event2(a) {  
                
            }  
        }  
    }  
</script>  

<style>  
</style>  