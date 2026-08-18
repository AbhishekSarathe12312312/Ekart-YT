// image send krne ka phla tarika {datastream} profile image m
// image send krne ka dusra tarika {data uri} products image m

import DataUriParser from "datauri/parser.js";
import { get } from "http";
import path from "path";

const perser = new DataUriParser();

const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return perser.format(extName, file.buffer).content;
};

export default getDataUri;
