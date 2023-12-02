# Day 1: Trebuchet?!

Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

For example:

1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

Consider your entire calibration document. What is the sum of all of the calibration values?

## Solution 1

### Techniques?

Last year I tried to follow Test Driven Development. This year I may loosely follow it as well. For the first day I did not write tests (expecting the problem to be extremely easy with nearly no tricks). After completing it I see that that was a mistake to assume so.

### Notes after solving the problem

1. Solving in best Big O time
   While I considered that I could simply do a double for loop to go over each line then over each character I realized I could just loop once, keep track of the line number, and use `continue` when I encounter a \n character. This would keep the search O(N) rather than O(N^2)

2. ASCII assumption
   I made the relatively safe assumption that ASCII will always be used for puzzle input.

3. Char codes to reduce checking 0-9
   The ASCII assumption reminded me that I could use a range of `"0".charCodeAt(0)` to `"9".charCodeAt(0)` (actually I think 0 never was present but whatever). This allowed me to dump all of the non-number characters by comparing the current character to be less than the 0 character or greater than the 9 character.

4. Last line does not contain a \n
   I then ran into the issue where I was getting N-1 calibration codes. It took me longer than it should have to realize that this was because I was excluding the final line since the input ended without a newline character as I was assuming. I fixed this by flushing the last values outside of the for loop after.

5. Case where only one number in a line
   One particularly interesting case was when there is only one number in a line such as in the case of "treb7uchet" on a line. After reviewing the document and example solution I realized that they wanted this to be handled as both the first and last calibration value. Eg. 77. Fixed this by simply not breaking out of the for loop when I'm first assigning a firstSeenNumber so it assigns a lastSeenNumber as well.

## Solution 2

### Notes after solving the problem

1. Trying to keep it O(N)
   I really wanted to keep the Big O to O(N) and that really held me up. My thought was to store the char codes of the number words (eg. one, two,...) in a 2d array then if the parsed charCode is < 0 or > 9 check all of the first letter char codes of the number letters (eg (o)ne, (t)wo, ...). If it is a match then loop over (technically a O(N^2) but the inner for loop has a max, relatively small number of iterations to check) the next numbers (eg. o(n)e, t(w)o). If I got to the end of the array of any one of these I would store that calibration code and increment to skip over those in my outer for loop. Additionally, I transposed the 2d array to make it easier to check the current index of each word number such that the first array of the matrix would be the first letter of 0-9. This got very complicated very quickly and was a code smell since it was only day 1 and this was not a day one type of solution.

2. Regex
   After a small break I resolved to give up on O(N) when I realized that the easiest thing to do was to simply replace each number word with the numerical representation. Pre-processing the input like this keeps it O(N) although it does add quite a few N+N+N...s to the inner term.

   ```ts
   input = input.replaceAll("zero", "0");
   input = input.replaceAll("one", "1");
   ...
   ```

3. Sharing letters between number words
   There was a confusing edge case where two number words might share letters between them (maybe multiple? maybe just one? didn't bother to figure that out). For example eightwothree != eigh23, eightwothree = 823. I wanted to get the problem done at this point and realized that replacing was not necessary, rather adding a number worked provided the same word surrounded the number. So I changed my regex to

   ```ts
   input = input.replaceAll("zero", "zero0zero");
   input = input.replaceAll("one", "one1one");
   ```
