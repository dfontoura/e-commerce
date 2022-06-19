import StockEntry from "../../src/domain/entity/stock-entry";

test('Should create an stock entry', () => {
    const stockEntry = new StockEntry(1, "in", 6);
    expect(stockEntry.itemId).toBe(1);
    expect(stockEntry.operation).toBe('in');
    expect(stockEntry.quantity).toBe(6);
});