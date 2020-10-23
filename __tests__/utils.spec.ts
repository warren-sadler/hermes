import * as utils from "../src/utils";

describe("Utils", () => {
  describe("sleep util", () => {
    it("by default waits 1ms", async () => {
      const START = Date.now();
      await utils.sleep();
      const END = Date.now();
      expect(END - START).toBeGreaterThanOrEqual(1_000);
    });
  });
});
