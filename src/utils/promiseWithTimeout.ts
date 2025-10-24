export function promiseWithTimeout<T>(promise: Promise<T>, ms: number, timeoutError = new Error('Promise timed out')) {
  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(timeoutError);
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ]);
}