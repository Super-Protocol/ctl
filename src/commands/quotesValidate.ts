import { GraphQLClient } from 'graphql-request';
import { QuoteValidator, TeeSgxParser } from '@super-protocol/sdk-js';
import axios from 'axios';
import Printer from '../printer';
import { AttestationQuery, getSdk } from '../gql';
import getGqlHeaders from '../services/gqlHeaders';

interface GetInfoFromQuoteParams {
  quote: string;
  pccsServiceApiUrl: string;
  solutions: AttestationQuery['attestation']['solutions'];
}

interface InfoFromQuote {
  mrEnclave: string;
  mrSigner: string;
  status: string;
  offerId: string | null;
}

export interface QuotesValidateParams {
  url: string;
  pccsServiceApiUrl: string;
  backend: {
    url: string;
    accessToken: string;
  };
}

const addPathToUrl = (url: string, path: string): string => {
  const urlParsed = new URL(url);

  urlParsed.pathname = path;

  return urlParsed.toString();
};

const getQuotes = async (url: string): Promise<string[]> => {
  const quotesUrl = addPathToUrl(url, '/quotes');
  try {
    const response = await axios.get(quotesUrl);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (err) {
    Printer.error(`Unable to fetch quotes from ${quotesUrl}. Is it still active?`);

    return [];
  }
};

const getInfoFromQuote = async (params: GetInfoFromQuoteParams): Promise<InfoFromQuote> => {
  const validator = new QuoteValidator(params.pccsServiceApiUrl);
  const quoteBuffer = Buffer.from(params.quote, 'base64');
  const validationResult = await validator.validate(quoteBuffer);
  const status = validationResult.quoteValidationStatus;

  const parser = new TeeSgxParser();
  const parsedQuote = parser.parseQuote(quoteBuffer);
  const parsedReport = parser.parseReport(parsedQuote.report);

  const mrEnclave = parsedReport.mrEnclave.toString('hex');
  const mrSigner = parsedReport.mrSigner.toString('hex');
  const { offerId } = params.solutions.find((solution) =>
    solution.mrEnclaves.find((v) => v === mrEnclave),
  ) || { offerId: null };

  return {
    mrEnclave,
    mrSigner,
    status,
    offerId,
  };
};

export default async (params: QuotesValidateParams): Promise<void> => {
  const quotes = await getQuotes(params.url);

  if (!quotes.length) {
    return Printer.error('Quotes not found');
  }

  const sdk = getSdk(new GraphQLClient(params.backend.url));
  const headers = getGqlHeaders(params.backend.accessToken);
  const { attestation } = await sdk.Attestation(undefined, headers);

  const infos = await Promise.all(
    quotes.map((quote) =>
      getInfoFromQuote({
        quote,
        pccsServiceApiUrl: params.pccsServiceApiUrl,
        solutions: attestation.solutions,
      }),
    ),
  );

  Printer.print('Found quotes:');

  for (const info of infos) {
    Printer.print('====QUOTE====');
    Printer.print(`MRENCLAVE: ${info.mrEnclave}`);
    Printer.print(`MRSIGNER: ${info.mrSigner}`);
    Printer.print(`STATUS: ${info.status}`);
    Printer.print(`OFFER: ${info.offerId ? info.offerId : 'NOT FOUND'}`);
    Printer.print('');
  }
};
