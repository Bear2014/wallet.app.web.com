//日期格式化  (时间戳转换为正常的时间)
// type 默认传0
export function formatTime(value, type = 0) {
  var time = new Date(value);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  var arr = [
    year + "-" + month + "-" + date,  //默认传0得到的是年月日
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second, //传1得到的是年月日时分秒(2022-12-31 19:30:25)
    year + "年" + month + "月" + date, //传2得到 (2022年12月31日)
    year + "年" + month + "月" + date + " " + hour + ":" + minute + ":" + second, //传3得到(2022年12月31 19:30:25)
    hour + ":" + minute + ":" + second, //传4得到 (19:30:25)
    month + "-" + date, //传5得到（12-31）
	minute + ":" + second, //传6得到（30:25）
    year + "/" + month + "/" + date + " " + hour + ":" + minute, //传7得到2022/12/31 19:30
    second  //传8只拿到秒
    //等等根据情况随便补充
]
  return arr[type];
}
