import { test, expect, vi } from "vitest";
import { maxSquareSize, applySquareSize } from "../scripts/utils";

test.each([
    [10, 10, 8],
    [20, 10, 4],
    [10, 20, 4],
    [11, 11, 8]
])("that x: %i and y: %i lead to max square size of %i", (a, b, expected) => {
    const container = { offsetWidth: 100, offsetHeight: 100 }
    expect(maxSquareSize(a, b, container)).toBe(expected)
})

test("that square size is applied to style sheet", () => {

    global.document = {
        styleSheets: [
            {},
            {
                cssRules: [{
                    selectorText: '.square'
                }],
                deleteRule: vi.fn(),
                insertRule: vi.fn()
            }
        ]
    }

    applySquareSize(10, 10, { offsetWidth: 100, offsetHeight: 100 })
    const styleSheet = document.styleSheets[1];

    expect(styleSheet.deleteRule).toHaveBeenCalledWith(0)
    expect(styleSheet.insertRule).toHaveBeenCalledWith('.square {width:8px; height:8px}',
        0
    );
})

