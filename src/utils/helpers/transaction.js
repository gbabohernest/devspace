/**
 * A mongoose transaction for write operations
 */
import mongoose from "mongoose";

const transactionHelper = async (fn, next) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const response = await fn(session);

    await session.commitTransaction();
    return response;
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

export default transactionHelper;
