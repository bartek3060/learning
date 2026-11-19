// Time: O(n log n), Space: O(n)
class ValidAnagramSortSolution {
  isAnagram(s: string, t: string): boolean {
    return [...s.split("")].sort().join() === [...t.split("")].sort().join();
  }
}

// Time: O(n), Space: O(k)
class ValidAnagramSolution {
  isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;

    const letterCounts = [...s].reduce(
      (acc, letter) => acc.set(letter, (acc.get(letter) ?? 0) + 1),
      new Map<string, number>(),
    );

    return [...t].every((letter) => {
      const letterCount = letterCounts.get(letter);
      if (!letterCount) return false;

      letterCounts.set(letter, letterCount - 1);
      return true;
    });
  }
}
