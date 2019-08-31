#!/bin/bash

[[ $1 = '' ]] && term="Здраво" || term=$1
[[ $2 = '' ]] && from="serbian" || from=$2
[[ $3 = '' ]] && to="english" || to=$3

user_agent='Mozilla/5.0 (Linux; Linux 4.15.0-55-generic #60-Ubuntu SMP Tue Jul 2 18:22:20 UTC 2019; en-US)'

encQuery=$(echo -e $term+$from+to+$to | od -An -tx1 | tr ' ' % | xargs printf "%s")

translateResponse=$(curl -H "User-Agent: $user_agent" -s https://www.bing.com/search\?q=$encQuery)

echo $translateResponse | grep -oP '(?<=<span id="tta_tgt">)[^<]+'