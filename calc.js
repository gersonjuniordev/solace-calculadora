/* All monetary calculations use unrounded values; only the recommended price rounds up. */
(function(root){
const defaults={batch:12,waxPrice:45,waxPack:1000,waxUse:150,oilPrice:35,oilPack:100,oilUse:12,loss:5,jar:5.5,wick:0.8,label:0.6,box:2,extra:0,inbound:0,laborMinutes:90,hourly:25,watts:500,energyMinutes:45,kwh:1.11,batchExtra:0,fixedMonthly:200,monthlyUnits:100,fee:5,tax:0,commission:0,orderFee:0,shipping:0,orderUnits:1,margin:30,rounding:'0.5',customPrice:45,discount:10};
const numeric=Object.keys(defaults).filter(k=>typeof defaults[k]==='number');
function parse(v){if(typeof v==='number')return Number.isFinite(v)?v:NaN;const s=String(v).trim().replace(/\s/g,'');if(!s)return NaN;if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(s)&&!/^\d+(?:\.\d+)?$/.test(s))return NaN;return Number(s.includes(',')?s.replace(/\./g,'').replace(',','.'):s);}
function calculate(raw){const d={...raw},errors={};for(const k of numeric){d[k]=parse(d[k]);if(!Number.isFinite(d[k])||d[k]<0||d[k]>1e9)errors[k]='Informe um número válido, entre 0 e 1 bilhão.';}
for(const k of ['batch','waxPack','oilPack','orderUnits','monthlyUnits'])if(!(d[k]>0))errors[k]='Informe um valor maior que zero.';
for(const k of ['batch','orderUnits','monthlyUnits'])if(!Number.isInteger(d[k]))errors[k]='Informe uma quantidade inteira.';
for(const k of ['loss','margin','discount'])if(d[k]>=100)errors[k]='Use um percentual menor que 100%.';
for(const k of ['fee','tax','commission'])if(d[k]>100)errors[k]='Use um percentual entre 0 e 100%.';
const rate=(d.fee+d.tax+d.commission)/100;
if(rate+d.margin/100>=1)errors.margin='Margem + taxas + impostos + comissão precisam somar menos de 100%.';
if(Object.keys(errors).length)return {errors};
const wax=d.waxPrice/d.waxPack*d.waxUse;
const oilQty=d.oilUse;
const oil=d.oilPrice/d.oilPack*oilQty;
const waste=(wax+oil)/(1-d.loss/100)-(wax+oil);
const packaging=d.jar+d.wick+d.label+d.box+d.extra;
const labor=d.laborMinutes/60*d.hourly/d.batch;
const energy=d.watts/1000*d.energyMinutes/60*d.kwh/d.batch;
const productionExtra=(d.inbound+d.batchExtra)/d.batch;
const fixed=d.fixedMonthly/d.monthlyUnits;
const order=(d.orderFee+d.shipping)/d.orderUnits;
const cost=wax+oil+waste+packaging+labor+energy+productionExtra+fixed+order;
if(!(cost>0))return {errors:{waxUse:'Preencha os custos para calcular um preço de venda.'}};
const exact=cost/(1-rate-d.margin/100),step=parse(d.rounding);
const round=s=>Math.ceil((s-1e-10)/(step>0?step:0.01))*(step>0?step:0.01);
const price=round(exact),profit=price*(1-rate)-cost,actualMargin=profit/price*100;
const floor=cost/(1-rate),sale=d.customPrice*(1-d.discount/100),saleProfit=sale*(1-rate)-cost;
const contribution=price*(1-rate)-(cost-fixed);
return {errors:{},d,rate,wax,oil,oilQty,waste,packaging,labor,energy,productionExtra,fixed,order,cost,exact,price,profit,actualMargin,floor,sale,saleProfit,saleMargin:sale>0?saleProfit/sale*100:null,maxDiscount:Math.max(0,(1-floor/price)*100),targetDiscount:Math.max(0,(1-exact/price)*100),breakEven:contribution>0?Math.ceil(d.fixedMonthly/contribution):null,batchCost:cost*d.batch,batchProfit:profit*d.batch,waxBatch:d.waxUse*d.batch/(1-d.loss/100),oilBatch:oilQty*d.batch/(1-d.loss/100),scenarios:[20,30,40,50].map(m=>({margin:m,price:rate+m/100<1?Math.ceil((cost/(1-rate-m/100)-1e-10)*100)/100:null}))};}
const api={defaults,parse,calculate};if(typeof module!=='undefined')module.exports=api;else root.Solace=api;
})(globalThis);
