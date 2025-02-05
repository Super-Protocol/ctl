import { OrderReport, OrderReportSchema } from '@super-protocol/dto-js';
import { OrderReportService, validateBySchema } from '@super-protocol/sdk-js';
import Printer from '../printer';

export const validateOrderReport = async (
  orderReport: OrderReport,
): Promise<{ isValid: boolean; error?: string }> => {
  const { isValid, errors } = validateBySchema(orderReport, OrderReportSchema, { allErrors: true });
  if (!isValid) {
    return Promise.resolve({
      isValid: false,
      error: errors?.join('; '),
    });
  }

  try {
    await OrderReportService.validateOrderReport(orderReport);
    return { isValid: true };
  } catch (err) {
    return {
      isValid: false,
      error: (err as Error).message,
    };
  }
};

export const printOrderReportValidationSuccess = (): void => {
  Printer.print(`Order report validation successful!`);
};

export const printOrderReportValidationFail = (error?: string): void => {
  Printer.error(`\n\n!!!ORDER REPORT IS NOT VALID!!!`);
  Printer.error(`Reason: ${error || `Unknown error`} \n\n`);
};
