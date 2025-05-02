/**
 * A helper function for filtering, sorting and paginating data
 *
 * @param req - Request object
 * @param Model - A mongoose data model
 * @param filter - Query filter
 * @param sort - Sort query
 * @param virtual - Document's Virtual field
 * @returns Object - Containing paginated data
 */

const paginate = async (req, Model, filter = {}, sort = {}, virtual = "") => {
  //prevent negative page/limit values
  const page = Math.max(1, parseInt(req.query?.page)) || 1;
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.limit))) || 2;

  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(virtual, "username -_id"),
    Model.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    nbHits: totalItems,
    currentPage: page,
    numberOfPages: totalPages,
    limit,
    data,
  };
};

export default paginate;
