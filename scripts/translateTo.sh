#!/bin/bash

[[ $1 = '' ]] && term="hello" || term=$1
[[ $2 = '' ]] && to="serbian" || to=$2

user_agent='Mozilla/5.0 (Linux; Linux 4.15.0-55-generic #60-Ubuntu SMP Tue Jul 2 18:22:20 UTC 2019; en-US)'

translateResponse=$(curl -H "User-Agent: $user_agent" -s https://www.bing.com/search\?q=$to+for+$term)

echo $translateResponse | grep -oP '(?<=<span id="tta_tgt">)[^<]+'