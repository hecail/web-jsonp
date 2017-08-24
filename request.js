/**
 * Created by 阿龙 on 2017/6/26.
 */
/**
 * options{
 * async:true（异步）或 false（同步）
 * method:请求的类型；GET 或 POST
 * url:文件在服务器上的位置
 * dataType:请求类型 支持jsonp
 * jsonp：jsonp方式请求成功后返回的包含字段
 * timeout：请求超时时间
 * data：请求参数
 * error：请求返回错误
 * success：请求返回成功
 * }
 * */

const urlHttp = "";

const ajax = (options) => {
    //默认参数
    options.url = options.url || '';
    options.async = options.async || true;
    options.method = options.method || 'get';
    options.data = options.data || '';
    options.timeout = options.timeout || 3000;
    options.url = urlHttp + options.url;//拼接服务器地址
    //如果是jsonp请求（默认改成get请求）
    options.success = options.success || '';
    if (options.dataType === "jsonp") {
        options.jsonp = options.jsonp || "jsoncallback";
        options.method = 'get';
    }
    //get请求-拼接url
    if (options.method.toLowerCase() == 'get') {
        if (typeof options.data == 'object') {
            var datas = "";
            for (var key in options.data) {
                datas += key + "=" + options.data[key] + "&";
            }
        }
        if (datas) {
            options.url += (options.url.indexOf('?') == -1? '?' : '') + datas;
        }
        if (options.dataType === "jsonp") {
            jsonpHttp(options);//跨域请求
            return
        }
    }
    //post请求-转换字符串
    if (options.method.toLowerCase() == 'post') {
        if (typeof options.data == 'object') {
            var arrs = [];
            for (var k in options.data) {
                arrs.push(k + '=' + options.data[k]);
            }
            options.data = arrs.join('&');
        }
    }
    //创建发送请求
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); //兼容ie
    xhr.open(options.method, options.url, options.async);
    if (options.method.toLowerCase() == 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(options.data);
    } else {
        xhr.send(null);
    }
    //异步请求
    if (options.async == true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callcall();
            }
        }
    }
    // xhr.abort(); // 取消异步请求
    //同步请求
    if (options.async == false) {
        callcall();
    }
    //返回状态判断
    function callcall() {
        if (xhr.status == 200) {
            options.success(xhr.responseText);
        } else {
            options.error('error:' + xhr.status + xhr.statusText);
        }
    }
};

const jsonpHttp = (options) => {
    //如果是跨域请求
    var timeoutId = undefined;
    var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
    var scriptId = '_' + callbackFunction;
    window[callbackFunction] = function (response) {
        options.success(response);
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        ;
        removeScript(scriptId);
        clearFunction(callbackFunction);
    };
    var jsonpScript = document.createElement('script');
    jsonpScript.setAttribute('src', '' + options.url + "&" + options.jsonp + '=' + callbackFunction);
    jsonpScript.id = scriptId;
    document.getElementsByTagName('head')[0].appendChild(jsonpScript);

    timeoutId = setTimeout(function () {
        console.log('JSONP request to ' + options.url + ' timed out');
        clearFunction(callbackFunction);
        removeScript(scriptId);
    }, options.timeout);

    //出现 404/500
    jsonpScript.onerror = function () {
        console.log('JSONP request to ' + options.url + ' failed');
        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    return;
};

//jsonp 请求返回的包裹
const generateCallbackFunction = () => {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
};
//jsonp请求成功后清除返回的方法
const clearFunction = (functionName) => {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
        delete window[functionName];
    } catch (e) {
        window[functionName] = undefined;
    }
};
//jsonp请求相当于是用Script的src请求，请求成功后就清除请求是创建的Script
const removeScript = (scriptId) => {
    var script = document.getElementById(scriptId);
    if (script) {
        document.getElementsByTagName('head')[0].removeChild(script);
    }
};

export default ajax;