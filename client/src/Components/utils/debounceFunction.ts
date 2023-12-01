// Copied from : https://dev.to/jeetvora331/javascript-debounce-easiest-explanation--29hc#:~:text=We%20can%20implement%20debouncing%20in,passed%20since%20the%20last%20call.

/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (mainFunction: any, delay: number) => {
  // Declare a variable called 'timer' to store the timer ID
  let timer: any;

  // Return an anonymous function that takes in any number of arguments
  return function (...args: any[]) {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);
console.log("clear timeout")
    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {
        console.log("exec")
      mainFunction(...args);
    }, delay);
  };
};
