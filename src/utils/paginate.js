/**
 * A helper function for filtering, searching,  sorting and paginating data
 *
 * @param req - Request object
 * @param Model - A mongoose data model
 * @param baseFilter - Query filter
 * @param sort - Sort query
 * @param virtual - Document's Virtual field
 * @param searchableFields - An array of  search fields.
 * @returns Object - Containing paginated data
 */

const paginate = async (
  req,
  Model,
  baseFilter = {},
  sort = {},
  virtual = "",
  searchableFields = [],
) => {
  //prevent negative page/limit values
  const page = Math.max(1, parseInt(req.query?.page)) || 1;
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.limit))) || 5;

  const skip = (page - 1) * limit;

  let filter = { ...baseFilter };

  if (req.query.search && searchableFields.length > 0) {
    const searchRegex = { $regex: req.query.search, $options: "i" };

    filter.$or = searchableFields.map((field) => {
      return { [field]: searchRegex };
    });

    /*
    let filterEx = {
      isPublic: true,
      $or: [
        { title: { $regex: "portfolio", $options: "i" } },
        { tech: { $regex: "portfolio", $options: "i" } },
      ],
    };
     */
  }

  const [data, totalItems] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(virtual, "username -_id"),
    Model.countDocuments(filter),
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
