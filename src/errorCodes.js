import { fromJS } from 'immutable';

const SDErrors = fromJS({
  0: {
    code: '0',
    message: 'Unknown error',
  },
  1: {
    code: '1',
    message: 'Validation Failed',
    errors: {
      1000: {
        code: '1000',
        field: 'phone',
        message: 'Phone number already in use',
      },
    },
  },
});


export function getErrorFromPgCode(code) {
  switch (code) {
    case '23505':
      return SDErrors.getIn(['1', 'errors', '1000']);
    default:
      return SDErrors.getIn(['0']);
  }
}
