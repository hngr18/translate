
let patterns = new Map<string, RegExp>();

patterns.set(
	'javascript', 
	/\b(?!(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|from|function|goto|if|implements|import|in|instanceof|int|interface|let|long|Math|native|new|null|package|private|protected|public|restore|render|return|rotate|save|scale|short|src|static|super|switch|synchronized|this|throw|throws|transient|translate|true|try|typeof|update|var|void|volatile|while|with|yield))\b[A-Za-z0-9_]{3,}\b/gm
);

patterns.set (
	'stylesheet',
	/(?:\/\*)([^\/*][^*]*)/g
)

export { patterns };