param(
    $term = 'Здраво',
    $from = 'serbian',
    $to = 'english'
)

 $ProgressPreference = 'SilentlyContinue'

 $response = Invoke-WebRequest -URI "https://www.bing.com/search?q=$term+$from+to+$to"

 $response.Content -match '(?:<span id="tta_tgt">)(.*)(?:<\/span>)' | Out-Null

 [System.Web.HttpUtility]::HtmlDecode($matches[1])