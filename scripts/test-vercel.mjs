import assert from 'node:assert/strict';
import { readFile,access } from 'node:fs/promises';
import { createServer } from 'node:http';
import handler,{normalizeVercelRequest} from '../api/index.mjs';
let request={url:'/api/index?_eyi_path=catalog%2Fproducts&limit=12&skip=24'};
normalizeVercelRequest(request);
assert.equal(request.url,'/api/catalog/products?limit=12&skip=24');
request={url:'/api/index?limit=12',query:{_eyi_path:['catalog','products']}};
normalizeVercelRequest(request);assert.equal(request.url,'/api/catalog/products?limit=12');
assert.throws(()=>normalizeVercelRequest({url:'/api/index?_eyi_path=..%2F.env'}));
const configuration=JSON.parse(await readFile('vercel.json','utf8'));
assert.equal(configuration.outputDirectory,'dist');assert.equal(configuration.functions['api/index.mjs'].includeFiles,'server/**');
await access('server/data/products.json');
console.log('PASS: Vercel rewrites preserve API path and pagination query; private fallback included.');
const server=createServer(handler);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
 const base=`http://127.0.0.1:${server.address().port}`;
 let response=await fetch(`${base}/api/index?_eyi_path=health`);
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{status:'ok'});
 response=await fetch(`${base}/api/index?_eyi_path=catalog%2Fproducts&limit=0`);assert.equal(response.status,400);
 response=await fetch(`${base}/api/index?_eyi_path=shipping%2Fquote`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cep:'01001000',items:[{id:101,quantity:1}]})});assert.equal(response.status,503);assert.equal((await response.json()).code,'shipping_not_configured');
 console.log('PASS: rewritten health/catalog/shipping routes work with normal Node request streams.');
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
for(const body of [{cep:'01001000',items:[{id:101,quantity:1}]},JSON.stringify({cep:'01001000',items:[{id:101,quantity:1}]})]){
 let status=0,result='';
 const response={headersSent:false,writeHead(code){status=code;this.headersSent=true;},end(data){result=data;}};
 await handler({method:'POST',url:'/api/index?_eyi_path=shipping%2Fquote',headers:{host:'example.test','content-type':'application/json'},socket:{remoteAddress:'vercel-test'},body},response);
 assert.equal(status,503);assert.equal(JSON.parse(result).code,'shipping_not_configured');
}
console.log('PASS: Vercel pre-parsed JSON body and string body are accepted without reading the stream twice.');
