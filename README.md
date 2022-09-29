# MAKE IT PULL

## install

 ```shell
 npm i make-it-poll
 ```

## Usage

### index.js

```js

const makeItPoll = require('make-it-poll');
const obj = makeItPoll(
  () =>
    new Promise((resolve, reject) => {
      console.log('exec promise');
      resolve();
    }),
  1000,
  5000,
  3
);
obj.startGetDataPoll();
setTimeout(() => {
  obj.stopGetDataPoll();
}, 5000);


//exec promise
//exec promise
//exec promise
//exec promise
//exec promise
```
