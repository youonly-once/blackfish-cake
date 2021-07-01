function isEmpty(v) {
  //console.log(typeof v)
  console.log(Object.prototype.toString.call(v))
  if (v == null) {
    console.log("v == null")
    return true;
  }
  if (v === null) {
    console.log("v === null")
    return true;
  }
  if (v == undefined) {
    console.log("v == undefined")
    return true;
  }
  if (v === undefined) {
    console.log("v === undefined")
    return true;
  }
  if (typeof v == 'string' && v.trim() == '') {
    console.log("v == 空")
    return true;
  }
  if (v == "undefined") {
    console.log("v == undefined")
    return true;
  }
  if (v == "null") {
    console.log("v == undefined")
    return true;
  }
  if (Object.prototype.toString.call(v) == '[object Number]' && isNaN(v)) {
    console.log("v == NAN")
    return true;
  }
  if (Object.prototype.toString.call(v) == '[object Array]' && v.length == 0) {
    console.log("v array == 0")
    return true;
  }
 /* if (Object.prototype.toString.call(v) == '[object Object]' && !v.hasOwnProperty('m')) {
    console.log("v has not property m")
    return true;
  }*/
  
 
  console.log("ok")
  return false

}

module.exports = {
  isEmpty: isEmpty
}