const { writeFile } = require('fs');
const { argv } = require('yargs');

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';

// Load node modules
require('dotenv').config();

// Environment variables to be written to the file
const envConfigFile = `export const environment = {
  production: false,
  googleClientId: '${process.env["GOOGLE_CLIENT_ID"]}',
};
`;

// Write the content to the respective file
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Environment variables written to ${targetPath}`);
  }
});
