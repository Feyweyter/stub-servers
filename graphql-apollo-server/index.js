const { ApolloServer, gql, MockList } = require('apollo-server');
const casual = require('casual');

const typeDefs = gql`
  type Query {
    person: Person
  }

  type Person {
    name: String
    age: Int
    friends: [Person]
  }
`;

const mocks = {
  Person: () => ({
    name: casual.name,
    age: () => casual.integer(10, 100),
    friends: () => new MockList([2,6]),
  }),
};

const server = new ApolloServer({
  typeDefs,
  mocks,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});