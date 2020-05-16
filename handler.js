'use strict';

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
const index_name = 'profile'


module.exports.createProfile = async (event, context, callback) => {
  const { body } = await client.index({
    index: index_name,
    body: event.body
  });
  callback(null, {
    body: JSON.stringify({
      statusCode: 201,
      result: body.result
    },
      null,
      2
    )
  });
}


module.exports.findAllProfile = async event => {
  const { body } = await client.search({
    index: index_name,
    body: {
      query: {
        "match_all": {}
      }
    }
  });
  return response(body);
};

module.exports.findByTitle = async event => {
  const { body } = await client.search({
    index: index_name,
    body: {
      query: {
        "match": {
          "jobTitle": {
            "query": event.pathParameters.title,
            "operator": "and"
          }
        }
      }
    }
  });
  return response(body);
}

module.exports.findProfileById = async (event, context, callback) => {
  const { body } = await client.search({
    index: index_name,
    body: {
      query: {
        "match": {
          "_id": event.pathParameters.Id
        }
      }
    }
  });
  callback(null, resposne(body));
}

module.exports.deleteProfileById = async (event, context, callback) => {
  const { body } = await client.delete({
    id: event.pathParameters.Id,
    index: index_name
  });
  callback(null, body.result)
}

function response(body) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        profiles: body.hits.hits
      },
      null,
      2
    ),
  };
}