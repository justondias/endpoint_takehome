import main from "./main.js";
import { jest } from "@jest/globals";

test("It should satisfy the given test case", async () => {
  // spy on console log
  const logSpy = jest.spyOn(global.console, "log");

  // run funtion
  main(`CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
DELETE fruits/apples
DELETE foods/fruits/apples
LIST`);

  // test expected res
  const resArr = [
    "CREATE fruits",
    "CREATE vegetables",
    "CREATE grains",
    "CREATE fruits/apples",
    "CREATE fruits/apples/fuji",
    "LIST",
    "fruits",
    "  apples",
    "    fuji",
    "grains",
    "vegetables",
    "CREATE grains/squash",
    "MOVE grains/squash vegetables",
    "CREATE foods",
    "MOVE grains foods",
    "MOVE fruits foods",
    "MOVE vegetables foods",
    "LIST",
    "foods",
    "  fruits",
    "    apples",
    "      fuji",
    "  grains",
    "  vegetables",
    "    squash",
    "DELETE fruits/apples",
    "Cannot delete fruits/apples - fruits does not exist",
    "DELETE foods/fruits/apples",
    "LIST",
    "foods",
    "  fruits",
    "  grains",
    "  vegetables",
    "    squash",
  ];
  for (let i = 0; i < 34; i++) {
    expect(console.log.mock.calls[i].join(" ")).toBe(resArr[i]);
  }
  expect(logSpy).toHaveBeenCalledTimes(34);
  logSpy.mockRestore();
});

test("It should not create a dir if child doesnt exist", async () => {
  // spy on console log
  const logSpy = jest.spyOn(global.console, "log");

  // run funtion
  main(`CREATE vegetables/cats/dogs`);

  // test expected res
  const resArr = [
    `CREATE vegetables/cats/dogs`,
    "Cannot create vegetables/cats/dogs - vegetables does not exist",
  ];
  const calls = 2;
  for (let i = 0; i < calls; i++) {
    expect(console.log.mock.calls[i].join(" ")).toBe(resArr[i]);
  }
  expect(logSpy).toHaveBeenCalledTimes(calls);
  logSpy.mockRestore();
});

test("It should not move a dir if child doesnt exist", async () => {
  // spy on console log
  const logSpy = jest.spyOn(global.console, "log");

  // run funtion
  main(`CREATE fruits
MOVE fruits cats`);

  // test expected res
  const resArr = [
    "CREATE fruits",
    "MOVE fruits cats",
    "Cannot move fruits to cats - cats does not exist",
  ];
  const calls = 3;
  for (let i = 0; i < calls; i++) {
    expect(console.log.mock.calls[i].join(" ")).toBe(resArr[i]);
  }
  expect(logSpy).toHaveBeenCalledTimes(calls);
  logSpy.mockRestore();
});

test("It should not move a dir if source doesnt exist", async () => {
  // spy on console log
  const logSpy = jest.spyOn(global.console, "log");

  // run funtion
  main(`CREATE fruits
MOVE cars fruits`);

  // test expected res
  const resArr = [
    "CREATE fruits",
    "MOVE cars fruits",
    "Cannot move cars to fruits - cars does not exist",
  ];
  const calls = 3;
  for (let i = 0; i < calls; i++) {
    expect(console.log.mock.calls[i].join(" ")).toBe(resArr[i]);
  }
  expect(logSpy).toHaveBeenCalledTimes(calls);
  logSpy.mockRestore();
});

test("It should not delete a dir if source doesnt exist", async () => {
  // spy on console log
  const logSpy = jest.spyOn(global.console, "log");

  // run funtion
  main(`CREATE fruits
DELETE fruits/cars/batman`);

  // test expected res
  const resArr = [
    "CREATE fruits",
    "DELETE fruits/cars/batman",
    "Cannot delete fruits/cars/batman - cars does not exist",
  ];
  const calls = 3;
  for (let i = 0; i < calls; i++) {
    expect(console.log.mock.calls[i].join(" ")).toBe(resArr[i]);
  }
  expect(logSpy).toHaveBeenCalledTimes(calls);
  logSpy.mockRestore();
});
