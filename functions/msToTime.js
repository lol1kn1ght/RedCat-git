module.exports = exports = function(time) {
  try {

    if (!time) return console.log(`No`);

    var diff = time

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var mins = Math.floor(diff / (1000 * 60));
    var secs = Math.floor(diff / 1000);

    var d = days;
    var h = hours - days * 24;
    var m = mins - hours * 60;
    var s = secs - mins * 60;
    var toTime = `${d}д:${h}ч:${m}м:${s}с`
    var toTime = `${d === 0 ? `${h === 0 ? `${m === 0? `${s}сек` : `${m}м:${s}сек`}` : `${h}ч:${m}м:${s}сек`}` : `${d}дн:${h}ч:${m}м`}`




    return toTime


  } catch (e) {
    return e.message
  }
};