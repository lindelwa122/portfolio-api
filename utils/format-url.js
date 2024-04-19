const allowedStrs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const formatURL = (urlstr) => {
  const words = urlstr.split(' ');

  for (let i = 0; i < words.length; i++) {
    const chars = words[i].split('');
    for (let j = 0; j < chars.length; j++) {
      if (!allowedStrs.includes(chars[j].toLowerCase())) {
        chars.splice(j, 1);
      }
    } 
    words[i] = chars.join('');
  }

  return words.join('-').toLowerCase();
}

module.exports = formatURL;