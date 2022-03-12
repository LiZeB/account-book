util = {}
util.deletNullQuery = function(obj) {
  const newObj = {};
  Object.keys(obj).forEach(e => {
    if (obj[e] === null || obj[e] === undefined || obj[e] === '') {
      return;
    } else if(Array.isArray(obj[e]) && !obj[e].length) {
      return;
    } else if(JSON.stringify(obj[e]) === '{}') {
      return;
    }
    newObj[e] = obj[e];
  });
  return newObj;
}

module.exports = util