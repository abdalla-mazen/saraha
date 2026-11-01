const sucessResponse = async ({
  res,
  statusCode = 200,
  message = "Done",
  data = {},
}) => {
  return res.status(statusCode).json({ message: message, data });
};

export default sucessResponse