import {request, sendUploadFile, WSRequest, WSRequestUpload} from "./request.js"

export default { 
	// 地址 -- 请求方式 -- 数据 -- token
    tokenTimeOut(address,met,params, foreAddress = "baseUrlTest") {
        return request(address,met,params,foreAddress)
    },
    flieUpload(url, method, params) {
        return sendUploadFile(url, method, params)
    },
    WSRequest(url, method, params) {
        return WSRequest(url, method, params)
    },
    WSRequestUpload(url,files, params) {
        return WSRequestUpload(url, files, params)
    },
    getVersion(address,met,params, foreAddress = "baseUrlTest") {
        return request(address,met,params,foreAddress)
    },
}