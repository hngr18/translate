param (
	$term = 'Здраво',
	$from = 'sr',
	$to = 'en',
	$accountKey = '2c8334bcc26a4bd3952cbae019e987c9'
)

$tokenUrl = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken'

$token = Invoke-RestMethod -Uri $tokenUrl -Method Post -Headers @{ "Ocp-Apim-Subscription-Key"=$accountKey }

#$token

$translationUrl = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'
$header = @{'Authorization'="Bearer "+$token; 'Content-Type'='application/json'}
$content = ConvertTo-Json @( 
	@{ Text= $term; }
)
$uri = $translationUrl + "&from=$from&to=$to"
$response = Invoke-WebRequest -Uri $uri -UseBasicParsing -Method Post -Headers $header -Body $content

$translations = ($response.Content | ConvertFrom-Json).translations

#$translations | Select-Object -Property text

$translations[0].text