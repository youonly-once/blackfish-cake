function random() {
  var result = ''
  const wordList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '0','k']
  for (let i = 0; i < 31; i++) {
    //0-1，不包括1 当随机数接近1时，round四舍五入为1 pos=36，越界，最后result就会加上undefined
    //所以在word增加一个 37
    //console.log('pos',pos)
    result += wordList[Math.round(Math.random() * 36)]
  }
  return result
}

module.exports = random()
