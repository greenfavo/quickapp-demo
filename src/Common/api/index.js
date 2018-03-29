const SL_API = 'http://api-xl9-ssl.xunlei.com/sl'

export default {
  getList ({ cursor = 0, size = 10, category= 'new'}) {
    return natives.fetch({
      url:`${SL_API}/cinecism/list`,
      method: 'GET',
      data: {
        cursor,
        size,
        category
      }
    }).then(res => {
      return res.data
    })
  },
  getReview (id) {
    return natives.fetch({
      url:`${SL_API}/cinecism/info`,
      method: 'GET',
      data: {
        id,
        recommend_size: 0
      }
    }).then(res => res.data)
  }
}