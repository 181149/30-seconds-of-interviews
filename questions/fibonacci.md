### Generate an array, containing the Fibonacci sequence, up until the nth term

#### Answer

Create an empty array of the specific length, initializing the first two values (0 and 1). Use Array.reduce() to add values into the array, using the sum of the last two values, except for the first two.

```js
const fibonacci = n =>
  Array.from({ length: n }).reduce(
    (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  );
```

#### Aditional links

* [Similar problem](https://github.com/Chalarangelo/30-seconds-of-code/blob/master/snippets_archive/fibonacciUntilNum.md)

#### Good to hear

<!-- tags: (javascript) -->
