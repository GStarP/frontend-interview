
/**
 * 编辑距离, 又称莱文斯坦距离
 * 指两个字符串之间由一个转成另一个所需的最少编辑(替换/插入/删除)次数
 * 相似度计算公式: (1-distance)/max(str1.length, str2.length)
 */

function editDistance(str1, str2) {
  if(str1.length === 0 || str2.length === 0) {
    return str1.length === 0 ? str2.length : str1.length
  }
  /**
   * 初始化矩阵
   *   s t r 2
   * s 0 1 2 3
   * t 1 0 0 0
   * r 2 0 0 0
   * 1 3 0 0 0
   */
  const dp = []
  for (let i = 0; i <= str1.length; i++) {
    const tmp = []
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) {
        tmp.push(j)
      } else {
        tmp.push(0)
      }
    }
    tmp[0] = i
    dp.push(tmp)
  }
  /**
   * 动态规划更新矩阵
   * dp[i][j] 表示 str1.substr(i) 和 str2.substr(j) 之间的编辑距离
   * dp[i][j] 可以由 dp[i-1][j] 添加一个; dp[i][j-1] 删除一个; dp[i-1][j-1] 替换一个(可能无需替换)
   * dp[i][j] = min{ dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + f(i,j) }
   * f(i, j) = str1[i] === str2[j] ? 0 : 1
   */
  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str2.length; j++) {
      if (str1[i] === str2[j]) {
        dp[i+1][j+1] = dp[i][j]
      } else {
        const rep = dp[i][j] + 1
        const ins = dp[i][j+1] + 1
        const del = dp[i+1][j] + 1
        const min = Math.min.call(this, rep, ins, del)
        dp[i+1][j+1] = min
      }
    }
  }
  console.log('---Matrix---')
  for (let i = 0; i <= str1.length; i++) {
    tmp = ''
    for (let j = 0; j <= str2.length; j++) {
      tmp += dp[i][j] + ' '
    }
    console.log(tmp)
  }
  console.log('---Result---')
  return dp[str1.length][str2.length]
}

console.log(editDistance('hxwnb', 'hxwsb'))
