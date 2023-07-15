const logger = require("node-color-log");

const log = (...message) => {
  logger.setLevel('debug');
  logger.color('black').bgColor('white').bold().log(...message);
}
const log_red = (...message) => {
  logger.setLevel('debug');
  logger.color('red').bold().log(...message);
}
const log_green = (...message) => {
  logger.setLevel('debug');
  logger.color('green').bold().log(...message);
}
const log_yellow = (...message) => {
  logger.setLevel('debug');
  logger.color('yellow').bold().log(...message);
}

module.exports = {
  log,
  log_red,
  log_green,
  log_yellow,
};