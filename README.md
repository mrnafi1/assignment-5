1. What is the difference between var, let, and const?
Basically, var is the old way to declare variables and it's globally or function-scoped, which often causes unexpected bugs. Nowadays, we use let for variables that we need to change or reassign later, and const for values that should stay exactly the same (block-scoped).

2. What is the spread operator (...)?
The spread operator is just three dots (...) that easily unpacks elements from an array or properties from an object. I use it mostly when I need to make a quick copy of an array or combine two objects together without modifying the original ones.

3. What is the difference between map(), filter(), and forEach()?
map() modifies every item in an array and gives you a brand new array, while filter() just picks out specific items based on a condition you set. On the other hand, forEach() simply loops through the items to execute a task, but it doesn't return any new array.

4. What is an arrow function?
It's just a shorter, cleaner, and more modern way to write standard JavaScript functions using =>. Besides saving time and looking nice, the best part is that it doesn't create its own this context, which prevents a lot of common bugs in callbacks.

5. What are template literals?
Template literals let us use backticks (`) instead of regular quotes to create strings. They make our lives so much easier because we can write multi-line strings naturally and inject variables directly inside them using ${} without messy plus (+) signs.

