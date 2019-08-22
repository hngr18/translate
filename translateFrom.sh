#!/bin/bash

[[ $1 = '' ]] && term="hello" || term=$1
[[ $2 = '' ]] && to="serbian" || to=$2

translateResponse=$(curl -s https://www.bing.com/search\?q=$to+for+$term)

echo "$translateResponse" > test.html

# regexp="(?:<span id="tta_tgt">)(.*)(?:<)"
# [[ $translateResponse =~ $regexp ]] && echo hi

# echo $test

#  [System.Web.HttpUtility]::HtmlDecode($matches[1])