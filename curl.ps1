$key =          'your-key-here'
$translateUrl = "https://pwsh.cognitiveservices.azure.com/sts/v1.0/issuetoken?Subscription-Key=$key"
$langFrom =     'en'
$langTo =       'fr'
$text =         'Let''s have some fun!'

try {
  $iwrParams = @{
    'Uri'                   = $translateUrl
    'Method'                = 'GET'
    # 'Body'                  = '{}'
    # 'ContentType'           = 'application/json'
    # 'Headers'               = @{
    #     'Ocp-Apim-Subscription-Key: ' = $key
    # }
    # 'UseBasicParsing'       = $true
    # 'UseDefaultCredentials' = $true
    # 'DisableKeepAlive'      = $true
    # 'MaximumDirection'      = [int32]::MaxValue
  }  
  #$Token = ($Request.ParsedHTML.getElementsByName("csrf-protection-token") | Select-Object *).Content
  $Token = Invoke-WebRequest @iwrParams
  $Token
}
catch {
  # $result = $_.Exception.Response.GetResponseStream()
  # $reader = New-Object System.IO.StreamReader($result)
  # $reader.BaseStream.Position = 0
  # $reader.DiscardBufferedData()
  # $responseBody = $reader.ReadToEnd();

  $_.Exception
  Write-host "Status Code: " $_.Exception.Response.StatusCode
  Write-host $responseBody
}
