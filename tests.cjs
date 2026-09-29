const assert=require('node:assert/strict');const {calculate,defaults,parse}=require('./calc.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const zero=Object.fromEntries(Object.entries(defaults).map(([k,v])=>[k,typeof v==='number'?0:v]));Object.assign(zero,{batch:1,waxPack:1,oilPack:1,monthlyUnits:1,orderUnits:1,jar:20,margin:30,rounding:'0.01'});
let r=calculate(zero);near(r.exact,20/0.7);near(r.price,28.58);assert.ok(r.actualMargin>=30);
r=calculate({...zero,fee:5,tax:6,commission:2});near(r.exact,20/0.57);near(r.profit,r.price*0.87-20);assert.ok(r.actualMargin>=30);
r=calculate({...zero,waxPrice:100,waxPack:1000,waxUse:100,oilPrice:100,oilPack:100,oilUse:10,loss:10});near(r.wax,10);near(r.oil,10);near(r.waste,20/9);
r=calculate({...zero,batch:12,laborMinutes:120,hourly:30,watts:1000,energyMinutes:60,kwh:1.2,fixedMonthly:200,monthlyUnits:100,orderFee:4,shipping:10,orderUnits:2});near(r.labor,5);near(r.energy,0.1);near(r.fixed,2);near(r.order,7);near(r.cost,34.1);
for(const invalid of [{waxPack:0},{batch:0},{loss:100},{margin:95,fee:5},{jar:-1},{hourly:'abc'},{monthlyUnits:0},{orderUnits:1.5},{waxPrice:''},{oilPack:0}])assert.ok(Object.keys(calculate({...defaults,...invalid}).errors).length);
assert.equal(parse('1.234,56'),1234.56);assert.equal(parse('0,50'),0.5);assert.equal(parse('35.50'),35.5);assert.ok(Number.isNaN(parse('12abc')));
for(let margin=0;margin<80;margin+=5)for(const rounding of ['0.01','0.5','1','5']){r=calculate({...defaults,margin,rounding});assert.ok(r.actualMargin+1e-8>=margin);assert.ok(r.price+1e-8>=r.exact);}
r=calculate({...defaults,customPrice:1,discount:0});assert.ok(r.saleProfit<0);r=calculate({...defaults,customPrice:0});assert.equal(r.saleMargin,null);console.log('Todos os testes passaram: margem, taxas, perdas, pesos em gramas, rateios, descontos, arredondamento e entradas inválidas.');console.log(JSON.stringify(calculate(defaults),null,2));

r=calculate({...defaults,oilPrice:35,oilPack:100,oilUse:12});near(r.oil,4.2);near(r.wax,6.75);near(r.price,39.5);near(r.oilBatch,12*12/0.95);
r=calculate({...defaults,oilPrice:50,oilPack:250,oilUse:7.5});near(r.oil,1.5);near(r.oilBatch,7.5*12/0.95);
