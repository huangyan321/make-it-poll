/**
 *
 * @param {Function} promiseFunc 返回promise的函数
 * @param {Number} timeout  轮询间隔时间，默认1s
 * @param {Number} retryTimeout  错误重试时间，默认5s
 * @param {Number} retryCount  错误重试次数，默认3次
 * @returns
 */
function makeItPoll(
  promiseFunc,
  timeout = 1000,
  retryTimeout = 5000,
  retryCount = 3
) {
  if (typeof promiseFunc !== 'function') {
    throw new TypeError('promiseFunc must be a function');
  }
  if (
    typeof timeout !== 'number' ||
    typeof retryTimeout !== 'number' ||
    typeof retryCount !== 'number'
  ) {
    throw new TypeError('params must be a number');
  }
  if (timeout < 0 || retryTimeout < 0 || retryCount < 0) {
    throw new TypeError('params must be positive');
  }
  const pollTimer = { id: 0, idObj: {} };
  function stopGetDataPoll() {
    pollTimer.idObj = {};
    pollTimer.id = 0;
  }
  function promiseRetryFunc(promise, interval, time) {
    let timer = time;
    return async function execWithRetry() {
      try {
        await promise();
        timer = time;
      } catch {
        timer--;
        console.log('Retries remaining: ' + timer);
        if (timer) {
          setTimeout(() => {
            execWithRetry();
          }, interval);
        }
      }
    };
  }
  function startGetDataPoll() {
    stopGetDataPoll();
    const id = pollTimer.id++;
    pollTimer.idObj[id] = true;
    const timerFn = promiseRetryFunc(
      async () => {
        if (!pollTimer.idObj[id]) return;
        await promiseFunc();
        setTimeout(timerFn, timeout);
      },
      retryTimeout,
      retryCount
    );
    timerFn();
  }
  return {
    startGetDataPoll,
    stopGetDataPoll,
  };
}
module.exports = makeItPoll;
