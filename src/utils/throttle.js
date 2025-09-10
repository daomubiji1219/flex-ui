function throttle(fn,delay){
    let timer = null
    return function(...args){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(this,args)
        },delay)
    }

}

export { throttle }
export default throttle
