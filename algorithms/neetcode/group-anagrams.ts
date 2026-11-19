const letters = Array.from({ length: 26 }, (v, n) => String.fromCharCode(n + 97));

const alphabet = Object.fromEntries(letters.map((item, index) => [item, index]));

// Time: O(n·k), Space: O(n·k)
class GroupAnagramsSortedKeySolution {
  groupAnagrams(strs: string[]): string[][] {
    const chars = strs.map((word) =>
      word
        .split("")
        .reduce((acc, item) => {
          acc[alphabet[item]] = (acc[alphabet[item]] ?? 0) + 1;
          return acc;
        }, [] as number[])
        .map((item, index) => Array.from({ length: item }, (_) => letters[index]).join(""))
        .filter(Boolean)
        .join(""),
    );

    return Object.values(
      strs.reduce(
        (acc, word, index) => {
          const item = acc[chars[index]];
          if (item) item.push(word);
          else acc[chars[index]] = [word];
          return acc;
        },
        {} as { [key: string]: string[] },
      ),
    );
  }
}

// Time: O(n·k), Space: O(n·k)
class GroupAnagramsSolution {
  groupAnagrams(strs: string[]): string[][] {
    const groups = strs.reduce((acc, word) => {
      const key = [...word]
        .reduce((counts, char) => {
          counts[char.charCodeAt(0) - 97]++;
          return counts;
        }, new Array(26).fill(0))
        .join("#");

      const group = acc.get(key);
      if (group) group.push(word);
      else acc.set(key, [word]);

      return acc;
    }, new Map<string, string[]>());

    return [...groups.values()];
  }
}
