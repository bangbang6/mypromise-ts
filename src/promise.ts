import {ResolveType,RejectType,Executor} from './actiontype'
export default class myPromise<T=any> {
  public resolve!:ResolveType
  public reject!:RejectType
  public status!:string
  public resolve_value!:any
  public reject_error!:any
  public resolve_then_callbacks:(()=>void)[] = [] //!保存then函数参数的成功的回调函数
  public reject_then_callbacks:(()=>void)[] = []//!保存then函数参数的失败的回调函数
  constructor(executor:Executor){
    this.status = 'pending'
    this.resolve=(value:any)=>{
      if(this.status === 'pending'){
        

        console.log('变成resolve');
        this.resolve_value = value
        this.status = 'success'
        this.resolve_then_callbacks.forEach(cb=>cb())
      }
     
    }
    this.reject = (reason:any)=>{
      if(this.status === 'pending'){
        console.log('变成reject');
        this.reject_error = reason

        this.status = 'fail'
        this.reject_then_callbacks.forEach(cb=>cb())

      }
      

    }
    try{ 
      executor(this.resolve,this.reject) //!为什么当resolve函数报错时候走reject  因为这里有try-catch 当报错就走reject了

    }catch(error:any){
      this.status = 'pending'
      this.reject(error.toString())
    }
  }
  then(resolveInthen:ResolveType,rejectInthen:RejectType){
    return new myPromise((resolve,reject)=>{
      if(this.status === 'success'){
        const next = resolveInthen(this.resolve_value)

        resolve(next)
      }
      if(this.status === 'fail'){
        const next = rejectInthen(this.reject_error)
        reject(next)

      }
      if(this.status === 'pending'){
         this.processManyAsyncAndSync(resolveInthen,rejectInthen,resolve,reject)
      }
        
      
    })
  
    
  }
  processManyAsyncAndSync(resolveInthen:ResolveType,rejectInthen:RejectType,resolve:ResolveType,reject:RejectType){
    this.resolve_then_callbacks.push(()=>{
      let next = resolveInthen(this.resolve_value)
      if(isPromise(next)){
        next.then(res=>{
          resolve(res)
        },error=>{
          reject(error)
        })
      }else{
        resolve(next)
      }
      })
      this.reject_then_callbacks.push(()=>{
        const next = rejectInthen(this.reject_error)
        if(isPromise(next)){
          next.then(res=>{
            reject(res)
          },error=>{
            reject(error)
          })
        }else{
          reject(next)
        }
          
        })
  }
  static all(promises:myPromise[]):myPromise{
    return new myPromise((resolve,reject)=>{
      let result:Array<any> = []
      let count = 0
      promises.forEach((promise,index)=>{
        promise.then(success=>{
          result[index]= success
          count++
          if(count === promises.length){
            resolve(result)
          }
        },error=>{
          reject(error)
        })
      })
      
    })
  }
}
//!自定义守卫
function isPromise(val:any):val is myPromise{
  return isObject(val) && isFunction(val.then) 
}
function isObject(val:any):val is Record<any,any>{
  return val!==null && typeof val === 'object'
}
function isFunction(val:any):val is Function{
  return typeof val === 'function'
}
export {}


