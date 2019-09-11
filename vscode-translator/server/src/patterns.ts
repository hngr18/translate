export { patterns };

interface Patterns {
	readonly javascript: RegExp,
	readonly stylesheet: RegExp,
	readonly camelCase: RegExp,

	getById(id: string): RegExp
}

let patternMap: Map<string, RegExp> = new Map();

const patterns: Patterns = {

	javascript: /\b(?!(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|from|function|goto|if|implements|import|in|instanceof|int|interface|let|long|Math|native|new|null|package|private|protected|public|restore|render|return|rotate|save|scale|short|src|static|super|switch|synchronized|this|throw|throws|transient|translate|true|try|typeof|update|var|void|volatile|while|with|yield))\b[A-Za-z0-9_]{3,}\b/gm,
	stylesheet: /(?<=\/\*)([^\/*][^*]*)|(?:\b(@keyframes)\b)?(?:[ .#])(?!(from|to))([\w.-]+)(?:.+)?(?=(?: {))/gm,
	camelCase: /([A-Z][a-z]+)/,

	getById(id) {
		if (patternMap.size == 0)
			patternMap = InitPatternMap();

		return patternMap.get(id)!
	}
}

function InitPatternMap(): Map<string, RegExp> {
	let map = new Map<string, RegExp>();
	
	for (let key in Object.keys(patterns)) {
		let patternName = Object.keys(patterns)[key];
		map.set(patternName, <RegExp>patterns[<keyof Patterns>patternName]);
	}
	return map;
}