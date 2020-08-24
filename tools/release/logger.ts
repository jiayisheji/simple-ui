import * as chalk from 'chalk';

type LoggerType = 'log' | 'info' | 'error' | 'warn';

class Logger {
  /**
   * 日志
   * @param message
   */
  log(message: string, color: string = 'cyan') {
    console.log(chalk[color](message));
  }

  /**
   * 日志
   * @param message
   */
  info(message: string, color: string = 'yellow') {
    console.info(chalk[color](message));
  }

  /**
   * 错误
   * @param message
   */
  error(message: string, color: string = 'red') {
    console.error(chalk[color](message));
  }

  /**
   * 成功
   * @param message
   */
  success(message: string, color: string = 'green') {
    console.log(chalk[color](message));
  }

  /**
   * 警告
   * @param message
   */
  warn(message: string, color: string = 'yellow') {
    console.warn(chalk[color](message));
  }

  /**
   * 加粗
   * @param message
   */
  bold(message: string) {
    return this.chalk('bold')(message);
  }

  /**
   * 斜体
   * @param message
   */
  italic(message: string) {
    return this.chalk('italic')(message);
  }

  /**
   * 包装 chalk
   * @param color
   */
  chalk(color: string): (message: string) => string {
    return (message: string) => chalk[color](message);
  }

  /**
   * 分割线
   */
  divider() {
    console.log(chalk.cyan('-----------------------------------------'));
  }

  /**
   * 空行
   */
  blank(type: LoggerType = 'log') {
    console[type]();
  }
}

export const logger = new Logger();
