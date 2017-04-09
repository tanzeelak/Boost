var request = require('request').defaults({ encoding: null });

var account_key = '5d7940777f9244549c6883044f9ccf57';
var base_url = 'https://westus.api.cognitive.microsoft.com/';

/**
 * Gets the key phrases of the sentence
 * @param {String} sentence
 * @return {Array()} the array of  

var batch_keyphrase_url = base_url + 'text/analytics/v2.0/keyPhrases';
exports.getKeyPhrases = function(sentence) {
	return new(
		function(resolve, reject) {
			var requestData = {
				url: batch_keyphrase_url,
				headers: {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key':account_key}
			};
			request.post(requestData, function (error, response, body) {
				if (error) {
					reject(error);
				}
				else if (response.statusCode !== 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(body));
                }
			}); 
		}
	);
};
*/
var req_headers = {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key':account_key};
var batch_sentiment_url = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';


exports.analyzeSentiment = function (sentence) {
	var requestData = '{"documents":[{"id":"1","text":"' + sentence + '"}]}';
	//var json_obj = JSON.parse(requestData);
	//console.log(json_obj);
	return new Promise(
		function (resolve, reject) {
			console.log("yo");
			request.post({
				headers: req_headers,
				url : batch_sentiment_url,
				body: requestData
				}, function(error, response, body) {
				if (error) {
		            console.log("error");
		        }
		        else if (response.statusCode !== 200) {
		            console.log("error: statusCode " + response.statusCode);
		        }
		        else {
		            resolve(extractScore(body));
		        }
			});
		}
		
	);
};

function extractScore(body) {
	var totalScore = 0;
	var count = 0;
	if (body) {
		body = JSON.parse(body);
		if (body.documents) {
			for (var item in body.documents) {
				count++;
				totalScore += body.documents[item]['score'];
				//console.log(body.documents[item]['id'] + ", " + body.documents[item]['score']);
			}
		}
	}
	//console.log(totalScore / count);
	return totalScore / count * 100;
}


//detect 