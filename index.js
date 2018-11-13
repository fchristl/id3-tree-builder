const Tree = require('./lib/tree');


function id3(examples) {
    const node = new Tree();
    if (examples.length === 0) {
        return node;
    }
    const attributes = getAvailableAttributes(examples[0]);
    let attributeWithHighestGain = null, highestGain = 0;
    for (const attribute of attributes) {
        const gain = getInformationGainWhenSplittingForAttribute(attribute, examples);
        if (gain > highestGain) {
            highestGain = gain;
            attributeWithHighestGain = attribute;
        }
    }
    if (attributeWithHighestGain == null) {
        return getMostUsedClassInExamples(examples);
    }
    node.value = attributeWithHighestGain;
    const valuesForAttribute = getValuesForAttribute(attributeWithHighestGain, examples);
    for (const valueForAttribute of valuesForAttribute) {
        const newNodeForAttribute = node.add(valueForAttribute);
        const reducedExamples = getExamplesWithValueForAttribute(valueForAttribute, attributeWithHighestGain, examples)
            .map(example => {
                const newExample = {...example};
                delete newExample[attributeWithHighestGain];
                return newExample;
            });
        newNodeForAttribute.add(id3(reducedExamples));
    }
    return node;
}

function getAvailableAttributes(example) {
    return Object.keys(example).filter(key => key !== 'class');
}

function getInformationGainWhenSplittingForAttribute(attribute, examples) {
    const entropyForAttribute = getEntropyForAttribute(attribute, examples);
    const overallEntropy = getOverallEntropy(examples);
    return overallEntropy - entropyForAttribute;
}

function getOverallEntropy(examples) {
    const classes = getClassesInExamples(examples);
    let entropy = 0;
    classes.forEach(classToCheck => {
        const numberOfExamplesWithClass = getNumberOfExamplesWithClass(classToCheck, examples);
        const pi = numberOfExamplesWithClass / examples.length;
        entropy += -pi * Math.log2(pi);
    });
    return entropy;
}

function getEntropyForAttribute(attribute, examples) {
    const values = getValuesForAttribute(attribute, examples);
    let entropy = 0;
    values.forEach(value => {
        const entropyForValue = getEntropyForAttributeAndValue(attribute, value, examples);
        const examplesWithThisValue = getExamplesWithValueForAttribute(value, attribute, examples);
        entropy += (examplesWithThisValue.length / examples.length) * entropyForValue;
    });
    return entropy;
}

function getEntropyForAttributeAndValue(attribute, value, examples) {
    const relevantExamples = getExamplesWithValueForAttribute(value, attribute, examples);
    const classesInRelevantExamples = getClassesInExamples(relevantExamples);
    let entropy = 0;
    classesInRelevantExamples.forEach(classToCheck => {
        const classCount = getNumberOfExamplesWithClass(classToCheck, relevantExamples);
        const pi = classCount / relevantExamples.length;
        entropy += -pi * Math.log2(pi);
    });
    return entropy;
}

function getValuesForAttribute(attribute, examples) {
    const values = [];
    examples.forEach(example => {
        if (values.indexOf(example[attribute]) === -1) {
            values.push(example[attribute]);
        }
    });
    return values;

}

function getExamplesWithValueForAttribute(value, attribute, examples) {
    return examples.filter(example => example[attribute] === value);
}

function getClassesInExamples(examples) {
    return getValuesForAttribute('class', examples);
}

function getNumberOfExamplesWithClass(classToCheck, examples) {
    return getExamplesWithValueForAttribute(classToCheck, 'class', examples).length;
}

function getMostUsedClassInExamples(examples) {
    const availableClasses = getClassesInExamples(examples);
    let maxCount = 0, mostUsedClass = null;
    for (const availableClass of availableClasses) {
        const count = getNumberOfExamplesWithClass(availableClass, examples);
        if (count > maxCount) {
            maxCount = count;
            mostUsedClass = availableClass;
        }
    }
    return mostUsedClass;
}

module.exports = id3;