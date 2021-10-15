util = {}
util.deletNullQuery = function(obj) {
  if(!obj) {
    return {}
  }
  const newObj = {};
  Object.keys(obj).forEach(e => {
    if(!obj[e] ) {
      return;
    } else if(Array.isArray(obj[e]) && !obj[e].length) {
      return;
    } else if(!Object.keys(obj[e]).length) {
      return;
    }
    newObj[e] = obj[e];
  });
  return newObj;
}

module.exports = util