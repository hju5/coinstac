const computationFields = {
  computationMetaFields: `
    repository: String
    description: String
    name: String!
    tags: [String]
    version: String
    dockerImage: String
  `,
};

module.exports = computationFields;