const Tree = require('./lib/tree');

class Id3TreeBuilder {

    constructor() {
    }

    buildTreeFromExamples(examples) {
        if (examples.length === 0) {
            throw new Error('no examples provided');
        }
        const attributeWithHighestGain = this.getAttributeWithHighestGain(examples);
        if (attributeWithHighestGain == null) {
            return this.getMostUsedClassInExamples(examples);
        }

        return this.createTreeForAttribute(attributeWithHighestGain, examples);
    }

    createTreeForAttribute(attribute, examples) {
        const node = new Tree(attribute);

        const valuesForAttribute = this.getValuesForAttribute(attribute, examples);

        for (const valueForAttribute of valuesForAttribute) {
            const newNodeForAttribute = node.add(valueForAttribute);
            const reducedExamples = this.getExamplesWithValueForAttribute(valueForAttribute, attribute, examples)
                .map(example => {
                    const newExample = {...example};
                    delete newExample[attribute];
                    return newExample;
                });
            newNodeForAttribute.add(this.buildTreeFromExamples(reducedExamples));
        }

        return node;
    }


    getAttributeWithHighestGain(examples) {
        const availableAttributes = this.getAvailableAttributes(examples[0]);
        let attributeWithHighestGain = null, highestGain = 0;
        for (const attribute of availableAttributes) {
            const gain = this.getInformationGainWhenSplittingForAttribute(attribute, examples);
            if (gain > highestGain) {
                highestGain = gain;
                attributeWithHighestGain = attribute;
            }
        }
        return attributeWithHighestGain;
    }

    getAvailableAttributes(example) {
        return Object.keys(example).filter(key => key !== 'class');
    }

    getInformationGainWhenSplittingForAttribute(attribute, examples) {
        const overallEntropy = this.getOverallEntropy(examples);
        const entropyForAttribute = this.getEntropyForAttribute(attribute, examples);
        return overallEntropy - entropyForAttribute;
    }

    getOverallEntropy(examples) {
        const classes = this.getClassesInExamples(examples);
        let entropy = 0;
        classes.forEach(classToCheck => {
            const numberOfExamplesWithClass = this.getNumberOfExamplesWithClass(classToCheck, examples);
            const pi = numberOfExamplesWithClass / examples.length;
            entropy += -pi * Math.log2(pi);
        });
        return entropy;
    }

    getEntropyForAttribute(attribute, examples) {
        const values = this.getValuesForAttribute(attribute, examples);
        let entropy = 0;
        values.forEach(value => {
            const entropyForValue = this.getEntropyForAttributeAndValue(attribute, value, examples);
            const examplesWithThisValue = this.getExamplesWithValueForAttribute(value, attribute, examples);
            entropy += (examplesWithThisValue.length / examples.length) * entropyForValue;
        });
        return entropy;
    }

    getEntropyForAttributeAndValue(attribute, value, examples) {
        const relevantExamples = this.getExamplesWithValueForAttribute(value, attribute, examples);
        const classesInRelevantExamples = this.getClassesInExamples(relevantExamples);
        let entropy = 0;
        classesInRelevantExamples.forEach(classToCheck => {
            const classCount = this.getNumberOfExamplesWithClass(classToCheck, relevantExamples);
            const pi = classCount / relevantExamples.length;
            entropy += -pi * Math.log2(pi);
        });
        return entropy;
    }

    getValuesForAttribute(attribute, examples) {
        const values = [];
        examples.forEach(example => {
            if (values.indexOf(example[attribute]) === -1) {
                values.push(example[attribute]);
            }
        });
        return values;

    }

    getExamplesWithValueForAttribute(value, attribute, examples) {
        return examples.filter(example => example[attribute] === value);
    }

    getClassesInExamples(examples) {
        return this.getValuesForAttribute('class', examples);
    }

    getNumberOfExamplesWithClass(classToCheck, examples) {
        return this.getExamplesWithValueForAttribute(classToCheck, 'class', examples).length;
    }

    getMostUsedClassInExamples(examples) {
        const availableClasses = this.getClassesInExamples(examples);
        let maxCount = 0, mostUsedClass = null;
        for (const availableClass of availableClasses) {
            const count = this.getNumberOfExamplesWithClass(availableClass, examples);
            if (count > maxCount) {
                maxCount = count;
                mostUsedClass = availableClass;
            }
        }
        return mostUsedClass;
    }

}

module.exports = Id3TreeBuilder;
