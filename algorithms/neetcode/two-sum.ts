// Time: O(n), Space: O(n)
class TwoSumSolution {
  twoSum(nums: number[], target: number): number[] {
    const numbersMap = nums.reduce((acc, num, index) => {
      const desiredIndex = target - num;
      if (!acc.has(desiredIndex)) {
        acc.set(desiredIndex, index);
      }
      return acc;
    }, new Map<number, number>());

    return nums.reduce((acc, num, index) => {
      const pairIndex = numbersMap.get(num);
      if (pairIndex !== undefined && index !== pairIndex) {
        return [pairIndex, index];
      }
      return acc;
    }, [] as number[]);
  }
}
