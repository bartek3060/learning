// v1 – sortowanie
// Time: O(n log n), Space: O(n)
class ValidAnagramSortSolution {
  isAnagram(s: string, t: string): boolean {
    return [...s.split("")].sort().join() === [...t.split("")].sort().join();
  }
}

// v2 – zliczanie w Map
// Time: O(n), Space: O(k), k = liczba różnych znaków
// Poprawki po review:
// - `!== null` -> `!== undefined` (Map.get zwraca undefined, nie null)
// - sprawdzenie długości na starcie (bez niego s="a", t="ab" dawało true)
class ValidAnagramSolution {
  isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;

    const firstWordMap = s.split("").reduce((acc, letter) => {
      const letterCount = acc.get(letter);

      if (letterCount === undefined) {
        acc.set(letter, 1);
        return acc;
      }
      acc.set(letter, letterCount + 1);
      return acc;
    }, new Map<string, number>());

    t.split("").forEach((letter) => {
      const letterCount = firstWordMap.get(letter);

      if (letterCount !== undefined) {
        firstWordMap.set(letter, letterCount - 1);
      }
    });

    return [...firstWordMap.values()].every((value) => value === 0);
  }
}
