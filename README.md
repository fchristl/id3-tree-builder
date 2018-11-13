# ID3 Tree Builder

This is a simple library that allows you to quickly generate decision trees based on examples. The
algorithm used is [ID3](https://en.wikipedia.org/wiki/ID3_algorithm).

## Installation

    npm install --save id3-tree-builder
  
## Usage
See the [example script](./example.js) for how to build a tree from examples. The example data is taken
from [http://willkurt.github.io/ID3-Decision-Tree/](http://willkurt.github.io/ID3-Decision-Tree/).

The basic usage works like this:

    const Id3TreeBuilder = require('id3-tree-builder');
    const examples = [{"Attribute": "Value 1", "class": "Class 1"}]; // your array of examples
    const builder = new Id3TreeBuilder();
    const tree = builder.build(examples);
    
All of your examples need to have the same properties set. Also, their class name needs to be set in
the `class` property.