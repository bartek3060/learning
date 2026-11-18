// v1 – sortowanie
// Time: O(n log n), Space: O(n)
class ValidAnagramSortSolution {
  isAnagram(s: string, t: string): boolean {
    return [...s.split("")].sort().join() === [...t.split("")].sort().join();
  }
}

// v2 – zliczanie w Map (metody tablic)
// Time: O(n), Space: O(k), k = liczba różnych znaków
// - Map.set zwraca mapę, więc reduce mieści się w jednej linii
// - every przerywa przy pierwszym false (early exit)
// - przy równych długościach wystarczy wykryć brakującą literę / licznik schodzący poniżej zera
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
