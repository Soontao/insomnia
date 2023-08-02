/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as csdl from 'odata-csdl';
import * as odata2openapi from 'odata-openapi';
import { Converter } from '../entities';
import { convert as convertOpenAPI3 } from './openapi-3';

export const id = 'odata';
export const name = 'OData';
export const description = 'Importer for OData metadata';

export const convert: Converter = async rawData => {
  try {
    return convertOpenAPI3(
      JSON.stringify(odata2openapi.csdl2openapi(csdl.xml2json(rawData)))
    );
  } catch (error) {
    return null;
  }
};
