module.exports = exports = function(number) {
  try {


    if (isNaN(Number(number))) return new Error(`Аргумент не является числом`)
    // if (number === 0) return 0
    number = number + ``
    var outrez = number.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    return outrez

  } catch (e) {
    return e.message
  }
};