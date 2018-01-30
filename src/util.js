import moment from 'moment';

function titleCase(str) {
  var words = str.split("_");
  for (var i = 0; i < words.length; i++) {
    var j = words[i].charAt(0).toUpperCase();
    words[i] = j + words[i].substr(1);
  }
  return words.join(" ");
}

const isObj = obj => typeof obj === "object";

const formatDate = date => moment(date.date).fromNow();

export { titleCase, isObj, formatDate }