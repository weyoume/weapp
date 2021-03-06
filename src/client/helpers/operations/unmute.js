const { userExists, isEmpty, normalizeUsername } = require('../validation-utils');

export const optionalFields = ['follower'];

export const parse = (query) => {
  const cQuery = {
    id: 'follow',
    json: JSON.stringify([
      'follow', {
        follower:
          query.follower ? normalizeUsername(query.follower) : query.required_posting_auths[0],
        following: normalizeUsername(query.following),
        what: query.what ? JSON.parse(query.what) : [''],
      },
    ]),
    required_auths: [],
    required_posting_auths: query.required_posting_auths,
  };

  return cQuery;
};

export const validate = async (query, errors) => {
  if (!isEmpty(query.following) && !await userExists(query.following)) {
    errors.push({ field: 'following', error: 'error_user_exist', values: { user: query.following } });
  }

  if (!isEmpty(query.follower) && !await userExists(query.follower)) {
    errors.push({ field: 'follower', error: 'error_user_exist', values: { user: query.follower } });
  }
};