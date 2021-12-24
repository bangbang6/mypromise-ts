type ResolveType = (resolve:any)=>void
type RejectType = (reject:any)=>void

type Executor=(resolve:ResolveType,reject:RejectType)=>void

export {ResolveType,RejectType,Executor}