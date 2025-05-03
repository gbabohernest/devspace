/**
 * A helper function for filtering, searching,  sorting and paginating data
 *
 * @param req - Request object
 * @param Model - A mongoose data model
 * @param baseFilter - Query filter
 * @param projection - field(s) to select or not select when fetching resource
 * @param sort - Sort query
 * @param virtual - Document's Virtual field
 * @param searchableFields - An array of  search fields.
 * @returns Object - Containing paginated data
 */
import Project from "../models/project.model.js";

const paginate = async (
  req,
  Model,
  baseFilter = {},
  projection = "",
  sort = {},
  searchableFields = [],
  virtual = null,
) => {
  //prevent negative page/limit values
  const page = Math.max(1, parseInt(req.query?.page)) || 1;
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.limit))) || 5;

  const skip = (page - 1) * limit;

  let filter = { ...baseFilter };

  // search functionality
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

  let query = Model.find(filter)
    .select(projection)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // conditionally populate only if virtual exists
  if (virtual) {
    query = query.populate(virtual, "username -_id");
  }
  const [data, totalItems] = await Promise.all([
    query,
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
