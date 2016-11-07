var postcss = require('postcss');
var R = require('ramda');

var neededColors = [
    'bg-color',
    'text-color',
    'comment-color',
    'input-color',
    'link-color',
    'button-default-color',
    'button-secondary-color',
    'button-tertiary-color',
    'th-color',
]

var defaultOptions = {
    '.hljs': {
        'bg-color': ['background', 'background-color'],
        'text-color': ['color']
    },
    '.hljs-comment': {
        'comment-color': ['color']
    },
    '.hljs-title': {
        'input-color': ['color']
    }
};


function matchesSelector(rule, targetSelector) {
    let selectors = rule.selector.replace(/\s/g, '').split(',');
    return R.contains(targetSelector, selectors);
}

function collectRuleColors(rule) {
    let collected = [];
    rule.walkDecls((decl, i) => {
        if (decl.prop == 'color' ||
            decl.prop == 'background-color' ||
            decl.prop == 'border-color')
        {
            collected.push(decl.value);
        }
    });
    return collected;
}

function getNeededColors(colorMap, collectedColors) {
    let setColors = R.keys(colorMap);
    let dedupedAvailableColors = R.uniq(collectedColors);
    let unusedAvailableColors = R.difference(dedupedAvailableColors, R.values(colorMap));
    let availableColors = R.flatten(R.repeat(unusedAvailableColors, 10));;
    let unsetNames = R.difference(neededColors, setColors);
    return R.fromPairs(R.zip(unsetNames, availableColors));
};

function collectSpecificColors(colorMap, rule, mappings) {
    let outputColors = Object.keys(mappings);
    outputColors.forEach((outputColor) => {
        let desiredProperties = mappings[outputColor];
        rule.walkDecls((decl, i) => {
            if (desiredProperties.indexOf(decl.prop) >= 0) {
                colorMap[outputColor] = decl.value;
            }
        });
    });
}

function buildLessColors(colorMap) {
    let less = postcss.root();
    R.mapObjIndexed((value, name) => {
        let rule = postcss.atRule({
            name: name + ':',
            params: value,
        });
        less.append(rule);
    }, colorMap);
    return less;
}

module.exports = postcss.plugin('themeBuilder', function themeBuilder(options) {
    return function (css) {
        options = options || defaultOptions;

        let finalColors = {};
        let availableColors = [];

        let targetedSelectors = R.keys(options);

        css.walkRules((rule) => {
            targetedSelectors.forEach((targetSelector) => {
                if (matchesSelector(rule, targetSelector)) {
                    collectSpecificColors(finalColors, rule, options[targetSelector]);
                } else {
                    availableColors = R.concat(availableColors, collectRuleColors(rule));
                }
            });
        });

        finalColors = R.merge(getNeededColors(finalColors, availableColors), finalColors);

        css.removeAll();
        css.append(buildLessColors(finalColors));
    }
});
