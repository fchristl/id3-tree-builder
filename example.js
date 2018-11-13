const Id3TreeBuilder = require('./index');
const treeify = require('treeify');
// examples taken from http://willkurt.github.io/ID3-Decision-Tree/
const examples = [
    {'outlook': 'Sunny', 'temperature': 'Hot', 'humidity': 'High', 'wind': 'Weak', 'class': 'No'},
    {'outlook': 'Sunny', 'temperature': 'Hot', 'humidity': 'High', 'wind': 'Strong', 'class': 'No'},
    {'outlook': 'Overcast', 'temperature': 'Hot', 'humidity': 'High', 'wind': 'Weak', 'class': 'Yes'},
    {'outlook': 'Rain', 'temperature': 'Mild', 'humidity': 'High', 'wind': 'Weak', 'class': 'Yes'},
    {'outlook': 'Rain', 'temperature': 'Cool', 'humidity': 'Normal', 'wind': 'Weak', 'class': 'Yes'},
    {'outlook': 'Rain', 'temperature': 'Cool', 'humidity': 'Normal', 'wind': 'Strong', 'class': 'No'},
    {'outlook': 'Overcast', 'temperature': 'Cool', 'humidity': 'Normal', 'wind': 'Strong', 'class': 'Yes'},
    {'outlook': 'Sunny', 'temperature': 'Mild', 'humidity': 'High', 'wind': 'Weak', 'class': 'No'},
    {'outlook': 'Sunny', 'temperature': 'Cool', 'humidity': 'Normal', 'wind': 'Weak', 'class': 'Yes'},
    {'outlook': 'Rain', 'temperature': 'Mild', 'humidity': 'Normal', 'wind': 'Weak', 'class': 'Yes'},
    {'outlook': 'Sunny', 'temperature': 'Mild', 'humidity': 'Normal', 'wind': 'Strong', 'class': 'Yes'},
    {'outlook': 'Overcast', 'temperature': 'Mild', 'humidity': 'High', 'wind': 'Strong', 'class': 'Yes'},
    {'outlook': 'Overcast', 'temperature': 'Hot', 'humidity': 'NormalWeak', 'class': 'Yes'},
    {'outlook': 'Rain', 'temperature': 'Mild', 'humidity': 'High', 'wind': 'Strong', 'class': 'No'}
];

console.log(treeify.asTree(new Id3TreeBuilder().build(examples), true));