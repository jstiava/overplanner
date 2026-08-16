import chalk from 'chalk';

function cutAfterApi(text: string) {
  const apiIndex = text.indexOf('(api)');
  if (apiIndex !== -1) {
    return text.slice(apiIndex + 6);
  } else {
    return text; // Return the original string if "(api)" is not found
  }
}

function logWithFilename() {
  return "";
  // const error = new Error();
  // if (!error.stack) return '';
  // const callerLine = error.stack.split('\n')[3];
  // if (!callerLine) return '';
  // const filename = callerLine.match(/at\s+(.+?)\:\d+:\d+/);
  // if (!filename || !filename[1]) return '';
  // return cutAfterApi(filename[1]);
}

export function fail(message: string) {
  const file = logWithFilename();
  console.log(`${chalk.white.bgRed.bold(' FAIL ')}${chalk.dim(file)} ${chalk.white(message)}`);
}

export function miss(message: string) {
  const file = logWithFilename();
  console.log(
    `${chalk.black.bgYellow.bold(' CACHE MISS ')}${chalk.dim(file)}${chalk.white(message)}`,
  );
}

export function success(message: string) {
  const file = logWithFilename();
  console.log(
    `${chalk.white.bgGreen.bold(' SUCCESS ')}${chalk.dim(file)} ${chalk.white(message)}`,
  );
}

export function call(message: string = "") {
  const file = logWithFilename();
  console.log(`${chalk.white.bgBlue.bold(' CALL ')}${chalk.dim(file)} ${chalk.white(message)}`);
}

const Chalk = {
  fail,
  miss,
  success,
  call
}

export default Chalk;