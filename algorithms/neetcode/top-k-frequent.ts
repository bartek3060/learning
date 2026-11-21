// Time: O(n), Space: O(n)
class TopKFrequentSolution {
  topKFrequent(nums: number[], k: number): number[] {
    if (nums.length === 1) {
      return nums;
    }

    const frequency = nums.reduce((map, num) => {
      map.set(num, (map.get(num) ?? 0) + 1);
      return map;
    }, new Map<number, number>());

    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);

    frequency.forEach((count, num) => {
      buckets[count].push(num);
    });

    return buckets.slice(1).reverse().flat().slice(0, k);
  }
}
