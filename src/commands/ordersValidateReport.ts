import readJsonFile from '../services/readJsonFile';
import {
  printOrderReportValidationFail,
  printOrderReportValidationSuccess,
  validateOrderReport,
} from '../services/validateOrderReport';

export type OrderValidateReportParams = {
  reportPath: string;
};

export const ordersValidateReport = async (params: OrderValidateReportParams): Promise<void> => {
  const orderReport = await readJsonFile({ path: params.reportPath });

  const validationResult = await validateOrderReport(orderReport);

  if (validationResult.isValid) {
    printOrderReportValidationSuccess();
  } else {
    printOrderReportValidationFail(validationResult.error);
  }
};
