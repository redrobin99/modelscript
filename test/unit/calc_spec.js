
const ms = require('../../dist/modelscript.cjs');
const ObjectValues = require('object.values');
const expect = require('chai').expect;
const rawTransactions = [
  ['Cookies', 'Milk', 'Plates', ],
  ['Cups', 'Milk', 'Silverware', ],
  ['Cookies', 'Cups', 'Milk', 'Silverware', ],
  ['Cups', 'Silverware', ],
  ['Cookies', 'Cups', 'Milk', 'Silverware', ],
];

if (!Object.values) {
  ObjectValues.shim();
}
describe('calc', function () { 
  describe('getTransactions', () => {
    const gt = ms.calc.getTransactions(rawTransactions);
    // console.log(gt);
    it('should return values', () => {
      expect(gt).to.haveOwnProperty('values');
      expect(gt.values).to.be.a('set');
    });
    it('should contain all unique values of all transactions', () => {
      expect(Array.from(gt.values.values())).to.include.all.members([
        'Cookies', 'Milk', 'Plates', 'Cups', 'Silverware',
      ]);
    });
    it('should have a map of all unique values and indexes', () => {
      expect(gt.valuesMap).to.be.a('map');
      gt.values.forEach((val, i) => {
        expect(gt.valuesMap.has(val.toString())).to.be.true;
        expect(gt.valuesMap.get(val.toString())).to.eql(gt.valuesMap.get(i.toString()));
        expect(gt.valuesMap.has(i.toString())).to.be.true;
        expect(gt.valuesMap.get(i.toString())).to.eql(gt.valuesMap.get(val.toString()));
      });
    });
    it('should map values onto transactions', () => {
      expect(gt.transactions.length).to.eql(rawTransactions.length);
      rawTransactions.forEach((rt, i) => {
        expect(rt.length).to.eql(gt.transactions[ i ].length);
      });
    });
  });
  describe('assocationRuleLearning', () => {
    const gt = ms.calc.getTransactions(rawTransactions);
    
    it('should use Eclat to associate transactions', (done) => {
      ms.calc.assocationRuleLearning(gt.transactions, {
        valuesMap: gt.valuesMap,
      })
        .then(arl => {
          expect(arl).to.be.an('array');
          done();
        })
        .catch(done);  
      expect(ms.calc.assocationRuleLearning).to.be.an('function');
    });
    it('should use accept options for eclat summary', (done) => {
      ms.calc.assocationRuleLearning(gt.transactions, {
        valuesMap: gt.valuesMap,
        summary:false,
      })
        .then(arl => {
          expect(arl).to.be.an('object');
          done();
        })
        .catch(done);  
    });
    it('should work with raw transactions', (done) => {
      ms.calc.assocationRuleLearning(rawTransactions, {
        summary:false,
      })
        .then(arl => {
          expect(arl).to.be.an('object');
          done();
        })
        .catch(done);  
    });
  });
});