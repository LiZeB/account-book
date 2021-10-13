function deVal(value, str = '--') {
  return value === undefined || value === null || value === '' ? str : value;
}

export {
  deVal,
}