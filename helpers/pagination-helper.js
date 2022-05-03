/* 
offset = (page - 1) * limit
totalPages = Math.ceil(restaurants.length/limit)
pages = Array.from({length: totalPages}, (_, index) => index + 1)
currentPage = page < 1 ? 1 : page > totalPages : totalPages : page
prev = currentPage - 1 < 1 ? 1 : currentPage - 1
prev = currentPage + 1 > totalPages ? totalPages : currentPage + 1
*/

const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, restaurants = 50) => {
  const totalPage = Math.ceil(restaurants / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next,
  }
}
module.exports = {
  getOffset,
  getPagination,
}
