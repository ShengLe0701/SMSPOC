export function settings() {
  const settingsJSON = {
    index: {
      number_of_shards: 1,
      number_of_replicas: 1,
    },
  };

  return settingsJSON;
}

/*
  TODO: will need to figure out a good analyzer to tokenize 'body'
  so we can remove the `fielddata: true` from the mapping
*/
export function mappings() {
  const mappingJSON = {
    message: {
      properties: {
        accountId: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        body: {
          type: 'text',
          fielddata: true,
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        createdAt: {
          type: 'long',
        },
        direction: {
          type: 'long',
        },
        guestId: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        senderId: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
      },
    },
  };

  return mappingJSON;
}

