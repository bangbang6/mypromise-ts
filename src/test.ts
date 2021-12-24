import myPromise from './promise'
let promise = new myPromise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('第一个异步')
  },5000)
  //resolve('asd')
 
  
})

promise.then(res=>{
  console.log('then1输出',res)
  return new myPromise((resolve,reject)=>{
    setTimeout(()=>{
      reject('第二个异步')
    },5000)
    //resolve('asd')
   
    
  })
},error=>{
  console.log('then1输出2',error)
  return 'error'

}).then(res2=>{ //每个promise存自己的的resolve,reject回调函数数组 不是同一个promise对象 而是有三个promise对象 每个对象有一个数组其中只有一个cb不是三个cb都在同一个promise的callbacks数组
  console.log('then2输出',res2)
 return 'ok2'
},error2=>{
  console.log('then2输出2',error2)

}).then(res3=>{
  console.log('then3输出',res3)

},error3=>{
  console.log('then3输出2',error3)

})
