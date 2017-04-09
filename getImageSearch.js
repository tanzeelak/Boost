var request = require('request').defaults({ encoding: null });

var account_key = '223c2e22e5be4fd8bc3df2d5a8aaa434';

var req_headers = {'Ocp-Apim-Subscription-Key':account_key};
//var batch_search_url = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=funny+memes&mkt=en-us';
var batch_search_url = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=';

// returns the images frome a search "funny memes" from the Microsoft Image Search API
exports.imageSearch = function (input) {
	var query = input.replace(" ", "+");
	// console.log(query); // TODO remove
    return new Promise(
        function (resolve, reject) {
            request.post({
                headers: req_headers,
                url : batch_search_url + query + '&mkt=en-us',
                }, function(error, response, body) {
                if (error) {
                    console.log("error");
                }
                else if (response.statusCode !== 200) {
                    console.log("error: statusCode " + response.statusCode);
                }
                else {
                    resolve(extractimgurl(body));
                }
            });
        }
        
    );
};

// return a random image from the selection of images in body
function extractimgurl(body) {
    if (body) {
        body = JSON.parse(body);
        if (body.value) {
        	// get a random image from the first 10 or number of images returned, whichever is smaller
        	var sizePool = body.value.length;
        	if(sizePool > 10)
        		sizePool = 10;
        	var index = Math.floor(Math.random() * sizePool);
            return body.value[index]['contentUrl'];
            // console.log(body.value[index]['contentUrl']);
        }
    }
}