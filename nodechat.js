/**
 * @brief Node's chat sample.
 * @param [in|out] server: node nodechat.js
 * @param [in|out] client: telnet 127.0.0.1 9001
 * @return Description of returned value.
 * @author wefs_
 * @web http://github.com/wefs
 */
var net =require('net')
var chatServer=net.createServer(),clientList=[]
chatServer.on('connection',function(client){
    client.name=client.remoteAddress+":"+client.remotePort
    client.write("Hi! "+client.name+"!\n");
    console.log(client.name+' joined')
    
    clientList.push(client)
    
    client.on('data',function(data){
       broadcast(data,client)
    })
    client.on('end',function(){
        console.log(client.name+' quit')
        clientList.splice(clientList.indexOf(client),1)
    })
    client.on('error',function(e){
        console.log(e)
    })
})
/*检查socket端口 是否可写*/
function broadcast(message,client) {
    var cleanup=[]
    for(var i=0;i<clientList.length;i+=1) {
       if(client!==clientList[i]) {
           if(clientList[i].writable) {
                clientList[i].write(client.name+"says"+message)
           }else {
               cleanup.push(clientList[i])
               clientList[i].detroy()
           }
       }
    }
/*在循环中删除四节点 ，删除垃圾索引*/
    for(i=0;i<cleanup.length;i+=1) {
        clientList.splice(clientList.indexOf(cleanup[i]),1)
    }
}
chatServer.listen(9001)