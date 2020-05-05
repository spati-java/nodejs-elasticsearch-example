'use strict';

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })



module.exports.createProfile = async (event, context, callback) => {
  console.log(event.body)
  const { body } = await client.index({
    index: 'profile',
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
  // Let's search!
  const { body } = await client.search({
    index: 'profile',
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      query: {
        "match_all": {}
      }
    }
  })

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
};

module.exports.findByTitle = async event => {

  const { body } = await client.search({
    index: 'profile',
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
  })

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

module.exports.findProfileById = async (event, context, callback) => {

  const { body } = await client.search({
    index: 'profile',
    body: {
      query: {
        "match": {
          "_id": event.pathParameters.Id
        }
      }
    }
  });

  const resposne = {
    statusCode: 200,
    body: JSON.stringify(
      {
        profiles: body.hits.hits
      },
      null,
      2
    ),
  };

  callback(null, resposne);

}

module.exports.deleteProfileById = async (event, context, callback) => {
  const {body} = await client.delete({
    id: event.pathParameters.Id,
    index: 'profile'
  });
  callback(null, body.result)
}