"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "It works, Devops is awesome!",
        input: event,
      },
      null,
      2
    ),
  };
};
