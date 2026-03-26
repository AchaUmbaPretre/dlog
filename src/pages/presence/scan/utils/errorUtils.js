import { ERROR_MAP } from '../constants/errorMap';

export const getErrorData = (type) => {
  return ERROR_MAP[type] || ERROR_MAP.DEFAULT;
};