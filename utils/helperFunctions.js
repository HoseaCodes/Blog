import fs from 'fs';
import path from 'path';

// return stringDate as a date object.
export const stringToDate = (dateString) => {
  return new Date(dateString);
};

// Check if variable is empty or not.
export const empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};

export async function listDirectories(rootPath) {
  const fileNames = await fs.promises.readdir(rootPath);
  const filePaths = fileNames.map((fileName) => path.join(rootPath, fileName));
  const filePathsAndIsDirectoryFlagsPromises = filePaths.map(
    async (filePath) => ({
      path: filePath,
      isDirectory: (await fs.promises.stat(filePath)).isDirectory(),
    })
  );
  const filePathsAndIsDirectoryFlags = await Promise.all(
    filePathsAndIsDirectoryFlagsPromises
  );
  return filePathsAndIsDirectoryFlags
    .filter(
      (filePathAndIsDirectoryFlag) => filePathAndIsDirectoryFlag.isDirectory
    )
    .map((filePathAndIsDirectoryFlag) => filePathAndIsDirectoryFlag.path);
}

export const listFiles = async (testFolder, list) => {
  await fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      console.log(file);
      list.push(file);
      console.log(list);
    });
  });
  return list;
};