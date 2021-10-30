import { generateVanityNumbers } from "../../lib/vanity-numbers/vanity-generator";

jest.spyOn(global.Math, "random").mockReturnValue(0.54321);

describe("vanity generator", () => {
    it.each([
        ["+447968736753", ["+447968PEOPLE", "+447968SEMPLE", "+447968RFORKE", "+447968RDORLE", "+447968REORLE"]],
        ["+447887872467", ["+447887TRAINS", "+447887UPAINS", "+447887URAINS", "+447887UPAIMP", "+447887USCHOR"]],
        ["+447776051600", ["+4477760J1M00", "+4477760J1O00", "+4477760K1M00", "+4477760K1O00", "+4477760L1M00"]],
        ["+440010002010", ["+44001000A010", "+44001000B010", "+44001000C010"]],
        ["+440010001010", []],
    ])("should generate expected vanity numbers", (phoneNumber, expected) => {
        const vanityNumbers = generateVanityNumbers(phoneNumber, 5);

        expect(vanityNumbers).toEqual(expected);
    });
});
