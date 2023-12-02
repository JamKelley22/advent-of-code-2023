# 2

## Summary Notes

Overall, day two had few troubles. However, this time I did not try to hard to optimize my runtime for each part. However, I did forget that the problems release at midnight EST NOT midnight CST so I waited until midnight to start.

## Part 1

- MaxColors
  In order to remove some magic numbers I created an object to represent the max colors for the scenario given

```ts
const maxColors = {
  red: 12,
  green: 13,
  blue: 14,
};
```

- Definitions of games, rounds, and draws
  One of the tricky things in programming is deciding on good names for variables. Another tricky thing is figuring out how to parse and define sections of data. I decided on dividing each game into a series of rounds (for each pull of colors), each of those rounds had a draw (the number of each color pulled that particular time), and each draw had a split (which is just splitting the color and number). This made it a bit easier to debug when the time came.

- Constructing draw objects
  I made the mistake of assuming the maximum number of colored cubes in the bag to be <10 when parsing the draws and so only grabbed `split[0]` (where split is a string) which did not work for the case of 20 red. This was a quick fix by simply splitting the string on the space character then parsing the number using `parseInt(split[0])` (where split is an array).

## Part 2

- Reduce and accumulate max color
  This part required little modification from part 1. I changed the accumulator of `rounds.reduce` to an object rather than an array of indexes and just returned the max of each color remapped to mins required for all draws of a game.
- Calculate Power
  Calculating power was straightforward as well. Simply take my minColors object and multiply each property together then reduce it to sum it up
