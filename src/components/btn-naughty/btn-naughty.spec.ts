import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";

import BtnNaughty from "./btn-naughty.vue";

test("第一個測試", () => {
  const wrapper = mount(BtnNaughty);
  expect(wrapper).toBeDefined();
});
