const object = {
    a:'akshat',b:'aks',c:'aks'
}
console.log(Object.keys(object).filter( key => object[key] == 'aks'));
// Random Color
console.log(`${'#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`);