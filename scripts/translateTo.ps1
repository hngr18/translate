param(
    $term = 'hello',
    $to = 'serbian'
)

 $ProgressPreference = 'SilentlyContinue'

 $response = Invoke-WebRequest -URI "https://www.bing.com/search?q=$to+for+$term"

 $response.Content -match '(?:<span id="tta_tgt">)(.*)(?:<\/span>)' | Out-Null

 [System.Web.HttpUtility]::HtmlDecode($matches[1])