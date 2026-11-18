// Time: O(n), Space: O(n) – Set przechowuje do n elementów
class ContainsDuplicateSolution {
  hasDuplicate(nums: number[]): boolean {
    return new Set(nums).size !== nums.length;
  }
}
