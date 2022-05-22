import Freight from "../../../domain/entity/freight";
import ItemRepository from "../../../domain/repository/item-repository";
import SimulateFreightInput from "./simulate-freight-input";
import SimulateFreightOutput from "./simulate-freight-output";

export default class SimulateFreight {
    constructor(readonly itemRepository: ItemRepository) {
    }

    async execute(input: SimulateFreightInput): Promise<SimulateFreightOutput> {
        const distance = 1000;
        const freight = new Freight(distance);
        const { orderItems } = input;

        for (const orderItem of orderItems) {
            const { itemId, quantity } = orderItem;
            const item = await this.itemRepository.getById(itemId);

            if (!item) {
                throw new Error("Item not found");
            }

            freight.addItem(item, quantity);
        }

        const total = freight.getTotal();
        const output = new SimulateFreightOutput(total);

        return output;
    }
}