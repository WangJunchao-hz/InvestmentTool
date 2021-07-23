'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let res = '';
	const code = event.queryStringParameters ? event.queryStringParameters.code : event.code;
	if (code) {
		const url =
			`https://api.weixin.qq.com/sns/jscode2session?appid=wx825c0da82f49974d&secret=8601776d7c6105b09f330701097f5864&js_code=${code}&grant_type=authorization_code`;
		res = await uniCloud.httpclient.request(url, {
			contentType: "json",
			dataType: "json"
		});
	}
	console.log('login', res);
	//返回数据给客户端
	return res
};
