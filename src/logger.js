const logger = require("node-color-log");

const log = (...message) => {
  logger.setLevel('debug');
  logger.color('white').bgColor('white').bold().log(...message);
}

const debug = (...message) => {
  logger.setLevel('debug');
  logger.color('black').bgColor('blue').bold().log(...message);
}
const red = (...message) => {
  logger.setLevel('debug');
  logger.color('red').bold().log(...message);
}
const green = (...message) => {
  logger.setLevel('debug');
  logger.color('green').bold().log(...message);
}
const yellow = (...message) => {
  logger.setLevel('debug');
  logger.color('yellow').bold().log(...message);
}

module.exports = {
  log,
  debug,
  red,
  green,
  yellow,
};